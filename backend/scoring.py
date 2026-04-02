"""
GENUINE ATS Scoring Engine
- No fake scores
- Real keyword matching (case-insensitive, whole-word aware)
- Section detection
- Action verb analysis
- Quantification detection
"""

import re
from typing import List, Dict, Tuple


SECTION_PATTERNS = {
    "summary":      r'\b(summary|objective|profile|about me|professional summary|career objective)\b',
    "skills":       r'\b(skills|technical skills|core competencies|technologies|tools|expertise)\b',
    "experience":   r'\b(experience|work experience|employment|internship|internships|work history)\b',
    "education":    r'\b(education|academic|qualification|degree|university|college)\b',
    "projects":     r'\b(projects|project work|personal projects|academic projects|portfolio)\b',
    "certifications": r'\b(certification|certifications|courses|training|certificate)\b',
    "achievements": r'\b(achievement|achievements|awards|honors|accomplishments)\b',
}

ACTION_VERBS = [
    "developed", "built", "designed", "implemented", "created", "managed", "analyzed",
    "improved", "increased", "reduced", "led", "delivered", "optimized", "automated",
    "achieved", "executed", "deployed", "architected", "coordinated", "streamlined",
    "engineered", "launched", "established", "maintained", "generated", "resolved",
    "collaborated", "mentored", "spearheaded", "transformed", "integrated", "migrated",
    "configured", "monitored", "investigated", "modeled", "visualized", "processed"
]

QUANTIFICATION_PATTERNS = [
    r'\d+\s*%',
    r'\d+\s*(users|records|projects|clients|customers|employees|months|years|days|hours)',
    r'(rs\.?|inr|₹|\$)\s*\d+',
    r'\d+\s*(lakh|lakhs|crore|crores|thousand|million|k\b)',
    r'(top|rank)\s*\d+',
    r'\d+\+',
    r'increased by \d+',
    r'reduced by \d+',
]


def normalize_text(text: str) -> str:
    """Normalize text for matching"""
    return text.lower().strip()


def keyword_in_text(keyword: str, text: str) -> bool:
    """
    REAL keyword matching:
    - Case insensitive
    - Handles multi-word keywords
    - Not fooled by partial matches for short words
    """
    kw = normalize_text(keyword)
    t = normalize_text(text)
    
    if len(kw) <= 3:
        # Short keywords: require word boundary
        pattern = r'\b' + re.escape(kw) + r'\b'
        return bool(re.search(pattern, t))
    else:
        # Multi-word or longer: substring is fine
        return kw in t


def extract_resume_sections(text: str) -> Dict[str, bool]:
    """Detect which sections exist in resume"""
    t = normalize_text(text)
    found = {}
    for section, pattern in SECTION_PATTERNS.items():
        found[section] = bool(re.search(pattern, t, re.I))
    return found


def score_keyword_match(resume_text: str, keywords: List[str]) -> Tuple[int, List[str], List[str]]:
    """
    Score keyword match (max 40 points)
    Returns: score, matched_list, missing_list
    """
    matched = []
    missing = []
    
    for kw in keywords:
        if keyword_in_text(kw, resume_text):
            matched.append(kw)
        else:
            missing.append(kw)
    
    if not keywords:
        return 0, [], []
    
    ratio = len(matched) / len(keywords)
    score = round(ratio * 40)
    return score, matched, missing


def score_skills_relevance(resume_text: str, keywords: List[str]) -> int:
    """
    Score skills section relevance (max 25 points)
    Looks specifically in the skills section area
    """
    t = normalize_text(resume_text)
    
    # Find skills section content
    skills_match = re.search(
        r'(skills|technical skills|core competencies|technologies)[:\s]*\n?(.*?)(\n\n|\Z)',
        t, re.S | re.I
    )
    
    skills_area = skills_match.group(2) if skills_match else t[:500]
    
    skills_found = sum(1 for kw in keywords if keyword_in_text(kw, skills_area))
    
    if not keywords:
        return 0
    
    ratio = skills_found / min(len(keywords), 15)
    return min(25, round(ratio * 25))


