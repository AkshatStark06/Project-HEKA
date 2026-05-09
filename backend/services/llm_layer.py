from typing import Dict


def generate_llm_insights(
    patient: Dict,
    progression_data: Dict,
    risk_data: Dict,
    cohort_data: Dict,
    variance_data: Dict,
    conversion_data: Dict
) -> Dict:

    doctor_summary_parts = []

    coordinator_summary_parts = []

    key_takeaways = []

    recommended_actions = []

    evidence_used = []

    # -----------------------------
    # Doctor Summary
    # -----------------------------

    if risk_data["risk_level"] == "high":
        doctor_summary_parts.append(
            "Patient is categorized as high clinical risk"
        )

    elif risk_data["risk_level"] == "moderate":
        doctor_summary_parts.append(
            "Patient is categorized as moderate clinical risk."
        )

    if progression_data["clinical_flags"]:
        for flag in progression_data["clinical_flags"]:

            if isinstance(flag, dict):

                doctor_summary_parts.append(
                    flag.get("finding", "")
                )

            else:
                doctor_summary_parts.append(str(flag))

    if variance_data["clinical_variances"]:
        for variance in variance_data["clinical_variances"]:

            if isinstance(variance, dict):

                doctor_summary_parts.append(
                    variance.get("finding", "")
                )

            else:
                doctor_summary_parts.append(str(variance))

    # -----------------------------
    # Coordinator Summary
    # -----------------------------

    coordinator_summary_parts.append(
        f'Conversion status: {conversion_data["conversion_status"]}'
    )

    if conversion_data["conversion_barriers"]:
        coordinator_summary_parts.append(
            "Detected conversion barriers present."
        )

    if variance_data["workflow_variances"]:
        coordinator_summary_parts.extend(
            variance_data["workflow_variances"]
        )

    # -----------------------------
    # Key Takeaways
    # -----------------------------

    key_takeaways.extend(
        progression_data["progression_summary"]
    )

    key_takeaways.extend(
        risk_data["risk_factors"]
    )

    # -----------------------------
    # Recommended Actions
    # -----------------------------

    recommended_actions.append(
        risk_data["priority_recommendation"]
    )

    recommended_actions.append(
        conversion_data["recommended_conversion_action"]
    )

    # -----------------------------
    # Evidence Aggregation
    # -----------------------------

    evidence_used.extend(
        progression_data["supporting_evidence"]
    )

    evidence_used.extend(
        risk_data["supporting_evidence"]
    )

    evidence_used.extend(
        conversion_data["supporting_evidence"]
    )

    return {

        "patient_id": patient["patient_id"],

        "doctor_summary": ". ".join(doctor_summary_parts) + ".",

        "coordinator_summary": ". ".join(
            coordinator_summary_parts
        ) + ".",

        "key_takeaways": key_takeaways,

        "recommended_actions": recommended_actions,

        "evidence_used": evidence_used,

        "traceability": {
            "evidence_sources": [
                "progression_engine",
                "risk_engine",
                "conversion_engine"
            ]
        }

    }