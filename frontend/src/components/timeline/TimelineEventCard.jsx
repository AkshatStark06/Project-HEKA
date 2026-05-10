import TimelineBadge from "./TimelineBadge";

function TimelineEventCard({ event }) {

  const renderDetails = () => {
    switch (event.event_type) {

      case "visit":
        return (
          <>
            {event.department && (
              <p className="text-sm text-slate-300">
                Department: {event.department}
              </p>
            )}

            {event.doctor && (
              <p className="text-sm text-slate-300">
                Doctor: {event.doctor}
              </p>
            )}

            {event.visit_type && (
              <p className="text-sm text-slate-300">
                Visit Type: {event.visit_type}
              </p>
            )}
          </>
        );

      case "call":
        return (
          <>
            {event.call_summary && (
              <p className="text-sm text-slate-300">
                {event.call_summary}
              </p>
            )}

            {event.call_outcome && (
              <p className="text-sm text-slate-300">
                <span className="font-medium text-white">
                  Outcome:
                </span>{" "}
                {event.call_outcome}
              </p>
            )}
          </>
        );

      case "action":
        return (
          <>
            {event.action && (
              <p className="text-sm text-slate-300">
                {event.action}
              </p>
            )}

            {event.status && (
              <p className="text-sm text-slate-300">
                <span className="font-medium text-white">
                  Status:
                </span>{" "}
                {event.status}
              </p>
            )}
          </>
        );

      default:
        return (
          <p className="text-sm text-slate-500">
            No additional details available.
          </p>
        );
    }
  };

  const getTitle = () => {
    switch (event.event_type) {
      case "visit":
        return "Clinical Visit";

      case "call":
        return "Coordinator Follow-up";

      case "action":
        return "Workflow Action";

      default:
        return "Timeline Event";
    }
  };

  return (
    <div
      className="
        rounded-2xl
        border border-slate-800
        bg-slate-900/90
        p-5
        shadow-lg shadow-black/10
      "
    >
      <div className="flex items-center justify-between mb-4">

        <TimelineBadge type={event.event_type} />

        <span className="text-sm text-slate-500">
          {event.date}
        </span>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-white text-lg">
          {getTitle()}
        </h4>

        {renderDetails()}
      </div>
    </div>
  );
}

export default TimelineEventCard;