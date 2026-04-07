import os
import json
import google.generativeai as genai
from typing import Dict, List
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

# We use gemini-1.5-flash as it is fast, free, and excellent at NLP tasks
generation_config = {
  "temperature": 0.2, # Low temperature for more deterministic, factual output
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 8192,
  "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
)

def analyze_resume_genuine(resume_text: str, job_role: str, job_description: str = None) -> Dict:
    """
    Perform a highly genuine, ruthless analysis of the resume against the role/description.
    Expects a strict JSON output.
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
    try:
        response = model.generate_content(prompt)
        result = json.loads(response.text)
        
        result["keyword_source"] = "AI_Analysis"
        result["analyzed_keywords"] = result["keywords"]["matched"] + result["keywords"]["missing"]
        result["skills_to_learn"] = result["keywords"]["missing"][:5]
        result["project_ideas"] = [
            {"title": "Role-focused Portfolio", "tech": "Relevant Stack", "desc": "Build a hands-on project demonstrating missing skills."}
        ]
        
        return result
    except Exception as e:
        print(f"AI Analysis Error: {e}")
        raise e


def improve_resume_ai(resume_text: str, job_role: str, confirmed_skills: List[str]) -> str:
    """
    Intelligently rewrite the resume text safely into text format.
    """
    if not api_key:
        raise ValueError("GEMINI_API_KEY is missing")

    text_generation_config = {
      "temperature": 0.4,
      "top_p": 0.95,
      "top_k": 40,
      "max_output_tokens": 8192,
      "response_mime_type": "text/plain",
    }
    
    text_model = genai.GenerativeModel(
      model_name="gemini-1.5-flash",
      generation_config=text_generation_config,
    )

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
    try:
        response = text_model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"AI Improvement Error: {e}")
        raise e
