import os
import json
import requests
import random
import time
from typing import Dict, List
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

# Resilient model list — updated April 2026
# gemini-1.5-x series is removed from API (404). gemini-2.0-flash free-tier quota = 0.
# Confirmed working: gemini-2.5-flash-lite, gemini-flash-lite-latest, gemini-flash-latest
MODELS = [
    "gemini-2.5-flash-lite",      # ✅ Confirmed working - fast & free tier available
    "gemini-flash-lite-latest",    # ✅ Latest flash lite alias
    "gemini-flash-latest",         # ✅ Latest flash alias
    "gemini-2.5-flash",            # ⚠️ May hit 503 under load — good fallback
    "gemini-2.0-flash",            # Last resort — may hit 429
]

def _gemini_post(prompt: str, temperature: float = 0.2, response_mime: str = "text/plain") -> str:
    """
    Bulletproof Gemini API call with:
    1. Multi-model fallbacks
    2. Exponential backoff for 429 Errors (Quota)
    3. Randomized Jitter to avoid thundering herd
    """
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
        
        # Try each model with multiple attempts
        max_attempts = 4 # Increased attempts
        for attempt in range(max_attempts):
            try:
                print(f"Gemini: Trying {model} (Attempt {attempt+1}/{max_attempts})...")
                response = requests.post(url, json=payload, timeout=40)
                
                # Handle Rate Limits (429)
                if response.status_code == 429:
                    wait_time = (2 ** attempt) + random.random() * 3 # Exponential wait
                    print(f"Gemini: {model} Quota reached (429). Retrying in {wait_time:.1f}s...")
                    time.sleep(wait_time)
                    continue
                
                # Handle Service Unavailable (503) — retry once with backoff before switching
                if response.status_code == 503:
                    if attempt < 1:  # Allow 1 retry with wait
                        wait_time = 3 + random.random() * 2
                        print(f"Gemini: {model} busy (503). Retrying in {wait_time:.1f}s...")
                        time.sleep(wait_time)
                        continue
                    print(f"Gemini: {model} still down (503). Switching model...")
                    break  # Try next model

                # Handle 404 — model deprecated/removed, skip immediately to next
                if response.status_code == 404:
                    print(f"Gemini: {model} not found (404). Model may be deprecated. Skipping...")
                    last_error = Exception(f"Model {model} not found (404)")
                    break

                # Handle other terminal errors (400, 401, 403, etc)
                if response.status_code in (400, 401, 403):
                    body = response.text[:300]
                    last_error = Exception(f"Gemini API Error {response.status_code}: {body}")
                    print(f"Gemini: Fatal error on {model}. {last_error}")
                    break
                    
                response.raise_for_status()
                data = response.json()
                
                # Validate response structure
                if not data.get('candidates') or not data['candidates'][0].get('content'):
                    raise Exception(f"Empty or malformed response from {model}")

                return data['candidates'][0]['content']['parts'][0]['text'].strip()

            except requests.exceptions.Timeout:
                print(f"Gemini: Request timed out on {model}. Retrying...")
                continue
            except Exception as e:
                print(f"Gemini: Error on {model}: {str(e)}")
                last_error = e
                time.sleep(1)
                continue
                
    # If we are here, all models and attempts failed
    raise last_error or Exception("All AI models failed after multiple retries and fallbacks.")

def parse_resume_ai(resume_text: str) -> Dict:
    """Extract name, contact, sections and suggest a role from resume text."""
    prompt = f"""
    Analyze this resume text and extract key details into JSON format.
    Return ONLY valid JSON.
    
    Resume Text (Partial):
    {resume_text[:6000]}
    
    Schema:
    {{
      "name": "Full Name",
      "contact": {{ "email": "email", "phone": "phone" }},
      "suggested_role": "Most relevant job role",
      "summary": "1-sentence summary",
      "sections_found": {{
         "summary": bool, "skills": bool, "experience": bool, "education": bool, "projects": bool, "certifications": bool, "achievements": bool
      }}
    }}
    """
    try:
        raw = _gemini_post(prompt, temperature=0.1, response_mime="application/json")
        return json.loads(raw)
    except Exception as e:
        print(f"parse_resume_ai failed: {e}")
        return { 
            "name": "User", "suggested_role": "", "summary": "", 
            "sections_found": { "summary": False, "skills": False, "experience": False, "education": False, "projects": False, "certifications": False, "achievements": False }
        }

