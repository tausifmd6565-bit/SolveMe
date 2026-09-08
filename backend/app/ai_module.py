"""
AI Module — Member 4's Bounded Module

This module provides AI-assisted problem analysis.
For the prototype, it uses keyword-matching rules.
Designed so it can be swapped to a real LLM API later.

Interface:
    analyze_problem(title: str, description: str) -> dict
"""

import re
from typing import Dict, List, Optional

# Category keywords mapping
CATEGORY_KEYWORDS = {
    "Water Management / Infrastructure": [
        "water", "waterlogging", "flooding", "drain", "drainage", "sewage",
        "pipeline", "water supply", "bore", "borewell", "tap water", "contaminated water",
        "rain", "monsoon", "stagnant", "overflow", "plumbing"
    ],
    "Healthcare / Public Health": [
        "health", "hospital", "clinic", "doctor", "medicine", "disease",
        "sanitation", "hygiene", "epidemic", "dengue", "malaria", "ambulance",
        "vaccination", "health centre", "primary health", "medical", "patient"
    ],
    "Education / Skill Development": [
        "school", "education", "teacher", "student", "college", "university",
        "classroom", "library", "digital", "computer", "skill", "training",
        "scholarship", "dropout", "literacy", "exam", "curriculum"
    ],
    "Road / Transport Infrastructure": [
        "road", "pothole", "bridge", "traffic", "transport", "bus",
        "highway", "footpath", "signal", "accident", "pedestrian",
        "parking", "street light", "broken road", "damaged road"
    ],
    "Agriculture / Rural Development": [
        "agriculture", "farming", "crop", "irrigation", "soil", "fertilizer",
        "harvest", "farmer", "pesticide", "drought", "rainfall", "cattle",
        "rural", "village", "market", "mandi", "subsidy"
    ],
    "Electricity / Energy": [
        "electricity", "power", "solar", "energy", "transformer", "wire",
        "outage", "blackout", "voltage", "meter", "bill", "electric",
        "generator", "grid", "renewable"
    ],
    "Waste Management / Environment": [
        "waste", "garbage", "trash", "pollution", "air quality", "dust",
        "plastic", "recycling", "dump", "landfill", "toxic", "chemical",
        "environment", "forest", "green", "deforestation", "smoke"
    ],
    "Public Safety / Security": [
        "safety", "crime", "police", "theft", "violence", "harassment",
        "security", "fire", "dangerous", "unsafe", "risk", "emergency",
        "accident", "rescue", "disaster"
    ],
    "Digital Infrastructure / Connectivity": [
        "internet", "wifi", "network", "mobile", "connectivity", "digital",
        "broadband", "tower", "signal", "website", "app", "online",
        "technology", "portal", "e-governance"
    ],
    "Housing / Urban Development": [
        "housing", "building", "construction", "slum", "encroachment",
        "demolition", "urban", "colony", "flat", "apartment", "rent",
        "land", "property", "infrastructure"
    ],
    "Women / Child Welfare": [
        "women", "child", "anganwadi", "nutrition", "gender", "abuse",
        "domestic", "protection", "welfare", "pregnancy", "maternal",
        "girl", "dowry", "empowerment"
    ],
    "Employment / Livelihood": [
        "job", "employment", "unemployment", "livelihood", "income",
        "wages", "labor", "worker", "entrepreneur", "self-employed",
        "startup", "msme", "business", "factory"
    ]
}

