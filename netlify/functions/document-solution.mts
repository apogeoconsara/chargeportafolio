import type { Config } from "@netlify/functions";
import { callAgentJSON, jsonResponse, errorResponse, languageInstruction, type Language } from "./_lib/claude.mts";

/**
 * Agent 7 · Automation Documenter
 * Turns a decided automation/bot/integration into an implementation brief
 * a team can run and support without the original builder — directly
 * demonstrating "Document automations following best practices; provide
 * ongoing monitoring, troubleshooting, and optimization".
 */

interface Brief {
  executive_summary: string;
  technical_approach: string;
  monitoring_and_troubleshooting: string;
  adoption_plan: string;
  metrics: string;
}

export default async (req: Request) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Use POST" }, 405);
  }

  try {
    const { description, language } = (await req.json()) as {
      description?: string;
      language?: Language;
    };
    if (!description || description.trim().length < 20) {
      return jsonResponse(
        { error: "Describe the automation with at least 20 characters." },
        400
      );
    }

    const brief = await callAgentJSON<Brief>({
      system: `You are writing implementation documentation for an automation,
bot, or integration already decided at a logistics company, so an ops or IT
team can run and support it without the original builder present. Ground
every section strictly in the description given — do not invent systems,
owners, or numbers that weren't stated.${languageInstruction(language)}`,
      user: `Automation/bot/integration already decided, described by the user:
"""
${description}
"""

Return a single JSON object with this exact shape:
{
  "executive_summary": string (<=80 words: what this is and why it matters, for a non-technical stakeholder),
  "technical_approach": string (<=120 words: how it works — systems, data flow, and the role of any LLM/API involved),
  "monitoring_and_troubleshooting": string (<=100 words: how to know it's healthy, where logs/errors surface, and the first steps when something breaks),
  "adoption_plan": string (<=80 words: how the team starts using/trusting it, including a human-in-the-loop period if relevant),
  "metrics": string (<=60 words: how success is measured)
}`,
      maxTokens: 1400,
    });

    return jsonResponse({ brief });
  } catch (err) {
    return errorResponse(err);
  }
};

export const config: Config = {
  path: "/api/document-solution",
};
