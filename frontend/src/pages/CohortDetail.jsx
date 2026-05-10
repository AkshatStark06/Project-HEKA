import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import hekaApi from "../api/hekaApi";

import PriorityPatientRow from "../components/dashboard/PriorityPatientRow";

import OperationalFilterBar from "../components/dashboard/OperationalFilterBar";

export default function CohortDetail() {
  const { cohortName } = useParams();

  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchCohortPatients = async () => {
    try {
      const response = await hekaApi.get(
        `/cohort/${cohortName}`
      );

      setPatients(response.data);
    } catch (error) {
      console.error(
        "Failed to load cohort intelligence",
        error
      );
    } finally {
      setLoading(false);
    }
  };
  const [searchTerm, setSearchTerm] = useState("");
  
  const [riskFilter, setRiskFilter] =
    useState("all");
    
  const [showConversionRisk, setShowConversionRisk] =
    useState(false);

  const [showDelayedProcedure, setShowDelayedProcedure] =
    useState(false);

  const [sortBy, setSortBy] =
    useState("highest_risk");

  useEffect(() => {
    fetchCohortPatients();
  }, [cohortName]);

  const filteredPatients = [...patients]

    // Search Filter
    .filter((patient) => {
        const search = searchTerm.toLowerCase();

        return (
        patient.name?.toLowerCase().includes(search) ||
        patient.patient_id
            ?.toLowerCase()
            .includes(search)
        );
    })

    // Risk Filter
    .filter((patient) => {
        if (riskFilter === "all") return true;

        return (
            patient.risk_category?.toLowerCase() ===
            riskFilter.toLowerCase()
        );
    })

    // Conversion Risk Filter
    .filter((patient) => {
        if (!showConversionRisk) return true;

        return patient.conversion_risk === true;
    })

    // Delayed Procedure Filter
    .filter((patient) => {
        if (!showDelayedProcedure) return true;

        return patient.delayed_procedure === true;
    })

    // Sorting
    .sort((a, b) => {
        if (sortBy === "highest_risk") {
        return b.risk_score - a.risk_score;
        }

        if (sortBy === "lowest_risk") {
        return a.risk_score - b.risk_score;
        }

        return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold">
            Loading Cohort Intelligence
          </h1>

          <p className="text-slate-400">
            Initializing operational drilldown workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

      <div className="space-y-3">

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Operational Cohort Intelligence
          </p>

          <h1 className="text-4xl xl:text-5xl font-bold tracking-tight mt-2">
            Cohort Drilldown
          </h1>
        </div>

        <p className="text-slate-400 max-w-3xl leading-relaxed">
          Explainable operational intelligence workspace for cohort-based
          patient prioritization, workflow monitoring, and longitudinal
          progression analysis.
        </p>

        <div
          className="
            inline-flex items-center rounded-full
            border border-blue-500/20
            bg-blue-500/10
            px-4 py-2
            text-sm text-blue-300
          "
        >
          Cohort:
          <span className="ml-2 font-semibold">
            {cohortName}
          </span>
        </div>
      </div>

      <div
        className="
          rounded-2xl
          border border-slate-800
          bg-slate-900/90
          shadow-xl shadow-black/20
          overflow-hidden
        "
      >

        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-semibold text-white">
            Patients in Cohort
          </h2>

          <div className="mt-1 space-y-1">

            <p className="text-sm text-slate-400">
              {filteredPatients.length} patients identified
            </p>

            <div className="flex flex-wrap gap-2">

              {riskFilter !== "all" && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  Risk: {riskFilter}
                </span>
              )}

              {showConversionRisk && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                  Conversion Risk
                </span>
              )}

              {showDelayedProcedure && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                  Delayed Procedure
                </span>
              )}

              {searchTerm && (
                <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full">
                  Search: {searchTerm}
                </span>
              )}

            </div>
          </div>
        </div>

        <OperationalFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            riskFilter={riskFilter}
            setRiskFilter={setRiskFilter}
            showConversionRisk={showConversionRisk}
            setShowConversionRisk={setShowConversionRisk}
            showDelayedProcedure={showDelayedProcedure}
            setShowDelayedProcedure={
                setShowDelayedProcedure
            }
            sortBy={sortBy}
            setSortBy={setSortBy}
            />

        <div className="divide-y divide-slate-800">
          {patients.length > 0 ? (
            filteredPatients.map((patient) => (
              <PriorityPatientRow
                key={patient.patient_id}
                patient={patient}
              />
            ))
          ) : (
            <div className="p-10 text-center">

              <h3 className="text-lg font-semibold text-slate-700">
                No matching patients found
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Try adjusting operational filters or
                search criteria.
              </p>
            </div>
          )}
        </div>

      </div>
      </div>
    </div>
  );
}