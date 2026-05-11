const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// llama-3.1-8b-instant: 20,000 TPM on free tier (vs 6,000 for 70b)
const MODEL = "llama-3.1-8b-instant";

// ---------------------------------------------
// Cache Layer
// ---------------------------------------------

const CACHE_PREFIX_INSIGHTS    = "heka_ai_insights_";
const CACHE_PREFIX_PROGRESSION = "heka_ai_progression_";
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function getCached(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // quota exceeded — ignore
  }
}

export function clearProgressionCache(patientId) {
  localStorage.removeItem(`${CACHE_PREFIX_PROGRESSION}${patientId}`);
}

export function clearInsightsCache(patientId) {
  localStorage.removeItem(`${CACHE_PREFIX_INSIGHTS}${patientId}`);
}

// ---------------------------------------------
// Core API Caller
// ---------------------------------------------

async function callGroq(prompt, forceJson = false) {
  try {
    const body = {
      model: MODEL,
      temperature: 0.3,
      max_tokens: 600,
      messages: [
        {
          role: "system",
          content:
            "You are an operational healthcare intelligence assistant. Generate concise, evidence-grounded operational summaries from structured patient JSON data. Never hallucinate medical facts. Never invent metrics. Focus on operational risk, care delays, follow-up concerns, and escalation reasoning.",
        },
        { role: "user", content: prompt },
      ],
    };

    if (forceJson) {
      body.response_format = { type: "json_object" };
    }

    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (response.status === 429) {
      console.warn("Groq rate limit hit (429).");
      return forceJson ? null : "RATE_LIMITED";
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq HTTP Error:", response.status, errorText);
      return forceJson ? null : "AI insight generation temporarily unavailable.";
    }

    const data = await response.json();
    console.log("Groq Response:", data);

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error("Invalid Groq Output:", data);
      return forceJson ? null : "AI generation failed.";
    }

    return content;
  } catch (error) {
    console.error("LLM Error:", error);
    return forceJson ? null : "AI insight generation temporarily unavailable.";
  }
}

// ---------------------------------------------
// JSON Parse Helper
// ---------------------------------------------

function parseJsonResponse(raw, requiredKeys) {
  if (!raw) return null;

  try {
    const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON object found");

    const parsed = JSON.parse(jsonMatch[0]);
    const allValid = requiredKeys.every((k) => typeof parsed[k] === "string");
    if (!allValid) throw new Error("Missing expected keys");

    return parsed;
  } catch (error) {
    console.error("JSON Parse Error:", error);
    console.error("Raw AI Response:", raw);
    return null;
  }
}

// ---------------------------------------------
// 1. Patient Insights (Clinical + Coordinator + Escalation)
// ---------------------------------------------

export async function generatePatientInsights(patient) {
  const patientId = patient?.patient_id;
  const cacheKey = `${CACHE_PREFIX_INSIGHTS}${patientId}`;

  if (patientId) {
    const cached = getCached(cacheKey);
    if (cached) {
      console.log("Serving AI insights from cache for:", patientId);
      return cached;
    }
  }

  const patientContext = {
    patient_id: patient.patient_id,
    demographics: patient.demographics,
    risk_analysis: {
      risk_level: patient.risk_analysis?.risk_level,
      risk_score: patient.risk_analysis?.risk_score,
      risk_factors: patient.risk_analysis?.risk_factors,
    },
    conversion_analysis: {
      conversion_risk: patient.conversion_analysis?.conversion_risk,
      conversion_barriers: patient.conversion_analysis?.conversion_barriers,
    },
    progression_analysis: {
      care_gaps: patient.progression_analysis?.care_gaps,
      procedure_delays: patient.progression_analysis?.procedure_delays,
      progression_summary: patient.progression_analysis?.progression_summary,
    },
    variance_analysis: {
      variance_flags: patient.variance_analysis?.variance_flags,
    },
  };

  const prompt = `
Patient operational data:
${JSON.stringify(patientContext, null, 2)}

Return a JSON object with exactly these three keys:
{
  "clinical_summary": "one plain sentence, max 50 words, operational risk focus",
  "coordinator_summary": "one plain sentence, max 50 words, care coordination focus",
  "escalation_reasoning": "one plain sentence, max 50 words, escalation justification"
}

No markdown. No bullet points. Plain strings only.
`;

  const raw = await callGroq(prompt, true);

  const rateLimitFallback = {
    clinical_summary: "Rate limit reached. Click Regenerate in ~1 minute.",
    coordinator_summary: "Rate limit reached. Click Regenerate in ~1 minute.",
    escalation_reasoning: "Rate limit reached. Click Regenerate in ~1 minute.",
    _rate_limited: true,
  };

  if (raw === "RATE_LIMITED") return rateLimitFallback;

  const parsed = parseJsonResponse(raw, [
    "clinical_summary",
    "coordinator_summary",
    "escalation_reasoning",
  ]);

  if (!parsed) {
    return {
      clinical_summary: "AI summary unavailable.",
      coordinator_summary: "Coordinator insight unavailable.",
      escalation_reasoning: "Escalation insight unavailable.",
    };
  }

  if (patientId) setCache(cacheKey, parsed);
  return parsed;
}

