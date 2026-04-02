"""
Real keyword database for ATS matching.
Keywords are extracted from actual job postings on Naukri, LinkedIn, Indeed India.
"""

import re
from typing import List

ROLE_KEYWORDS: dict = {
    "data analyst": [
        "SQL", "Python", "Excel", "Power BI", "Tableau",
        "pandas", "numpy", "data visualization", "ETL",
        "data cleaning", "pivot tables", "VLOOKUP", "Power Query",
        "statistics", "dashboard", "reporting", "data wrangling",
        "matplotlib", "seaborn", "Jupyter", "Google Analytics",
        "A/B testing", "KPI", "business intelligence", "R",
        "data modeling", "hypothesis testing", "regression",
        "MySQL", "PostgreSQL", "data pipeline", "storytelling",
    ],
    "business analyst": [
        "requirements gathering", "stakeholder management", "BRD",
        "FRS", "user stories", "Agile", "Scrum", "JIRA",
        "wireframes", "process mapping", "BPMN", "gap analysis",
        "UAT", "SQL", "Excel", "Power BI", "data analysis",
        "Confluence", "Visio", "use cases", "test cases",
        "change management", "risk analysis", "cost-benefit analysis",
        "sprint planning", "backlog grooming", "KPI", "SLA",
        "documentation", "presentation", "stakeholder",
    ],
    "mis executive": [
        "MIS", "MIS reports", "Excel", "VBA", "macros",
        "pivot tables", "VLOOKUP", "HLOOKUP", "Power BI",
        "SQL", "data analysis", "dashboard", "reporting",
        "data validation", "data entry", "reconciliation",
        "automation", "Power Query", "MS Office", "SAP",
        "ERP", "data management", "KPI tracking", "SLA",
        "advanced Excel", "conditional formatting", "data cleaning",
        "daily reports", "weekly reports", "monthly reports",
    ],
    "operations analyst": [
        "process improvement", "operations", "SQL", "Excel",
        "data analysis", "KPI", "SLA", "workflow", "reporting",
        "Power BI", "Tableau", "supply chain", "logistics",
        "Six Sigma", "Lean", "root cause analysis", "CAPA",
        "ERP", "SAP", "automation", "project management",
        "stakeholder management", "cost reduction", "efficiency",
        "process documentation", "SOP", "JIRA", "dashboards",
        "forecasting", "inventory", "vendor management",
    ],
    "software engineer": [
        "Python", "Java", "JavaScript", "C++", "data structures",
        "algorithms", "REST API", "Git", "GitHub", "Docker",
        "SQL", "MySQL", "MongoDB", "React", "Node.js",
        "system design", "OOP", "AWS", "Linux", "CI/CD",
        "unit testing", "debugging", "Agile", "Scrum", "JIRA",
        "microservices", "TypeScript", "HTML", "CSS", "PostgreSQL",
        "Redis", "Kafka", "Spring Boot", "Django", "FastAPI",
    ],
    "web developer": [
        "HTML", "CSS", "JavaScript", "React", "Node.js",
        "TypeScript", "Next.js", "REST API", "Git", "GitHub",
        "responsive design", "Tailwind CSS", "Bootstrap",
        "MongoDB", "SQL", "Figma", "webpack", "SEO",
        "performance optimization", "cross-browser", "accessibility",
        "Vue.js", "Express.js", "API integration", "deployment",
        "Netlify", "Vercel", "Firebase", "Redux", "SASS",
    ],
    "marketing analyst": [
        "Google Analytics", "SEO", "SEM", "social media",
        "Excel", "data analysis", "campaign management", "A/B testing",
        "CRM", "Power BI", "SQL", "content strategy",
        "email marketing", "paid ads", "ROI", "market research",
        "segmentation", "Salesforce", "HubSpot", "KPI",
        "Google Ads", "Facebook Ads", "keyword research",
        "conversion rate", "funnel analysis", "customer journey",
    ],
    "product manager": [
        "roadmap", "user stories", "Agile", "Scrum", "JIRA",
        "stakeholder management", "product strategy", "KPI",
        "A/B testing", "user research", "wireframes", "Figma",
        "prioritization", "go-to-market", "SQL", "analytics",
        "OKR", "competitive analysis", "customer journey",
        "backlog management", "sprint planning", "PRD",
        "product roadmap", "data-driven", "user interviews",
    ],
    "hr": [
        "recruitment", "talent acquisition", "onboarding",
        "payroll", "HRIS", "employee relations", "performance management",
        "Excel", "HR policies", "compliance", "Workday", "SAP HR",
        "job portals", "Naukri", "LinkedIn", "screening",
        "interviewing", "compensation", "benefits", "L&D",
        "training", "induction", "HR analytics", "attrition",
    ],
    "finance": [
        "financial analysis", "Excel", "accounting", "Tally",
        "GST", "TDS", "balance sheet", "P&L", "cash flow",
        "budgeting", "forecasting", "variance analysis",
        "SAP FICO", "QuickBooks", "financial modeling", "VLOOKUP",
        "pivot tables", "auditing", "reconciliation", "MIS",
        "cost analysis", "financial reporting", "ratio analysis",
    ],
}

