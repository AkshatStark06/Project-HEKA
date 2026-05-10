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
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          Loading Cohort Intelligence...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 space-y-6">

      <div>
        <h1 className="text-4xl font-bold text-slate-800">
          Cohort Drilldown
        </h1>

        <p className="text-slate-500 mt-2">
          Operational intelligence for:
          {" "}
          <span className="font-semibold">
            {cohortName}
          </span>
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">

        <div className="p-5 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            Patients in Cohort
          </h2>

          <div className="mt-1 space-y-1">

            <p className="text-sm text-slate-500">
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

        <div>
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
  );
}