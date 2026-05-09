from typing import Dict, List


def analyze_risk(patient: Dict, progression_data: Dict) -> Dict:

    risk_score = 0

    risk_factors = []

    supporting_evidence = []


    # scoring logic here
    latest_visit = patient.get("latest_visit", {})

    clinical_flags = progression_data.get(
        "clinical_flags",
        []
    )
    clinical_findings = [
        item.get("finding", "")
        for item in clinical_flags
    ]

    care_gaps = progression_data.get(
        "care_gaps",
        []
    )

    procedure_delays = progression_data.get(
        "procedure_delays",
        []
    )

    if "Diabetes remains uncontrolled" in clinical_findings:

        risk_score += 2

        risk_factors.append(
            "Uncontrolled diabetes"
        )

        supporting_evidence.append(
            "HbA1c remains elevated over multiple visits"
        )
    
    if "Blood pressure remains elevated" in clinical_findings:

        risk_score += 2

        risk_factors.append(
            "Persistent hypertension"
        )

        supporting_evidence.append(
            "Blood pressure elevated across visits"
        )

    if "Cardiac condition remains active" in clinical_findings:

        risk_score += 3

        risk_factors.append(
            "Active cardiac condition"
        )

        supporting_evidence.append(
            "Ongoing cardiac diagnosis present"
        )

    if len(care_gaps) > 0:

        risk_score += 1

        risk_factors.append(
            "Long follow-up gap"
        )

        supporting_evidence.append(
            "Delayed clinical follow-up detected"
        )

    if len(procedure_delays) > 0:

        risk_score += 3

        risk_factors.append(
            "Pending critical procedure"
        )

        supporting_evidence.append(
            "Recommended procedure still pending"
        )


    risk_level = determine_risk_level(
        risk_score
    )

    priority_recommendation = (
        generate_priority_recommendation(
            risk_level
        )
    )   

    return {
        "patient_id": patient.get("patient_id"),

        "risk_level": risk_level,

        "risk_score": risk_score,

        "risk_factors": risk_factors,

        "priority_recommendation": priority_recommendation,

        "supporting_evidence": supporting_evidence,

    }

def determine_risk_level(score: int) -> str:

    if score >= 7:
        return "high"

    elif score >= 4:
        return "moderate"

    return "low"

def generate_priority_recommendation(risk_level: str) -> str:

    if risk_level == "high":
        return "Immediate clinical review recommended"

    elif risk_level == "moderate":
        return "Close follow-up recommended"

    return "Routine monitoring recommended"