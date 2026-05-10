export default function PatientIntelligenceRail({
  patient,
}) {

  const riskLevel =
    patient.risk_analysis?.risk_level ||
    "Unknown";

  const riskScore =
    patient.risk_analysis?.risk_score || 0;

  const conversionRisk =
    patient.conversion_analysis
      ?.conversion_barriers?.length > 0;

  const delayedProcedure =
    patient.variance_analysis
      ?.variance_flags?.length > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">

      {/* Risk Score */}

      <div
        className="
          bg-slate-900/90
          border border-slate-800
          rounded-2xl
          p-5
        "
      >
        <p className="text-sm text-slate-500">
          Risk Score
        </p>

        <h3 className="text-3xl font-bold text-white mt-2">
          {riskScore}
        </h3>
      </div>

      {/* Risk Level */}

      <div
        className="
          bg-slate-900/90
          border border-slate-800
          rounded-2xl
          p-5
        "
      >
        <p className="text-sm text-slate-500">
          Risk Level
        </p>

        <h3 className="text-2xl font-semibold text-red-400 mt-2 capitalize">
          {riskLevel}
        </h3>
      </div>

      {/* Conversion Risk */}

      <div
        className="
          bg-slate-900/90
          border border-slate-800
          rounded-2xl
          p-5
        "
      >
        <p className="text-sm text-slate-500">
          Conversion Risk
        </p>

        <h3
          className={`
            text-2xl font-semibold mt-2
            ${
              conversionRisk
                ? "text-orange-400"
                : "text-green-400"
            }
          `}
        >
          {conversionRisk ? "Detected" : "None"}
        </h3>
      </div>

      {/* Delayed Procedure */}

      <div
        className="
          bg-slate-900/90
          border border-slate-800
          rounded-2xl
          p-5
        "
      >
        <p className="text-sm text-slate-500">
          Procedure Delay
        </p>

        <h3
          className={`
            text-2xl font-semibold mt-2
            ${
              delayedProcedure
                ? "text-yellow-400"
                : "text-green-400"
            }
          `}
        >
          {delayedProcedure ? "Present" : "None"}
        </h3>
      </div>

      {/* Monitoring */}

      <div
        className="
          bg-slate-900/90
          border border-slate-800
          rounded-2xl
          p-5
        "
      >
        <p className="text-sm text-slate-500">
          Monitoring
        </p>

        <h3 className="text-2xl font-semibold text-blue-400 mt-2">
          Active
        </h3>
      </div>

    </div>
  );
}