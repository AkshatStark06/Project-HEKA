import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

export default function RiskScoreDistributionChart({
  patients = [],
}) {

  const ranges = {
    "0-3": 0,
    "4-6": 0,
    "7-9": 0,
    "10+": 0,
  };

  patients.forEach((patient) => {

    const score = patient?.risk_score || 0;

    if (score <= 3) {
      ranges["0-3"] += 1;
    } else if (score <= 6) {
      ranges["4-6"] += 1;
    } else if (score <= 9) {
      ranges["7-9"] += 1;
    } else {
      ranges["10+"] += 1;
    }
  });

  const data = [
    {
      range: "0-3",
      patients: ranges["0-3"],
      color: "#22c55e",
    },
    {
      range: "4-6",
      patients: ranges["4-6"],
      color: "#eab308",
    },
    {
      range: "7-9",
      patients: ranges["7-9"],
      color: "#f97316",
    },
    {
      range: "10+",
      patients: ranges["10+"],
      color: "#ef4444",
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <h2 className="text-2xl font-bold text-white mb-2">
        Risk Score Distribution
      </h2>

      <p className="text-slate-400 text-sm mb-6">
        Patient distribution across operational risk severity ranges.
      </p>

      <div className="h-[380px]">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 10,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
            />

            <XAxis
              dataKey="range"
              tick={{ fill: "#cbd5e1" }}
              axisLine={{ stroke: "#334155" }}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "12px",
                color: "#fff",
              }}
            />

            <Bar
              dataKey="patients"
              radius={[10, 10, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                />
              ))}
            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>
    </div>
  );
}