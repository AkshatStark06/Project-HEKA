import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import hekaApi from "../api/hekaApi";

function Patients() {
  const [patients, setPatients] = useState([]);

  const fetchPatients = async () => {
    try {
      const response = await hekaApi.get("/patients");

      setPatients(response.data);
    } catch (error) {
      console.error("Patients API Error:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">
          HEKA Patients
        </h1>

        <p className="text-gray-500 mt-2">
          Clinical Intelligence Patient Registry
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Patient ID</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Risk Level</th>
              <th className="text-left p-4">Cohorts</th>
              <th className="text-left p-4">Conversion Status</th>
              <th className="text-left p-4">Details</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.patient_id}
                className="border-t"
              >
                <td className="p-4">
                  {patient.patient_id}
                </td>

                <td className="p-4">
                  {patient.name}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
                      patient.risk_level === "high"
                        ? "bg-red-100 text-red-700"
                        : patient.risk_level === "moderate"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {patient.risk_level}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {patient.cohorts?.map((cohort, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs"
                      >
                        {cohort}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="p-4">
                  {patient.conversion_status}
                </td>

                <td className="p-4">
                  <Link
                    to={`/patient/${patient.patient_id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Patients;