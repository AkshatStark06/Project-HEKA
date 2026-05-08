from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.data_loader import DataLoader
from services.patient_processor import PatientProcessor
from services.progression_engine import analyze_progression
from services.risk_engine import analyze_risk

app = FastAPI(
    title="HEKA Backend",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "HEKA Backend Running"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
@app.get("/load-data")
def load_data():

    loader = DataLoader("data/patients.json")

    data = loader.load_json()

    return {
        "total_records": len(data),
        "sample_record": data[0] if data else {}
    }
@app.get("/process-patient")
def process_patient():

    loader = DataLoader("data/patients.json")

    raw_data = loader.load_json()

    processor = PatientProcessor()

    processed_patient = processor.process_patient(
        raw_data[0]
    )

    return processed_patient
@app.get("/analyze-progression")
def progression_test():

    loader = DataLoader("data/patients.json")

    patients = loader.load_json()

    first_patient = patients[0]

    processor = PatientProcessor()

    processed_patient = processor.process_patient(first_patient)

    progression = analyze_progression(processed_patient)

    risk = analyze_risk(
        processed_patient,
        progression
    )

    return {
        "patient": processed_patient,
        "progression": progression,
        "risk": risk
    }