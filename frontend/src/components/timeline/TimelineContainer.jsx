import TimelineEventCard from "./TimelineEventCard";

function TimelineContainer({ timeline }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-gray-500 text-sm">
        No timeline data available.
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-gray-200 ml-4 space-y-6">
      {timeline.map((event, index) => (
        <div
          key={index}
          className="relative pl-6"
        >
          <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow" />

          <TimelineEventCard event={event} />
        </div>
      ))}
    </div>
  );
}

export default TimelineContainer;