# Domain expertise mapping
DOMAIN_MAP = {
    "Water Management / Infrastructure": ["Civil Engineering", "Environmental Engineering"],
    "Healthcare / Public Health": ["Medical Science", "Public Health", "Biotechnology"],
    "Education / Skill Development": ["Education", "Computer Science", "Social Sciences"],
    "Road / Transport Infrastructure": ["Civil Engineering", "Urban Planning", "Transportation Engineering"],
    "Agriculture / Rural Development": ["Agriculture", "Soil Science", "Rural Management"],
    "Electricity / Energy": ["Electrical Engineering", "Renewable Energy", "Electronics"],
    "Waste Management / Environment": ["Environmental Science", "Chemical Engineering", "Urban Planning"],
    "Public Safety / Security": ["Criminology", "Emergency Management", "Social Work"],
    "Digital Infrastructure / Connectivity": ["Computer Science", "Electronics", "Information Technology"],
    "Housing / Urban Development": ["Architecture", "Civil Engineering", "Urban Planning"],
    "Women / Child Welfare": ["Social Work", "Public Policy", "Psychology"],
    "Employment / Livelihood": ["Economics", "Business Administration", "Rural Management"]
}


def _extract_keywords(text: str) -> List[str]:
    """Extract meaningful keywords from text."""
    # Remove common stop words and extract significant words
    stop_words = {
        "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
        "have", "has", "had", "do", "does", "did", "will", "would", "could",
        "should", "may", "might", "can", "shall", "to", "of", "in", "for",
        "on", "with", "at", "by", "from", "as", "into", "through", "during",
        "before", "after", "above", "below", "and", "but", "or", "nor",
        "not", "so", "yet", "both", "either", "neither", "each", "every",
        "all", "any", "few", "more", "most", "other", "some", "such",
        "no", "only", "same", "than", "too", "very", "just", "because",
        "it", "its", "this", "that", "these", "those", "i", "we", "they",
        "he", "she", "my", "our", "your", "his", "her", "their",
        "what", "which", "who", "whom", "when", "where", "why", "how",
        "there", "here", "also", "about", "up", "out", "if", "then"
    }
    words = re.findall(r'\b[a-z]+\b', text.lower())
    keywords = [w for w in words if w not in stop_words and len(w) > 2]
    # Return unique keywords, preserving order
    seen = set()
    unique = []
    for k in keywords:
        if k not in seen:
            seen.add(k)
            unique.append(k)
    return unique[:15]  # limit to 15 tags


def _categorize(text: str) -> tuple:
    """Determine category based on keyword matching. Returns (category, score)."""
    text_lower = text.lower()
    scores = {}
    for category, keywords in CATEGORY_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in text_lower)
        if score > 0:
            scores[category] = score
    
    if scores:
        best_category = max(scores, key=scores.get)
        return best_category, scores[best_category]
    return "General / Uncategorized", 0


def _generate_summary(title: str, description: str) -> str:
    """Generate a concise summary from title and description."""
    # For prototype: take first 2 sentences of description or truncate
    sentences = re.split(r'[.!?]+', description.strip())
    sentences = [s.strip() for s in sentences if s.strip()]
    if len(sentences) >= 2:
        summary = f"{sentences[0]}. {sentences[1]}."
    elif sentences:
        summary = f"{sentences[0]}."
    else:
        summary = title
    
    if len(summary) > 200:
        summary = summary[:197] + "..."
    return summary


def analyze_problem(title: str, description: str) -> Dict:
    """
    AI-assisted problem analysis.
    
    Args:
        title: Problem title
        description: Problem description
    
    Returns:
        dict with keys: suggested_category, summary, tags, possible_domains,
                       possible_duplicate_query
    """
    combined_text = f"{title} {description}"
    
    # Categorize
    category, confidence = _categorize(combined_text)
    
    # Generate summary
    summary = _generate_summary(title, description)
    
    # Extract tags
    tags = _extract_keywords(combined_text)
    
    # Get relevant domains
    domains = DOMAIN_MAP.get(category, ["General Studies", "Social Sciences"])
    
    # Generate duplicate search hint
    key_terms = tags[:3] if tags else title.lower().split()[:3]
    duplicate_hint = " ".join(key_terms)
    
    return {
        "suggested_category": category,
        "summary": summary,
        "tags": tags[:8],  # limit to 8 most relevant tags
        "possible_domains": domains,
        "possible_duplicate_query": duplicate_hint
    }
