export default function CohortCard({
  title,
  count,
  description,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        {title}
      </h3>

      <p className="text-3xl font-bold text-blue-600 mb-2">
        {count}
      </p>

      <p className="text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}