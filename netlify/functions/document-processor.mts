import type { Config } from "@netlify/functions";
import { callAgentJSON, jsonResponse, errorResponse, languageInstruction, type Language } from "./_lib/claude.mts";

/**
 * Agent 5 · Document Processor (IDP)
 * Simulates an Intelligent Document Processing step: given a free-text
 * description of a freight document (Bill of Lading, Proof of Delivery,
 * carrier invoice, HAZMAT manifest), it extracts a structured field set and
 * flags anything low-confidence for human review — directly demonstrating
 * the "Familiarity with OCR/Intelligent Document Processing (IDP) tools"
 * requirement.
 */

interface ExtractedField {
  field: string;
  value: string;
  confidence: "low" | "medium" | "high";
}

interface DocumentResult {
  document_type: string;
  extracted_fields: ExtractedField[];
  flagged_for_review: string[];
  downstream_action: string;
  target_system: string;
  automation_note: string;
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
        { error: "Describe the document with at least 20 characters." },
        400
      );
    }

    const result = await callAgentJSON<DocumentResult>({
      system: `You are simulating an Intelligent Document Processing (IDP) step
for a logistics carrier — the kind of extraction that would normally run on
a scanned Bill of Lading, Proof of Delivery, carrier invoice, rate
confirmation, or HAZMAT manifest after OCR. You are NOT reading a real
scanned image; you are demonstrating the extraction logic and judgment an
IDP pipeline needs, based on the free-text description given. Never invent
specific values (names, dollar amounts, dates) that weren't in the
description or clearly implied — if a field is plausible but not stated,
mark it low confidence and explain why in flagged_for_review instead of
fabricating a number.${languageInstruction(language)}`,
      user: `Document described by the user:
"""
${description}
"""

Return a single JSON object with this exact shape:
{
  "document_type": string (e.g. "Bill of Lading", "Proof of Delivery", "Carrier Invoice", "HAZMAT Manifest", or "Unclear — needs classification"),
  "extracted_fields": [
    { "field": string, "value": string, "confidence": "low"|"medium"|"high" }
  ] (4-7 items: the fields this document type would typically carry, e.g. shipper, consignee, load/PO number, weight, delivery date, signature status — only fill "value" with something the description supports; otherwise say "not stated in source"),
  "flagged_for_review": string[] (1-3 items: what a human reviewer must check before this document is processed automatically),
  "downstream_action": string (<=25 words: what happens next once extraction is confirmed, e.g. match to TMS load, trigger invoice approval),
  "target_system": string (<=15 words: where this data would land, e.g. "TMS load record", "ERP AP module"),
  "automation_note": string (<=25 words: honest note on what confidence threshold would trigger full automation vs. human review)
}`,
      maxTokens: 1300,
    });

    return jsonResponse({ result });
  } catch (err) {
    return errorResponse(err);
  }
};

export const config: Config = {
  path: "/api/document-processor",
};
