import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#ef4444",
  "#eab308",
  "#22c55e",
];

export default function RiskDistributionChart({
  summary,
}) {
  const data = [
    {
      name: "High Risk",
      value: summary.high_risk_patients,
    },
    {
      name: "Moderate Risk",
      value: summary.moderate_risk_patients,
    },
    {
      name: "Low Risk",
      value: summary.low_risk_patients,
    },
  ];

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
          Risk Distribution
        </h2>

        <p className="text-slate-400 mt-1">
          Operational patient risk segmentation.
        </p>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 80, left: 20, bottom: 20 }}>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              innerRadius={60}
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

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
            />

            <Legend 
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{
                    color: "#e2e8f0",
                    paddingLeft: "20px",
                }}
            />

          </PieChart >
        </ResponsiveContainer>
      </div>
    </div>
  );
}