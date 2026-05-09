import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import hekaApi from "../api/hekaApi";

import KPICard from "../components/dashboard/KPICard";


function Dashboard() {
  const [summary, setSummary] = useState(null);

  const fetchDashboardSummary = async () => {
    try {
      const response = await hekaApi.get("/dashboard/summary");

      setSummary(response.data);
    } catch (error) {
      console.error("Dashboard API Error:", error);
    }
  };

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  if (!summary) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          Loading Dashboard...
        </h1>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">
          HEKA Clinical Intelligence Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Explainable Clinical Operations Intelligence
        </p>
        <Link
            to="/patients"
            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
            View Patients
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
  );
}

export default Dashboard;