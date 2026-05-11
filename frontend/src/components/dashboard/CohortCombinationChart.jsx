import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

function formatCohortName(name) {
  return name
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function CohortCombinationChart({ patients }) {

  const combinationCounts = {};

  patients.forEach((patient) => {

    const cohorts = patient.cohorts || [];

    if (cohorts.length < 2) return;

    const sortedCohorts = [...cohorts]
      .sort()
      .slice(0, 2);

    const combinationKey = sortedCohorts.join(" + ");

    combinationCounts[combinationKey] =
      (combinationCounts[combinationKey] || 0) + 1;
  });

  const chartData = Object.entries(combinationCounts)
    .map(([key, value]) => ({
      name: key
        .split(" + ")
        .map(formatCohortName)
        .join(" + "),
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  return (
    <div className="bg-[#091a33] border border-blue-900/40 rounded-2xl p-5">

      <h3 className="text-white font-semibold text-lg">
        Cohort Combination Intelligence
      </h3>

      <p className="text-blue-200/70 text-sm mb-4">
        Most common multi-condition operational cohort overlaps across patients.
      </p>

      <div className="h-[340px]">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
            />

            <XAxis
              type="number"
              stroke="#94a3b8"
            />

            <YAxis
              type="category"
              dataKey="name"
              stroke="#94a3b8"
              width={150}
            />

            <Tooltip 
                contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e3a8a",
                borderRadius: "12px",
                color: "#ffffff",
              }}
              labelStyle={{
                color: "#cbd5e1",
              }}
              cursor={{
                fill: "rgba(59, 130, 246, 0.08)",
              }}
            />

            <Bar
              dataKey="value"
              radius={[0, 8, 8, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill="#3b82f6"
                />
              ))}
            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>
    </div>
  );
}

export default CohortCombinationChart;