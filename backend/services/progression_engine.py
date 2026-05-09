from datetime import datetime
from services.traceability_engine import (
    build_evidence,
    build_finding
)


def extract_hba1c_trend(patient):

    timeline = patient.get("timeline", [])

    hba1c_values = []

    for item in timeline:

        if item.get("event_type") == "visit":

            details = item.get("details", {})

            labs = details.get("labs", {})

            hba1c = labs.get("hba1c")

            if hba1c is not None:

                hba1c_values.append({
                    "date": item.get("date"),
                    "value": hba1c
                })

    return hba1c_values

def extract_bp_trend(patient):

    timeline = patient.get("timeline", [])

    bp_values = []

    for item in timeline:

        if item.get("event_type") == "visit":

            details = item.get("details", {})

            vitals = details.get("vitals", {})

            bp = vitals.get("bp")

            if bp:

                systolic = int(bp.split("/")[0])

                diastolic = int(bp.split("/")[1])

                bp_values.append({
                    "date": item.get("date"),
                    "systolic": systolic,
                    "diastolic": diastolic
                })

    return bp_values

def detect_unresolved_conditions(patient):

    flags = []

    current_status = patient.get("current_status", {})

    latest_hba1c = current_status.get("latest_hba1c")

    latest_bp = current_status.get("latest_bp")

    latest_diagnosis = current_status.get(
        "latest_diagnosis", ""
    ).lower()

    # Uncontrolled diabetes
    if latest_hba1c and latest_hba1c >= 7:

        flags.append(
            build_finding(
                finding="Diabetes remains uncontrolled",

                finding_type="uncontrolled_diabetes",

                severity="moderate",

                evidence=[
                    build_evidence(
                        source_type="lab",

                        field="hba1c",

                        value=latest_hba1c,

                        visit_date=patient.get(
                            "latest_visit", {}
                        ).get("visit_date"),

                        reference_path="latest_visit.labs.hba1c"
                    )
                ]
            )
        )

    # Persistent hypertension
    if latest_bp:

        systolic = int(latest_bp.split("/")[0])

        diastolic = int(latest_bp.split("/")[1])

        if systolic >= 140 or diastolic >= 90:

            flags.append(
                build_finding(
                    finding="Blood pressure remains elevated",

                    finding_type="persistent_hypertension",

                    severity="moderate",

                    evidence=[
                        build_evidence(
                            source_type="vitals",

                            field="bp",

                            value=latest_bp,

                            visit_date=patient.get(
                                "latest_visit", {}
                            ).get("visit_date"),

                            reference_path="latest_visit.vitals.bp"
                        )
                    ]
                )
            )

    # Persistent angina / cardiac issue
    if "angina" in latest_diagnosis:

        flags.append(
            build_finding(
                finding="Cardiac condition remains active",

                finding_type="ongoing_cardiac_condition",

                severity="high",

                evidence=[
                    build_evidence(
                        source_type="diagnosis",

                        field="latest_diagnosis",

                        value=current_status.get(
                            "latest_diagnosis"
                        ),

                        visit_date=patient.get(
                            "latest_visit", {}
                        ).get("visit_date"),

                        reference_path="current_status.latest_diagnosis"
                    )
                ]
            )
        )

    return flags

from datetime import datetime


def detect_care_gaps(patient):

    gaps = []

    timeline = patient.get("timeline", [])

    visit_dates = []

    for item in timeline:

        if item.get("event_type") == "visit":

            date_str = item.get("date")

            if date_str:

                visit_dates.append(
                    datetime.strptime(date_str, "%Y-%m-%d")
                )

    visit_dates.sort()

    for i in range(1, len(visit_dates)):

        previous_visit = visit_dates[i - 1]

        current_visit = visit_dates[i]

        days_gap = (current_visit - previous_visit).days

        if days_gap > 60:

            gaps.append({

                "gap_type": "followup_delay",

                "finding": "Long gap between follow-up visits",

                "evidence": [
                    f"{days_gap} days between visits"
                ],

                "traceability": {
                    "previous_visit": previous_visit.strftime("%Y-%m-%d"),
                    "current_visit": current_visit.strftime("%Y-%m-%d")
                }
            })

    return gaps

