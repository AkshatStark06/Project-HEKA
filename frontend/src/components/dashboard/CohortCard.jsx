import { Link } from "react-router-dom";

export default function CohortCard({
  title,
  count,
  description,
  cohortKey,
}) {
  return (
    <Link
      to={`/cohort/${cohortKey}`}
      className="block group"
    >
      <div
        className="
          relative
          h-full
          overflow-hidden
          rounded-2xl
          border border-slate-800
          bg-slate-950/80
          p-5
          transition-all duration-300
          hover:border-blue-500/40
          hover:bg-slate-900
          hover:shadow-xl hover:shadow-black/20
        "
      >
        <div className="space-y-5">
          
          <div className="flex items-start justify-between gap-4">
            
            <div>
              <h3 className="text-lg font-semibold text-white">
                {title}
              </h3>

              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                {description}
              </p>
            </div>

            <div
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl
                border border-blue-500/20
                bg-blue-500/10
              "
            >
              <div className="h-2 w-2 rounded-full bg-blue-400" />
            </div>
          </div>

          <div className="flex items-end justify-between">
            
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Patients
              </p>

              <p className="text-4xl font-bold tracking-tight text-blue-300 mt-2">
                {count}
              </p>
            </div>

            <div
              className="
                text-sm font-medium
                text-slate-400
                group-hover:text-blue-300
                transition-colors
              "
            >
              View Cohort →
            </div>
          </div>
        </div>

        <div
          className="
            absolute inset-x-0 bottom-0 h-[2px]
            bg-gradient-to-r from-transparent via-blue-500/40 to-transparent
          "
        />
      </div>
    </Link>
  );
}