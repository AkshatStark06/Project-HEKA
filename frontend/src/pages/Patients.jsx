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

      console.error(
        "Patients API Error:",
        error
      );
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (

    <div className="min-h-screen bg-[#020617] p-8 space-y-8">

      <div className="space-y-3">

        <p className="uppercase tracking-[0.3em] text-xs text-blue-400">

          Healthcare Evaluation & Knowledge Assistant

        </p>

        <h1 className="text-5xl font-black text-white">

          H.E.K.A. Patient Registry

        </h1>

        <p className="text-slate-400 text-lg max-w-4xl leading-relaxed">

          Operational clinical intelligence workspace for
          longitudinal patient monitoring, risk prioritization,
          conversion tracking, and explainable care coordination
          workflows.

        </p>

      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">

        <table className="w-full">

          <thead className="bg-slate-950 border-b border-slate-800">

            <tr>

              <th className="text-left px-6 py-5 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Patient ID
              </th>

              <th className="text-left px-6 py-5 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Name
              </th>

              <th className="text-left px-6 py-5 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Risk Level
              </th>

              <th className="text-left px-6 py-5 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Cohorts
              </th>

              <th className="text-left px-6 py-5 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Conversion Status
              </th>

              <th className="text-left px-6 py-5 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Details
              </th>

            </tr>

          </thead>

          <tbody>

            {patients.map((patient) => (

              <tr
                key={patient.patient_id}
                className="border-t border-slate-800 hover:bg-slate-800/40 transition-all duration-200"
              >

                <td className="px-6 py-6 text-slate-200 font-medium">
                  {patient.patient_id}
                </td>

                <td className="px-6 py-6 text-slate-100 font-semibold">
                  {patient.name}
                </td>

                <td className="px-6 py-6 text-slate-200">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border
                    ${
                      patient.risk_level === "high"
                        ? "bg-red-500/10 text-red-400 border-red-500/30"
                        : patient.risk_level === "moderate"
                        ? "bg-yellow-500/10 text-yellow-300 border-yellow-500/30"
                        : "bg-green-500/10 text-green-400 border-green-500/30"
                    }`}
                  >

                    {patient.risk_level?.toUpperCase()}

                  </span>

                </td>

                <td className="px-6 py-6 text-slate-200">

                  <div className="flex flex-wrap gap-2 max-w-[600px]">

                    {patient.cohorts?.map((cohort, index) => (

                      <span
                        key={index}
                        className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-medium"
                      >

                        {cohort
                          .replaceAll("_", " ")
                          .replace(/\b\w/g, (char) =>
                            char.toUpperCase()
                          )}

                      </span>

                    ))}

                  </div>

                </td>

                <td className="px-6 py-6 text-slate-300 font-medium">

                  {patient.conversion_status
                    ?.replaceAll("_", " ")
                    .replace(/\b\w/g, (char) =>
                      char.toUpperCase()
                    )}

                </td>

                <td className="px-6 py-6">

                  <Link
                    to={`/patient/${patient.patient_id}`}
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
                  >

                    Open Patient Profile →

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