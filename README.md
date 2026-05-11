# H.E.K.A — Healthcare Evaluation & Knowledge Assistant

> Inspired by **Heka**, the ancient Egyptian god associated with healing, medicine, magic, and the power of transformative knowledge.

H.E.K.A. is an explainable AI-powered clinical intelligence and operational analytics platform designed to assist healthcare systems in longitudinal patient monitoring, risk prioritization, conversion intelligence, care coordination analysis, and explainable clinical workflows.

---

# Overview

H.E.K.A. combines:

* Clinical intelligence
* Longitudinal progression analysis
* Explainable AI insights
* Operational risk prioritization
* Conversion intelligence
* Cohort analysis
* Timeline reasoning
* Healthcare workflow visibility

into a unified healthcare intelligence dashboard.

The platform is designed to simulate a modern healthcare operational intelligence system capable of helping hospitals and healthcare organizations:

* Identify deteriorating patients
* Detect care gaps
* Monitor longitudinal risk progression
* Analyze conversion barriers
* Prioritize intervention workflows
* Generate explainable AI-assisted summaries
* Improve operational visibility

---


# Key Features

## Explainable Patient Intelligence

Each patient profile includes:

* Longitudinal progression analysis
* Risk severity analysis
* Clinical escalation detection
* Conversion intelligence
* Care coordination insights
* Evidence-grounded reasoning
* Timeline intelligence

---

## AI Clinical Summaries

H.E.K.A. generates:

* Doctor-focused summaries
* Care coordinator summaries
* Operational escalation reasoning
* Suggested next actions
* Progression intelligence

All insights are grounded in actual patient evidence and longitudinal signals.

---

## Operational Intelligence Dashboard

The dashboard includes:

* Risk distribution analytics
* Cohort intelligence
* Conversion monitoring
* Age-based risk burden analysis
* Cohort combination intelligence
* Operational drilldowns
* Patient prioritization queues

---

## Longitudinal Timeline Intelligence

H.E.K.A. reconstructs patient journeys through:

* Semantic timeline generation
* Risk trajectory analysis
* Procedural delay detection
* Care continuity monitoring
* Clinical deterioration tracking

---

## Explainability Layer

The system prioritizes explainability through:

* Evidence cards
* Clinical traceability
* Grounded reasoning
* Explainable escalation logic
* Signal attribution

---

# Technology Stack

## Frontend

* React
* Vite
* Tailwind CSS
* Recharts
* React Router

## Backend

* FastAPI
* Python
* Uvicorn

## AI Layer

* LLM-powered intelligence generation
* Clinical reasoning orchestration
* Prompt-driven explainability
* Longitudinal progression analysis

## Deployment

* Frontend: Vercel
* Backend: Render

---

# System Architecture

```text
Frontend (React + Tailwind)
        ↓
FastAPI Backend
        ↓
Clinical Intelligence Engines
        ├── Risk Engine
        ├── Progression Engine
        ├── Cohort Engine
        ├── Variance Engine
        ├── Conversion Engine
        ├── Explainability Layer
        └── LLM Intelligence Layer
```

---

# Core Intelligence Modules

## Risk Engine

Analyzes:

* Clinical severity
* Operational burden
* Escalation likelihood
* Longitudinal deterioration

---

## Progression Engine

Tracks:

* Worsening conditions
* Care gaps
* Procedure delays
* Longitudinal changes

---

## Cohort Engine

Builds clinically meaningful operational cohorts for patient prioritization, longitudinal monitoring, and care coordination workflows.

---

## Conversion Intelligence Engine

Identifies:

* Procedure conversion risk
* Follow-up failures
* Financial barriers
* Care continuity disruption

---

## AI Intelligence Layer

Generates explainable operational and clinical intelligence using evidence-grounded LLM reasoning workflows.

---

# Clinical Intelligence Methodology

---

## Dashboard Approach

HEKA was designed as an operational clinical intelligence workspace rather than a static patient summary viewer.

The platform prioritizes:
- longitudinal patient understanding
- risk-based prioritization
- explainable escalation visibility
- operational care coordination
- clinically actionable intelligence

The workflow is optimized so clinicians and care teams can:
- identify high-risk patients quickly
- detect worsening longitudinal patterns
- understand care-path deviations
- review AI-supported summaries
- trace all intelligence back to evidence

---

## Data-to-Insight Pipeline

