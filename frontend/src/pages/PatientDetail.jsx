import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SectionCard from "../components/dashboard/SectionCard";
import EvidenceCard from "../components/dashboard/EvidenceCard";
import TimelineContainer from "../components/timeline/TimelineContainer";
import EscalationBanner from "../components/dashboard/EscalationBanner";
import PatientRiskTrendChart from "../components/timeline/PatientRiskTrendChart";
import PatientIntelligenceRail from "../components/patients/PatientIntelligenceRail";

import { getProgressionStatus } from "../utils/getProgressionStatus";
import { buildPatientEvidence } from "../utils/aiEvidenceBuilder";

import { buildSemanticTimeline } from "../utils/buildSemanticTimeline";


import hekaApi from "../api/hekaApi";
import {
  generatePatientInsights,
  generateProgressionAnalysis,
  clearInsightsCache,
  clearProgressionCache,
} from "../services/llmService";

import {
  varianceLabelMap,
  conversionBarrierMap,
} from "../utils/clinicalLabels";

function PatientDetail() {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);

  // ── AI Clinical Insights state ──────────────────────────────────────────────
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingAIInsights, setLoadingAIInsights] = useState(false);
  const [aiInsightsError, setAiInsightsError] = useState(false);

  // ── AI Progression Intelligence state ──────────────────────────────────────
  const [aiProgression, setAiProgression] = useState(null);
  const [loadingAIProgression, setLoadingAIProgression] = useState(false);
  const [aiProgressionError, setAiProgressionError] = useState(false);

  // ── Fetch patient data ──────────────────────────────────────────────────────

  const fetchPatient = async () => {
    try {
      const response = await hekaApi.get(`/patient/${id}`);
      setPatient(response.data);
    } catch (error) {
      console.error("Patient Detail API Error:", error);
    }
  };

  useEffect(() => {
    fetchPatient();
    // Reset all AI state when navigating between patients
    setAiInsights(null);
    setAiInsightsError(false);
    setAiProgression(null);
    setAiProgressionError(false);
  }, [id]);

  // ── Handler: Clinical + Escalation Insights ─────────────────────────────────

  async function handleGenerateInsights() {
    if (!patient || loadingAIInsights) return;

    if (aiInsights?._rate_limited) {
      clearInsightsCache(patient.patient_id);
    }

    try {
      setLoadingAIInsights(true);
      setAiInsightsError(false);
      const insights = await generatePatientInsights(patient);
      setAiInsights(insights);
    } catch (error) {
      console.error("AI Insight Error:", error);
      setAiInsightsError(true);
    } finally {
      setLoadingAIInsights(false);
    }
  }

  // ── Handler: Progression Intelligence ──────────────────────────────────────

  async function handleGenerateProgression() {
    if (!patient || loadingAIProgression) return;

    if (aiProgression?._rate_limited) {
      clearProgressionCache(patient.patient_id);
    }

    try {
      setLoadingAIProgression(true);
      setAiProgressionError(false);
      const progression = await generateProgressionAnalysis(patient);
      setAiProgression(progression);
    } catch (error) {
      console.error("AI Progression Error:", error);
      setAiProgressionError(true);
    } finally {
      setLoadingAIProgression(false);
    }
  }

  // ── Derived flags ───────────────────────────────────────────────────────────

  const progressionStatus = getProgressionStatus(patient);
  const supportingEvidence = buildPatientEvidence(patient);

  const semanticTimeline = buildSemanticTimeline(
    patient,
    patient?.progression_analysis,
    patient?.risk_analysis
  );
  
  const hasConversionBarriers =
    patient?.conversion_analysis?.conversion_barriers?.length > 0;
  const hasProcedureDelays =
    patient?.progression_analysis?.procedure_delays?.length > 0;
  const hasCareGaps =
    patient?.progression_analysis?.care_gaps?.length > 0;

  // ── Loading screen ──────────────────────────────────────────────────────────

  if (!patient) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold">Loading Patient Intelligence</h1>
          <p className="text-slate-400">
            Initializing explainable clinical workspace...
          </p>
        </div>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* HEADER */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

          {/* LEFT MAIN HEADER */}

          <div className="xl:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl shadow-black/20 px-8 pt-8 pb-5">

            <div className="space-y-5">

              {/* Patient Identity */}

              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                  Explainable Patient Intelligence
                </p>

                <h1 className="text-4xl xl:text-5xl font-bold tracking-tight mt-2">
                  {patient.demographics?.name}
                </h1>
              </div>

              {/* Patient Meta */}

              <div className="flex flex-wrap items-center gap-4 text-slate-300">

                <div className="rounded-xl bg-slate-800 px-4 py-2 border border-slate-700">
                  Patient ID:
                  <span className="ml-2 text-white font-semibold">
                    {patient.patient_id}
                  </span>
                </div>

                <div className="rounded-xl bg-slate-800 px-4 py-2 border border-slate-700">
                  {patient.demographics?.age} years
                </div>

                <div className="rounded-xl bg-slate-800 px-4 py-2 border border-slate-700">
                  {patient.demographics?.gender}
                </div>

              </div>

              {/* Progression Status */}

              <div
                className={`
                  rounded-2xl border px-6 py-5
                  ${progressionStatus.color}
                `}
              >
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] opacity-70">
                      Clinical Progression Status
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                      {progressionStatus.label}
                    </h2>
                  </div>

                  <div className="text-right text-sm opacity-80">
                    Longitudinal clinical trajectory
                  </div>

                </div>
              </div>
              <PatientIntelligenceRail patient={patient} />

              {/* Intelligence Status */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Intelligence Status
                  </p>

                  <h3 className="text-lg font-semibold text-white mt-3 leading-snug">
                    Active Longitudinal Clinical Monitoring
                  </h3>
                </div>

                <div
                  className={`
                    inline-flex items-center rounded-full
                    px-4 py-2 text-sm font-semibold border
                    ${
                      patient.risk_analysis?.risk_level === "high"
                        ? "border-red-500/30 bg-red-500/10 text-red-300"
                        : patient.risk_analysis?.risk_level === "moderate"
                        ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                        : "border-green-500/30 bg-green-500/10 text-green-300"
                    }
                  `}
                >
                  {patient.risk_analysis?.risk_level} Risk
                </div>

              </div>

            </div>
                
            </div>

          </div>

          {/* RIGHT INTELLIGENCE PANEL */}

          <div className="space-y-4">

            {/* ── OPERATIONAL ESCALATIONS ─────────────────────────────────── */}

            <SectionCard title="Operational Escalations">
              <div className="space-y-4">

                {hasConversionBarriers && (
                  <EscalationBanner
                    title="Care Continuity Risk"
                    description="Operational intelligence detected barriers affecting procedure conversion."
                    type="warning"
                  />
                )}
                {hasCareGaps && (
                  <EscalationBanner
                    title="Care Gap Escalation"
                    description="Clinical workflow gaps detected requiring follow-up attention."
                    type="danger"
                  />
                )}
                {hasProcedureDelays && (
                  <EscalationBanner
                    title="Delayed Procedural Care"
                    description="Delayed progression detected in procedural care pathway."
                    type="warning"
                  />
                )}

                {/* AI Escalation Reasoning */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <h3 className="text-red-200 font-semibold mb-2">
                    Clinical Escalation Assessment
                  </h3>
                  {loadingAIInsights ? (
                    <p className="text-slate-400 text-sm leading-relaxed animate-pulse">
                      Generating escalation intelligence...
                    </p>
                  ) : aiInsights ? (
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {aiInsights.escalation_reasoning}
                    </p>
                  ) : (
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Use Generate AI Insights to load escalation reasoning.
                    </p>
                  )}
                </div>

              </div>
            </SectionCard>

            

            

          </div>

        </div>       

        {/* LLM INSIGHTS GRID */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* LEFT — AI SUMMARIES + CLINICAL DATA */}

          <div className="xl:col-span-2 space-y-6">

            {/* ── AI CLINICAL SUMMARY ─────────────────────────────────────── */}

            <SectionCard title="AI Clinical Summary">
              <div className="space-y-4">

                {/* Idle */}
                {!aiInsights && !loadingAIInsights && !aiInsightsError && (
                  <button
                    onClick={handleGenerateInsights}
                    className="w-full rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-3 text-sm font-semibold text-blue-300 hover:bg-blue-500/20 transition-colors cursor-pointer"
                  >
                    ✦ Generate AI Insights
                  </button>
                )}

                {/* Error */}
                {aiInsightsError && !loadingAIInsights && (
                  <button
                    onClick={handleGenerateInsights}
                    className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/20 transition-colors cursor-pointer"
                  >
                    ↺ Error loading insights — Click to retry
                  </button>
                )}

                {/* Rate limited */}
                {aiInsights?._rate_limited && !loadingAIInsights && (
                  <button
                    onClick={handleGenerateInsights}
                    className="w-full rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-3 text-sm font-semibold text-yellow-300 hover:bg-yellow-500/20 transition-colors cursor-pointer"
                  >
                    ↺ Rate limit reached — Wait ~1 min then retry
                  </button>
                )}

                {/* Regenerate */}
                {aiInsights && !aiInsights._rate_limited && !loadingAIInsights && (
                  <button
                    onClick={handleGenerateInsights}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-5 py-2 text-xs font-medium text-slate-400 hover:bg-slate-700/50 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    ↺ Regenerate AI Insights
                  </button>
                )}

                {/* Doctor Summary */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
                  <h3 className="font-semibold text-white mb-2">Doctor Summary</h3>
                  {loadingAIInsights ? (
                    <p className="text-slate-400 leading-relaxed animate-pulse">
                      Generating AI clinical insight...
                    </p>
                  ) : aiInsights ? (
                    <div className="space-y-4">
                      <p className="text-slate-300 leading-relaxed">
                        {aiInsights.clinical_summary}
                      </p>

                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-widest text-blue-300">
                          Supporting Evidence
                        </p>

                        {supportingEvidence.map((item, index) => (
                          <div
                            key={index}
                            className="text-sm text-slate-400 bg-slate-900/40 rounded-lg px-3 py-2 border border-slate-700"
                          >
                            • {item}
                          </div>
                        ))}
                      </div>
                    </div>                  
                  ) : (
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Click Generate AI Insights above to load.
                    </p>
                  )}
                </div>

                {/* Coordinator Summary */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5">
                  <h3 className="font-semibold text-white mb-2">Coordinator Summary</h3>
                  {loadingAIInsights ? (
                    <p className="text-slate-400 leading-relaxed animate-pulse">
                      Generating coordinator intelligence...
                    </p>
                  ) : aiInsights ? (
                    <p className="text-slate-300 leading-relaxed">
                      {aiInsights.coordinator_summary}
                    </p>
                  ) : (
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Click Generate AI Insights above to load.
                    </p>
                  )}
                </div>

              </div>
            </SectionCard>

            {/* ── RISK ANALYSIS ───────────────────────────────────────────── */}

            <SectionCard title="Risk Analysis">
              <div className="space-y-3">
                {patient.risk_analysis?.risk_factors?.map((factor, index) => (
                  <div
                    key={index}
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-100"
                  >
                    {factor}
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* ── PROGRESSION ANALYSIS + AI PROGRESSION INTELLIGENCE ──────── */}

            <SectionCard title="Progression Analysis">
              <div className="space-y-4">

                {/* Static JSON-driven progression findings */}
                <div className="space-y-3">
                  {patient.progression_analysis?.progression_summary?.map(
                    (finding, index) => (
                      <div
                        key={index}
                        className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-yellow-100"
                      >
                        {finding}
                      </div>
                    )
                  )}
                </div>

                {/* ── AI PROGRESSION INTELLIGENCE PANEL ─────────────────── */}

                <div className="mt-2 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5 space-y-4">

                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-violet-400 text-lg">⬡</span>
                      <h3 className="font-semibold text-violet-200 text-sm uppercase tracking-wider">
                        AI Progression Intelligence
                      </h3>
                    </div>

                    {/* Inline regenerate — only after successful load */}
                    {aiProgression && !aiProgression._rate_limited && !loadingAIProgression && (
                      <button
                        onClick={handleGenerateProgression}
                        className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                      >
                        ↺ Regenerate
                      </button>
                    )}
                  </div>

                  {/* Idle state */}
                  {!aiProgression && !loadingAIProgression && !aiProgressionError && (
                    <button
                      onClick={handleGenerateProgression}
                      className="w-full rounded-xl border border-violet-500/30 bg-violet-500/10 px-5 py-3 text-sm font-semibold text-violet-300 hover:bg-violet-500/20 transition-colors cursor-pointer"
                    >
                      ✦ Generate Longitudinal AI Analysis
                    </button>
                  )}

                  {/* Rate limited */}
                  {aiProgression?._rate_limited && !loadingAIProgression && (
                    <button
                      onClick={handleGenerateProgression}
                      className="w-full rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-3 text-sm font-semibold text-yellow-300 hover:bg-yellow-500/20 transition-colors cursor-pointer"
                    >
                      ↺ Rate limit reached — Wait ~1 min then retry
                    </button>
                  )}

                  {/* Error */}
                  {aiProgressionError && !loadingAIProgression && (
                    <button
                      onClick={handleGenerateProgression}
                      className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/20 transition-colors cursor-pointer"
                    >
                      ↺ Error — Click to retry
                    </button>
                  )}

                  {/* Deterioration Summary */}
                  <div className="rounded-xl bg-slate-800/60 border border-slate-700/50 p-4">
                    <p className="text-xs uppercase tracking-widest text-violet-400 mb-2 font-medium">
                      Deterioration Assessment
                    </p>
                    {loadingAIProgression ? (
                      <p className="text-slate-400 text-sm leading-relaxed animate-pulse">
                        Analyzing longitudinal trajectory...
                      </p>
                    ) : aiProgression ? (
                      <div className="space-y-4">
                        <p className="text-slate-200 text-sm leading-relaxed">
                          {aiProgression.deterioration_summary}
                        </p>

                        <div className="space-y-2">
                          <p className="text-xs uppercase tracking-widest text-violet-300">
                            Evidence Signals
                          </p>

                          {supportingEvidence.map((item, index) => (
                            <div
                              key={index}
                              className="text-sm text-slate-400 bg-slate-900/40 rounded-lg px-3 py-2 border border-slate-700"
                            >
                              • {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-600 text-sm">
                        Generate analysis to view.
                      </p>
                    )}
                  </div>

                  {/* Risk Trajectory */}
                  <div className="rounded-xl bg-slate-800/60 border border-slate-700/50 p-4">
                    <p className="text-xs uppercase tracking-widest text-violet-400 mb-2 font-medium">
                      Risk Trajectory Pattern
                    </p>
                    {loadingAIProgression ? (
                      <p className="text-slate-400 text-sm leading-relaxed animate-pulse">
                        Identifying repeated risk patterns...
                      </p>
                    ) : aiProgression ? (
                      <p className="text-slate-200 text-sm leading-relaxed">
                        {aiProgression.risk_trajectory}
                      </p>
                    ) : (
                      <p className="text-slate-600 text-sm">
                        Generate analysis to view.
                      </p>
                    )}
                  </div>

                  {/* Intervention Priority */}
                  <div className="rounded-xl bg-violet-900/20 border border-violet-500/30 p-4">
                    <p className="text-xs uppercase tracking-widest text-violet-300 mb-2 font-medium">
                      Intervention Priority
                    </p>
                    {loadingAIProgression ? (
                      <p className="text-slate-400 text-sm leading-relaxed animate-pulse">
                        Determining operational priority...
                      </p>
                    ) : aiProgression ? (
                      <p className="text-violet-100 text-sm leading-relaxed font-medium">
                        {aiProgression.intervention_priority}
                      </p>
                    ) : (
                      <p className="text-slate-600 text-sm">
                        Generate analysis to view.
                      </p>
                    )}
                  </div>

                </div>

              </div>
            </SectionCard>

            {/* ── CARE PATH VARIANCE ──────────────────────────────────────── */}

            <SectionCard title="Care Path Variance">
              <div className="space-y-3">
                {patient.variance_analysis?.variance_flags?.map(
                  (variance, index) => (
                    <div
                      key={index}
                      className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-purple-100"
                    >
                      {varianceLabelMap[variance] || variance}
                    </div>
                  )
                )}
              </div>
            </SectionCard>

          </div>

          {/* RIGHT — OPERATIONAL RAIL */}

          <div className="space-y-6">

            



            {/* ── CONVERSION INTELLIGENCE ─────────────────────────────────── */}

            <SectionCard title="Care Coordination Factors">
              <div className="space-y-3">
                {patient.conversion_analysis?.conversion_barriers?.map(
                  (barrier, index) => (
                    <div
                      key={index}
                      className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-orange-100"
                    >
                      {conversionBarrierMap[barrier] || barrier}
                    </div>
                  )
                )}
              </div>
            </SectionCard>

          </div>

        </div>

        {aiInsights?.suggested_next_actions?.length > 0 && (
          <SectionCard title="Suggested Next Actions">
            <div className="space-y-4">

              {aiInsights.suggested_next_actions.map(
                (action, index) => (
                  <div
                    key={index}
                    className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5"
                  >
                    <div className="flex items-start gap-4">

                      <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />

                      <div className="space-y-2">

                        <p className="text-emerald-100 font-medium leading-relaxed">
                          {action}
                        </p>

                        {/* Supporting evidence */}
                        {supportingEvidence.length > 0 && (
                          <div className="space-y-1 pt-2">

                            <p className="text-[10px] uppercase tracking-widest text-emerald-300/70">
                              Grounded Signals
                            </p>

                            {supportingEvidence.slice(0, 3).map(
                              (item, evidenceIndex) => (
                                <div
                                  key={evidenceIndex}
                                  className="text-xs text-slate-400"
                                >
                                  • {item}
                                </div>
                              )
                            )}

                          </div>
                        )}

                      </div>

                    </div>
                  </div>
                )
              )}

            </div>
          </SectionCard>
        )}

        {/* CLINICAL EXPLAINABILITY */}

        <SectionCard title="Clinical Explainability">

          <div className="space-y-10">

            {/* Clinical Flags */}

            <div>

              <h3 className="text-lg font-semibold mb-4">
                Clinical Flags
              </h3>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

                {patient.progression_analysis?.clinical_flags?.map(
                  (flag, index) => (

                    <EvidenceCard
                      key={index}
                      item={flag}
                    />

                  )
                )}

              </div>

            </div>

            {/* Care Gaps */}

            <div>

              <h3 className="text-lg font-semibold mb-4">
                Care Gaps
              </h3>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

                {patient.progression_analysis?.care_gaps?.map(
                  (gap, index) => (

                    <EvidenceCard
                      key={index}
                      item={gap}
                    />

                  )
                )}

              </div>

            </div>

            {/* Procedure Delays */}

            <div>

              <h3 className="text-lg font-semibold mb-4">
                Procedure Delays
              </h3>

              <div className="grid grid-cols-1 gap-4">

                {patient.progression_analysis?.procedure_delays?.map(
                  (delay, index) => (

                    <EvidenceCard
                      key={index}
                      item={delay}
                    />

                  )
                )}

              </div>

            </div>

          </div>

        </SectionCard>

        <PatientRiskTrendChart timeline={patient.timeline || []} />

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Timeline Intelligence</h2>
          <TimelineContainer timeline={semanticTimeline} />
        </div>

      </div>
    </div>
  );
}

export default PatientDetail;
