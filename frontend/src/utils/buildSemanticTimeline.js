export function buildSemanticTimeline(patient, progressionData, riskData) {
  const events = [];

  const visits =
    patient?.timeline ||
    patient?.visits ||
    patient?.encounters ||
    [];

  const latestVisit = visits[visits.length - 1];

  // ─────────────────────────────────────────────────────────────────────────
  // Patient-level data — pulled OUTSIDE the loop (same for all visits)
  // ─────────────────────────────────────────────────────────────────────────
  const riskLevel =
    patient?.risk_analysis?.risk_level?.toLowerCase() || "";
  const riskFactors =
    patient?.risk_analysis?.risk_factors || [];
  const progressionFlags =
    patient?.progression_analysis?.clinical_flags || [];

  // ─────────────────────────────────────────────────────────────────────────
  // VISIT EVENTS — use visit-specific data for unique titles/descriptions
  // ─────────────────────────────────────────────────────────────────────────
  visits.forEach((visit, index) => {
    const isLatest = index === visits.length - 1;
    const visitNumber = index + 1;
    const totalVisits = visits.length;

    // ── Extract visit-specific fields ──────────────────────────────────────
    const dept =
      visit.department || visit.dept || visit.specialty || "";
    const diagnosis =
      visit.diagnosis ||
      visit.primary_diagnosis ||
      visit.condition ||
      visit.icd_description ||
      "";
    const doctor =
      visit.doctor ||
      visit.physician ||
      visit.provider ||
      visit.attending ||
      "";
    const visitType =
      visit.visit_type ||
      visit.type ||
      visit.encounter_type ||
      "";
    const notes =
      visit.notes ||
      visit.summary ||
      visit.chief_complaint ||
      visit.reason ||
      "";
    const bp =
      visit.bp_systolic ||
      visit.systolic_bp ||
      visit.blood_pressure?.systolic ||
      null;
    const hba1c =
      visit.hba1c || visit.a1c || null;

    // Build a searchable text from ALL visit-specific fields
    const visitText = [diagnosis, notes, dept, visitType]
      .join(" ")
      .toLowerCase();

    // Enrich description with whatever visit data exists
    const detailParts = [];
    if (dept)      detailParts.push(`Dept: ${dept}`);
    if (doctor)    detailParts.push(`Provider: ${doctor}`);
    if (diagnosis) detailParts.push(`Diagnosis: ${diagnosis}`);
    if (visitType) detailParts.push(`Type: ${visitType}`);
    if (bp)        detailParts.push(`BP: ${bp} mmHg`);
    if (hba1c)     detailParts.push(`HbA1c: ${hba1c}`);

    const visitContext =
      detailParts.length > 0
        ? detailParts.join("  ·  ")
        : `Visit ${visitNumber} of ${totalVisits}`;

    let title = "";
    let description = "";
    let severity = "stable";

    // ── Classify using VISIT-specific text first ───────────────────────────

    const matchesTerm = (term) =>
      visitText.includes(term) ||
      riskFactors.some((f) => f.toLowerCase().includes(term));

    // CARDIOVASCULAR
    if (matchesTerm("card") || matchesTerm("coronary") || matchesTerm("heart")) {
      title = isLatest
        ? "Cardiovascular risk review completed"
        : `Cardiology assessment — visit ${visitNumber}`;
      description = bp
        ? `Cardiovascular indicators reviewed. BP: ${bp} mmHg. ${visitContext}`
        : `Cardiovascular risk indicators reviewed. ${visitContext}`;
      severity = riskLevel === "high" ? "high" : "moderate";
    }

    // HYPERTENSION
    else if (matchesTerm("hypertension") || matchesTerm("blood pressure") || matchesTerm("bp")) {
      title = isLatest
        ? "Hypertension monitoring review completed"
        : `Blood pressure follow-up — visit ${visitNumber}`;
      description = bp
        ? `BP documented at ${bp} mmHg systolic. ${visitContext}`
        : `Blood pressure trend reviewed. ${visitContext}`;
      severity = bp >= 160 ? "high" : bp >= 140 ? "moderate" : "stable";
    }

    // DIABETES
    else if (matchesTerm("diabet") || matchesTerm("glucose") || matchesTerm("hba1c") || matchesTerm("a1c")) {
      title = isLatest
        ? "Diabetes progression review completed"
        : `Diabetes management follow-up — visit ${visitNumber}`;
      description = hba1c
        ? `Glycemic control reviewed. HbA1c: ${hba1c}. ${visitContext}`
        : `Longitudinal glycemic trajectory assessed. ${visitContext}`;
      severity = "moderate";
    }

    // RENAL / KIDNEY
    else if (matchesTerm("renal") || matchesTerm("kidney") || matchesTerm("ckd") || matchesTerm("creatinine")) {
      title = isLatest
        ? "Renal function review completed"
        : `Nephrology follow-up — visit ${visitNumber}`;
      description = `Renal function and progression risk reviewed. ${visitContext}`;
      severity = riskLevel === "high" ? "high" : "moderate";
    }

    // RESPIRATORY
    else if (matchesTerm("copd") || matchesTerm("asthma") || matchesTerm("respiratory") || matchesTerm("lung")) {
      title = isLatest
        ? "Respiratory health assessment completed"
        : `Pulmonary follow-up — visit ${visitNumber}`;
      description = `Respiratory function and management reviewed. ${visitContext}`;
      severity = "moderate";
    }

    // CARE GAP (from progression flags)
    else if (progressionFlags.some((f) => f.toLowerCase().includes("follow"))) {
      title = isLatest
        ? "Care continuity review completed"
        : `Care gap follow-up — visit ${visitNumber}`;
      description = `Follow-up adherence and continuity assessed. ${visitContext}`;
      severity = "moderate";
    }

    // FALLBACK — unique by visit using any available context
    else {
      if (isLatest) {
        title = "Most recent clinical review completed";
        description = `Latest trajectory and risk profile assessed. ${visitContext}`;
        severity = riskLevel === "high" ? "moderate" : "stable";
      } else {
        // Build a meaningful fallback from whatever visit data exists
        const baseLabel = dept
          ? `${dept} encounter`
          : diagnosis
          ? `${diagnosis} follow-up`
          : `Clinical encounter`;

        title = `${baseLabel} — visit ${visitNumber}`;
        description = bp
          ? `Routine longitudinal assessment. ${visitContext}`
          : `Follow-up documented. ${visitContext}`;
        severity = "stable";
      }
    }

    events.push({
      id: `visit-${index}`,
      date: visit.date || visit.timestamp || new Date().toISOString(),
      title,
      description,
      sourceType: visitType || "Visit Note",
      severity,
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // FOLLOW-UP GAP EVENTS
  // ─────────────────────────────────────────────────────────────────────────
  const overdueDays =
    progressionData?.followup_gap_days || riskData?.followup_gap_days;

  if (overdueDays && overdueDays > 30) {
    events.push({
      id: "followup-gap",
      date: new Date().toISOString(),
      title: `Follow-up overdue by ${overdueDays} days`,
      description: "Recommended clinical review interval exceeded. Immediate outreach advised.",
      sourceType: "Coordinator Workflow",
      severity: overdueDays > 60 ? "high" : "moderate",
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BP TREND EVENTS (from most recent visit only)
  // ─────────────────────────────────────────────────────────────────────────
  if (latestVisit) {
    const systolic =
      latestVisit?.bp_systolic ||
      latestVisit?.systolic_bp ||
      latestVisit?.blood_pressure?.systolic;

    if (systolic >= 160) {
      events.push({
        id: "bp-high",
        date: latestVisit.date,
        title: "Persistent uncontrolled blood pressure trend detected",
        description: `Latest documented BP reading: ${systolic} mmHg systolic. Urgent clinical review recommended.`,
        sourceType: "Lab Result",
        severity: "high",
      });
    } else if (systolic >= 140) {
      events.push({
        id: "bp-moderate",
        date: latestVisit.date,
        title: "Elevated blood pressure trend observed",
        description: `Latest documented BP reading: ${systolic} mmHg systolic. Continued monitoring advised.`,
        sourceType: "Lab Result",
        severity: "moderate",
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RISK PROGRESSION EVENTS
  // ─────────────────────────────────────────────────────────────────────────
  if (progressionData?.progression_status === "worsening") {
    events.push({
      id: "risk-progression",
      date: new Date().toISOString(),
      title: "Progressive clinical risk trajectory identified",
      description:
        "Longitudinal review indicates worsening risk profile over time. Escalation review recommended.",
      sourceType: "Risk Assessment",
      severity: "high",
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CARE COORDINATION EVENTS
  // ─────────────────────────────────────────────────────────────────────────
  if (riskData?.needs_escalation) {
    events.push({
      id: "care-escalation",
      date: new Date().toISOString(),
      title: "Care coordination escalation initiated",
      description:
        "Operational review recommended due to elevated longitudinal risk.",
      sourceType: "Coordinator Workflow",
      severity: "moderate",
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SORT BY DATE DESC
  // ─────────────────────────────────────────────────────────────────────────
  return events.sort((a, b) => new Date(b.date) - new Date(a.date));
}