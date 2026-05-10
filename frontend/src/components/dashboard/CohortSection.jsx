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