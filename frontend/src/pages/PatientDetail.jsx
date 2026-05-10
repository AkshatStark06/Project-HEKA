import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SectionCard from "../components/dashboard/SectionCard"
import EvidenceCard from "../components/dashboard/EvidenceCard"

import TimelineContainer from "../components/timeline/TimelineContainer";

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

  if (!patient) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          Loading Patient Intelligence...
        </h1>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      
      {/* HEADER */}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-4xl font-bold text-gray-800">
          {patient.demographics?.name}
        </h1>

        <p className="text-gray-500 mt-2">
          Patient ID: {patient.patient_id}
        </p>
        
        <p className="text-gray-500">
          {patient.demographics?.age} years •{" "}
          {patient.demographics?.gender}
        </p>

        <div className="mt-4">
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium
            ${
              patient.risk_analysis?.risk_level === "high"
                ? "bg-red-100 text-red-700"
                : patient.risk_analysis?.risk_level === "moderate"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {patient.risk_analysis?.risk_level} risk
          </span>
        </div>
      </div>

      {/* LLM INSIGHTS */}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">
            AI Clinical Summary
        </h2>

        <div className="space-y-4">

          <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
            <h3 className="font-semibold mb-1">
              Doctor Summary
            </h3>

            <p>
              {patient.llm_insights?.doctor_summary}
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
            <h3 className="font-semibold mb-1">
              Coordinator Summary
            </h3>

            <p>
              {patient.llm_insights?.coordinator_summary}
            </p>
          </div>

        </div>
        </div>

      {/* RISK ANALYSIS */}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">
          Risk Analysis
        </h2>

        <div className="space-y-3">
          {patient.risk_analysis?.risk_factors?.map(
            (factor, index) => (
              <div
                key={index}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                {factor}
              </div>
            )
          )}
        </div>
      </div>

      {/* PROGRESSION ANALYSIS */}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">
          Progression Analysis
        </h2>

        <div className="space-y-3">
          {patient.progression_analysis?.progression_summary?.map(
            (finding, index) => (
              <div
                key={index}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
              >
                {finding}
              </div>
            )
          )}
        </div>
      </div>

      {/* VARIANCE ANALYSIS */}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">
          Care Path Variance
        </h2>

        <div className="space-y-3">
          {patient.variance_analysis?.variance_flags?.map(
            (variance, index) => (
              <div
                key={index}
                className="bg-purple-50 border border-purple-200 rounded-lg p-4"
              >
                {variance}
              </div>
            )
          )}
        </div>
      </div>

      {/* CONVERSION ANALYSIS */}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">
          Conversion Intelligence
        </h2>

        <div className="space-y-3">
          {patient.conversion_analysis?.conversion_barriers?.map(
            (barrier, index) => (
              <div
                key={index}
                className="bg-orange-50 border border-orange-200 rounded-lg p-4"
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

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">
          Timeline Intelligence
        </h2>

        <TimelineContainer timeline={patient.timeline} />
      </div>

    </div>
  );
}

export default PatientDetail;