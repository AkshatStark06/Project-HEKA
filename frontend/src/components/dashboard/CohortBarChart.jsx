import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function CohortBarChart({
  cohorts,
}) {
  const data = cohorts.map((cohort) => ({
    name: cohort.title,
    patients: cohort.count,
  }));

  return (
    <div
      className="
        bg-slate-900/90
        border border-slate-800
        rounded-2xl
        p-6
      "
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">
          Cohort Intelligence Trends
        </h2>

        <p className="text-slate-400 mt-1">
          Operational segmentation across key patient cohorts.
        </p>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
            />

            <XAxis
              dataKey="name"
              stroke="#94a3b8"
            />

            <YAxis stroke="#94a3b8" />

            <Tooltip 
                contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    color: "#ffffff",
                }}
                labelStyle={{
                    color: "#ffffff",
                    fontWeight: 600,
                }}
                itemStyle={{
                    color: "#60a5fa",
                }}
                cursor={{
                    fill: "rgba(59, 130, 246, 0.08)",
                }}
            />

            <Bar
              dataKey="patients"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}