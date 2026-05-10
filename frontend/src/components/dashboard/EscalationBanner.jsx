export default function EscalationBanner({
  title,
  description,
  level = "high",
}) {
  const levelStyles = {
    critical:
      "border-red-300 bg-red-50 text-red-900",

    high:
      "border-orange-300 bg-orange-50 text-orange-900",

    moderate:
      "border-yellow-300 bg-yellow-50 text-yellow-900",
  };

  return (
    <div
      className={`
        border rounded-xl p-4 mb-4 shadow-sm
        ${levelStyles[level]}
      `}
    >
      <h3 className="font-bold text-base mb-1">
        {title}
      </h3>

      <p className="text-sm">
        {description}
      </p>
    </div>
  );
}