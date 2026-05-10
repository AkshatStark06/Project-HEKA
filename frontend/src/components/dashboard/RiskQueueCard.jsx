import PriorityPatientRow from "./PriorityPatientRow";

export default function RiskQueueCard({
  title,
  patients = [],
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
          flex items-center justify-between
          px-6 py-5
          border-b border-slate-800
          bg-slate-900
        "
      >
        <div>
          <h2 className="text-lg font-semibold text-white">
            {title}
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Explainable operational priority queue
          </p>
        </div>

        <div
          className="
            flex items-center justify-center
            min-w-[70px]
            rounded-xl
            border border-blue-500/20
            bg-blue-500/10
            px-3 py-2
          "
        >
          <span className="text-sm font-semibold text-blue-300">
            {patients.length}
          </span>
        </div>
      </div>

      <div 
        className="
          divide-y divide-slate-800
          max-h-[420px]
          overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent
        "
      >
        {patients.length > 0 ? (
          patients.map((patient) => (
            <PriorityPatientRow
              key={patient.patient_id}
              patient={patient}
            />
          ))
        ) : (
          <div className="px-6 py-8">
            <p className="text-sm text-slate-400">
              No patients currently in this queue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}