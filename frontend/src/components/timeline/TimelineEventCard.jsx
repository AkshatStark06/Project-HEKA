import TimelineBadge from "./TimelineBadge";

function TimelineEventCard({ event }) {
  const renderDetails = () => {
    switch (event.event_type) {
      case "visit":
        return (
          <>
            {event.department && (
              <p className="text-sm text-gray-600">
                Department: {event.department}
              </p>
            )}

            {event.doctor && (
              <p className="text-sm text-gray-600">
                Doctor: {event.doctor}
              </p>
            )}

            {event.visit_type && (
              <p className="text-sm text-gray-600">
                Visit Type: {event.visit_type}
              </p>
            )}
          </>
        );

      case "call":
        return (
          <>
            {event.call_summary && (
              <p className="text-sm text-gray-600">
                {event.call_summary}
              </p>
            )}

            {event.call_outcome && (
              <p className="text-sm">
                <span className="font-medium">
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
              <p className="text-sm text-gray-600">
                {event.action}
              </p>
            )}

            {event.status && (
              <p className="text-sm">
                <span className="font-medium">
                  Status:
                </span>{" "}
                {event.status}
              </p>
            )}
          </>
        );

      default:
        return (
          <p className="text-sm text-gray-500">
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
    <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <TimelineBadge type={event.event_type} />

        <span className="text-sm text-gray-500">
          {event.date}
        </span>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-gray-800">
          {getTitle()}
        </h4>

        {renderDetails()}
      </div>
    </div>
  );
}

export default TimelineEventCard;