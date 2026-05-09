from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.data_loader import DataLoader
from services.patient_processor import PatientProcessor
from services.progression_engine import analyze_progression
from services.risk_engine import analyze_risk
from services.cohort_engine import build_cohorts
from services.variance_engine import analyze_variance
from services.conversion_engine import analyze_conversion
from services.llm_layer import generate_llm_insights

from routes.patients import router as patient_router


from services.traceability_engine import (
    build_evidence,
    build_finding
)

from routes.risk import router as risk_router

from routes.conversion import (
    router as conversion_router
)

from routes.cohorts import (
    router as cohort_router
)

from routes.dashboard import (
    router as dashboard_router
)

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

app.include_router(patient_router)
app.include_router(risk_router)
app.include_router(conversion_router)
app.include_router(cohort_router)
app.include_router(dashboard_router)


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
    cohorts = build_cohorts(
        processed_patient,
        progression,
        risk
    )
    variance = analyze_variance(
        processed_patient,
        progression,
        risk,
        cohorts
    )
    conversion = analyze_conversion(
        processed_patient,
        progression,
        risk,
        cohorts,
        variance
    )
    llm_insights = generate_llm_insights(
        processed_patient,
        progression,
        risk,
        cohorts,
        variance,
        conversion
    )
    sample_evidence = build_evidence(
        source_type="lab",
        field="hba1c",
        value=9.4,
        source_id="VISIT-001",
        visit_date="2026-04-20",
        reference_path="visits[0].labs.hba1c"
    )

    sample_finding = build_finding(
        finding="Uncontrolled diabetes",
        evidence=[sample_evidence],
        severity="high"
    )

    print(sample_finding)
    
    return {
        "patient": processed_patient,
        "progression": progression,
        "risk": risk,
        "cohorts": cohorts,
        "variance": variance,
        "conversion": conversion,
        "llm_insights": llm_insights
    }