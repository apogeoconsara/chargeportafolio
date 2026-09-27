import type { Config } from "@netlify/functions";
import { callAgentJSON, jsonResponse, errorResponse, languageInstruction, type Language } from "./_lib/claude.mts";

/**
 * Agent 4 · Integration Architect
 * Designs a Workday business-process automation or an integration between
 * enterprise systems (Workday, ERP, CRM, TMS, SAP, HubSpot) via API/SQL —
 * directly demonstrating the role's "configure and support automations
 * within Workday" and "integrate automations with enterprise systems"
 * responsibilities.
 */

interface IntegrationBlueprint {
  pattern: "Workday business process automation" | "Workday custom report/integration" | "Point-to-point API integration" | "Middleware/iPaaS integration" | "Scheduled batch/SQL sync";
  problem: string;
  systems_involved: string[];
  trigger: string;
  data_flow_steps: string[];
  integration_method: string;
  error_handling: string;
  owner_and_approval: string;
  success_metrics: string[];
  risks: string[];
  implementation_steps: string[];
}

export default async (req: Request) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Use POST" }, 405);
  }

  try {
    const { opportunity, language } = (await req.json()) as {
      opportunity?: unknown;
      language?: Language;
    };
    if (!opportunity) {
      return jsonResponse({ error: "An integration/automation need is required." }, 400);
    }

    const blueprint = await callAgentJSON<IntegrationBlueprint>({
      system: `You are a Digital Transformation & Automation Specialist designing
an integration or Workday automation for a logistics company's enterprise
systems (Workday HCM, an ERP, a CRM such as HubSpot, a TMS, and/or SAP).
Ground the design strictly in what was described — do not invent field
names, endpoints, or systems not implied by it. Pick the pattern that
actually fits: not everything is a Workday business process, and not
everything needs real-time API calls when a scheduled batch/SQL sync would
do.${languageInstruction(language)}`,
      user: `Integration/automation need described by the user:
"""
${JSON.stringify(opportunity)}
"""

Return a single JSON object with this exact shape:
{
  "pattern": "Workday business process automation"|"Workday custom report/integration"|"Point-to-point API integration"|"Middleware/iPaaS integration"|"Scheduled batch/SQL sync",
  "problem": string (<=30 words, restated concretely),
  "systems_involved": string[] (2-3 items: name the specific systems, e.g. "Workday", "HubSpot CRM", "TMS", "SAP"),
  "trigger": string (<=20 words: what starts this — a new hire event, a status change, a schedule, a form submission),
  "data_flow_steps": string[] (3-5 items: the concrete sequence of what moves where),
  "integration_method": string (<=25 words: REST/SOAP API, Workday Studio/EIB, scheduled SQL job, webhook — be specific),
  "error_handling": string (<=25 words: what happens on failure — retry, alert, manual queue),
  "owner_and_approval": string (<=20 words: who owns this in steady state and who approves changes),
  "success_metrics": string[] (2-3 items, qualitative or structural, not invented numbers),
  "risks": string[] (2-3 items, each as "risk: mitigation"),
  "implementation_steps": string[] (3-5 concrete, sequential steps)
}`,
      maxTokens: 1500,
    });

    return jsonResponse({ blueprint });
  } catch (err) {
    return errorResponse(err);
  }
};

export const config: Config = {
  path: "/api/integration-blueprint",
};