def build_progression_summary(
    detected_trends,
    clinical_flags,
    care_gaps,
    procedure_delays
):

    summary = []

    added_findings = set()

    # Trend summaries
    for trend in detected_trends:

        finding = trend.get("finding")

        if finding not in added_findings:

            summary.append(finding)

            added_findings.add(finding)

    # Clinical condition summaries
    for flag in clinical_flags:

        finding = flag.get("finding")

        if finding not in added_findings:

            summary.append(finding)

            added_findings.add(finding)

    # Care gap summaries
    for gap in care_gaps:

        finding = gap.get("finding")

        if finding not in added_findings:

            summary.append(finding)

            added_findings.add(finding)

    # Procedure delay summaries
    for delay in procedure_delays:

        finding = delay.get("finding")

        if finding not in added_findings:

            summary.append(finding)

            added_findings.add(finding)

    return summary

def detect_procedure_delays(patient):

    delays = []

    pending_actions = patient.get("pending_actions", [])

    call_history = patient.get("call_history", [])

    for action in pending_actions:

        action_type = action.get("action_type", "")

        if action_type == "procedure":

            finding = {
                "delay_type": "pending_procedure",

                "finding": f"{action.get('title')} still pending",

                "evidence": [],

                "traceability": {
                    "due_date": action.get("due_date")
                }
            }

            for call in call_history:

                summary = call.get("transcript_summary", "").lower()

                if "cost" in summary:

                    finding["evidence"].append(
                        "Financial concern mentioned"
                    )

                if "insurance" in summary:

                    finding["evidence"].append(
                        "Insurance concern mentioned"
                    )

                if "not interested" in summary:

                    finding["evidence"].append(
                        "Patient declined procedure locally"
                    )

                if "hometown" in summary:

                    finding["evidence"].append(
                        "Patient prefers hometown hospital"
                    )

            delays.append(finding)

    return delays


def analyze_progression(patient):
    # print(patient)

    hba1c_trend = extract_hba1c_trend(patient)
    bp_trend = extract_bp_trend(patient)
    

    detected_trends = []

    if len(hba1c_trend) >= 2:

        first = hba1c_trend[0]["value"]

        last = hba1c_trend[-1]["value"]

        if last > first:

            trend = {
                "type": "hba1c_worsening",

                "finding": "HbA1c increasing over time",

                "evidence": [
                    f"{first} -> {last}"
                ],

                "traceability": {
                    "dates": [
                        hba1c_trend[0]["date"],
                        hba1c_trend[-1]["date"]
                    ]
                }
            }

            detected_trends.append(trend)

        elif last < first:

            trend = {
                "type": "hba1c_improving",

                "finding": "HbA1c improving over time",

                "evidence": [
                    f"{first} -> {last}"
                ],

                "traceability": {
                    "dates": [
                        hba1c_trend[0]["date"],
                        hba1c_trend[-1]["date"]
                    ]
                }
            }

            detected_trends.append(trend)

    if len(bp_trend) >= 2:

        first_sys = bp_trend[0]["systolic"]
        last_sys = bp_trend[-1]["systolic"]

        first_dia = bp_trend[0]["diastolic"]
        last_dia = bp_trend[-1]["diastolic"]

        if last_sys < first_sys and last_dia < first_dia:

            trend = {
                "type": "bp_improving",

                "finding": "Blood pressure improving over time",

                "evidence": [
                    f"{first_sys}/{first_dia} -> {last_sys}/{last_dia}"
                ],

                "traceability": {
                    "dates": [
                        bp_trend[0]["date"],
                        bp_trend[-1]["date"]
                    ]
                }
            }

            detected_trends.append(trend)

        elif last_sys > first_sys and last_dia > first_dia:

            trend = {
                "type": "bp_worsening",

                "finding": "Blood pressure worsening over time",

                "evidence": [
                    f"{first_sys}/{first_dia} -> {last_sys}/{last_dia}"
                ],

                "traceability": {
                    "dates": [
                        bp_trend[0]["date"],
                        bp_trend[-1]["date"]
                    ]
                }
            }

            detected_trends.append(trend)

    procedure_delays = detect_procedure_delays(patient)
    clinical_flags = detect_unresolved_conditions(patient)
    care_gaps = detect_care_gaps(patient)
    progression_summary = build_progression_summary(
        detected_trends,
        clinical_flags,
        care_gaps,
        procedure_delays
    )

    return {

        "patient_id": patient["patient_id"],

        "progression_summary": progression_summary,

        "detected_trends": detected_trends,

        "clinical_flags": clinical_flags,

        "care_gaps": care_gaps,

        "procedure_delays": procedure_delays,

        "supporting_evidence": [],

    }