export default function PriorityReasonTag({
  label,
  type = "default",
}) {
  const styles = {
    danger:
      "bg-red-100 text-red-700 border border-red-200",

    warning:
      "bg-yellow-100 text-yellow-800 border border-yellow-300",

    info:
      "bg-blue-100 text-blue-700 border border-blue-200",

    default:
      "bg-slate-100 text-slate-700 border border-slate-200",
  };

  return (
    <span
      className={`
        text-xs px-3 py-1 rounded-full
        font-semibold
        ${styles[type]}
      `}
    >
      {label}
    </span>
  );
}