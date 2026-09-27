const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = String(str ?? "");
  return div.innerHTML;
}

function fillList(el, items) {
  el.innerHTML = (items || []).map((i) => `<li>${escapeHtml(i)}</li>`).join("");
}

/* ============================================================
   i18n
   ============================================================ */

const I18N = {
  en: {
    "nav.assistant": "Assistant",
    "nav.how": "How it works",
    "nav.capabilities": "Capabilities",
    "nav.contact": "Contact",
    "hero.role": "Digital Transformation & Automation Specialist — Charger Logistics",
    "hero.h1": "One assistant. Seven ways to automate a logistics operation with AI.",
    "hero.lead": "Pick a goal, describe your situation, and watch the right specialized agent run — live, on your own words, powered by Claude.",
    "offer.label": "What I bring to this role",
    "offer.bots": "Build chatbots and conversational assistants, internal and customer-facing",
    "offer.claude": "Use Claude (Anthropic) to power intelligent workflows and document processing",
    "offer.integrations": "Design integrations across Workday, ERP, CRM, TMS and SAP",
    "offer.idp": "Extract structured data from freight documents (OCR/IDP judgment)",
    "offer.dashboards": "Build dashboards that monitor automation performance and KPIs",
    "common.tryExample": "Try an example",
    "panel.audit.title": "Workflow Audit",
    "panel.audit.bottlenecks": "Bottlenecks",
    "panel.audit.repetitive": "Repetitive work",
    "panel.audit.systems": "Systems involved",
    "panel.audit.decisions": "Human decision points",
    "panel.audit.risks": "Potential risks",
    "panel.audit.opportunities": "Automation opportunities",
    "panel.prioritize.title": "Opportunity Prioritization",
    "panel.prioritize.quickWin": "Quick win",
    "panel.prioritize.strategic": "Strategic",
    "panel.prioritize.experiment": "Experiment",
    "panel.prioritize.lowPriority": "Low priority",
    "panel.prioritize.col.opportunity": "Opportunity",
    "panel.prioritize.col.impact": "Business impact",
    "panel.prioritize.col.effort": "Implementation effort",
    "panel.prioritize.col.frequency": "Frequency",
    "panel.prioritize.col.risk": "Risk",
    "panel.prioritize.col.priority": "Priority",
    "panel.bot.title": "Conversational Bot Blueprint",
    "panel.bot.diagram.user": "User message",
    "panel.bot.diagram.claude": "Claude — intent + reply",
    "panel.bot.diagram.data": "TMS / ERP / Workday / KB",
    "panel.bot.diagram.escalation": "Escalation to human",
    "panel.bot.sampleUser": "Sample user message",
    "panel.bot.sampleReply": "Sample bot reply",
    "panel.bot.intents": "Intents handled",
    "panel.bot.dataSources": "Data sources",
    "panel.bot.claudeRole": "Claude's role",
    "panel.bot.escalation": "Escalation rule",
    "panel.bot.guardrails": "Guardrails",
    "panel.bot.metrics": "Success metrics",
    "panel.bot.steps": "Implementation steps",
    "panel.integration.title": "Integration Blueprint",
    "panel.integration.systems": "Systems involved",
    "panel.integration.trigger": "Trigger",
    "panel.integration.dataFlow": "Data flow",
    "panel.integration.method": "Integration method",
    "panel.integration.errors": "Error handling",
    "panel.integration.owner": "Owner & approval",
    "panel.integration.metrics": "Success metrics",
    "panel.integration.risks": "Risks",
    "panel.integration.steps": "Implementation steps",
    "panel.document.title": "Document Extraction (IDP)",
    "panel.document.col.field": "Field",
    "panel.document.col.value": "Extracted value",
    "panel.document.col.confidence": "Confidence",
    "panel.document.flagged": "Flagged for human review",
    "panel.document.downstream": "Downstream action",
    "panel.document.target": "Target system",
    "panel.document.note": "Automation note",
    "panel.dashboard.sources": "Data sources",
    "panel.dashboard.cadence": "Refresh cadence",
    "panel.dashboard.layout": "Chart layout",
    "panel.docs.title": "Automation Documentation",
    "panel.docs.tab.summary": "Executive Summary",
    "panel.docs.tab.approach": "Technical Approach",
    "panel.docs.tab.monitoring": "Monitoring & Troubleshooting",
    "panel.docs.tab.adoption": "Adoption Plan",
    "panel.docs.tab.metrics": "Metrics",
    "panel.docs.download": "Download as Markdown",
    "how.title": "How it works",
    "how.intro": "One goal picker routes your input to the right specialized agent — each one mapped directly to a responsibility of the Digital Transformation & Automation Specialist role.",
    "how.auditor.name": "Process Auditor",
    "how.auditor.desc": "Understands the operational workflow before recommending anything.",
    "how.prioritizer.name": "Prioritizer",
    "how.prioritizer.desc": "Scores impact vs. effort — no invented ROI.",
    "how.botDesigner.name": "Bot Designer",
    "how.botDesigner.desc": "Designs conversational assistants with a real escalation path.",
    "how.integrationArchitect.name": "Integration Architect",
    "how.integrationArchitect.desc": "Designs Workday and enterprise-system automations.",
    "how.documentProcessor.name": "Document Processor",
    "how.documentProcessor.desc": "Extracts structured fields and flags what needs human review.",
    "how.dashboardDesigner.name": "Dashboard Designer",
    "how.dashboardDesigner.desc": "Defines the KPIs that prove an automation is working.",
    "how.documenter.name": "Documenter",
    "how.documenter.desc": "Turns a decision into something a team can run without me.",
    "how.col.goal": "Goal",
    "how.col.agent": "Agent(s) used",
    "how.col.responsibility": "Job responsibility demonstrated",
    "how.row.audit": "Prioritize automation opportunities",
    "how.row.opportunities": "Collaborate to prioritize automation opportunities",
    "how.row.bot": "Build chatbots/conversational assistants with Claude",
    "how.row.integration": "Configure Workday and integrate ERP/CRM/TMS/SAP",
    "how.row.document": "OCR/IDP document processing",
    "how.row.dashboard": "Monitor automation performance and KPIs",
    "how.row.docs": "Document automations; support monitoring and optimization",
    "cap.title": "What this demonstrates",
    "cap.intro": "Every result above is generated live by Claude when you run it — nothing on this page is pre-written.",
    "cap.rpa": "RPA & workflow automation",
    "cap.bots": "Chatbots & conversational assistants",
    "cap.claude": "Claude (Anthropic) / LLM integration",
    "cap.workday": "Workday configuration & business process automation",
    "cap.api": "API (REST/SOAP) & SQL integration",
    "cap.idp": "OCR / Intelligent Document Processing",
    "cap.dashboards": "Dashboards & KPI monitoring",
    "cap.docs": "Documentation & enablement",
    "cap.judgment": "Implementation judgment — right tool for the job",
    "contact.title": "Contact",
    "contact.line": "Available to discuss the Digital Transformation & Automation Specialist role at Charger Logistics.",
    "contact.additional": "View additional work →",
    "footer.built": "Built with Netlify Functions + Claude (Anthropic)",
    "obj.audit.label": "Audit an ops workflow",
    "obj.audit.field": "Describe a logistics/ops workflow",
    "obj.audit.placeholder": "Dispatch manually re-keys carrier rate confirmations from email into the TMS every day, and cross-checks HAZMAT documentation by hand before releasing a load.",
    "obj.audit.run": "Analyze workflow",
    "obj.opportunities.label": "Find automation opportunities",
    "obj.opportunities.field": "Describe a logistics/ops workflow",
    "obj.opportunities.placeholder": "Customer service answers the same 'where is my shipment' questions all day by manually checking the TMS and replying over email.",
    "obj.opportunities.run": "Find opportunities",
    "obj.bot.label": "Design a conversational bot",
    "obj.bot.field": "Describe the bot use case",
    "obj.bot.placeholder": "Drivers text dispatch asking for their next load's pickup address and delivery window instead of checking the app.",
    "obj.bot.run": "Design bot",
    "obj.integration.label": "Design a Workday/ERP integration",
    "obj.integration.field": "Describe the integration or Workday need",
    "obj.integration.placeholder": "When a new driver is hired in Workday, ops still manually creates their profile in the TMS and adds them to the HubSpot dispatch list.",
    "obj.integration.run": "Design integration",
    "obj.document.label": "Process a freight document",
    "obj.document.field": "Describe the document to extract",
    "obj.document.placeholder": "A signed Proof of Delivery scanned by the driver, showing consignee name, delivery date/time, and a note about one damaged pallet.",
    "obj.document.run": "Extract fields",
    "obj.dashboard.label": "Build a KPI dashboard",
    "obj.dashboard.field": "Describe the automation to monitor",
    "obj.dashboard.placeholder": "A bot that auto-extracts rate confirmations from carrier emails and creates the load in the TMS, running since last month.",
    "obj.dashboard.run": "Build dashboard",
    "obj.docs.label": "Document an automation",
    "obj.docs.field": "Describe an automation that's already decided",
    "obj.docs.placeholder": "We're building a Claude-powered bot that reads incoming carrier invoices, matches them to the TMS load, and flags mismatches for AP review.",
    "obj.docs.run": "Generate documentation",
  },
  es: {
    "nav.assistant": "Asistente",
    "nav.how": "Cómo funciona",
    "nav.capabilities": "Capacidades",
    "nav.contact": "Contacto",
    "hero.role": "Digital Transformation & Automation Specialist — Charger Logistics",
    "hero.h1": "Un asistente. Siete formas de automatizar una operación logística con IA.",
    "hero.lead": "Elige un objetivo, describe tu situación, y observa el agente especializado correcto ejecutarse — en vivo, con tus propias palabras, con Claude.",
    "offer.label": "Qué aporto a este puesto",
    "offer.bots": "Construir chatbots y asistentes conversacionales, internos y de cara al cliente",
    "offer.claude": "Usar Claude (Anthropic) para potenciar flujos inteligentes y procesamiento de documentos",
    "offer.integrations": "Diseñar integraciones entre Workday, ERP, CRM, TMS y SAP",
    "offer.idp": "Extraer datos estructurados de documentos de carga (criterio OCR/IDP)",
    "offer.dashboards": "Construir dashboards que monitorean el desempeño de las automatizaciones y sus KPIs",
    "common.tryExample": "Probar un ejemplo",
    "panel.audit.title": "Auditoría del flujo de trabajo",
    "panel.audit.bottlenecks": "Cuellos de botella",
    "panel.audit.repetitive": "Trabajo repetitivo",
    "panel.audit.systems": "Sistemas involucrados",
    "panel.audit.decisions": "Puntos de decisión humana",
    "panel.audit.risks": "Riesgos potenciales",
    "panel.audit.opportunities": "Oportunidades de automatización",
    "panel.prioritize.title": "Priorización de oportunidades",
    "panel.prioritize.quickWin": "Quick win",
    "panel.prioritize.strategic": "Estratégico",
    "panel.prioritize.experiment": "Experimento",
    "panel.prioritize.lowPriority": "Baja prioridad",
    "panel.prioritize.col.opportunity": "Oportunidad",
    "panel.prioritize.col.impact": "Impacto de negocio",
    "panel.prioritize.col.effort": "Esfuerzo de implementación",
    "panel.prioritize.col.frequency": "Frecuencia",
    "panel.prioritize.col.risk": "Riesgo",
    "panel.prioritize.col.priority": "Prioridad",
    "panel.bot.title": "Blueprint del bot conversacional",
    "panel.bot.diagram.user": "Mensaje del usuario",
    "panel.bot.diagram.claude": "Claude — intención + respuesta",
    "panel.bot.diagram.data": "TMS / ERP / Workday / KB",
    "panel.bot.diagram.escalation": "Escalamiento a humano",
    "panel.bot.sampleUser": "Mensaje de ejemplo del usuario",
    "panel.bot.sampleReply": "Respuesta de ejemplo del bot",
    "panel.bot.intents": "Intenciones que maneja",
    "panel.bot.dataSources": "Fuentes de datos",
    "panel.bot.claudeRole": "Rol de Claude",
    "panel.bot.escalation": "Regla de escalamiento",
    "panel.bot.guardrails": "Guardrails",
    "panel.bot.metrics": "Métricas de éxito",
    "panel.bot.steps": "Pasos de implementación",
    "panel.integration.title": "Blueprint de integración",
    "panel.integration.systems": "Sistemas involucrados",
    "panel.integration.trigger": "Disparador",
    "panel.integration.dataFlow": "Flujo de datos",
    "panel.integration.method": "Método de integración",
    "panel.integration.errors": "Manejo de errores",
    "panel.integration.owner": "Dueño y aprobación",
    "panel.integration.metrics": "Métricas de éxito",
    "panel.integration.risks": "Riesgos",
    "panel.integration.steps": "Pasos de implementación",
    "panel.document.title": "Extracción de documento (IDP)",
    "panel.document.col.field": "Campo",
    "panel.document.col.value": "Valor extraído",
    "panel.document.col.confidence": "Confianza",
    "panel.document.flagged": "Marcado para revisión humana",
    "panel.document.downstream": "Acción posterior",
    "panel.document.target": "Sistema destino",
    "panel.document.note": "Nota de automatización",
    "panel.dashboard.sources": "Fuentes de datos",
    "panel.dashboard.cadence": "Frecuencia de actualización",
    "panel.dashboard.layout": "Disposición de gráficos",
    "panel.docs.title": "Documentación de automatización",
    "panel.docs.tab.summary": "Resumen ejecutivo",
    "panel.docs.tab.approach": "Enfoque técnico",
    "panel.docs.tab.monitoring": "Monitoreo y resolución",
    "panel.docs.tab.adoption": "Plan de adopción",
    "panel.docs.tab.metrics": "Métricas",
    "panel.docs.download": "Descargar como Markdown",
    "how.title": "Cómo funciona",
    "how.intro": "Un selector de objetivo enruta tu descripción hacia el agente especializado correcto — cada uno mapeado directamente a una responsabilidad del puesto de Digital Transformation & Automation Specialist.",
    "how.auditor.name": "Auditor de procesos",
    "how.auditor.desc": "Entiende el flujo operativo antes de recomendar cualquier cosa.",
    "how.prioritizer.name": "Priorizador",
    "how.prioritizer.desc": "Puntúa impacto vs. esfuerzo — sin inventar ROI.",
    "how.botDesigner.name": "Diseñador de bots",
    "how.botDesigner.desc": "Diseña asistentes conversacionales con una ruta real de escalamiento.",
    "how.integrationArchitect.name": "Arquitecto de integración",
    "how.integrationArchitect.desc": "Diseña automatizaciones de Workday y sistemas empresariales.",
    "how.documentProcessor.name": "Procesador de documentos",
    "how.documentProcessor.desc": "Extrae campos estructurados y marca lo que necesita revisión humana.",
    "how.dashboardDesigner.name": "Diseñador de dashboards",
    "how.dashboardDesigner.desc": "Define los KPIs que demuestran que una automatización funciona.",
    "how.documenter.name": "Documentador",
    "how.documenter.desc": "Convierte una decisión en algo que el equipo puede operar sin mí.",
    "how.col.goal": "Objetivo",
    "how.col.agent": "Agente(s) usados",
    "how.col.responsibility": "Responsabilidad del puesto que demuestra",
    "how.row.audit": "Priorizar oportunidades de automatización",
    "how.row.opportunities": "Colaborar para priorizar oportunidades de automatización",
    "how.row.bot": "Construir chatbots/asistentes conversacionales con Claude",
    "how.row.integration": "Configurar Workday e integrar ERP/CRM/TMS/SAP",
    "how.row.document": "Procesamiento de documentos OCR/IDP",
    "how.row.dashboard": "Monitorear el desempeño de automatizaciones y KPIs",
    "how.row.docs": "Documentar automatizaciones; dar soporte a monitoreo y optimización",
    "cap.title": "Qué demuestra esto",
    "cap.intro": "Cada resultado de arriba se genera en vivo con Claude al ejecutarlo — nada en esta página está preescrito.",
    "cap.rpa": "RPA y automatización de flujos",
    "cap.bots": "Chatbots y asistentes conversacionales",
    "cap.claude": "Integración de Claude (Anthropic) / LLMs",
    "cap.workday": "Configuración de Workday y automatización de procesos de negocio",
    "cap.api": "Integración vía API (REST/SOAP) y SQL",
    "cap.idp": "OCR / Procesamiento inteligente de documentos",
    "cap.dashboards": "Dashboards y monitoreo de KPIs",
    "cap.docs": "Documentación y habilitación",
    "cap.judgment": "Criterio de implementación — la herramienta correcta para cada caso",
    "contact.title": "Contacto",
    "contact.line": "Disponible para conversar sobre la posición de Digital Transformation & Automation Specialist en Charger Logistics.",
    "contact.additional": "Ver más trabajo →",
    "footer.built": "Construido con Netlify Functions + Claude (Anthropic)",
    "obj.audit.label": "Auditar un flujo operativo",
    "obj.audit.field": "Describe un flujo logístico/operativo",
    "obj.audit.placeholder": "Dispatch re-captura a mano las confirmaciones de tarifa de los transportistas desde el correo hacia el TMS cada día, y revisa a mano la documentación HAZMAT antes de liberar una carga.",
    "obj.audit.run": "Analizar flujo",
    "obj.opportunities.label": "Encontrar oportunidades de automatización",
    "obj.opportunities.field": "Describe un flujo logístico/operativo",
    "obj.opportunities.placeholder": "Servicio al cliente responde todo el día la misma pregunta de '¿dónde está mi envío?' revisando el TMS a mano y contestando por correo.",
    "obj.opportunities.run": "Encontrar oportunidades",
    "obj.bot.label": "Diseñar un bot conversacional",
    "obj.bot.field": "Describe el caso de uso del bot",
    "obj.bot.placeholder": "Los conductores le escriben a dispatch preguntando la dirección de recogida y la ventana de entrega de su siguiente carga en lugar de revisar la app.",
    "obj.bot.run": "Diseñar bot",
    "obj.integration.label": "Diseñar una integración Workday/ERP",
    "obj.integration.field": "Describe la necesidad de integración o de Workday",
    "obj.integration.placeholder": "Cuando se contrata a un conductor nuevo en Workday, operaciones todavía crea su perfil a mano en el TMS y lo agrega a la lista de dispatch en HubSpot.",
    "obj.integration.run": "Diseñar integración",
    "obj.document.label": "Procesar un documento de carga",
    "obj.document.field": "Describe el documento a extraer",
    "obj.document.placeholder": "Un Proof of Delivery firmado y escaneado por el conductor, con el nombre del consignatario, fecha/hora de entrega y una nota sobre un tarima dañada.",
    "obj.document.run": "Extraer campos",
    "obj.dashboard.label": "Construir un dashboard de KPIs",
    "obj.dashboard.field": "Describe la automatización a monitorear",
    "obj.dashboard.placeholder": "Un bot que extrae automáticamente las confirmaciones de tarifa de los correos de transportistas y crea la carga en el TMS, funcionando desde el mes pasado.",
    "obj.dashboard.run": "Construir dashboard",
    "obj.docs.label": "Documentar una automatización",
    "obj.docs.field": "Describe una automatización ya decidida",
    "obj.docs.placeholder": "Vamos a construir un bot con Claude que lee las facturas entrantes de transportistas, las cruza con la carga en el TMS, y marca discrepancias para revisión de cuentas por pagar.",
    "obj.docs.run": "Generar documentación",
  },
};

