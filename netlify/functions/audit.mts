import type { Config } from "@netlify/functions";
import { callAgentJSON, jsonResponse, errorResponse, languageInstruction, type Language } from "./_lib/claude.mts";

/**
 * Agent 1 · Process Auditor
 * Reads a free-text description of a logistics/operations workflow (dispatch,
 * customer service, document handling, driver check-ins, reporting) and
 * produces a grounded understanding of it BEFORE recommending any
 * automation: bottlenecks, repetitive work, systems involved, human
 * decision points, risks, and a short list of automation opportunities —
 * each scored by automation potential and mapped to a recommended
 * intervention type (which can be "keep_human").
 */

interface Opportunity {
  opportunity: string;
  automation_potential: "low" | "medium" | "high";
  recommended_intervention:
    | "rpa_bot"
    | "conversational_bot"
    | "workday_automation"
    | "system_integration"
    | "document_processing"
    | "dashboard"
    | "keep_human";
  rationale: string;
}

interface AuditResult {
  current_process: string;
  bottlenecks: string[];
  repetitive_work: string[];
  systems_involved: string[];
  human_decision_points: string[];
  potential_risks: string[];
  opportunities: Opportunity[];
}

export default async (req: Request) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Use POST" }, 405);
  }

  try {
    const { process: workflow, focus, language } = (await req.json()) as {
      process?: string;
      focus?: string;
      language?: Language;
    };
    if (!workflow || workflow.trim().length < 20) {
      return jsonResponse(
        { error: "Describe the workflow with at least 20 characters." },
        400
      );
    }

    const audit = await callAgentJSON<AuditResult>({
      system: `You are a Digital Transformation & Automation Specialist auditing a
real logistics or operations workflow (dispatch, carrier/driver support,
customer service, document handling, Workday/ERP processes, reporting).
Your job is to understand how the process actually works TODAY before
recommending anything. Be concrete and grounded strictly in what the user
described — do not invent tools, systems, or team structure they did not
mention. If the description is vague about volume or frequency, say so
instead of guessing a number.${focus ? ` Focus the audit specifically on ${focus}.` : ""}${languageInstruction(language)}`,
      user: `Logistics/operations workflow described by the user:
"""
${workflow}
"""

Return a single JSON object with this exact shape:
{
  "current_process": string (<=40 words, restate what happens today in your own words),
  "bottlenecks": string[] (2-4 items, concrete),
  "repetitive_work": string[] (1-3 items),
  "systems_involved": string[] (1-3 items: TMS, ERP, CRM, Workday, SAP, spreadsheets, email/Teams, etc. mentioned or clearly implied),
  "human_decision_points": string[] (1-3 items: where judgment must stay human even after automating),
  "potential_risks": string[] (1-3 items: what could go wrong if this is automated carelessly, e.g. HAZMAT compliance, driver safety, customer trust),
  "opportunities": [
    {
      "opportunity": string,
      "automation_potential": "low"|"medium"|"high",
      "recommended_intervention": "rpa_bot"|"conversational_bot"|"workday_automation"|"system_integration"|"document_processing"|"dashboard"|"keep_human",
      "rationale": string (<=20 words)
    }
  ] (2-4 items, ordered by automation_potential descending)
}

Be honest: if something should stay human-led, use "keep_human" for it.
Match interventions to what they actually solve — do not recommend a
conversational bot for a pure data-processing task, or RPA for something
that requires judgment.`,
      maxTokens: 1400,
    });

    return jsonResponse({ audit });
  } catch (err) {
    return errorResponse(err);
  }
};

export const config: Config = {
  path: "/api/audit",
};
