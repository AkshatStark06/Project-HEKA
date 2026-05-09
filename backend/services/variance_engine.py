from typing import Dict


def analyze_variance(
    patient: Dict,
    progression: Dict,
    risk: Dict,
    cohorts: Dict
) -> Dict:

    variance_flags = []

    workflow_variances = []

    clinical_variances = []

    conversion_variances = []

    supporting_evidence = []

    traceability = patient.get("traceability", {})

    escalation_needed = False

    recommended_action = "Continue routine monitoring"

    # -----------------------------
    # Workflow Variance Detection
    # -----------------------------

    procedure_delays = progression.get("procedure_delays", [])

    if procedure_delays:

        variance_flags.append("procedure_conversion_delay")

        workflow_variances.append(
            "Advised procedure not yet completed"
        )

        supporting_evidence.extend(procedure_delays)

    care_gaps = progression.get("care_gaps", [])

    if care_gaps:

        variance_flags.append("followup_variance")

        workflow_variances.append(
            "Long follow-up inactivity detected"
        )

        supporting_evidence.extend(care_gaps)

    call_history = patient.get("call_history", [])

    if len(call_history) >= 2 and procedure_delays:

        variance_flags.append("repeated_followup_no_conversion")

        workflow_variances.append(
            "Repeated coordinator follow-ups without conversion"
        )

    # -----------------------------
    # Clinical Variance Detection
    # -----------------------------

    clinical_flags = progression.get("clinical_flags", [])

    for flag in clinical_flags:

        condition = flag.get("condition", "")

        if condition == "uncontrolled_diabetes":

            variance_flags.append(
                "persistent_uncontrolled_diabetes"
            )

            clinical_variances.append(
                "Diabetes remains uncontrolled despite ongoing follow-up"
            )

        elif condition == "persistent_hypertension":

            variance_flags.append(
                "persistent_uncontrolled_hypertension"
            )

            clinical_variances.append(
                "Blood pressure remains uncontrolled despite care pathway"
            )

        elif condition == "ongoing_cardiac_condition":

            variance_flags.append(
                "active_cardiac_management_variance"
            )

            clinical_variances.append(
                "Cardiac condition remains active and unresolved"
            )

    # -----------------------------
    # Conversion Variance Detection
    # -----------------------------

    

    for delay in procedure_delays:

        evidence_list = delay.get("evidence", [])

        for evidence in evidence_list:

            lower_evidence = evidence.lower()

            if "financial" in lower_evidence:

                variance_flags.append(
                    "financial_conversion_barrier"
                )

                conversion_variances.append(
                    "Financial concerns delaying conversion"
                )

            if "insurance" in lower_evidence:

                variance_flags.append(
                    "insurance_conversion_barrier"
                )

                conversion_variances.append(
                    "Insurance-related conversion delay"
                )

            if "hometown" in lower_evidence:

                variance_flags.append(
                    "hospital_preference_variance"
                )

                conversion_variances.append(
                    "Patient prefers treatment in hometown"
                )

            if "declined" in lower_evidence:

                variance_flags.append(
                    "local_conversion_refusal"
                )

                conversion_variances.append(
                    "Patient declined local procedure/admission"
                )

    # -----------------------------
    # Escalation Logic
    # -----------------------------

    if (
        risk.get("risk_level") == "high"
        and procedure_delays
    ):

        escalation_needed = True

        recommended_action = (
            "Immediate coordinator and clinical escalation required"
        )

    elif workflow_variances:

        recommended_action = (
            "Active follow-up and workflow intervention recommended"
        )

    return {
        "patient_id": patient.get("patient_id"),

        "variance_flags": variance_flags,

        "workflow_variances": workflow_variances,

        "clinical_variances": clinical_variances,

        "conversion_variances": conversion_variances,

        "escalation_needed": escalation_needed,

        "recommended_action": recommended_action,

        "supporting_evidence": supporting_evidence,

        "traceability": traceability
    }