import type { Config } from "@netlify/functions";
import { callAgentJSON, jsonResponse, errorResponse, languageInstruction, type Language } from "./_lib/claude.mts";

/**
 * Agent 3 · Conversational Bot Designer
 * Designs a chatbot/conversational assistant (internal or customer-facing)
 * powered by Claude, for a logistics use case: shipment status, driver
 * check-ins, dispatch Q&A, HAZMAT/compliance lookups, carrier onboarding.
 * Always states an escalation path to a human — never full autonomy for
 * customer-facing safety or compliance topics.
 */

interface BotBlueprint {
  channel: "Customer-facing web/SMS" | "Internal Teams/Slack" | "Driver mobile app" | "Voice/IVR";
  problem: string;
  sample_user_message: string;
  sample_bot_reply: string;
  intents: string[];
  data_sources: string[];
  claude_role: string;
  escalation_rule: string;
  guardrails: string[];
  success_metrics: string[];
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
      return jsonResponse({ error: "A use case description is required." }, 400);
    }

    const blueprint = await callAgentJSON<BotBlueprint>({
      system: `You are a Digital Transformation & Automation Specialist designing
a conversational assistant (chatbot) for Charger Logistics, an asset-based
carrier handling dedicated, specialized, temperature-controlled and HAZMAT
freight. The bot can be internal-facing (dispatch, drivers, ops teams) or
customer-facing (shipment status, delivery windows, document requests).
Ground the design strictly in the use case described — do not invent
systems or volumes not implied by it.

Always include a clear escalation_rule to a human for anything involving
safety, HAZMAT compliance, pricing exceptions, or a frustrated/high-value
customer — a bot with no escalation path is not an acceptable design for
this domain.${languageInstruction(language)}`,
      user: `Use case described by the user:
"""
${JSON.stringify(opportunity)}
"""

Return a single JSON object with this exact shape:
{
  "channel": "Customer-facing web/SMS"|"Internal Teams/Slack"|"Driver mobile app"|"Voice/IVR",
  "problem": string (<=30 words, restated concretely),
  "sample_user_message": string (a realistic message a user would send this bot),
  "sample_bot_reply": string (<=60 words, a realistic, grounded reply — cite a plausible source like "TMS" or "load #" rather than inventing exact data),
  "intents": string[] (3-5 items: the request types this bot handles),
  "data_sources": string[] (2-4 items: TMS, ERP, Workday, CRM, a knowledge base, a tracking API — whatever is plausible for this use case),
  "claude_role": string (<=30 words: exactly what Claude does — classify intent, retrieve, draft a reply, summarize a document, etc.),
  "escalation_rule": string (<=25 words: the specific condition that hands this off to a human, and to whom),
  "guardrails": string[] (2-3 items: what the bot must never do autonomously in this domain),
  "success_metrics": string[] (2-3 items, qualitative or structural),
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
  path: "/api/design-bot",
};
