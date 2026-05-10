export default function PriorityReasonTag({
  label,
  type = "default",
}) {
  const styles = {
    danger:
      "bg-red-500/15 text-red-300 border border-red-500/30",

    warning:
      "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30",

    info:
      "bg-blue-500/15 text-blue-300 border border-blue-500/30",

    default:
      "bg-slate-700 text-slate-300 border border-slate-600",
  };

  return (
    <span
      className={`
        text-xs px-2 py-1 rounded-full
        font-medium
        ${styles[type]}
      `}
    >
      {label}
    </span>
  );
}