import { Link } from "react-router-dom";
import PriorityReasonTag from "./PriorityReasonTag";

export default function PriorityPatientRow({ patient }) {

    const reasonTags = [];

    if (patient.conversion_risk) {
        reasonTags.push({
        label: "Conversion Risk",
        type: "warning",
        });
    }

    if (patient.lost_followup_risk) {
        reasonTags.push({
        label: "Lost Follow-Up",
        type: "danger",
        });
    }

    if (patient.delayed_procedure) {
        reasonTags.push({
        label: "Delayed Procedure",
        type: "warning",
        });
    }

    if (patient.high_risk_trend) {
        reasonTags.push({
        label: "High-Risk Trend",
        type: "danger",
        });
    }
  return (
  <Link
    to={`/patients/${patient.patient_id}`}
    className="
      block
      px-6 py-5
      transition-all duration-200
      hover:bg-slate-800/60
    "
  >
    <div className="flex items-start justify-between gap-6">
      
      <div className="flex-1 min-w-0 space-y-3">
        
        <div>
          <h4 className="font-semibold text-white text-base">
            {patient.name || "Unknown Patient"}
          </h4>

          <p className="text-sm text-slate-400 mt-1">
            Patient ID: {patient.patient_id}
          </p>
        </div>

        {patient.priority_reason && (
          <p className="text-sm leading-relaxed text-slate-300 max-w-2xl">
            {patient.priority_reason}
          </p>
        )}

        {reasonTags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {reasonTags.map((tag, index) => (
              <PriorityReasonTag
                key={index}
                label={tag.label}
                type={tag.type}
              />
            ))}
          </div>
        )}
      </div>

      <div className="min-w-[120px] text-right space-y-2">
        
        <div>
          <span
            className={`
              inline-flex items-center rounded-full
              px-3 py-1 text-xs font-semibold
              border
              ${
                (
                  patient.risk_category ||
                  patient.conversion_risk
                )?.toLowerCase() === "high"
                  ? "border-red-500/30 bg-red-500/10 text-red-300"
                  : (
                      patient.risk_category ||
                      patient.conversion_risk ||
                      (patient.risk_score >= 10
                        ? "high"
                        : patient.risk_score >= 6
                        ? "moderate"
                        : "low")
                    )?.toLowerCase() === "moderate"
                  ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                  : "border-green-500/30 bg-green-500/10 text-green-300"
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
              .replace(/\b\w/g, (char) =>
                char.toUpperCase()
              )}
          </span>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Intelligence Signal
          </p>

          <p className="text-sm font-medium text-slate-300 mt-1">
            {patient.risk_score
              ? `Risk Score: ${patient.risk_score}`
              : patient.conversion_risk
              ? `Conversion Risk`
              : "No Score"}
          </p>
        </div>
      </div>
    </div>
  </Link>
);
}