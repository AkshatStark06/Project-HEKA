from fastapi import APIRouter

from services.data_loader import DataLoader
from services.patient_processor import PatientProcessor

router = APIRouter()

loader = DataLoader("data/patients.json")

processor = PatientProcessor()


@router.get("/high-risk-patients")
def get_high_risk_patients():

    patients = loader.load_json()

    high_risk_patients = []

    for patient in patients:

        processed_patient = (
            processor.process_patient(patient)
        )

        risk_level = (
            processed_patient
            .get("risk_analysis", {})
            .get("risk_level")
        )

        if risk_level == "high":

            high_risk_patients.append({

                "patient_id": processed_patient.get(
                    "patient_id"
                ),

                "name": processed_patient
                    .get("demographics", {})
                    .get("name"),

                "risk_score": processed_patient
                    .get("risk_analysis", {})
                    .get("risk_score"),

                "risk_factors": processed_patient
                    .get("risk_analysis", {})
                    .get("risk_factors", []),

                "priority_recommendation": processed_patient
                    .get("risk_analysis", {})
                    .get("priority_recommendation")
            })

    return high_risk_patients