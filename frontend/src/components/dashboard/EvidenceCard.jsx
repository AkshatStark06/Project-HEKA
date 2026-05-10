import TraceabilityBlock from "./TraceabilityBlock";

const EvidenceCard = ({ item }) => {
  return (
    <div
      className="
        rounded-2xl
        border border-slate-800
        bg-slate-950/70
        p-5
        mb-4
      "
    >
      <h3 className="font-semibold text-lg text-white mb-3">
        {item.finding}
      </h3>

      {item.severity && (
        <div className="mb-3">
          <span
            className="
              inline-flex items-center rounded-full
              border border-yellow-500/20
              bg-yellow-500/10
              px-3 py-1
              text-xs font-semibold text-yellow-300
            "
          >
            Severity: {item.severity}
          </span>
        </div>
      )}

      {item.evidence && (
        <div className="mb-4">
          <p className="font-medium text-slate-300 mb-2">
            Supporting Evidence
          </p>

          <ul className="space-y-2">
            {item.evidence.map((ev, index) => (
              <li
                key={index}
                className="
                  rounded-xl
                  border border-slate-800
                  bg-slate-900
                  px-4 py-3
                  text-sm text-slate-300
                "
              >
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
  );
};

export default EvidenceCard;