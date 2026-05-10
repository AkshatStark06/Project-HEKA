const colorMap = {
  visit: "bg-blue-100 text-blue-700",
  call: "bg-yellow-100 text-yellow-700",
  action: "bg-purple-100 text-purple-700",
};

function TimelineBadge({ type }) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${
        colorMap[type] || "bg-gray-100 text-gray-700"
      }`}
    >
      {type?.toUpperCase()}
    </span>
  );
}

export default TimelineBadge;