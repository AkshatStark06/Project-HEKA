from fastapi import APIRouter
from services.data_loader import DataLoader
from services.patient_processor import PatientProcessor

router = APIRouter()

loader = DataLoader("data/patients.json")
processor = PatientProcessor()

@router.get("/patients")
def get_patients():

    patients = loader.load_json()

    response = []

    for patient in patients:

        processed_patient = processor.process_patient(patient)

        response.append({
            "patient_id": processed_patient.get("patient_id"),
            "name": processed_patient
                .get("demographics", {})
                .get("name"),

            "age": processed_patient
                .get("demographics", {})
                .get("age"),

            "gender": processed_patient
                .get("demographics", {})
                .get("gender"),

            "risk_level": processed_patient
                .get("risk_analysis", {})
                .get("risk_level"),

            "risk_score": processed_patient
                .get("risk_analysis", {})
                .get("risk_score"),

            "priority_level": processed_patient
                .get("risk_analysis", {})
                .get("priority_level"),

            "cohorts": processed_patient
                .get("cohort_analysis", {})
                .get("cohorts", []),

            "conversion_status": processed_patient
                .get("conversion_analysis", {})
                .get("conversion_status"),

            "department": processed_patient
                .get("current_referral", {})
                .get("department"),

            "procedure_type": processed_patient
                .get("current_referral", {})
                .get("procedure_type"),

            "last_visit_date": processed_patient
                .get("latest_visit", {})
                .get("visit_date")
        })

    return response

@router.get("/patient/{patient_id}")
def get_patient(patient_id: str):

    patients = loader.load_json()

    for patient in patients:

        if patient.get("patient_id") == patient_id:

            processed_patient = processor.process_patient(patient)

            return processed_patient

    return {
        "error": "Patient not found"
    }