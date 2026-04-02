from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import docx
import io
import re
import json
from typing import Optional
from scoring import compute_ats_score, extract_resume_sections
from keywords import get_role_keywords, extract_jd_keywords

app = FastAPI(title="ATS Resume Checker API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read PDF: {str(e)}")
    return text.strip()


def extract_text_from_docx(file_bytes: bytes) -> str:
    text = ""
    try:
        doc = docx.Document(io.BytesIO(file_bytes))
        for para in doc.paragraphs:
            if para.text.strip():
                text += para.text + "\n"
        for table in doc.tables:
            for row in table.rows:
                for cell in row.cells:
                    if cell.text.strip():
                        text += cell.text + "\n"
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read DOCX: {str(e)}")
    return text.strip()


@app.post("/api/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 5MB allowed.")
    filename = file.filename.lower()
    if filename.endswith(".pdf"):
        text = extract_text_from_pdf(content)
    elif filename.endswith(".docx"):
        text = extract_text_from_docx(content)
    elif filename.endswith(".txt"):
        text = content.decode("utf-8", errors="ignore")
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type. Use PDF, DOCX, or TXT.")
    if len(text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Could not extract text. Try pasting text manually.")
    sections = extract_resume_sections(text)
    return {
        "success": True,
        "filename": file.filename,
        "text": text,
        "word_count": len(text.split()),
        "char_count": len(text),
        "sections_detected": sections
    }


@app.post("/api/analyze")
async def analyze_resume(
    resume_text: str = Form(...),
    job_role: str = Form(...),
    job_description: Optional[str] = Form(None)
):
    if len(resume_text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Resume text too short.")
    if not job_role.strip():
        raise HTTPException(status_code=400, detail="Job role is required.")

    if job_description and len(job_description.strip()) > 30:
        jd_keywords = extract_jd_keywords(job_description)
        role_keywords = get_role_keywords(job_role)
        all_keywords = list(dict.fromkeys(jd_keywords + role_keywords))[:40]
        keyword_source = "job_description"
    else:
        all_keywords = get_role_keywords(job_role)
        keyword_source = "role_database"

    result = compute_ats_score(resume_text, job_role, all_keywords)
    result["keyword_source"] = keyword_source
    result["analyzed_keywords"] = all_keywords
    return result


@app.post("/api/improve")
async def improve_resume(
    resume_text: str = Form(...),
    job_role: str = Form(...),
    missing_keywords: str = Form(...),
    suggestions: str = Form(...),
    confirmed_skills: Optional[str] = Form(None)
):
    """
    confirmed_skills = skills the user confirmed they actually know.
    missing_keywords = all missing (for reference only, NOT auto-added).
    We ONLY add confirmed_skills to the resume — no fake skills.
    """
    confirmed = json.loads(confirmed_skills) if confirmed_skills else []
    # Only use confirmed skills — never auto-inject missing keywords
    improved = rewrite_resume(resume_text, job_role, confirmed)
    return {"success": True, "improved_text": improved}


def extract_section(text: str, patterns: list) -> str:
    """Extract a specific section from resume text"""
    lines = text.split('\n')
    section_content = []
    in_section = False
    
    section_headers = [
        r'\b(summary|objective|profile|about)\b',
        r'\b(skills|technical|competencies|technologies)\b',
        r'\b(experience|internship|employment|work)\b',
        r'\b(education|academic|degree|qualification)\b',
        r'\b(projects?|portfolio)\b',
        r'\b(certifications?|courses?|training)\b',
        r'\b(achievements?|awards?|accomplishments?)\b',
        r'\b(contact|personal)\b',
    ]
    
    for line in lines:
        stripped = line.strip()
        if not stripped:
            if in_section:
                section_content.append('')
            continue
        
        # Check if this line matches our target section
        is_target = any(re.search(p, stripped, re.I) for p in patterns)
        # Check if this is any other section header (to stop)
        is_other_header = not is_target and any(
            re.search(p, stripped, re.I) for p in section_headers
            if not any(re.search(pp, stripped, re.I) for pp in patterns)
        )
        
        if is_target and len(stripped) < 50:
            in_section = True
            continue
        elif is_other_header and len(stripped) < 50 and in_section:
            break
        
        if in_section:
            section_content.append(line)
    
    return '\n'.join(section_content).strip()


def extract_contact_info(text: str) -> dict:
    """Extract name, email, phone, linkedin, github from resume"""
    lines = text.split('\n')
    info = {'name': '', 'email': '', 'phone': '', 'linkedin': '', 'github': '', 'location': ''}
    
    # Name: usually first non-empty line
    for line in lines[:5]:
        stripped = line.strip()
        if stripped and len(stripped) < 60 and not re.search(r'@|http|linkedin|github|\d{10}', stripped, re.I):
            info['name'] = stripped
            break
    
    full_text = text
    email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', full_text)
    if email_match:
        info['email'] = email_match.group()
    
    phone_match = re.search(r'(?:\+91[-\s]?)?[6-9]\d{9}', full_text)
    if phone_match:
        info['phone'] = phone_match.group()
    
    linkedin_match = re.search(r'linkedin\.com/in/[\w\-]+', full_text, re.I)
    if linkedin_match:
        info['linkedin'] = 'linkedin.com/in/' + linkedin_match.group().split('linkedin.com/in/')[-1]
    
    github_match = re.search(r'github\.com/[\w\-]+', full_text, re.I)
    if github_match:
        info['github'] = 'github.com/' + github_match.group().split('github.com/')[-1]
    
    location_match = re.search(r'(mumbai|delhi|bangalore|bengaluru|hyderabad|pune|chennai|kolkata|ahmedabad|india|maharashtra|gujarat)[,\s\w]*', full_text, re.I)
    if location_match:
        info['location'] = location_match.group().split('\n')[0].strip()[:50]
    
    return info


ACTION_VERB_MAP = {
    r'^worked on\b': 'Developed',
    r'^did\b': 'Implemented',
    r'^made\b': 'Built',
    r'^helped\b': 'Contributed to',
    r'^was responsible for\b': 'Managed',
    r'^used\b': 'Utilized',
    r'^learned\b': 'Acquired expertise in',
    r'^created\b': 'Developed',
    r'^wrote\b': 'Authored',
    r'^tested\b': 'Validated and tested',
    r'^handled\b': 'Managed',
    r'^did work on\b': 'Developed',
}


def strengthen_bullet(line: str) -> str:
    """Strengthen a bullet point with better action verbs"""
    stripped = line.strip()
    if not stripped:
        return line
    
    # Remove leading bullet chars
    clean = re.sub(r'^[\-•*›▸]\s*', '', stripped)
    
    for pattern, replacement in ACTION_VERB_MAP.items():
        if re.search(pattern, clean, re.I):
            clean = re.sub(pattern, replacement, clean, flags=re.I, count=1)
            break
    
    # Capitalize first letter
    if clean:
        clean = clean[0].upper() + clean[1:]
    
    # Add period if missing
    if clean and not clean.endswith(('.', ')', ']')):
        clean += '.'
    
    return '• ' + clean


def rewrite_resume(original: str, role: str, missing_keywords: list) -> str:
    """
    REAL resume rewriter:
    1. Extracts all info from original resume
    2. Rebuilds it in clean ATS format
    3. Injects missing keywords where relevant
    4. Strengthens bullet points
    5. NEVER adds fake experience/companies
    """
    contact = extract_contact_info(original)
    lines = original.split('\n')
    
    # Extract sections
    skills_raw = extract_section(original, [r'\b(skills|technical|competencies|technologies|tools)\b'])
    experience_raw = extract_section(original, [r'\b(experience|internship|employment|work history)\b'])
    education_raw = extract_section(original, [r'\b(education|academic|degree|qualification)\b'])
    projects_raw = extract_section(original, [r'\b(projects?|portfolio)\b'])
    certs_raw = extract_section(original, [r'\b(certifications?|courses?|training)\b'])
    summary_raw = extract_section(original, [r'\b(summary|objective|profile|about me)\b'])
    achievements_raw = extract_section(original, [r'\b(achievements?|awards?|accomplishments?)\b'])

    out = []

    # ── HEADER ──────────────────────────────────────────
    out.append('=' * 65)
    out.append(contact['name'] or 'YOUR NAME')
    out.append('=' * 65)
    
    contact_parts = []
    if contact['email']:    contact_parts.append(contact['email'])
    if contact['phone']:    contact_parts.append(contact['phone'])
    if contact['location']: contact_parts.append(contact['location'])
    out.append(' | '.join(contact_parts))
    
    links = []
    if contact['linkedin']: links.append(contact['linkedin'])
    if contact['github']:   links.append(contact['github'])
    if links: out.append(' | '.join(links))
    out.append('')

    # ── PROFESSIONAL SUMMARY ─────────────────────────────
    out.append('PROFESSIONAL SUMMARY')
    out.append('-' * 40)
    if summary_raw.strip():
        # Clean up and use existing summary
        for line in summary_raw.split('\n')[:4]:
            if line.strip():
                out.append(line.strip())
    else:
        # Generate a concise role-specific summary
        matched_skills = [kw for kw in missing_keywords[:3]] if missing_keywords else []
        out.append(f"Results-driven {role} fresher with strong foundation in analytical thinking,")
        out.append(f"problem-solving, and data-driven decision making. Seeking to contribute")
        out.append(f"technical expertise and deliver measurable business impact.")
    out.append('')

    # ── SKILLS ──────────────────────────────────────────
    out.append('SKILLS')
    out.append('-' * 40)
    if skills_raw.strip():
        # Reformat existing skills
        for line in skills_raw.split('\n'):
            stripped = line.strip()
            if stripped:
                out.append(stripped)
        # Add missing keywords as new skill line
        if missing_keywords:
            out.append(f"Additional Tools & Concepts: {', '.join(missing_keywords[:8])}")
    else:
        # Build skills from scratch with missing keywords
        out.append(f"Core Skills: {', '.join(missing_keywords[:10]) if missing_keywords else 'See below'}")
    out.append('')

    # ── EXPERIENCE / INTERNSHIPS ─────────────────────────
    if experience_raw.strip():
        out.append('EXPERIENCE & INTERNSHIPS')
        out.append('-' * 40)
        for line in experience_raw.split('\n'):
            stripped = line.strip()
            if not stripped:
                out.append('')
                continue
            # Strengthen bullet points
            if re.match(r'^[\-•*›▸]', stripped) or (len(stripped) > 20 and not stripped[-1] in ':|-'):
                out.append(strengthen_bullet(stripped))
            else:
                out.append(stripped)
        out.append('')

    # ── PROJECTS ────────────────────────────────────────
    if projects_raw.strip():
        out.append('PROJECTS')
        out.append('-' * 40)
        for line in projects_raw.split('\n'):
            stripped = line.strip()
            if not stripped:
                out.append('')
                continue
            if re.match(r'^[\-•*›▸]', stripped):
                out.append(strengthen_bullet(stripped))
            else:
                out.append(stripped)
        out.append('')

    # ── EDUCATION ───────────────────────────────────────
    if education_raw.strip():
        out.append('EDUCATION')
        out.append('-' * 40)
        for line in education_raw.split('\n'):
            if line.strip():
                out.append(line.strip())
        out.append('')

    # ── CERTIFICATIONS ──────────────────────────────────
    if certs_raw.strip():
        out.append('CERTIFICATIONS & COURSES')
        out.append('-' * 40)
        for line in certs_raw.split('\n'):
            if line.strip():
                out.append('• ' + line.strip().lstrip('•-* '))
        out.append('')

    # ── ACHIEVEMENTS ────────────────────────────────────
    if achievements_raw.strip():
        out.append('ACHIEVEMENTS')
        out.append('-' * 40)
        for line in achievements_raw.split('\n'):
            if line.strip():
                out.append('• ' + line.strip().lstrip('•-* '))
        out.append('')

    # ── FOOTER NOTE ─────────────────────────────────────
    out.append('─' * 65)
    out.append('ATS-OPTIMIZED VERSION | Skills added: ' + (', '.join(missing_keywords[:6]) if missing_keywords else 'Only your confirmed skills'))
    out.append('Copy this into your Word/Google Doc and apply your formatting.')
    out.append('─' * 65)

    return '\n'.join(out)


@app.get("/api/health")
def health():
    return {"status": "ok", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)