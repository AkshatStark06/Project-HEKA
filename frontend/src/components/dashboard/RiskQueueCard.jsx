import PriorityPatientRow from "./PriorityPatientRow";

export default function RiskQueueCard({
  title,
  patients = [],
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">
          {title}
        </h2>

        <span className="text-sm text-slate-500">
          {patients.length} patients
        </span>
      </div>

      <div className="space-y-1">
        {patients.length > 0 ? (
          patients.map((patient) => (
            <PriorityPatientRow
              key={patient.patient_id}
              patient={patient}
            />
          ))
        ) : (
          <p className="text-sm text-slate-500">
            No patients found.
          </p>
        )}
      </div>
    </div>
  );
}