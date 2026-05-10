import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import hekaApi from "../api/hekaApi";

import KPICard from "../components/dashboard/KPICard";

import RiskQueueCard from "../components/dashboard/RiskQueueCard";
import CohortSection from "../components/dashboard/CohortSection";

import cohortConfig from "../utils/cohortConfig";

import RiskDistributionChart from "../components/dashboard/RiskDistributionChart";
import CohortBarChart from "../components/dashboard/CohortBarChart";


function Dashboard() {
  const [summary, setSummary] = useState(null);

  const [highRiskPatients, setHighRiskPatients] = useState([]);

  const [conversionRiskPatients, setConversionRiskPatients] =
    useState([]);

  const [cohortData, setCohortData] = useState([]);

  const fetchDashboardSummary = async () => {
    try {
      const response = await hekaApi.get("/dashboard/summary");

      setSummary(response.data);
    } catch (error) {
      console.error("Dashboard API Error:", error);
    }
  };

  const fetchOperationalData = async () => {
    try {
      const highRiskResponse =
        await hekaApi.get("/high-risk-patients");

      const conversionRiskResponse =
        await hekaApi.get("/conversion-risk");

      setHighRiskPatients(highRiskResponse.data);

      setConversionRiskPatients(
        conversionRiskResponse.data
      );
    } catch (error) {
      console.error(
        "Failed to fetch operational intelligence",
        error
      );
    }
  };

  useEffect(() => {
    fetchDashboardSummary();

    fetchOperationalData();
    fetchCohortData();
  }, []);

  const fetchCohortData = async () => {
    try {

      const cohortResponses = await Promise.all(
        cohortConfig.map(async (cohort) => {

          const response = await hekaApi.get(
            `/cohort/${cohort.cohortKey}`
          );

          return {
            ...cohort,
            count: response.data.length,
          };
        })
      );

      setCohortData(cohortResponses);

    } catch (error) {
      console.error(
        "Failed to fetch cohort intelligence",
        error
      );
    }
  };

  if (!summary) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold">
            Loading HEKA Intelligence Workspace
          </h1>

          <p className="text-slate-400">
            Initializing operational intelligence systems...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
  
          <div className="space-y-3">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                Explainable Clinical Operations Platform
              </p>

              <h1 className="text-4xl xl:text-5xl font-bold tracking-tight mt-2">
                HEKA Clinical Intelligence
              </h1>
            </div>

            <p className="text-slate-400 max-w-3xl leading-relaxed">
              Operational intelligence workspace for patient prioritization,
              longitudinal risk tracking, conversion intelligence, and
              explainable care coordination workflows.
            </p>
          </div>

          <div>
            <Link
              to="/patients"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:bg-blue-500"
            >
              Open Patient Registry
            </Link>
          </div>
        </div>

        <div className="space-y-4">
  
          <div>
            <h2 className="text-xl font-semibold">
              Operational Intelligence Overview
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Real-time explainable patient risk and workflow metrics generated
              from backend intelligence engines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <KPICard
            title="Total Patients"
            value={summary.total_patients}
          />

          <KPICard
            title="High Risk Patients"
            value={summary.high_risk_patients}
          />

          <KPICard
            title="Moderate Risk Patients"
            value={summary.moderate_risk_patients}
          />

          <KPICard
            title="Low Risk Patients"
            value={summary.low_risk_patients}
          />

          <KPICard
            title="Pending Procedures"
            value={summary.pending_procedures}
          />

          <KPICard
            title="Conversion Risk Patients"
            value={summary.conversion_risk_patients}
          />

          <KPICard
            title="Lost Follow-Up Patients"
            value={summary.lost_followup_patients}
          />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <RiskQueueCard
            title="High-Risk Patient Queue"
            patients={highRiskPatients}
          />

          <RiskQueueCard
            title="Conversion-Risk Queue"
            patients={conversionRiskPatients}
          />
        </div>

        <div className="space-y-4">

          <div>
            <h2 className="text-2xl font-semibold">
              Cohort Intelligence
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Longitudinal patient segmentation based on operational,
              progression, and conversion intelligence patterns.
            </p>
          </div>

          <RiskDistributionChart summary={summary} />
          <CohortBarChart cohorts={cohortData} />
          <CohortSection cohorts={cohortData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;