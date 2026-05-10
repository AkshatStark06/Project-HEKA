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
          key={index}
          className="relative pl-8"
        >
          <div
            className="
              absolute -left-[11px] top-7
              w-5 h-5 rounded-full
              bg-blue-500
              border-4 border-slate-950
              shadow-lg shadow-blue-500/20
            "
          />

          <TimelineEventCard event={event} />
        </div>
      ))}
    </div>
  );
}

export default TimelineContainer;