def analyze_resume_genuine(resume_text: str, job_role: str, job_description: str = None) -> Dict:
    """Perform a highly genuine, ruthless analysis of the resume against the role."""
    if not api_key: raise ValueError("GEMINI_API_KEY is missing")

    jd_context = f"\nTarget Job Description:\n{job_description}" if job_description else ""

    prompt = f"""
You are an uncompromising, enterprise-level Applicant Tracking System (ATS). 
Evaluate the resume entirely genuinely based on the target role. DO NOT inflate the score.

Target Job Role: {job_role}{jd_context}

Resume Text:
---
{resume_text}
---

Response MUST be ONLY valid JSON.
Schema:
{{
  "total_score": int (0 to 100),
  "verdict": string,
  "rank_estimate": string,
  "job_match_percent": int,
  "breakdown": {{
    "keyword_match": {{"score": int, "max": 40, "label": "Keyword Match"}},
    "skills_relevance": {{"score": int, "max": 25, "label": "Skills Relevance"}},
    "resume_structure": {{"score": int, "max": 15, "label": "Structure"}},
    "section_completeness": {{"score": int, "max": 10, "label": "Completeness"}},
    "readability": {{"score": int, "max": 10, "label": "Readability"}}
  }},
  "keywords": {{
    "total": int, "matched": [string], "missing": [string], "matched_count": int, "missing_count": int
  }},
  "sections_detected": {{ "summary": bool, "skills": bool, "experience": bool, "education": bool, "projects": bool, "certifications": bool, "achievements": bool }},
  "missing_sections": [string],
  "suggestions": [{{ "priority": "high", "area": string, "icon": string, "issue": string, "fix": string, "impact": string }}],
  "strengths": [string]
}}
"""
    raw_text = _gemini_post(prompt, temperature=0.2, response_mime="application/json")
    result = json.loads(raw_text)
    
    # Enrichment
    result["keyword_source"] = "AI_Analysis"
    result["analyzed_keywords"] = result["keywords"]["matched"] + result["keywords"]["missing"]
    result["skills_to_learn"] = result["keywords"]["missing"][:5]
    
    # Project Ideas
    proj_prompt = f"Target Role: {job_role}. Missing Skills: {result['skills_to_learn']}. Suggest 3 projects as JSON array [{{'title': '...', 'tech': '...', 'desc': '...'}}]."
    try:
        proj_raw = _gemini_post(proj_prompt, temperature=0.7, response_mime="application/json")
        result["project_ideas"] = json.loads(proj_raw)
    except:
        result["project_ideas"] = [{"title": f"{job_role} Project", "tech": "Relevant Tech", "desc": "Build a hands-on project."}]
        
    return result

def improve_resume_ai(resume_text: str, job_role: str, confirmed_skills: List[str]) -> str:
    """Rewrite resume text into a clean ATS format."""
    if not api_key: raise ValueError("GEMINI_API_KEY is missing")
    skills_str = ", ".join(confirmed_skills) if confirmed_skills else "Original skills"

    prompt = f"""
You are a top-tier Professional Resume Writer. 
Rewrite the resume strictly into a clean ATS format. 
Target Role: {job_role}. Skills to integrate: {skills_str}.
RULES: No fake data. Use STAR method. Reset sections: HEADER, SUMMARY, SKILLS, EXPERIENCE, PROJECTS, EDUCATION.
Original:
{resume_text}
Return ONLY rewritten text.
"""
    return _gemini_post(prompt, temperature=0.4)
