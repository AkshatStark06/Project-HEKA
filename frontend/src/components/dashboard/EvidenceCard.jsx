import TraceabilityBlock from "./TraceabilityBlock"

const EvidenceCard = ({ item }) => {
  return (
    <div className="border rounded-xl p-4 mb-4 bg-gray-50">

      <h3 className="font-semibold text-lg mb-2">
        {item.finding}
      </h3>

      {item.severity && (
        <p className="mb-2">
          <span className="font-medium">Severity:</span>{" "}
          {item.severity}
        </p>
      )}

      {item.evidence && (
        <div className="mb-3">
          <p className="font-medium mb-1">
            Supporting Evidence:
          </p>

          <ul className="list-disc ml-5">
            {item.evidence.map((ev, index) => (
              <li key={index}>
                {typeof ev === "string"
                  ? ev
                  : `${ev.field}: ${ev.value}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      <TraceabilityBlock traceability={item.traceability} />

    </div>
  )
}

export default EvidenceCard