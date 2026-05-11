export function getProgressionStatus(patient) {
  const findings =
    patient?.progression_analysis?.progression_summary || [];

  const text = findings.join(" ").toLowerCase();

  let worseningScore = 0;
  let improvingScore = 0;

  // worsening indicators
  if (text.includes("uncontrolled")) worseningScore += 2;
  if (text.includes("elevated")) worseningScore += 2;
  if (text.includes("pending")) worseningScore += 1;
  if (text.includes("delay")) worseningScore += 1;
  if (text.includes("long gap")) worseningScore += 2;
  if (text.includes("active")) worseningScore += 1;

  // improving indicators
  if (text.includes("improving")) improvingScore += 2;
  if (text.includes("improved")) improvingScore += 2;
  if (text.includes("better")) improvingScore += 1;
  if (text.includes("stabilized")) improvingScore += 2;

  // determine trajectory
  if (worseningScore >= improvingScore + 2) {
    return {
      label: "Worsening",
      color:
        "border-red-500/30 bg-red-500/10 text-red-300",
    };
  }

  if (improvingScore > worseningScore) {
    return {
      label: "Improving",
      color:
        "border-green-500/30 bg-green-500/10 text-green-300",
    };
  }

  return {
    label: "Stable",
    color:
      "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
  };
}