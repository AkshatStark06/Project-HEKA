const TraceabilityBlock = ({ traceability }) => {
  if (!traceability) return null

  return (
    <div className="mt-3 text-sm bg-gray-100 rounded-lg p-3">
      <h4 className="font-semibold mb-2">
        Source Traceability
      </h4>

      {traceability.dates && (
        <p>
          <span className="font-medium">Dates:</span>{" "}
          {traceability.dates.join(" → ")}
        </p>
      )}

      {traceability.previous_visit && (
        <p>
          <span className="font-medium">Previous Visit:</span>{" "}
          {traceability.previous_visit}
        </p>
      )}

      {traceability.current_visit && (
        <p>
          <span className="font-medium">Current Visit:</span>{" "}
          {traceability.current_visit}
        </p>
      )}

      {traceability.due_date && (
        <p>
          <span className="font-medium">Due Date:</span>{" "}
          {traceability.due_date}
        </p>
      )}
    </div>
  )
}

export default TraceabilityBlock