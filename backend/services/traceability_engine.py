from typing import Dict, List, Optional, Any


def build_evidence(
    source_type: str,
    field: str,
    value: Any,
    source_id: Optional[str] = None,
    visit_date: Optional[str] = None,
    reference_path: Optional[str] = None
) -> Dict:

    evidence = {
        "source_type": source_type,
        "field": field,
        "value": value
    }

    if source_id:
        evidence["source_id"] = source_id

    if visit_date:
        evidence["visit_date"] = visit_date

    if reference_path:
        evidence["reference_path"] = reference_path

    return evidence


def build_finding(
    finding: str,
    evidence: List[Dict],
    finding_type: Optional[str] = None,
    severity: Optional[str] = None
) -> Dict:

    result = {
        "finding": finding,
        "evidence": evidence
    }

    if finding_type:
        result["finding_type"] = finding_type

    if severity:
        result["severity"] = severity

    return result