import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function AgeRiskChart({
  patients = [],
}) {

  const ageGroups = {
    "0-20": [],
    "21-40": [],
    "41-60": [],
    "60+": [],
  };

  patients.forEach((patient) => {

    const age = Number(patient?.age);
    const riskScore = Number(patient?.risk_score);

    if (
      Number.isNaN(age) ||
      Number.isNaN(riskScore)
    ) {
      return;
    }

    if (age <= 20) {
      ageGroups["0-20"].push(riskScore);
    }

    else if (age <= 40) {
      ageGroups["21-40"].push(riskScore);
    }

    else if (age <= 60) {
      ageGroups["41-60"].push(riskScore);
    }

    else {
      ageGroups["60+"].push(riskScore);
    }
  });

  const data = Object.entries(ageGroups).map(
    ([group, scores]) => {

      let averageRisk = 0;

      if (scores.length > 0) {

        const total = scores.reduce(
          (sum, score) => sum + score,
          0
        );

        averageRisk = Number(
          (total / scores.length).toFixed(1)
        );
      }

      return {
        ageGroup: group,
        averageRisk,
      };
    }
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <h2 className="text-2xl font-bold text-white mb-2">
        Age Risk Burden Analysis
      </h2>

      <p className="text-slate-400 text-sm mb-6">
        Average operational risk burden across patient age groups.
      </p>

      <div className="h-[380px]">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 10,
            }}
          >

            <defs>

              <linearGradient
                id="riskGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#60a5fa"
                  stopOpacity={0.55}
                />

                <stop
                  offset="100%"
                  stopColor="#60a5fa"
                  stopOpacity={0.03}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
            />

            <XAxis
              dataKey="ageGroup"
              tick={{ fill: "#cbd5e1" }}
              axisLine={{ stroke: "#334155" }}
              tickLine={false}
            />

            <YAxis
              domain={[0, 10]}
              tick={{ fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "12px",
                color: "#fff",
              }}
              labelStyle={{
                color: "#e2e8f0",
              }}
            />

            <Area
              type="monotone"
              dataKey="averageRisk"
              stroke="#60a5fa"
              strokeWidth={3}
              fill="url(#riskGradient)"
              dot={{
                r: 5,
                strokeWidth: 2,
                fill: "#60a5fa",
              }}
              activeDot={{
                r: 7,
              }}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}