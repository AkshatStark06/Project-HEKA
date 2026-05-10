import CohortCard from "./CohortCard";

export default function CohortSection({
  cohorts = [],
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <h2 className="text-xl font-bold text-slate-800 mb-5">
        Cohort Intelligence
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
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
  );
}