HEKA transforms raw OPD JSON records into explainable operational intelligence through a multi-stage pipeline:

```text
Raw Patient JSON
    ↓
Patient Processing Layer
    ↓
Clinical Intelligence Engines
    ├── Risk Engine
    ├── Progression Engine
    ├── Cohort Engine
    ├── Variance Engine
    ├── Conversion Intelligence Engine
    └── Traceability Layer
    ↓
LLM Intelligence Layer
    ↓
Explainable Dashboard UI

```

---

# UI Highlights

## Dashboard

* Enterprise healthcare intelligence styling
* Operational analytics cards
* Interactive charts
* Cohort drilldowns
* Queue prioritization

## Patient Intelligence Workspace

* Explainable patient profiles
* Operational escalation rail
* AI clinical summaries
* Timeline intelligence
* Evidence-grounded explainability

---

# Example Operational Insights

H.E.K.A. can identify:

* Patients at risk of care abandonment
* Delayed procedural pathways
* High-risk progression patterns
* Care continuity failures
* Operational escalation priorities
* Longitudinal deterioration signals

---

# Project Goals

The project aims to demonstrate:

* Explainable healthcare AI
* Clinical intelligence workflows
* Longitudinal healthcare analytics
* Human-centered AI reasoning
* Operational healthcare dashboards
* Full-stack healthcare analytics engineering

---

# Running the Project Locally

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

# API Endpoints

## Patients

```text
/patients
/patient/{patient_id}
```

## Dashboard

```text
/dashboard
```

## Cohorts

```text
/cohorts
```

## Conversion Intelligence

```text
/conversion
```

---

## Prompt Engineering Strategy

The LLM layer was designed using evidence-grounded prompting techniques.

Prompts are structured to:
- summarize longitudinal progression
- generate escalation reasoning
- suggest operational next actions
- identify deterioration trends
- avoid unsupported hallucinated claims

The AI layer receives:
- progression findings
- risk signals
- cohort classifications
- operational barriers
- evidence-grounded clinical indicators

This improves reliability and keeps outputs operationally relevant.

---

## Cohortization Logic

Patients are grouped into clinically meaningful operational cohorts using deterministic rules derived from longitudinal patterns and structured patient signals.

Example cohorts include:
- uncontrolled diabetes
- persistent hypertension
- cardiac high-risk
- conversion risk
- procedure pending
- lost follow-up
- financial barrier
- insurance barrier

Cohorts are designed to support:
- operational prioritization
- care coordination
- intervention planning
- longitudinal monitoring

---

## Care-Path Variance Logic

HEKA identifies patients deviating from expected outpatient progression pathways.

Variance detection includes:
- persistent symptoms without stabilization
- delayed procedures
- repeated visits without improvement
- unresolved chronic disease progression
- missed follow-ups
- conversion barriers
- operational care gaps

Variance intelligence is surfaced directly in both dashboard-level analytics and patient-level explainability sections.

---

## Validation & Grounding Strategy

A major project focus was explainable and grounded AI output.

To improve trustworthiness:
- all AI summaries are grounded in structured patient evidence
- longitudinal signals are explicitly surfaced
- supporting evidence is displayed alongside insights
- traceability layers connect intelligence back to:
  - labs
  - medications
  - progression signals
  - visit history
  - care gaps
  - operational events

Insights without supporting evidence are intentionally avoided.

---

## Known Limitations

Current limitations include:
- synthetic sample dataset size
- absence of real EHR integration
- limited specialty breadth
- no real-time streaming clinical data
- simplified cohort logic compared to production healthcare systems
- operational intelligence optimized for demonstration scale

The system is intended as an explainable healthcare intelligence prototype rather than a production medical platform.

---

## Future Improvements

Potential future enhancements include:
- real EHR interoperability
- predictive deterioration forecasting
- vector-memory patient history retrieval
- clinician feedback learning loops
- multi-agent healthcare orchestration
- real-time event streaming
- scalable healthcare analytics pipelines
- HIPAA-compliant deployment architecture
- adaptive cohort intelligence
- provider-specific operational workflows
 

---

# Author

Akshat Srivastava

Built as a healthcare intelligence and explainable AI engineering project focused on combining:

* Data analytics
* Clinical reasoning
* AI-assisted intelligence
* Operational healthcare workflows
* Explainable systems design

---

# License

This project is intended for educational and portfolio purposes.
