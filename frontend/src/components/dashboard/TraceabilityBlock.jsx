const TraceabilityBlock = ({ traceability }) => {
  if (!traceability) return null;

  return (
    <div
      className="
        mt-4
        rounded-xl
        border border-blue-500/20
        bg-blue-500/5
        p-4
      "
    >
      <h4 className="font-semibold text-blue-300 mb-3">
        Source Traceability
      </h4>

      <div className="space-y-2 text-sm text-slate-300">

        {traceability.dates && (
          <p>
            <span className="font-medium text-slate-200">
              Dates:
            </span>{" "}
            {traceability.dates.join(" → ")}
          </p>
        )}

        {traceability.previous_visit && (
          <p>
            <span className="font-medium text-slate-200">
              Previous Visit:
            </span>{" "}
            {traceability.previous_visit}
          </p>
        )}

        {traceability.current_visit && (
          <p>
            <span className="font-medium text-slate-200">
              Current Visit:
            </span>{" "}
            {traceability.current_visit}
          </p>
        )}

        {traceability.due_date && (
          <p>
            <span className="font-medium text-slate-200">
              Due Date:
            </span>{" "}
            {traceability.due_date}
          </p>
        )}
      </div>
    </div>
  );
};

export default TraceabilityBlock;