# Aliases for fuzzy role matching
ROLE_ALIASES = {
    "da": "data analyst",
    "data analyst": "data analyst",
    "analyst": "data analyst",
    "data science": "data analyst",
    "ba": "business analyst",
    "business analyst": "business analyst",
    "sys analyst": "business analyst",
    "mis": "mis executive",
    "mis executive": "mis executive",
    "mis analyst": "mis executive",
    "ops analyst": "operations analyst",
    "operations analyst": "operations analyst",
    "operations": "operations analyst",
    "swe": "software engineer",
    "software engineer": "software engineer",
    "software developer": "software engineer",
    "sde": "software engineer",
    "dev": "software engineer",
    "web dev": "web developer",
    "web developer": "web developer",
    "frontend": "web developer",
    "backend": "software engineer",
    "full stack": "web developer",
    "fullstack": "web developer",
    "marketing": "marketing analyst",
    "pm": "product manager",
    "product": "product manager",
    "hr": "hr",
    "human resources": "hr",
    "talent acquisition": "hr",
    "finance": "finance",
    "accounts": "finance",
    "ca": "finance",
}


def get_role_keywords(role: str) -> List[str]:
    """
    Get keywords for a role using fuzzy matching.
    Returns a list of keywords most relevant to the role.
    """
    role_lower = role.lower().strip()
    
    # Direct match
    if role_lower in ROLE_KEYWORDS:
        return ROLE_KEYWORDS[role_lower]
    
    # Alias match
    for alias, canonical in ROLE_ALIASES.items():
        if alias in role_lower:
            return ROLE_KEYWORDS.get(canonical, [])
    
    # Partial match
    for key in ROLE_KEYWORDS:
        if key in role_lower or role_lower in key:
            return ROLE_KEYWORDS[key]
    
    # Fallback: generic professional keywords
    return [
        "communication", "teamwork", "problem solving", "analytical thinking",
        "MS Office", "Excel", "data analysis", "reporting", "presentation",
        "stakeholder management", "project management", "SQL", "Python",
        "documentation", "Agile", "JIRA", "critical thinking", "time management",
    ]


def extract_jd_keywords(job_description: str) -> List[str]:
    """
    Extract meaningful keywords from a job description.
    - Filters out stop words
    - Focuses on skills, tools, technologies
    - Returns deduplicated list
    """
    # Known tech/skill terms to prioritize
    TECH_TERMS = [
        # Programming
        "python", "java", "javascript", "typescript", "c++", "c#", "r", "scala", "go", "ruby",
        # Data tools
        "sql", "mysql", "postgresql", "mongodb", "oracle", "sql server", "sqlite",
        "excel", "power bi", "tableau", "looker", "qlik", "metabase",
        "pandas", "numpy", "matplotlib", "seaborn", "scikit-learn", "tensorflow",
        # Cloud/DevOps
        "aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "jenkins", "git", "github",
        # Frameworks
        "react", "angular", "vue", "node.js", "django", "flask", "fastapi", "spring",
        "next.js", "express", "tailwind", "bootstrap",
        # Tools
        "jira", "confluence", "figma", "postman", "airflow", "spark", "kafka", "redis",
        "sap", "salesforce", "hubspot", "workday", "servicenow",
        # Methodologies
        "agile", "scrum", "kanban", "six sigma", "lean", "waterfall",
        # Soft skills (keep these)
        "communication", "leadership", "teamwork", "problem solving", "analytical",
    ]
    
    jd_lower = job_description.lower()
    found_terms = []
    
    # First: extract known tech terms
    for term in TECH_TERMS:
        if re.search(r'\b' + re.escape(term) + r'\b', jd_lower):
            found_terms.append(term)
    
    # Second: extract multi-word phrases (2-3 words that look like skills)
    skill_phrases = re.findall(
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\b',
        job_description
    )
    for phrase in skill_phrases:
        if len(phrase) > 4 and phrase.lower() not in ['the', 'and', 'for', 'with']:
            found_terms.append(phrase)
    
    # Third: extract capitalized acronyms (SQL, API, MIS, etc.)
    acronyms = re.findall(r'\b[A-Z]{2,6}\b', job_description)
    common_acronyms = ["SQL", "API", "MIS", "ERP", "SAP", "KPI", "SLA", "CRM", "ETL",
                       "BI", "ML", "AI", "UI", "UX", "QA", "HR", "ERP", "MBA", "B.Tech"]
    for acr in acronyms:
        if acr in common_acronyms:
            found_terms.append(acr)
    
    # Deduplicate maintaining order
    seen = set()
    result = []
    for term in found_terms:
        t = term.strip()
        if t and t.lower() not in seen:
            seen.add(t.lower())
            result.append(t)
    
    return result[:35]