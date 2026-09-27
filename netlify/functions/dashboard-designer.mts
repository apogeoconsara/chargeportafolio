import type { Config } from "@netlify/functions";
import { callAgentJSON, jsonResponse, errorResponse, languageInstruction, type Language } from "./_lib/claude.mts";

/**
 * Agent 6 · Dashboard Designer
 * Designs a KPI dashboard to monitor automation performance for a given
 * process — directly demonstrating "Build and maintain dashboards to
 * monitor automation performance and KPIs".
 */

interface KPI {
  name: string;
  formula: string;
  target_direction: "up" | "down" | "stable";
}

interface DashboardBlueprint {
  dashboard_title: string;
  audience: string;
  kpis: KPI[];
  data_sources: string[];
  refresh_cadence: string;
  alert_condition: string;
  chart_layout: string[];
}

export default async (req: Request) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Use POST" }, 405);
  }

  try {
    const { process: automation, language } = (await req.json()) as {
      process?: string;
      language?: Language;
    };
    if (!automation || automation.trim().length < 20) {
      return jsonResponse(
        { error: "Describe the automation with at least 20 characters." },
        400
      );
    }

    const blueprint = await callAgentJSON<DashboardBlueprint>({
      system: `You are designing a KPI dashboard spec (the kind built in Power BI,
Tableau, or a Workday report) to monitor the health and performance of an
automation or bot already in production at a logistics company. Ground
every KPI in what the automation described actually does — do not invent
metrics unrelated to it, and do not invent baseline numbers that weren't
given.${languageInstruction(language)}`,
      user: `Automation/bot to monitor, described by the user:
"""
${automation}
"""

Return a single JSON object with this exact shape:
{
  "dashboard_title": string (<=8 words),
  "audience": string (<=15 words: who looks at this dashboard and why),
  "kpis": [
    { "name": string, "formula": string (<=20 words, plain-language calculation), "target_direction": "up"|"down"|"stable" }
  ] (4-6 items: mix of volume, accuracy/error-rate, time-saved/cycle-time, and adoption/exception-rate metrics relevant to this specific automation),
  "data_sources": string[] (2-4 items: where each metric would actually come from — bot logs, TMS, Workday, ticketing system),
  "refresh_cadence": string (<=10 words, e.g. "daily batch refresh"),
  "alert_condition": string (<=20 words: the one condition that should trigger a proactive alert, e.g. an error-rate spike or a queue backing up),
  "chart_layout": string[] (3-5 items: the concrete visual for each key KPI, e.g. "Volume processed — trend line, last 30 days", "Exception rate — single stat with threshold color")
}`,
      maxTokens: 1300,
    });

    return jsonResponse({ blueprint });
  } catch (err) {
    return errorResponse(err);
  }
};

export const config: Config = {
  path: "/api/dashboard-designer",
};
