from typing import Dict, List


def build_cohorts(
    patient: Dict,
    progression_data: Dict,
    risk_data: Dict
) -> Dict:

    cohorts = []

    progression_summary = progression_data.get(
        "progression_summary",
        []
    )

    clinical_flags = progression_data.get(
        "clinical_flags",
        []
    )

    care_gaps = progression_data.get(
        "care_gaps",
        []
    )

    procedure_delays = progression_data.get(
        "procedure_delays",
        []
    )

    risk_level = risk_data.get(
        "risk_level",
        "low"
    )

    if (
        "Diabetes remains uncontrolled"
        in progression_summary
        or
        "uncontrolled diabetes"
        in clinical_flags
    ):
        cohorts.append("uncontrolled_diabetes")

    if (
        "Blood pressure remains elevated"
        in progression_summary
        or
        "persistent hypertension"
        in clinical_flags
    ):
        cohorts.append("persistent_hypertension")

    if (
        "Cardiac condition remains active"
        in progression_summary
    ):
        cohorts.append("cardiac_high_risk")

    if risk_level == "high":
        cohorts.append("high_priority")

    elif risk_level == "moderate":
        cohorts.append("moderate_priority")

    if len(procedure_delays) > 0:
        cohorts.append("procedure_pending")

    if len(care_gaps) > 0:
        cohorts.append("lost_followup")

    barrier_text_parts = []

    barrier_text_parts.extend(progression_summary)

    for delay in procedure_delays:

        evidence_list = delay.get(
            "evidence",
            []
        )

        barrier_text_parts.extend(evidence_list)

    barrier_text = " ".join(
        barrier_text_parts
    ).lower()

    if "financial" in barrier_text:
        cohorts.append("financial_barrier")

    if "insurance" in barrier_text:
        cohorts.append("insurance_barrier")

    if (
        "financial" in barrier_text
        or
        "insurance" in barrier_text
        or
        "refused" in barrier_text
        or
        "delay" in barrier_text
    ):
        cohorts.append("conversion_risk")

    return {
        "patient_id": patient.get("patient_id"),
        "cohorts": cohorts,
        "traceability": progression_data.get(
            "traceability",
            {}
        )
    }