let currentLang = localStorage.getItem("lang") === "es" ? "es" : "en";

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
}

function applyStaticTranslations() {
  $$("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  $$("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.documentElement.lang = currentLang;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  $("#lang-en").classList.toggle("active", lang === "en");
  $("#lang-es").classList.toggle("active", lang === "es");
  applyStaticTranslations();
  applyObjective(currentObjective, { keepInput: true });
}

$("#lang-en").addEventListener("click", () => setLang("en"));
$("#lang-es").addEventListener("click", () => setLang("es"));

/* ============================================================
   Objectives
   ============================================================ */

const OBJECTIVES = {
  audit: { steps: ["auditor"] },
  opportunities: { steps: ["auditor", "prioritizer"] },
  bot: { steps: ["botDesigner"] },
  integration: { steps: ["integrationArchitect"] },
  document: { steps: ["documentProcessor"] },
  dashboard: { steps: ["dashboardDesigner"] },
  docs: { steps: ["documenter"] },
};

const STEP_LABEL_KEY = {
  auditor: "how.auditor.name",
  prioritizer: "how.prioritizer.name",
  botDesigner: "how.botDesigner.name",
  integrationArchitect: "how.integrationArchitect.name",
  documentProcessor: "how.documentProcessor.name",
  dashboardDesigner: "how.dashboardDesigner.name",
  documenter: "how.documenter.name",
};

let currentObjective = "audit";

const elInput = $("#workflow-input");
const elInputLabel = $("#input-label");
const elBtnRun = $("#btn-run");
const elBtnExample = $("#btn-example");
const elError = $("#error-msg");
const elPipeline = $("#pipeline");

function applyObjective(objective, opts = {}) {
  currentObjective = objective;
  $$(".objective-chip").forEach((chip) => chip.classList.toggle("active", chip.dataset.objective === objective));

  elInputLabel.textContent = t(`obj.${objective}.field`);
  elInput.placeholder = t(`obj.${objective}.placeholder`);
  elBtnRun.textContent = t(`obj.${objective}.run`);
  if (!opts.keepInput) elInput.value = "";

  renderPipelineStages(OBJECTIVES[objective].steps);
  resetResults();
}

function renderPipelineStages(steps) {
  elPipeline.innerHTML = steps
    .map(
      (step, i) => `
      ${i > 0 ? '<div class="pipeline-arrow">→</div>' : ""}
      <div class="pipeline-stage" data-stage="${step}">
        <span class="pipeline-num">0${i + 1}</span>
        <span class="pipeline-name">${escapeHtml(t(STEP_LABEL_KEY[step]))}</span>
      </div>`
    )
    .join("");
}

$$(".objective-chip").forEach((chip) => {
  chip.addEventListener("click", () => applyObjective(chip.dataset.objective));
});

$("#btn-example").addEventListener("click", () => {
  elInput.value = t(`obj.${currentObjective}.placeholder`);
});

/* ============================================================
   Console log + pipeline stage status
   ============================================================ */

const elLog = $("#console-log");

function log(msg, type) {
  const line = document.createElement("div");
  line.className = "console-line" + (type ? ` ${type}` : "");
  const time = new Date().toLocaleTimeString("en-US", { hour12: false });
  line.innerHTML = `<span class="t">${time}</span>${escapeHtml(msg)}`;
  elLog.appendChild(line);
  elLog.scrollTop = elLog.scrollHeight;
}

function setStage(step, status) {
  const el = elPipeline.querySelector(`[data-stage="${step}"]`);
  if (!el) return;
  el.classList.remove("active", "done", "error");
  if (status) el.classList.add(status);
}

async function callAgent(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, language: currentLang }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Error calling ${path}`);
  return data;
}

async function runStep(step, path, body, onSuccess) {
  setStage(step, "active");
  log(`→ ${t(STEP_LABEL_KEY[step])}: sending request to Claude...`);
  const start = performance.now();
  try {
    const data = await callAgent(path, body);
    const elapsed = ((performance.now() - start) / 1000).toFixed(1);
    setStage(step, "done");
    const summary = onSuccess(data);
    log(`✓ ${t(STEP_LABEL_KEY[step])}: ${summary} (${elapsed}s)`, "ok");
    return data;
  } catch (err) {
    setStage(step, "error");
    log(`✗ ${t(STEP_LABEL_KEY[step])}: ${err.message}`, "err");
    throw err;
  }
}

/* ============================================================
   Rendering: Audit
   ============================================================ */

const INTERVENTION_LABEL = {
  rpa_bot: "RPA Bot",
  conversational_bot: "Conversational Bot",
  workday_automation: "Workday Automation",
  system_integration: "System Integration",
  document_processing: "Document Processing",
  dashboard: "Dashboard",
  keep_human: "Keep Human",
};

function renderAudit(audit) {
  const panel = $("#panel-audit");
  panel.querySelector('[data-field="current_process"]').textContent = audit.current_process;
  fillList(panel.querySelector('[data-field="bottlenecks"]'), audit.bottlenecks);
  fillList(panel.querySelector('[data-field="repetitive_work"]'), audit.repetitive_work);
  fillList(panel.querySelector('[data-field="systems_involved"]'), audit.systems_involved);
  fillList(panel.querySelector('[data-field="human_decision_points"]'), audit.human_decision_points);
  fillList(panel.querySelector('[data-field="potential_risks"]'), audit.potential_risks);

  const list = panel.querySelector('[data-field="opportunities"]');
  list.innerHTML = audit.opportunities
    .map(
      (o) => `
      <div class="opportunity-item">
        <span class="opportunity-text">${escapeHtml(o.opportunity)}<span class="opportunity-rationale">${escapeHtml(o.rationale)}</span></span>
        <span class="badge badge-${o.automation_potential}">${o.automation_potential} potential</span>
        <span class="badge badge-intervention">${INTERVENTION_LABEL[o.recommended_intervention] || o.recommended_intervention}</span>
      </div>`
    )
    .join("");

  panel.hidden = false;
}

/* ============================================================
   Rendering: Prioritization
   ============================================================ */

const PRIORITY_LABEL_KEY = {
  quick_win: "panel.prioritize.quickWin",
  strategic: "panel.prioritize.strategic",
  experiment: "panel.prioritize.experiment",
  low_priority: "panel.prioritize.lowPriority",
};

function renderPrioritization(payload) {
  const panel = $("#panel-prioritize");
  panel.querySelector('[data-field="data_note"]').textContent = payload.data_note;

  $$(".quadrant-items").forEach((el) => (el.innerHTML = ""));
  payload.matrix.forEach((row) => {
    const cell = panel.querySelector(`.quadrant-cell[data-quadrant="${row.recommended_priority}"] .quadrant-items`);
    if (cell) {
      const chip = document.createElement("span");
      chip.className = "quadrant-chip";
      chip.textContent = row.opportunity;
      cell.appendChild(chip);
    }
  });

  const tbody = panel.querySelector('[data-field="matrix-rows"]');
  tbody.innerHTML = payload.matrix
    .map(
      (row) => `
      <tr>
        <td>${escapeHtml(row.opportunity)}</td>
        <td><span class="badge badge-${row.business_impact}">${row.business_impact}</span></td>
        <td><span class="badge badge-${row.implementation_effort}">${row.implementation_effort}</span></td>
        <td>${escapeHtml(row.frequency)}</td>
        <td><span class="badge badge-${row.risk}">${row.risk}</span></td>
        <td><strong>${escapeHtml(t(PRIORITY_LABEL_KEY[row.recommended_priority]) || row.recommended_priority)}</strong></td>
      </tr>`
    )
    .join("");

  panel.hidden = false;
}

/* ============================================================
   Rendering: Conversational bot blueprint
   ============================================================ */

function renderBotBlueprint(blueprint) {
  const panel = $("#panel-bot");
  panel.querySelector('[data-field="channel"]').textContent = blueprint.channel;
  panel.querySelector('[data-field="problem"]').textContent = blueprint.problem;
  panel.querySelector('[data-field="sample_user_message"]').textContent = blueprint.sample_user_message;
  panel.querySelector('[data-field="sample_bot_reply"]').textContent = blueprint.sample_bot_reply;
  fillList(panel.querySelector('[data-field="intents"]'), blueprint.intents);
  fillList(panel.querySelector('[data-field="data_sources"]'), blueprint.data_sources);
  panel.querySelector('[data-field="claude_role"]').textContent = blueprint.claude_role;
  panel.querySelector('[data-field="escalation_rule"]').textContent = blueprint.escalation_rule;
  fillList(panel.querySelector('[data-field="guardrails"]'), blueprint.guardrails);
  fillList(panel.querySelector('[data-field="success_metrics"]'), blueprint.success_metrics);
  fillList(panel.querySelector('[data-field="implementation_steps"]'), blueprint.implementation_steps);
  panel.hidden = false;
}

/* ============================================================
   Rendering: Integration blueprint
   ============================================================ */

function renderIntegrationBlueprint(blueprint) {
  const panel = $("#panel-integration");
  panel.querySelector('[data-field="pattern"]').textContent = blueprint.pattern;
  panel.querySelector('[data-field="problem"]').textContent = blueprint.problem;
  fillList(panel.querySelector('[data-field="systems_involved"]'), blueprint.systems_involved);
  panel.querySelector('[data-field="trigger"]').textContent = blueprint.trigger;
  fillList(panel.querySelector('[data-field="data_flow_steps"]'), blueprint.data_flow_steps);
  panel.querySelector('[data-field="integration_method"]').textContent = blueprint.integration_method;
  panel.querySelector('[data-field="error_handling"]').textContent = blueprint.error_handling;
  panel.querySelector('[data-field="owner_and_approval"]').textContent = blueprint.owner_and_approval;
  fillList(panel.querySelector('[data-field="success_metrics"]'), blueprint.success_metrics);
  fillList(panel.querySelector('[data-field="risks"]'), blueprint.risks);
  fillList(panel.querySelector('[data-field="implementation_steps"]'), blueprint.implementation_steps);
  panel.hidden = false;
}

/* ============================================================
   Rendering: Document processor (IDP)
   ============================================================ */

function renderDocumentResult(result) {
  const panel = $("#panel-document");
  panel.querySelector('[data-field="document_type"]').textContent = result.document_type;

  const tbody = panel.querySelector('[data-field="extracted_fields"]');
  tbody.innerHTML = result.extracted_fields
    .map(
      (f) => `
      <tr>
        <td>${escapeHtml(f.field)}</td>
        <td>${escapeHtml(f.value)}</td>
        <td><span class="badge badge-${f.confidence}">${f.confidence}</span></td>
      </tr>`
    )
    .join("");

  fillList(panel.querySelector('[data-field="flagged_for_review"]'), result.flagged_for_review);
  panel.querySelector('[data-field="downstream_action"]').textContent = result.downstream_action;
  panel.querySelector('[data-field="target_system"]').textContent = result.target_system;
  panel.querySelector('[data-field="automation_note"]').textContent = result.automation_note;
  panel.hidden = false;
}

/* ============================================================
   Rendering: KPI dashboard
   ============================================================ */

const DIRECTION_ARROW = { up: "▲", down: "▼", stable: "→" };

function renderDashboardBlueprint(blueprint) {
  const panel = $("#panel-dashboard");
  panel.querySelector('[data-field="dashboard_title"]').textContent = blueprint.dashboard_title;
  panel.querySelector('[data-field="audience"]').textContent = blueprint.audience;

  const kpiGrid = panel.querySelector('[data-field="kpis"]');
  kpiGrid.innerHTML = blueprint.kpis
    .map(
      (k) => `
      <div class="kpi-card">
        <div class="kpi-name"><span class="kpi-direction">${DIRECTION_ARROW[k.target_direction] || ""}</span>${escapeHtml(k.name)}</div>
        <p class="kpi-formula">${escapeHtml(k.formula)}</p>
      </div>`
    )
    .join("");

  fillList(panel.querySelector('[data-field="data_sources"]'), blueprint.data_sources);
  panel.querySelector('[data-field="refresh_cadence"]').textContent = blueprint.refresh_cadence;

  const layoutList = panel.querySelector('[data-field="chart_layout"]');
  layoutList.innerHTML = blueprint.chart_layout
    .map((item) => `<div class="chart-layout-item">${escapeHtml(item)}</div>`)
    .join("");

  panel.querySelector('[data-field="alert_condition"]').textContent = "⚠ " + blueprint.alert_condition;
  panel.hidden = false;
}

/* ============================================================
   Rendering: Automation documentation
   ============================================================ */

let lastDocsMarkdown = "";

function renderDocsBrief(brief) {
  const panel = $("#panel-docs");
  Object.keys(brief).forEach((key) => {
    const el = panel.querySelector(`[data-brief-panel="${key}"]`);
    if (el) el.textContent = brief[key];
  });

  lastDocsMarkdown = `# Automation Documentation

## Executive Summary
${brief.executive_summary}

## Technical Approach
${brief.technical_approach}

## Monitoring & Troubleshooting
${brief.monitoring_and_troubleshooting}

## Adoption Plan
${brief.adoption_plan}

## Metrics
${brief.metrics}
`;

  panel.hidden = false;
}

$$("#brief-tabs .tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$("#brief-tabs .tab-btn").forEach((b) => b.classList.toggle("active", b === btn));
    $$(".brief-panel").forEach((p) => p.classList.toggle("active", p.dataset.briefPanel === btn.dataset.briefTab));
  });
});

$("#btn-download-docs").addEventListener("click", () => {
  const blob = new Blob([lastDocsMarkdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "automation-documentation.md";
  a.click();
  URL.revokeObjectURL(url);
});

/* ============================================================
   Orchestration
   ============================================================ */

function resetResults() {
  elError.hidden = true;
  elLog.innerHTML = "";
  ["audit", "prioritize", "bot", "integration", "document", "dashboard", "docs"].forEach((name) => {
    $(`#panel-${name}`).hidden = true;
  });
}

