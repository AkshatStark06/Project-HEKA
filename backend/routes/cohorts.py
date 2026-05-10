from fastapi import APIRouter

from services.data_loader import DataLoader
from services.patient_processor import PatientProcessor

router = APIRouter()

loader = DataLoader("data/patients.json")

processor = PatientProcessor()


@router.get("/cohort/{cohort_name}")
def get_patients_by_cohort(
    cohort_name: str
):

    patients = loader.load_json()

    matched_patients = []

    for patient in patients:

        processed_patient = (
            processor.process_patient(patient)
        )

        cohorts = (
            processed_patient
            .get("cohort_analysis", {})
            .get("cohorts", [])
        )

        if cohort_name in cohorts:

            matched_patients.append({

                "patient_id": processed_patient.get(
                    "patient_id"
                ),

                "name": processed_patient
                    .get("demographics", {})
                    .get("name"),

                "risk_level": processed_patient
                    .get("risk_analysis", {})
                    .get("risk_level"),

                "risk_score": processed_patient
                    .get("risk_analysis", {})
                    .get("risk_score"),

                "risk_category": processed_patient
                    .get("risk_analysis", {})
                    .get("risk_level"),

                "conversion_risk":
                    "conversion_risk" in cohorts,

                "lost_followup_risk":
                    "lost_followup" in cohorts,

                "delayed_procedure":
                    "procedure_pending" in cohorts,

                "priority_reason":
                    processed_patient
                    .get("llm_insights", {})
                    .get("doctor_summary"),

                "cohorts": cohorts,

                "conversion_status": processed_patient
                    .get("conversion_analysis", {})
                    .get("conversion_status")
            })

    return matched_patients