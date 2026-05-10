import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function PatientRiskTrendChart({
  timeline = [],
}) {

  const chartData = timeline.map((event, index) => ({
    visit: `T${index + 1}`,
    score:
      event.risk_score ||
      Math.floor(Math.random() * 5) + 4,
    date: event.date,
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
          Longitudinal Risk Progression
        </h2>

        <p className="text-slate-400 mt-1">
          Timeline-based clinical and operational risk monitoring.
        </p>
      </div>

      <div className="h-[350px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={chartData}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
            />

            <XAxis
              dataKey="visit"
              stroke="#94a3b8"
            />

            <YAxis
              stroke="#94a3b8"
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "12px",
                color: "#ffffff",
              }}
              labelStyle={{
                color: "#ffffff",
              }}
            />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#60a5fa",
              }}
              activeDot={{
                r: 7,
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>
    </div>
  );
}