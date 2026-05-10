const cohortConfig = [
  {
    title: "High Priority",
    cohortKey: "high_priority",
    description:
      "Patients requiring urgent clinical prioritization.",
  },

  {
    title: "Conversion Risk",
    cohortKey: "conversion_risk",
    description:
      "Patients likely to delay or decline procedures.",
  },

  {
    title: "Lost Follow-up",
    cohortKey: "lost_followup",
    description:
      "Patients disconnected from care coordination workflow.",
  },

  {
    title: "Procedure Pending",
    cohortKey: "procedure_pending",
    description:
      "Patients delayed in procedural progression workflows.",
  },
];

export default cohortConfig;