// ---------------------------------------------
// 2. Progression Intelligence (Longitudinal AI Reasoning)
// ---------------------------------------------

export async function generateProgressionAnalysis(patient) {
  const patientId = patient?.patient_id;
  const cacheKey = `${CACHE_PREFIX_PROGRESSION}${patientId}`;

  if (patientId) {
    const cached = getCached(cacheKey);
    if (cached) {
      console.log("Serving progression analysis from cache for:", patientId);
      return cached;
    }
  }

  // Only send progression-relevant fields to keep token usage lean
  const progressionContext = {
    patient_id: patient.patient_id,
    demographics: {
      name: patient.demographics?.name,
      age: patient.demographics?.age,
    },
    risk_analysis: {
      risk_level: patient.risk_analysis?.risk_level,
      risk_score: patient.risk_analysis?.risk_score,
      risk_factors: patient.risk_analysis?.risk_factors,
      high_risk_trend: patient.risk_analysis?.high_risk_trend,
    },
    progression_analysis: {
      progression_summary: patient.progression_analysis?.progression_summary,
      care_gaps: patient.progression_analysis?.care_gaps,
      procedure_delays: patient.progression_analysis?.procedure_delays,
      clinical_flags: patient.progression_analysis?.clinical_flags,
    },
    variance_analysis: {
      variance_flags: patient.variance_analysis?.variance_flags,
    },
    // Include timeline only as event labels, not full objects — saves tokens
    timeline_events: patient.timeline?.map((t) => t.event || t.type) ?? [],
  };

  const prompt = `
You are analyzing the longitudinal care trajectory of a patient.

Patient progression data:
${JSON.stringify(progressionContext, null, 2)}

Return a JSON object with exactly these three keys:

{
  "deterioration_summary": "Plain sentence summarizing whether the patient is deteriorating, stable, or at risk of worsening. Max 55 words. Ground in the actual risk factors, flags, and delays present.",
  "risk_trajectory": "Plain sentence describing the pattern of repeated or escalating risk indicators across the care timeline. Max 55 words. Reference specific gaps or delays if present.",
  "intervention_priority": "Plain sentence stating what operational intervention is most urgently needed and why. Max 55 words. Be specific to this patient's data."
}

Rules:
- Plain strings only. No markdown, no bullet points.
- Do not invent metrics or facts not present in the data.
- Write as an operational intelligence system, not a clinician.
`;

  const raw = await callGroq(prompt, true);

  const rateLimitFallback = {
    deterioration_summary: "Rate limit reached. Click Regenerate in ~1 minute.",
    risk_trajectory: "Rate limit reached. Click Regenerate in ~1 minute.",
    intervention_priority: "Rate limit reached. Click Regenerate in ~1 minute.",
    _rate_limited: true,
  };

  if (raw === "RATE_LIMITED") return rateLimitFallback;

  const parsed = parseJsonResponse(raw, [
    "deterioration_summary",
    "risk_trajectory",
    "intervention_priority",
  ]);

  if (!parsed) {
    return {
      deterioration_summary: "Progression analysis unavailable.",
      risk_trajectory: "Risk trajectory unavailable.",
      intervention_priority: "Intervention priority unavailable.",
    };
  }

  if (patientId) setCache(cacheKey, parsed);
  return parsed;
}