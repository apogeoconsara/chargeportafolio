# Automation & Digital Transformation Assistant — Sarahí Cruz Salazar

Built for the **Digital Transformation & Automation Specialist** role at **Charger Logistics**. One project,
one page: a single assistant with seven selectable goals, each mapped directly to a responsibility from the
job posting — chatbots (Claude, transferable to Dialogflow/Microsoft Bot Framework/Rasa), RPA workflows
(the trigger/validate/act pattern shared by UiPath/Automation Anywhere/Power Automate), Workday/ERP/CRM/TMS/SAP
integrations via REST/SOAP and SQL, OCR/IDP document processing, and KPI dashboards. EN by default, ES
available via the toggle in the header.

Cross-reference: [`portafolioaisiemens`](https://github.com/apogeoconsara/portafolioaisiemens) (live at
https://siemensaiportafolio.netlify.app) is a separate, deeper demo of the SAP FI/CO data-model side —
cost-center master data, governance checks, and a real in-browser SQL engine — linked from this page's
contact section as supporting evidence for the SAP/ERP requirement.

## Live vs. simulated

The console has seven tabs. Tab 01 (**Live AI Console**) makes **real calls to the Anthropic API** through the
Netlify Functions in `netlify/functions/` — pick a goal, describe a situation, and Claude generates the result
live. Requires `ANTHROPIC_API_KEY` in the Netlify environment; without it the function returns an explicit
error rather than faking a response.

Tabs 02–07 (Operations Copilot, Document Automation, RPA Workflow, Integration Map, Performance Dashboard,
Build vs Buy) are **deterministic client-side simulations** with synthetic logistics data — they illustrate
the mechanics (an RPA retry, an OCR confidence threshold, an integration topology) without an API call, and
the RPA one is deliberately rule-based because that workflow shouldn't need an LLM at all.

## The assistant (`index.html`)

Pick a goal, describe your situation in your own words, and the assistant runs the right specialized agent
against it:

| Goal | Agent(s) used | Backend | Job responsibility demonstrated |
|---|---|---|---|
| Audit an ops workflow | Process Auditor | `audit.mts` | Understand a process before automating it |
| Find automation opportunities | Process Auditor → Prioritizer | `audit.mts`, `prioritize.mts` | Collaborate to prioritize automation opportunities |
| Design a conversational bot | Bot Designer | `design-bot.mts` | Build chatbots/conversational assistants with Claude |
| Design a Workday/ERP integration | Integration Architect | `integration-blueprint.mts` | Configure Workday; integrate ERP/CRM/TMS/SAP via API/SQL |
| Process a freight document | Document Processor | `document-processor.mts` | OCR/Intelligent Document Processing (IDP) |
| Build a KPI dashboard | Dashboard Designer | `dashboard-designer.mts` | Monitor automation performance and KPIs |
| Document an automation | Documenter | `document-solution.mts` | Document automations; support monitoring & optimization |

All 7 functions accept a `language: "en"|"es"` field so the output matches whichever language is selected in
the header, while structural fields (badges, enum keys) stay in English so the UI never breaks.

Requires `ANTHROPIC_API_KEY` set in Netlify.

## Structure

```
index.html                          The Automation & Digital Transformation Assistant (homepage)
netlify/functions/
  _lib/claude.mts                     Anthropic client + JSON helper + language instruction
  audit.mts                           Process Auditor
  prioritize.mts                      Prioritizer
  design-bot.mts                      Bot Designer (conversational assistant blueprint)
  integration-blueprint.mts           Integration Architect (Workday/ERP/CRM/TMS/SAP)
  document-processor.mts              Document Processor (IDP simulation)
  dashboard-designer.mts               Dashboard Designer (KPI spec)
  document-solution.mts               Documenter (implementation/monitoring brief)
assets/css/style.css                 Base design tokens
assets/css/console.css               UI: objective picker, pipeline, result panels
assets/js/console.js                 Objective routing, i18n (EN/ES), orchestration
```

## Contact

sarahicruzsalazar@gmail.com
