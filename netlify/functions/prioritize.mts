import type { Config } from "@netlify/functions";
import { callAgentJSON, jsonResponse, errorResponse, languageInstruction, type Language } from "./_lib/claude.mts";

/**
 * Agent 2 · Prioritizer
 * Scores a list of automation opportunities on business impact vs.
 * implementation effort, plus frequency and risk, and places each into a
 * quadrant — without inventing ROI numbers that were never provided.
 */

interface MatrixRow {
  opportunity: string;
  business_impact: "low" | "medium" | "high";
  implementation_effort: "low" | "medium" | "high";
  frequency: string;
  risk: "low" | "medium" | "high";
  recommended_priority: "quick_win" | "strategic" | "experiment" | "low_priority";
}

interface PrioritizationResult {
  data_note: string;
  matrix: MatrixRow[];
}

export default async (req: Request) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Use POST" }, 405);
  }

  try {
    const { opportunities, language } = (await req.json()) as {
      opportunities?: unknown;
      language?: Language;
    };
    if (!opportunities || !Array.isArray(opportunities) || opportunities.length === 0) {
      return jsonResponse({ error: "A list of opportunities is required." }, 400);
    }

    const result = await callAgentJSON<PrioritizationResult>({
      system: `You are prioritizing automation opportunities for a logistics
operations team (dispatch, carrier/driver support, customer service,
back-office). Score each on business impact vs. implementation effort,
using only what was given — never invent a dollar figure or percentage
that wasn't stated.${languageInstruction(language)}`,
      user: `Automation opportunities to prioritize (JSON):
${JSON.stringify(opportunities)}

Return a single JSON object with this exact shape:
{
  "data_note": string (<=25 words: an honest note on what this scoring is/isn't based on),
  "matrix": [
    {
      "opportunity": string,
      "business_impact": "low"|"medium"|"high",
      "implementation_effort": "low"|"medium"|"high",
      "frequency": string (e.g. "daily", "per shipment", "weekly", or "not specified"),
      "risk": "low"|"medium"|"high",
      "recommended_priority": "quick_win"|"strategic"|"experiment"|"low_priority"
    }
  ] (one row per opportunity given, ordered with quick_win first)
}

quick_win = high impact + low/medium effort. strategic = high impact + high
effort. experiment = uncertain/medium impact + low effort. low_priority =
low impact regardless of effort.`,
      maxTokens: 1200,
    });

    return jsonResponse(result);
  } catch (err) {
    return errorResponse(err);
  }
};

export const config: Config = {
  path: "/api/prioritize",
};
