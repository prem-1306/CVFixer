import os
import json
import requests
from typing import Dict, List
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
MODELS = ["gemini-2.0-flash", "gemini-2.0-flash-lite"]

def _gemini_post(prompt: str, temperature: float = 0.2, response_mime: str = "text/plain") -> str:
    """Helper for Gemini API calls with retries and 429 backoff."""
    import time
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": temperature,
            "responseMimeType": response_mime
        }
    }
    
    last_error = None
    for model in MODELS:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        for attempt in range(3):
            try:
                print(f"Gemini: Trying {model} (attempt {attempt+1})...")
                response = requests.post(url, json=payload, timeout=60)
                
                if response.status_code == 429:
                    print(f"{model} quota/rate limit reached. Waiting 10s...")
                    time.sleep(10)
                    continue
                
                if response.status_code == 503:
                    break

                if response.status_code in (400, 401, 403, 404):
                    body = response.text[:500]
                    last_error = Exception(f"Gemini API Error {response.status_code}: {body}")
                    break
                    
                response.raise_for_status()
                data = response.json()
                return data['candidates'][0]['content']['parts'][0]['text'].strip()
            except Exception as e:
                last_error = e
                if attempt < 2: time.sleep(2)
                continue
    raise last_error or Exception("All AI models failed")

def parse_resume_ai(resume_text: str) -> Dict:
    """Extract name, contact, sections and suggest a role from resume text."""
    prompt = f"""
    Analyze this resume text and extract key details into JSON format.
    Return ONLY valid JSON.
    
    Resume Text:
    {resume_text[:4000]}
    
    Schema:
    {{
      "name": "Full Name",
      "contact": {{ "email": "email", "phone": "phone" }},
      "suggested_role": "Most relevant job role (e.g. Data Analyst, Web Developer)",
      "summary": "1-sentence professional summary",
      "sections_found": ["List", "of", "sections"]
    }}
    """
    try:
        raw = _gemini_post(prompt, temperature=0.1, response_mime="application/json")
        return json.loads(raw)
    except:
        return { "name": "User", "suggested_role": "", "summary": "", "sections_found": [] }

def analyze_resume_genuine(resume_text: str, job_role: str, job_description: str = None) -> Dict:
    """
    Perform a highly genuine, ruthless analysis of the resume against the role/description.
    """
    if not api_key:
        raise ValueError("GEMINI_API_KEY is missing")

    jd_context = f"\nTarget Job Description:\n{job_description}" if job_description else ""

    prompt = f"""
You are an uncompromising, enterprise-level Applicant Tracking System (ATS). 
Your task is to evaluate the provided resume entirely genuinely based on the target job role.
Do NOT inflate the score to make the user feel good. If it is a bad match or poorly formatted, give a low score (e.g., 20-40). 
If it is a great match, give a high score.

Target Job Role: {job_role}{jd_context}

Resume Text:
---
{resume_text}
---

Your response must be ONLY valid JSON matching this schema exactly:
{{
  "total_score": int (0 to 100),
  "verdict": string ("Poor", "Needs Work", "Average", "Good", "Excellent"),
  "rank_estimate": string (e.g. "Bottom 20%", "Top 30%"),
  "job_match_percent": int (0 to 100),
  "breakdown": {{
    "keyword_match": {{"score": int (out of 40), "max": 40, "label": "Keyword Match"}},
    "skills_relevance": {{"score": int (out of 25), "max": 25, "label": "Skills Relevance"}},
    "resume_structure": {{"score": int (out of 15), "max": 15, "label": "Structure & Impact"}},
    "section_completeness": {{"score": int (out of 10), "max": 10, "label": "Section Completeness"}},
    "readability": {{"score": int (out of 10), "max": 10, "label": "Readability & Format"}}
  }},
  "keywords": {{
    "total": int (total combined matched+missing),
    "matched": list of strings (keywords truly explicitly found in the resume),
    "missing": list of strings (crucial core keywords for this role/JD that are entirely missing),
    "matched_count": int,
    "missing_count": int
  }},
  "sections_detected": {{
    "summary": bool, "skills": bool, "experience": bool, "education": bool, "projects": bool, "certifications": bool, "achievements": bool
  }},
  "missing_sections": list of strings,
  "suggestions": [
     {{ "priority": "high", "area": string, "icon": string (emoji), "issue": string, "fix": string, "impact": string }}
  ],
  "strengths": list of strings
}}
"""
    raw_text = _gemini_post(prompt, temperature=0.2, response_mime="application/json")
    result = json.loads(raw_text)
    
    result["keyword_source"] = "AI_Analysis"
    result["analyzed_keywords"] = result["keywords"]["matched"] + result["keywords"]["missing"]
    result["skills_to_learn"] = result["keywords"]["missing"][:5]
    result["project_ideas"] = [
        {"title": "Role-focused Portfolio", "tech": "Relevant Stack", "desc": "Build a hands-on project demonstrating missing skills."}
    ]
    return result


def improve_resume_ai(resume_text: str, job_role: str, confirmed_skills: List[str]) -> str:
    """
    Intelligently rewrite the resume text safely into text format.
    """
    if not api_key:
        raise ValueError("GEMINI_API_KEY is missing")

    skills_str = ", ".join(confirmed_skills) if confirmed_skills else "None provided"

    prompt = f"""
You are a top-tier Professional Resume Writer and ATS Optimizer.
Your task is to take the user's original resume text and rewrite it strictly into a clean, highly ATS-readable format.

Job Role Target: {job_role}
Confirmed Skills to Add: {skills_str}

RULES:
1. DO NOT make up fake jobs, fake companies, or fake degrees.
2. If Confirmed Skills are provided, seamlessly integrate them into the 'Skills' section, AND naturally weave 1 or 2 into Experience/Projects natively.
3. Improve all bullet points using the STAR method (Situation, Task, Action, Result). Replace weak verbs.
4. Set STANDARD sections: PROFESSIONAL SUMMARY, SKILLS, EXPERIENCE/PROJECTS, EDUCATION.
5. Format the output cleanly with textual dividers (e.g., -------------------------).

Original Resume Text:
---
{resume_text}
---

Return ONLY the rewritten resume text. Do not include introductory conversational text.
"""
    return _gemini_post(prompt, temperature=0.4)