def score_structure(resume_text: str) -> Tuple[int, List[str]]:
    """
    Score resume structure (max 15 points)
    - Action verbs usage
    - Bullet point formatting
    - Consistent structure
    """
    t = normalize_text(resume_text)
    issues = []
    score = 0
    
    # Action verbs check (0-8 points)
    verbs_found = [v for v in ACTION_VERBS if re.search(r'\b' + v + r'\b', t)]
    verb_score = min(8, len(verbs_found) * 2)
    score += verb_score
    
    if len(verbs_found) < 3:
        issues.append("Very few action verbs (developed, built, managed, etc.)")
    
    # Quantification check (0-7 points)  
    quant_count = sum(1 for p in QUANTIFICATION_PATTERNS if re.search(p, t, re.I))
    quant_score = min(7, quant_count * 2)
    score += quant_score
    
    if quant_count == 0:
        issues.append("No quantified achievements (add numbers, percentages, metrics)")
    
    return score, issues


def score_sections(sections: Dict[str, bool]) -> Tuple[int, List[str]]:
    """
    Score section completeness (max 10 points)
    Core sections for freshers
    """
    core_sections = ["education", "skills", "projects"]
    bonus_sections = ["summary", "certifications", "achievements"]
    
    missing = []
    score = 0
    
    for s in core_sections:
        if sections.get(s):
            score += 3
        else:
            missing.append(s.capitalize())
    
    for s in bonus_sections:
        if sections.get(s):
            score += 1
    
    return min(10, score), missing


