import { Link } from "react-router-dom";

export default function PriorityPatientRow({ patient }) {
  return (
    <Link
      to={`/patients/${patient.patient_id}`}
      className="block border-b border-slate-200 py-3 hover:bg-slate-50 transition"
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-slate-800">
            {patient.name || "Unknown Patient"}
          </h4>

          <p className="text-sm text-slate-500">
            ID: {patient.patient_id}
          </p>
        </div>

        <div className="text-right">
          <span
            className={`
                px-3 py-1 rounded-full text-xs font-semibold
                ${
                (
                    patient.risk_category ||
                    patient.conversion_risk
                )?.toLowerCase() === "high"
                    ? "bg-red-100 text-red-700"
                    : (
                        patient.risk_category ||
                        patient.conversion_risk||
                        (patient.risk_score >= 10
                            ? "high"
                            : patient.risk_score >= 6
                            ? "moderate"
                            : "low")
                    )?.toLowerCase() === "moderate"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }
            `}
            >
            {(
                patient.risk_category ||
                patient.conversion_risk ||
                (patient.risk_score >= 10
                    ? "High"
                    : patient.risk_score >= 6
                    ? "Moderate"
                    : "Low")
            )
                .toString()
                .replace("_", " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
          </span>

          <p className="text-sm text-slate-500 mt-1">
            {patient.risk_score
                ? `Score: ${patient.risk_score}`
                : patient.conversion_risk
                ? `Conversion Risk`
                : "No Score"}
          </p>
        </div>
      </div>
    </Link>
  );
}