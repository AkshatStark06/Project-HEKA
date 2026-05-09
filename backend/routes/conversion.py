from fastapi import APIRouter

from services.data_loader import DataLoader
from services.patient_processor import PatientProcessor

router = APIRouter()

loader = DataLoader("data/patients.json")

processor = PatientProcessor()


@router.get("/conversion-risk")
def get_conversion_risk_patients():

    patients = loader.load_json()

    conversion_risk_patients = []

    for patient in patients:

        processed_patient = (
            processor.process_patient(patient)
        )

        conversion_analysis = (
            processed_patient.get(
                "conversion_analysis",
                {}
            )
        )

        conversion_status = (
            conversion_analysis.get(
                "conversion_status"
            )
        )

        conversion_risk = (
            conversion_analysis.get(
                "conversion_risk"
            )
        )

        if (
            conversion_status != "likely_to_convert"
            or
            conversion_risk == "high"
        ):

            conversion_risk_patients.append({

                "patient_id": processed_patient.get(
                    "patient_id"
                ),

                "name": processed_patient
                    .get("demographics", {})
                    .get("name"),

                "conversion_status": conversion_status,

                "conversion_risk": conversion_risk,

                "conversion_barriers": (
                    conversion_analysis.get(
                        "conversion_barriers",
                        []
                    )
                ),

                "recommended_action": (
                    conversion_analysis.get(
                        "recommended_conversion_action"
                    )
                )
            })

    return conversion_risk_patients