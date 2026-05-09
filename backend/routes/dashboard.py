from fastapi import APIRouter

from services.data_loader import DataLoader
from services.patient_processor import PatientProcessor

router = APIRouter()

loader = DataLoader("data/patients.json")

processor = PatientProcessor()


@router.get("/dashboard/summary")
def get_dashboard_summary():

    patients = loader.load_json()

    processed_patients = []

    for patient in patients:

        processed_patients.append(
            processor.process_patient(patient)
        )

    total_patients = len(processed_patients)

    high_risk_patients = 0

    moderate_risk_patients = 0

    low_risk_patients = 0

    pending_procedures = 0

    conversion_risk_patients = 0

    lost_followup_patients = 0

    for patient in processed_patients:

        risk_level = (
            patient
            .get("risk_analysis", {})
            .get("risk_level")
        )

        if risk_level == "high":
            high_risk_patients += 1

        elif risk_level == "moderate":
            moderate_risk_patients += 1

        elif risk_level == "low":
            low_risk_patients += 1

        cohorts = (
            patient
            .get("cohort_analysis", {})
            .get("cohorts", [])
        )

        if "procedure_pending" in cohorts:
            pending_procedures += 1

        if "conversion_risk" in cohorts:
            conversion_risk_patients += 1

        if "lost_followup" in cohorts:
            lost_followup_patients += 1

    return {

        "total_patients": total_patients,

        "high_risk_patients": high_risk_patients,

        "moderate_risk_patients": (
            moderate_risk_patients
        ),

        "low_risk_patients": low_risk_patients,

        "pending_procedures": pending_procedures,

        "conversion_risk_patients": (
            conversion_risk_patients
        ),

        "lost_followup_patients": (
            lost_followup_patients
        )
    }