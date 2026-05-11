export function buildPatientEvidence(patient) {
  const evidence = [];

  // Clinical flags
  const flags =
    patient?.progression_analysis?.clinical_flags || [];

  flags.forEach((flag) => {
    const items = flag?.evidence || [];

    items.forEach((item) => {
      if (item.source_type === "lab") {
        evidence.push(
          `${item.field?.toUpperCase()}: ${item.value}`
        );
      }

      if (item.source_type === "vital") {
        evidence.push(
          `${item.field?.toUpperCase()}: ${item.value}`
        );
      }

      if (item.source_type === "diagnosis") {
        evidence.push(item.value);
      }

      if (item.source_type === "visit_gap") {
        evidence.push(item.value);
      }

      if (item.source_type === "procedure") {
        evidence.push(item.value);
      }
    });
  });

  // Care gaps
  const careGaps =
    patient?.progression_analysis?.care_gaps || [];

  careGaps.forEach((gap) => {
    const items = gap?.evidence || [];

    items.forEach((item) => {
      if (item?.value) {
        evidence.push(item.value);
      }
    });
  });

  // Procedure delays
  const delays =
    patient?.progression_analysis?.procedure_delays || [];

  delays.forEach((delay) => {
    const items = delay?.evidence || [];

    items.forEach((item) => {
      if (item?.value) {
        evidence.push(item.value);
      }
    });
  });

  return [...new Set(evidence)].slice(0, 6);
}