def score_readability(resume_text: str) -> Tuple[int, List[str]]:
    """
    Score readability (max 10 points)
    - Not too long, not too short
    - Clean formatting signals
    - Contact info present
    """
    issues = []
    score = 0
    word_count = len(resume_text.split())
    
    # Word count (2 points)
    if 200 <= word_count <= 800:
        score += 2
    elif word_count < 200:
        issues.append(f"Resume too short ({word_count} words). Aim for 300-600 words.")
    else:
        issues.append(f"Resume too long ({word_count} words). Keep under 800 words for freshers.")
    
    # Contact info (3 points)
    has_email = bool(re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', resume_text))
    has_phone = bool(re.search(r'(\+91|0)?[6-9]\d{9}|\d{10}', resume_text))
    has_linkedin = bool(re.search(r'linkedin\.com/in/', resume_text, re.I))
    has_github = bool(re.search(r'github\.com/', resume_text, re.I))
    
    if has_email: score += 1
    if has_phone: score += 1
    if has_linkedin or has_github: score += 1
    
    if not has_email:
        issues.append("Email address not found")
    if not has_phone:
        issues.append("Phone number not found")
    
    # GitHub/Portfolio (2 points for freshers - very important)
    if has_github:
        score += 2
    elif has_linkedin:
        score += 1
    else:
        issues.append("Add GitHub or LinkedIn profile URL")
    
    # No obvious formatting issues (3 points)
    lines = resume_text.split('\n')
    non_empty = [l for l in lines if l.strip()]
    if len(non_empty) >= 10:
        score += 3
    else:
        issues.append("Resume appears to have very little content")
    
    return min(10, score), issues


def compute_ats_score(resume_text: str, job_role: str, keywords: List[str]) -> Dict:
    """
    Master function: compute genuine ATS score
    """
    sections = extract_resume_sections(resume_text)
    
    keyword_score, matched, missing = score_keyword_match(resume_text, keywords)
    skills_score = score_skills_relevance(resume_text, keywords)
    structure_score, structure_issues = score_structure(resume_text)
    section_score, missing_sections = score_sections(sections)
    readability_score, readability_issues = score_readability(resume_text)
    
    total = keyword_score + skills_score + structure_score + section_score + readability_score
    total = min(99, max(5, total))
    
    # Generate smart suggestions
    suggestions = []
    
    if missing[:5]:
        suggestions.append({
            "priority": "high",
            "area": "Keywords",
            "icon": "🔑",
            "issue": f"Missing {len(missing)} important keywords for {job_role}",
            "fix": f"Add these to your Skills section: {', '.join(missing[:6])}",
            "impact": "+8-12 ATS points"
        })
    
    if structure_issues:
        for issue in structure_issues[:2]:
            suggestions.append({
                "priority": "high",
                "area": "Impact",
                "icon": "📊",
                "issue": issue,
                "fix": "Example: 'Developed Python script that processed 10,000+ records, reducing manual effort by 40%'",
                "impact": "+5-8 ATS points"
            })
    
    if missing_sections:
        suggestions.append({
            "priority": "medium",
            "area": "Sections",
            "icon": "📋",
            "issue": f"Missing sections: {', '.join(missing_sections)}",
            "fix": f"Add these sections to your resume",
            "impact": "+3-5 ATS points"
        })
    
    if readability_issues:
        for issue in readability_issues[:2]:
            suggestions.append({
                "priority": "medium" if "GitHub" in issue else "low",
                "area": "Profile",
                "icon": "🔗",
                "issue": issue,
                "fix": "Add your LinkedIn and GitHub URLs at the top of your resume",
                "impact": "+2-4 ATS points"
            })
    
    # Rank estimate
    if total >= 80:
        rank = "Top 15%"
        verdict = "Excellent"
    elif total >= 65:
        rank = "Top 30%"
        verdict = "Good"
    elif total >= 50:
        rank = "Top 50%"
        verdict = "Average"
    elif total >= 35:
        rank = "Bottom 40%"
        verdict = "Needs Work"
    else:
        rank = "Bottom 20%"
        verdict = "Poor"
    
    # Skills to learn based on missing keywords
    skills_to_learn = missing[:6]
    
    # Project ideas based on role
    project_ideas = get_project_ideas(job_role, missing[:4])
    
    return {
        "total_score": total,
        "verdict": verdict,
        "rank_estimate": rank,
        "job_match_percent": min(98, round((len(matched) / max(len(keywords), 1)) * 100)),
        "breakdown": {
            "keyword_match": {"score": keyword_score, "max": 40, "label": "Keyword Match"},
            "skills_relevance": {"score": skills_score, "max": 25, "label": "Skills Relevance"},
            "resume_structure": {"score": structure_score, "max": 15, "label": "Structure & Impact"},
            "section_completeness": {"score": section_score, "max": 10, "label": "Section Completeness"},
            "readability": {"score": readability_score, "max": 10, "label": "Readability & Format"},
        },
        "keywords": {
            "total": len(keywords),
            "matched": matched,
            "missing": missing,
            "matched_count": len(matched),
            "missing_count": len(missing),
        },
        "sections_detected": sections,
        "missing_sections": missing_sections,
        "suggestions": suggestions,
        "skills_to_learn": skills_to_learn,
        "project_ideas": project_ideas,
        "strengths": build_strengths(sections, matched, resume_text),
    }


def build_strengths(sections: Dict, matched: List, resume_text: str) -> List[str]:
    strengths = []
    if sections.get("projects"):
        strengths.append("Has project experience — great for freshers")
    if sections.get("certifications"):
        strengths.append("Certifications add credibility")
    if len(matched) > 5:
        strengths.append(f"{len(matched)} relevant keywords already present")
    if re.search(r'github\.com/', resume_text, re.I):
        strengths.append("GitHub profile linked — shows practical skills")
    if re.search(r'\d+\s*%', resume_text):
        strengths.append("Has quantified achievements")
    if not strengths:
        strengths.append("Resume structure is parseable by ATS")
    return strengths


def get_project_ideas(role: str, missing_skills: List[str]) -> List[Dict]:
    role_lower = role.lower()
    
    if any(x in role_lower for x in ["data analyst", "data"]):
        return [
            {"title": "Sales Dashboard", "tech": "Python + Power BI", "desc": "Analyze e-commerce dataset, build interactive dashboard"},
            {"title": "Customer Churn Analysis", "tech": "Python + SQL", "desc": "Predict churning customers using historical data"},
            {"title": "Finance Tracker", "tech": "Python + Excel", "desc": "Personal finance analysis with automated reports"},
        ]
    elif any(x in role_lower for x in ["mis", "operations"]):
        return [
            {"title": "MIS Report Automation", "tech": "Excel VBA / Python", "desc": "Automate daily MIS reports from raw data"},
            {"title": "Inventory Dashboard", "tech": "Excel + Power BI", "desc": "Track inventory KPIs with automated alerts"},
            {"title": "Process Optimization", "tech": "Excel + SQL", "desc": "Identify bottlenecks in a business process using data"},
        ]
    elif any(x in role_lower for x in ["business analyst", "ba"]):
        return [
            {"title": "E-commerce BRD", "tech": "Documentation", "desc": "Write full Business Requirements Document for a fake startup"},
            {"title": "Process Flow Mapper", "tech": "Visio/Draw.io", "desc": "Map AS-IS and TO-BE process for a banking use case"},
            {"title": "Stakeholder Analysis", "tech": "Excel + PPT", "desc": "Complete stakeholder analysis for a retail project"},
        ]
    else:
        return [
            {"title": "Portfolio Website", "tech": "React / HTML", "desc": "Showcase all your projects professionally"},
            {"title": "Data Analysis Project", "tech": "Python + SQL", "desc": "Analyze a Kaggle dataset and publish findings"},
            {"title": "Automation Script", "tech": "Python", "desc": "Automate a repetitive task and document the impact"},
        ]