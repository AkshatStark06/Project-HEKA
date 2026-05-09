from datetime import datetime
from typing import Dict, Any, List

from services.progression_engine import analyze_progression
from services.risk_engine import analyze_risk
from services.cohort_engine import build_cohorts
from services.variance_engine import analyze_variance
from services.conversion_engine import analyze_conversion
from services.llm_layer import generate_llm_insights


class PatientProcessor:

    def process_patient(self, patient: Dict[str, Any]) -> Dict[str, Any]:
        """
        Convert raw patient JSON into normalized patient state.
        """

        visit_history = patient.get("visit_history", [])
        call_history = patient.get("call_history", [])
        advised_actions = patient.get("advised_actions", [])

        sorted_visits = self.sort_visits(visit_history)

        latest_visit = (
            sorted_visits[-1]
            if sorted_visits
            else {}
        )

        timeline = self.build_timeline(
            sorted_visits,
            call_history,
            advised_actions
        )

        normalized_patient = {

            "patient_id": patient.get("patient_id"),

            "current_status": {
            "latest_diagnosis": latest_visit.get("diagnosis_text"),
            "latest_bp": latest_visit.get("vitals", {}).get("bp"),
            "latest_hba1c": latest_visit.get("labs", {}).get("hba1c"),
            "latest_ldl": latest_visit.get("labs", {}).get("ldl"),
            },

            "demographics": {
                "name": patient.get("name"),
                "age": patient.get("age"),
                "gender": patient.get("gender"),
                "uhid": patient.get("uhid"),
            },

            "workflow": {
                "workflow_type": patient.get("workflow_type"),
                "workflow_status": patient.get("workflow_status"),
                "agent_worked_status": patient.get("agent_worked_status"),
            },

            "history": patient.get("history", {}),

            "latest_visit": latest_visit,

            "visit_count": len(sorted_visits),

            "timeline": timeline,

            "pending_actions": advised_actions,

            "call_history": call_history,

            "traceability": {
                "source_index": patient.get("_source_index")
            }
        }

        progression_analysis = analyze_progression(
            normalized_patient
        )

        risk_analysis = analyze_risk(
            normalized_patient,
            progression_analysis
        )

        cohort_analysis = build_cohorts(
            normalized_patient,
            progression_analysis,
            risk_analysis
        )

        variance_analysis = analyze_variance(
            normalized_patient,
            progression_analysis,
            risk_analysis,
            cohort_analysis
        )

        conversion_analysis = analyze_conversion(
            normalized_patient,
            progression_analysis,
            risk_analysis,
            cohort_analysis,
            variance_analysis
        )

        llm_insights = generate_llm_insights(
            normalized_patient,
            progression_analysis,
            risk_analysis,
            cohort_analysis,
            variance_analysis,
            conversion_analysis
        )

        normalized_patient["progression_analysis"] = (
            progression_analysis
        )

        normalized_patient["risk_analysis"] = (
            risk_analysis
        )

        normalized_patient["cohort_analysis"] = (
            cohort_analysis
        )

        normalized_patient["variance_analysis"] = (
            variance_analysis
        )

        normalized_patient["conversion_analysis"] = (
            conversion_analysis
        )

        normalized_patient["llm_insights"] = (
            llm_insights
        )

        return normalized_patient

    def sort_visits(
        self,
        visits: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Sort visits chronologically.
        """

        return sorted(
            visits,
            key=lambda x: datetime.strptime(
                x["visit_date"],
                "%Y-%m-%d"
            )
        )

    def build_timeline(
        self,
        visits: List[Dict[str, Any]],
        calls: List[Dict[str, Any]],
        actions: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Build unified patient timeline.
        """

        timeline = []

        # Visit events
        for visit in visits:

            timeline.append({
                "event_type": "visit",
                "date": visit.get("visit_date"),
                "details": visit
            })

        # Call events
        for call in calls:

            timeline.append({
                "event_type": "call",
                "date": call.get("call_date"),
                "details": call
            })

        # Action events
        for action in actions:

            timeline.append({
                "event_type": "action",
                "date": action.get("due_date"),
                "details": action
            })

        # Sort complete timeline
        timeline = sorted(
            timeline,
            key=lambda x: x["date"]
        )

        return timeline