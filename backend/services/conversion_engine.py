from typing import Dict


def analyze_conversion(
    patient: Dict,
    progression: Dict,
    risk: Dict,
    cohort_data: Dict,
    variance: Dict
) -> Dict:

    conversion_status = "unknown"

    conversion_risk = "low"

    conversion_barriers = []

    positive_conversion_signals = []

    negative_conversion_signals = []

    recommended_conversion_action = ""

    coordinator_priority = False

    supporting_evidence = []

    traceability = {}

    cohorts = cohort_data.get("cohorts", [])

    conversion_variances = variance.get(
        "conversion_variances",
        []
    )

    if "financial_barrier" in cohorts:
        conversion_barriers.append(
            "financial_constraint"
        )

        negative_conversion_signals.append(
            "financial concern affecting procedure conversion"
        )

    if "insurance_barrier" in cohorts:
        conversion_barriers.append(
            "insurance_clearance_pending"
        )

        negative_conversion_signals.append(
            "insurance approval delaying conversion"
        )

    if any(
        "hometown" in variance.lower()
        for variance in conversion_variances
    ):
        conversion_barriers.append(
            "external_treatment_preference"
        )

        negative_conversion_signals.append(
            "patient prefers treatment near hometown"
        )

    if any(
        "refusal" in variance.lower()
        for variance in conversion_variances
    ):
        conversion_barriers.append(
            "local_procedure_refusal"
        )

        negative_conversion_signals.append(
            "patient declined advised procedure locally"
        )

    risk_level = risk.get(
        "risk_level",
        ""
    )

    clinical_flags = progression.get(
        "clinical_flags",
        []
    )

    workflow_variances = variance.get(
        "workflow_variances",
        []
    )

    if risk_level == "high":

        positive_conversion_signals.append(
            "high clinical urgency may improve conversion likelihood"
        )

    if any(
        "procedure" in variance.lower()
        for variance in workflow_variances
    ):

        positive_conversion_signals.append(
            "active procedure workflow detected"
        )

    if len(patient.get("timeline", [])) >= 3:

        positive_conversion_signals.append(
            "repeat engagement with care pathway"
        )

    if any(
        "cardiac" in str(flag).lower()
        for flag in clinical_flags
    ):

        positive_conversion_signals.append(
            "serious cardiac condition increases escalation priority"
        )

    if (
        len(conversion_barriers) == 0
        and len(positive_conversion_signals) >= 2
    ):

        conversion_status = "likely_to_convert"

        conversion_risk = "low"

    elif (
        len(conversion_barriers) >= 1
        and len(positive_conversion_signals) >= 1
    ):

        conversion_status = "hesitant_conversion"

        conversion_risk = "moderate"

    elif len(conversion_barriers) >= 3:

        conversion_status = "high_conversion_risk"

        conversion_risk = "high"

    if any(
        "hometown" in variance.lower()
        for variance in conversion_variances
    ):

        conversion_status = "transferred_external"

        conversion_risk = "high"

    if (
        any(
            "follow-up" in variance.lower()
            for variance in workflow_variances
        )
        and len(conversion_barriers) >= 2
    ):

        conversion_status = "lost_conversion"

        conversion_risk = "high"

    if (
        risk_level == "high"
        and conversion_status != "likely_to_convert"
    ):

        coordinator_priority = True

    if conversion_status == "likely_to_convert":

        recommended_conversion_action = (
            "continue active follow-up and procedure scheduling"
        )

    elif conversion_status == "hesitant_conversion":

        recommended_conversion_action = (
            "target identified conversion barriers through coordinator intervention"
        )

    elif conversion_status == "high_conversion_risk":

        recommended_conversion_action = (
            "urgent coordinator escalation required to prevent conversion loss"
        )

    elif conversion_status == "lost_conversion":

        recommended_conversion_action = (
            "intensive recovery follow-up required"
        )

    elif conversion_status == "transferred_external":

        recommended_conversion_action = (
            "document external conversion leakage and monitor outcome"
        )

    supporting_evidence.extend(
        conversion_barriers
    )

    supporting_evidence.extend(
        positive_conversion_signals
    )

    supporting_evidence.extend(
        negative_conversion_signals
    )

    traceability = {
        "progression_engine": progression.get(
            "traceability",
            {}
        ),

        "risk_engine": risk.get(
            "traceability",
            {}
        ),

        "cohort_engine": cohort_data.get(
            "traceability",
            {}
        ),

        "variance_engine": variance.get(
            "traceability",
            {}
        )
    }

    return {
        "patient_id": patient.get("patient_id"),

        "conversion_status": conversion_status,

        "conversion_risk": conversion_risk,

        "conversion_barriers": conversion_barriers,

        "positive_conversion_signals": positive_conversion_signals,

        "negative_conversion_signals": negative_conversion_signals,

        "recommended_conversion_action": recommended_conversion_action,

        "coordinator_priority": coordinator_priority,

        "supporting_evidence": supporting_evidence,

        "traceability": traceability
    }