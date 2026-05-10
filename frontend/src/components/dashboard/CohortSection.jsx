import CohortCard from "./CohortCard";

export default function CohortSection({
  cohorts = [],
}) {
  return (
    <div
      className="
        rounded-2xl
        border border-slate-800
        bg-slate-900/90
        shadow-xl shadow-black/20
        overflow-hidden
      "
    >
      <div
        className="
          px-6 py-5
          border-b border-slate-800
        "
      >
        <h2 className="text-xl font-semibold text-white">
          Cohort Intelligence
        </h2>

        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Longitudinal patient segmentation generated from
          operational, progression, and conversion intelligence
          engines.
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {cohorts.map((cohort) => (
            <CohortCard
              key={cohort.title}
              title={cohort.title}
              count={cohort.count}
              description={cohort.description}
              cohortKey={cohort.cohortKey}
            />
          ))}
        </div>
      </div>
    </div>
  );
}