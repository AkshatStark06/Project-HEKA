import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SectionCard from "../components/dashboard/SectionCard"
import EvidenceCard from "../components/dashboard/EvidenceCard"

import TimelineContainer from "../components/timeline/TimelineContainer";

import EscalationBanner from "../components/dashboard/EscalationBanner";
import PatientRiskTrendChart from "../components/timeline/PatientRiskTrendChart";
import PatientIntelligenceRail from "../components/patients/PatientIntelligenceRail";

import hekaApi from "../api/hekaApi";

function PatientDetail() {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  console.log(patient);

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
  }, [id]);

  const hasConversionBarriers =
    patient?.conversion_analysis?.conversion_barriers
      ?.length > 0;

  const hasProcedureDelays =
    patient?.progression_analysis?.procedure_delays
      ?.length > 0;

  const hasCareGaps =
    patient?.progression_analysis?.care_gaps
      ?.length > 0;

  if (!patient) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold">
            Loading Patient Intelligence
          </h1>

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

      <div
        className="
          rounded-2xl
          border border-slate-800
          bg-slate-900/90
          shadow-xl shadow-black/20
          p-8
        "
      >
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

          <div className="space-y-4">

            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                Explainable Patient Intelligence
              </p>

              <h1 className="text-4xl xl:text-5xl font-bold tracking-tight mt-2">
                {patient.demographics?.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-400">

              <div className="rounded-xl bg-slate-800 px-4 py-2 border border-slate-700">
                Patient ID:
                <span className="ml-2 text-white font-medium">
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
          </div>

          <div className="flex flex-col items-start xl:items-end gap-4">

            <div
              className={`
                inline-flex items-center rounded-full
                px-5 py-2 text-sm font-semibold border
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

            <div className="text-right">
              <p className="text-sm uppercase tracking-wide text-slate-500">
                Intelligence Status
              </p>

              <p className="text-lg font-semibold text-white mt-1">
                Active Operational Monitoring
              </p>
            </div>
          </div>
        </div>
      </div>

      <PatientIntelligenceRail patient={patient} />

    <div className="space-y-4">
      {hasConversionBarriers && (
        <EscalationBanner
          title="Conversion Risk Detected"
          description="Operational intelligence detected barriers affecting procedure conversion."
          level="high"
        />
      )}

      {hasCareGaps && (
        <EscalationBanner
          title="Care Gap Escalation"
          description="Clinical workflow gaps detected requiring follow-up attention."
          level="critical"
        />
      )}

      {hasProcedureDelays && (
        <EscalationBanner
          title="Procedure Delay Detected"
          description="Delayed progression detected in procedural care pathway."
          level="moderate"
        />
      )}
    </div>

      {/* LLM INSIGHTS */}

      <div className="
          bg-slate-900/90
            border border-slate-800
            rounded-2xl
            p-6
            shadow-xl shadow-black/20
            "
      >
        <h2 className="text-2xl font-semibold text-white mb-5">
            AI Clinical Summary
        </h2>

        <div className="space-y-4">

          <div className="
            border border-blue-500/20
            bg-blue-500/10
            rounded-xl
            p-5
            "
          >
            <h3 className="font-semibold text-white mb-2">
              Doctor Summary
            </h3>

            <p>
              {patient.llm_insights?.doctor_summary}
            </p>
          </div>

          <div className="
                border border-green-500/20
                bg-green-500/10
                rounded-xl
                p-5
                "
              >
            <h3 className="font-semibold text-white mb-2">
              Coordinator Summary
            </h3>

            <p>
              {patient.llm_insights?.coordinator_summary}
            </p>
          </div>

        </div>
        </div>

      {/* RISK ANALYSIS */}

      <div className="
          bg-slate-900/90
            border border-slate-800
            rounded-2xl
            p-6
            shadow-xl shadow-black/20
            "
      >
        <h2 className="text-2xl font-semibold text-white mb-5">
          Risk Analysis
        </h2>

        <div className="space-y-3">
          {patient.risk_analysis?.risk_factors?.map(
            (factor, index) => (
              <div
                key={index}
                className="
                  bg-red-500/10
                  border border-red-500/20
                  rounded-xl
                  p-4
                  text-red-100
                "

              >
                {factor}
              </div>
            )
          )}
        </div>
      </div>

      {/* PROGRESSION ANALYSIS */}

      <div className="
          bg-slate-900/90
            border border-slate-800
            rounded-2xl
            p-6
            shadow-xl shadow-black/20
            "
      >
        <h2 className="text-2xl font-semibold text-white mb-5">
          Progression Analysis
        </h2>

        <div className="space-y-3">
          {patient.progression_analysis?.progression_summary?.map(
            (finding, index) => (
              <div
                key={index}
                className="
                  bg-yellow-500/10
                  border border-yellow-500/20
                  rounded-xl
                  p-4
                  text-yellow-100
                "
              >
                {finding}
              </div>
            )
          )}
        </div>
      </div>

      {/* VARIANCE ANALYSIS */}

      <div className="
          bg-slate-900/90
            border border-slate-800
            rounded-2xl
            p-6
            shadow-xl shadow-black/20
            "
      >
        <h2 className="text-2xl font-semibold text-white mb-5">
          Care Path Variance
        </h2>

        <div className="space-y-3">
          {patient.variance_analysis?.variance_flags?.map(
            (variance, index) => (
              <div
                key={index}
                className="
                  bg-purple-500/10
                  border border-purple-500/20
                  rounded-xl
                  p-4
                  text-purple-100
                "
              >
                {variance}
              </div>
            )
          )}
        </div>
      </div>

      {/* CONVERSION ANALYSIS */}

      <div className="
          bg-slate-900/90
            border border-slate-800
            rounded-2xl
            p-6
            shadow-xl shadow-black/20
            "
      >
        <h2 className="text-2xl font-semibold text-white mb-5">
          Conversion Intelligence
        </h2>

        <div className="space-y-3">
          {patient.conversion_analysis?.conversion_barriers?.map(
            (barrier, index) => (
              <div
                key={index}
                className="
                  bg-orange-500/10
                  border border-orange-500/20
                  rounded-xl
                  p-4
                  text-orange-100
                "
              >
                {barrier}
              </div>
            )
          )}
        </div>
      </div>

      {/* CLINICAL EXPLAINABILITY */}

      <SectionCard title="Clinical Explainability">

        <div className="mb-6">

          <h3 className="text-lg font-semibold mb-3">
            Clinical Flags
          </h3>

          {patient.progression_analysis?.clinical_flags?.map(
            (flag, index) => (
              <EvidenceCard
                key={index}
                item={flag}
              />
            )
          )}

        </div>

        <div className="mb-6">

          <h3 className="text-lg font-semibold mb-3">
            Care Gaps
          </h3>

          {patient.progression_analysis?.care_gaps?.map(
            (gap, index) => (
              <EvidenceCard
                key={index}
                item={gap}
              />
            )
          )}

        </div>

        <div className="mb-6">

          <h3 className="text-lg font-semibold mb-3">
            Procedure Delays
          </h3>

          {patient.progression_analysis?.procedure_delays?.map(
            (delay, index) => (
              <EvidenceCard
                key={index}
                item={delay}
              />
            )
          )}

        </div>

      </SectionCard>

      <PatientRiskTrendChart
        timeline={patient.timeline || []}
      />

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">
          Timeline Intelligence
        </h2>

        <TimelineContainer timeline={patient.timeline} />
      </div>
      </div>

    </div>
  );
}

export default PatientDetail;