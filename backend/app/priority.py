"""
Priority Scoring Module

Rule-based priority scoring from the SIH workflow document.
Priority Score = Community Signal (0-5) + Evidence Score (0-3) + 
                 Severity Signal (0-5) + Urgency Signal (0-3) + 
                 Validation Signal (0-4)

Max possible score = 20
"""

from typing import Dict


def calculate_priority(
    confirmation_count: int = 0,
    has_evidence: bool = False,
    evidence_count: int = 0,
    severity: str = "medium",
    description: str = "",
    is_validated: bool = False,
    has_expert_validation: bool = False
) -> Dict:
    """
    Calculate priority score with transparent breakdown.
    
    Returns:
        dict with 'total' and individual signal scores
    """
    # Community Signal (0-5): based on confirmation count
    if confirmation_count >= 50:
        community_signal = 5.0
    elif confirmation_count >= 25:
        community_signal = 4.0
    elif confirmation_count >= 10:
        community_signal = 3.0
    elif confirmation_count >= 5:
        community_signal = 2.0
    elif confirmation_count >= 1:
        community_signal = 1.0
    else:
        community_signal = 0.0
    
    # Evidence Score (0-3): based on submitted evidence
    if evidence_count >= 3:
        evidence_score = 3.0
    elif evidence_count >= 2:
        evidence_score = 2.0
    elif has_evidence or evidence_count >= 1:
        evidence_score = 1.0
    else:
        evidence_score = 0.0
    
    # Severity Signal (0-5): based on user-selected severity
    severity_map = {
        "low": 1.0,
        "medium": 3.0,
        "high": 5.0
    }
    severity_signal = severity_map.get(severity.lower(), 3.0)
    
    # Urgency Signal (0-3): based on keywords in description
    urgency_keywords = [
        "urgent", "emergency", "immediately", "critical", "dangerous",
        "life-threatening", "collapsed", "flooding now", "fire",
        "outbreak", "accident", "rescue", "trapped"
    ]
    desc_lower = description.lower()
    urgency_hits = sum(1 for kw in urgency_keywords if kw in desc_lower)
    urgency_signal = min(3.0, urgency_hits * 1.5)
    
    # Validation Signal (0-4): based on official validation
    validation_signal = 0.0
    if has_expert_validation:
        validation_signal = 4.0
    elif is_validated:
        validation_signal = 2.0
    
    total = community_signal + evidence_score + severity_signal + urgency_signal + validation_signal
    
    return {
        "community_signal": round(community_signal, 1),
        "evidence_score": round(evidence_score, 1),
        "severity_signal": round(severity_signal, 1),
        "urgency_signal": round(urgency_signal, 1),
        "validation_signal": round(validation_signal, 1),
        "total": round(total, 1)
    }
