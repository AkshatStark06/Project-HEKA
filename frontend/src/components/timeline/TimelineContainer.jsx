import TimelineEventCard from "./TimelineEventCard";

function TimelineContainer({ timeline }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-slate-500 text-sm">
        No timeline data available.
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-slate-700 ml-4 space-y-6">
      {timeline.map((event, index) => (
        <div
          key={event.id}
          className={`
            border-l-4 pl-4 py-4 rounded-r-xl mb-4
            ${
              event.severity === "high"
                ? "border-red-500 bg-red-500/5"
                : event.severity === "moderate"
                ? "border-amber-500 bg-amber-500/5"
                : "border-emerald-500 bg-emerald-500/5"
            }
          `}
        >

          {/* DATE + SOURCE */}

          <div className="flex items-center justify-between mb-2">

            <p className="text-xs text-slate-400 uppercase tracking-wider">
              {new Date(event.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>

            <div className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {event.sourceType}
            </div>

          </div>

          {/* TITLE */}

          <h3 className="text-white font-semibold text-sm mb-2">
            {event.title}
          </h3>

          {/* DESCRIPTION */}

          <p className="text-sm text-slate-300 leading-relaxed">
            {event.description}
          </p>

        </div>
      ))}
    </div>
  );
}

export default TimelineContainer;