elBtnRun.addEventListener("click", runAssistant);

async function runAssistant() {
  const input = elInput.value.trim();
  const minLen = 20;
  resetResults();
  $$(".pipeline-stage").forEach((el) => el.classList.remove("active", "done", "error"));

  if (input.length < minLen) {
    elError.textContent =
      currentLang === "es"
        ? `Escribe al menos ${minLen} caracteres.`
        : `Please write at least ${minLen} characters.`;
    elError.hidden = false;
    return;
  }

  elBtnRun.disabled = true;
  log(currentLang === "es" ? "Iniciando el asistente..." : "Starting the assistant...");

  try {
    switch (currentObjective) {
      case "audit": {
        await runStep("auditor", "/api/audit", { process: input }, (data) => {
          renderAudit(data.audit);
          return `${data.audit.opportunities.length} opportunities identified`;
        });
        break;
      }

      case "opportunities": {
        const { audit } = await runStep("auditor", "/api/audit", { process: input }, (data) => {
          renderAudit(data.audit);
          return `${data.audit.opportunities.length} opportunities identified`;
        });
        await runStep(
          "prioritizer",
          "/api/prioritize",
          { opportunities: audit.opportunities },
          (data) => {
            renderPrioritization(data);
            return `${data.matrix.length} opportunities scored`;
          }
        );
        break;
      }

      case "bot": {
        await runStep("botDesigner", "/api/design-bot", { opportunity: input }, (data) => {
          renderBotBlueprint(data.blueprint);
          return `channel: ${data.blueprint.channel}`;
        });
        break;
      }

      case "integration": {
        await runStep("integrationArchitect", "/api/integration-blueprint", { opportunity: input }, (data) => {
          renderIntegrationBlueprint(data.blueprint);
          return `pattern: ${data.blueprint.pattern}`;
        });
        break;
      }

      case "document": {
        await runStep("documentProcessor", "/api/document-processor", { description: input }, (data) => {
          renderDocumentResult(data.result);
          return `${data.result.extracted_fields.length} fields extracted`;
        });
        break;
      }

      case "dashboard": {
        await runStep("dashboardDesigner", "/api/dashboard-designer", { process: input }, (data) => {
          renderDashboardBlueprint(data.blueprint);
          return `${data.blueprint.kpis.length} KPIs defined`;
        });
        break;
      }

      case "docs": {
        await runStep("documenter", "/api/document-solution", { description: input }, (data) => {
          renderDocsBrief(data.brief);
          return "automation documentation generated";
        });
        break;
      }
    }

    log(currentLang === "es" ? "Listo." : "Done.", "ok");
  } catch (err) {
    elError.textContent = err.message || (currentLang === "es" ? "Algo falló." : "Something failed.");
    elError.hidden = false;
  } finally {
    elBtnRun.disabled = false;
  }
}

/* ============================================================
   Init
   ============================================================ */

setLang(currentLang);
