import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import hekaApi from "../api/hekaApi";

import PriorityPatientRow from "../components/dashboard/PriorityPatientRow";

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

  useEffect(() => {
    fetchCohortPatients();
  }, [cohortName]);

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
    <div className="p-6 space-y-6">

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

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">

        <div className="p-5 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            Patients in Cohort
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {patients.length} patients identified
          </p>
        </div>

        <div>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <PriorityPatientRow
                key={patient.patient_id}
                patient={patient}
              />
            ))
          ) : (
            <div className="p-6 text-slate-500">
              No patients found in this cohort.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}