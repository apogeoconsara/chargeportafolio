const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = String(str ?? "");
  return div.innerHTML;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ============================================================
   Tab switching
   ============================================================ */

const tabButtons = $$(".console-tab");
const modulePanels = $$(".module-panel");

function activateTab(tabName) {
  tabButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === tabName));
  modulePanels.forEach((panel) => {
    panel.hidden = panel.dataset.module !== tabName;
  });
}

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => activateTab(btn.dataset.tab));
});

/* ============================================================
   MODULE 1 · AI Operations Copilot
   ============================================================ */

const COPILOT_SCENARIOS = {
  attention: {
    userText: "What shipments need attention today?",
    trace: [
      "Query TMS for shipments flagged exception, delayed, or missing-document",
      "Cross-reference HAZMAT / compliance flags for priority",
      "Rank by severity and customer SLA impact",
      "Apply guardrail: read-only — no shipment status modified",
    ],
    answer:
      "3 shipments need attention today — one HAZMAT compliance hold, one delayed customer-committed load, and one missing a signed POD.",
    structured: {
      type: "table",
      headers: ["Shipment", "Issue", "Severity", "Recommended action"],
      rows: [
        ["LD-48213", "HAZMAT manifest unsigned", "High", "Hold release, notify compliance"],
        ["LD-48097", "2h behind SLA window", "Medium", "Notify customer, expedite"],
        ["LD-48350", "POD missing signature", "Low", "Request re-upload from driver"],
      ],
    },
    badges: [{ type: "guardrail", text: "Read-only query — no shipment status changed automatically" }],
  },
  exceptions: {
    userText: "Summarize today's exceptions",
    trace: [
      "Pull all exception-tagged records from the last 24 hours",
      "Group by exception type",
      "Compute counts and trend vs. yesterday",
    ],
    answer: "12 exceptions logged today, up from 9 yesterday. Documentation issues are the largest category.",
    structured: {
      type: "table",
      headers: ["Exception type", "Count", "Change vs. yesterday"],
      rows: [
        ["Missing / incomplete document", "5", "+2"],
        ["Delivery delay", "4", "+1"],
        ["Damage reported", "2", "0"],
        ["HAZMAT compliance hold", "1", "0"],
      ],
    },
    badges: [{ type: "guardrail", text: "Aggregation only — individual case detail requires drill-down" }],
  },
  document: {
    userText: "What document is missing for this shipment?",
    trace: [
      "Look up required document checklist for this shipment type (standard dry van delivery)",
      "Compare against documents on file for LD-48350",
      "Identify the gap",
    ],
    answer:
      "Shipment LD-48350 is missing a signed Proof of Delivery. The POD was uploaded, but the signature field is blank.",
    structured: {
      type: "checklist",
      items: [
        { text: "Bill of Lading", ok: true },
        { text: "Rate Confirmation", ok: true },
        { text: "Proof of Delivery — signature missing", ok: false },
        { text: "Delivery photos", ok: true },
      ],
    },
    badges: [
      { type: "guardrail", text: "Cannot generate or approve a document — flags the gap for the ops team" },
    ],
  },
  escalate: {
    userText: "Escalate this case to a person",
    trace: [
      "Identify case context: LD-48213, HAZMAT manifest unsigned",
      "Match escalation rule: HAZMAT / compliance → always human, no autonomous resolution",
      "Create handoff ticket with full context attached",
    ],
    answer:
      "Escalated. A human dispatcher will take it from here — I don't resolve HAZMAT compliance holds autonomously.",
    structured: {
      type: "handoff",
      fields: {
        Ticket: "#HD-2291",
        "Assigned to": "Compliance Team",
        Priority: "High",
        "Context attached": "Manifest status, shipment ID, flagged reason",
      },
    },
    badges: [{ type: "escalation", text: "Required by guardrail — not left to model judgment" }],
  },
};

function renderStructured(structured) {
  if (structured.type === "table") {
    const head = structured.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("");
    const rows = structured.rows
      .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
      .join("");
    return `<div class="table-wrap"><table class="data-table"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
  }
  if (structured.type === "checklist") {
    return `<ul class="chat-checklist">${structured.items
      .map(
        (item) =>
          `<li><span class="${item.ok ? "check-ok" : "check-fail"}">${item.ok ? "✓" : "✗"}</span>${escapeHtml(item.text)}</li>`
      )
      .join("")}</ul>`;
  }
  if (structured.type === "handoff") {
    const rows = Object.entries(structured.fields)
      .map(([k, v]) => `<div><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}</div>`)
      .join("");
    return `<div class="handoff-card">${rows}</div>`;
  }
  return "";
}

const elCopilotChat = $("#copilot-chat");

function appendUserBubble(text) {
  const div = document.createElement("div");
  div.className = "chat-msg-user";
  div.textContent = text;
  elCopilotChat.appendChild(div);
}

function appendAssistantScenario(scenario) {
  const div = document.createElement("div");
  div.className = "chat-msg-assistant";
  const badgesHtml = scenario.badges
    .map(
      (b) =>
        `<span class="tag-badge ${b.type === "escalation" ? "tag-escalation" : "tag-guardrail"}">${b.type === "escalation" ? "Human handoff" : "Guardrail"} — ${escapeHtml(b.text)}</span>`
    )
    .join("");
  div.innerHTML = `
    <ul class="chat-trace">${scenario.trace.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>
    <p class="chat-answer">${escapeHtml(scenario.answer)}</p>
    <div class="chat-structured">${renderStructured(scenario.structured)}</div>
    <div class="chat-badges">${badgesHtml}</div>
  `;
  elCopilotChat.appendChild(div);
  elCopilotChat.scrollTop = elCopilotChat.scrollHeight;
}

function appendAssistantFallback(userText) {
  const div = document.createElement("div");
  div.className = "chat-msg-assistant";
  div.innerHTML = `
    <p class="chat-answer">This demo scripts four grounded scenarios rather than calling a live model. "${escapeHtml(
      userText
    )}" doesn't match one of them — try one of the four prompts above (shipments needing attention, today's exceptions, a missing document, or escalating a case) to see the full reasoning trace.</p>
  `;
  elCopilotChat.appendChild(div);
  elCopilotChat.scrollTop = elCopilotChat.scrollHeight;
}

function matchScenario(text) {
  const t = text.toLowerCase();
  if (/(attention|today|need.*attention|priorit)/.test(t)) return "attention";
  if (/(exception|summar)/.test(t)) return "exceptions";
  if (/(document|missing|pod|bol|paperwork)/.test(t)) return "document";
  if (/(escalate|escalat|human|person|handoff)/.test(t)) return "escalate";
  return null;
}

function runCopilot(userText, scenarioKey) {
  appendUserBubble(userText);
  const key = scenarioKey || matchScenario(userText);
  if (key && COPILOT_SCENARIOS[key]) {
    appendAssistantScenario(COPILOT_SCENARIOS[key]);
  } else {
    appendAssistantFallback(userText);
  }
}

$$(".copilot-prompt-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.prompt;
    runCopilot(COPILOT_SCENARIOS[key].userText, key);
  });
});

$("#copilot-send").addEventListener("click", () => {
  const input = $("#copilot-input");
  const text = input.value.trim();
  if (!text) return;
  runCopilot(text);
  input.value = "";
});

$("#copilot-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") $("#copilot-send").click();
});

/* ============================================================
   MODULE 2 · Document Automation
   ============================================================ */

const DOC_PRESETS = {
  pod: {
    label: "Proof of Delivery",
    fields: [
      { field: "Consignee", value: "Meridian Foods Distribution", confidence: "high" },
      { field: "Delivery date/time", value: "2026-01-14 14:32", confidence: "high" },
      { field: "Signature status", value: "Signed", confidence: "high" },
      { field: "Pallet count", value: "12 / 12", confidence: "medium" },
    ],
    validations: [
      { label: "Signature present", pass: true },
      { label: "Pallet count matches load record", pass: true },
      { label: "Delivery time within SLA window", pass: true },
    ],
    exception: null,
    approval: { status: "approved", text: "Auto-approved — all fields high/medium confidence, no exceptions detected." },
  },
  invoice: {
    label: "Carrier Invoice",
    fields: [
      { field: "Invoice #", value: "INV-88231", confidence: "high" },
      { field: "Load #", value: "LD-48213", confidence: "high" },
      { field: "Billed amount", value: "$1,250.00", confidence: "high" },
      { field: "Rate confirmation amount", value: "$1,180.00", confidence: "high" },
    ],
    validations: [
      { label: "Load number matches TMS record", pass: true },
      { label: "Billed amount matches rate confirmation", pass: false, note: "$70.00 discrepancy" },
    ],
    exception: { label: "Billing discrepancy", detail: "Invoiced amount exceeds the rate confirmation by $70.00." },
    approval: { status: "review", text: "Routed to AP for review — amount mismatch exceeds auto-approval tolerance." },
  },
  bol: {
    label: "Bill of Lading",
    fields: [
      { field: "Shipper", value: "Northgate Manufacturing", confidence: "high" },
      { field: "Consignee", value: "Meridian Foods Distribution", confidence: "high" },
      { field: "Weight", value: "18,400 lbs", confidence: "medium" },
      { field: "HAZMAT flag", value: "No", confidence: "high" },
    ],
    validations: [
      { label: "Shipper/consignee match load record", pass: true },
      { label: "Weight within tolerance", pass: true },
      { label: "HAZMAT documentation not required", pass: true },
    ],
    exception: null,
    approval: { status: "approved", text: "Auto-processed and logged — no exceptions found." },
  },
  receipt: {
    label: "Delivery Receipt",
    fields: [
      { field: "Delivery confirmation", value: "Confirmed", confidence: "high" },
      { field: "Received by", value: "J. Alvarez", confidence: "medium" },
      { field: "Condition note", value: "1 pallet damaged", confidence: "high" },
    ],
    validations: [
      { label: "Delivery confirmed by consignee", pass: true },
      { label: "Condition matches expected (no damage)", pass: false, note: "Damage reported" },
    ],
    exception: { label: "Damage reported", detail: "1 pallet damaged — routed to claims for review before closing the load." },
    approval: { status: "review", text: "Held for human review — a damage claim requires manual sign-off." },
  },
};

const DOC_STAGES = [
  { key: "document", label: "Document" },
  { key: "extraction", label: "Extraction (OCR/IDP)" },
  { key: "validation", label: "Validation" },
  { key: "structured", label: "Structured fields" },
  { key: "exception", label: "Exception detection" },
  { key: "approval", label: "Human approval" },
];

let currentDocType = "pod";
let docRunning = false;

function renderDocPipelineShell() {
  const el = $("#doc-pipeline");
  el.innerHTML = DOC_STAGES.map(
    (s, i) => `
    ${i > 0 ? '<span class="doc-arrow">→</span>' : ""}
    <div class="doc-stage" data-stage="${s.key}"><span class="doc-stage-num">0${i + 1}</span>${escapeHtml(s.label)}</div>`
  ).join("");
}

function setDocStage(key, status) {
  const el = $(`#doc-pipeline [data-stage="${key}"]`);
  if (!el) return;
  el.classList.remove("active", "done");
  if (status) el.classList.add(status);
}

function confidenceDot(level) {
  return `<span class="confidence-dot conf-${level}"></span>`;
}

function docCard(title, bodyHtml) {
  return `<div class="mini-card"><h4 style="margin:0 0 10px;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.03em;color:var(--text-faint);">${escapeHtml(
    title
  )}</h4>${bodyHtml}</div>`;
}

async function runDocPipeline() {
  if (docRunning) return;
  docRunning = true;
  $("#btn-run-doc").disabled = true;
  const preset = DOC_PRESETS[currentDocType];
  const content = $("#doc-content");
  content.innerHTML = "";
  DOC_STAGES.forEach((s) => setDocStage(s.key, null));

  // Stage 1 · document
  setDocStage("document", "active");
  await delay(350);
  content.insertAdjacentHTML(
    "beforeend",
    docCard("Document received", `<p style="margin:0;color:var(--text-muted);font-size:0.86rem;">Type: <strong style="color:var(--text);">${escapeHtml(preset.label)}</strong> · Format: scanned PDF (simulated input)</p>`)
  );
  setDocStage("document", "done");

  // Stage 2 · extraction
  setDocStage("extraction", "active");
  await delay(500);
  const fieldsHtml = `<div class="doc-fields-grid">${preset.fields
    .map(
      (f) =>
        `<div><div style="font-size:0.72rem;color:var(--text-faint);text-transform:uppercase;letter-spacing:0.03em;">${escapeHtml(f.field)}</div><div style="font-size:0.88rem;color:var(--text);margin-top:2px;">${confidenceDot(f.confidence)}${escapeHtml(f.value)} <span style="color:var(--text-faint);font-size:0.72rem;">(${f.confidence} confidence)</span></div></div>`
    )
    .join("")}</div>`;
  content.insertAdjacentHTML("beforeend", docCard("Extraction (OCR / IDP)", fieldsHtml));
  setDocStage("extraction", "done");

  // Stage 3 · validation
  setDocStage("validation", "active");
  await delay(500);
  const valHtml = preset.validations
    .map(
      (v) =>
        `<div class="validation-row"><span class="${v.pass ? "check-ok" : "check-fail"}">${v.pass ? "✓" : "✗"}</span><span>${escapeHtml(v.label)}${v.note ? ` — <span style="color:var(--danger);">${escapeHtml(v.note)}</span>` : ""}</span></div>`
    )
    .join("");
  content.insertAdjacentHTML("beforeend", docCard("Validation", valHtml));
  setDocStage("validation", "done");

  // Stage 4 · structured fields
  setDocStage("structured", "active");
  await delay(450);
  const structuredHtml = `<pre style="margin:0;font-family:var(--font-mono);font-size:0.8rem;color:var(--accent-strong);white-space:pre-wrap;">${preset.fields
    .map((f) => `${f.field}: ${f.value}`)
    .join("\n")}</pre>`;
  content.insertAdjacentHTML("beforeend", docCard("Structured record", structuredHtml));
  setDocStage("structured", "done");

  // Stage 5 · exception detection
  setDocStage("exception", "active");
  await delay(450);
  const exceptionHtml = preset.exception
    ? `<div class="approval-banner review"><strong>${escapeHtml(preset.exception.label)}</strong> — ${escapeHtml(preset.exception.detail)}</div>`
    : `<div class="approval-banner approved">No exceptions detected.</div>`;
  content.insertAdjacentHTML("beforeend", docCard("Exception detection", exceptionHtml));
  setDocStage("exception", "done");

  // Stage 6 · human approval
  setDocStage("approval", "active");
  await delay(450);
  const approvalClass = preset.approval.status === "approved" ? "approved" : "review";
  content.insertAdjacentHTML(
    "beforeend",
    docCard("Human approval", `<div class="approval-banner ${approvalClass}">${escapeHtml(preset.approval.text)}</div>`)
  );
  setDocStage("approval", "done");

  docRunning = false;
  $("#btn-run-doc").disabled = false;
}

$$(".doc-type-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (docRunning) return;
    currentDocType = btn.dataset.doctype;
    $$(".doc-type-btn").forEach((b) => b.classList.toggle("active", b === btn));
    $("#doc-content").innerHTML = "";
    DOC_STAGES.forEach((s) => setDocStage(s.key, null));
  });
});

$("#btn-run-doc").addEventListener("click", runDocPipeline);

renderDocPipelineShell();

/* ============================================================
   MODULE 3 · RPA / Power Automate Workflow
   ============================================================ */

const RPA_NODES = {
  receive: {
    label: "Receive document",
    rule: "Trigger: a new file lands in the intake folder / inbox connector.",
    retry: "Not applicable — this step only detects arrival.",
    exception: "If the file type is unsupported, the flow stops and notifies the automation owner.",
  },
  validate: {
    label: "Validate",
    rule: "Deterministic rule: required fields present, file type matches expected, load number found in the TMS.",
    retry: "1 retry after 5 seconds if the TMS lookup times out.",
    exception: "If validation fails twice, the record is queued for manual review instead of blocking the flow.",
  },
  update: {
    label: "Update system",
    rule: "Writes the validated record to the target system (TMS/ERP) via API.",
    retry: "3 retries with exponential backoff (5s, 15s, 45s), then escalates to on-call.",
    exception: "On repeated failure, the flow logs the error and opens an incident instead of retrying indefinitely.",
  },
  notify: {
    label: "Notify user",
    rule: "Sends a notification (email/Teams) to the process owner once the record is updated.",
    retry: "1 retry if the notification channel is temporarily unavailable.",
    exception: "If notification fails entirely, the flow still completes — a notification failure never blocks the update.",
  },
  log: {
    label: "Log result",
    rule: "Writes a structured audit trail entry for every run, success or failure.",
    retry: "Not applicable — logging always executes, including on failure paths.",
    exception: "Not applicable — this step is itself the exception/audit record.",
  },
};

const RPA_ORDER = ["receive", "validate", "update", "notify", "log"];

function renderRpaDetail(key) {
  const node = RPA_NODES[key];
  $("#rpa-detail").innerHTML = `
    <dt>Rule</dt><dd>${escapeHtml(node.rule)}</dd>
    <dt>Retry logic</dt><dd>${escapeHtml(node.retry)}</dd>
    <dt>Exception handling</dt><dd>${escapeHtml(node.exception)}</dd>
  `;
}

function selectRpaNode(key) {
  $$(".rpa-node").forEach((n) => n.classList.toggle("selected", n.dataset.node === key));
  renderRpaDetail(key);
}

$$(".rpa-node").forEach((node) => {
  node.addEventListener("click", () => selectRpaNode(node.dataset.node));
});

function rpaTimestamp() {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

function appendRpaLog(text, cls) {
  const log = $("#rpa-log");
  const line = document.createElement("div");
  line.className = "log-line" + (cls ? ` ${cls}` : "");
  line.textContent = `[${rpaTimestamp()}] ${text}`;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}

function setNodeState(key, state) {
  const el = $(`.rpa-node[data-node="${key}"]`);
  el.classList.remove("state-active", "state-success", "state-fail", "state-retry");
  const statusEl = el.querySelector(".rpa-node-status");
  if (state === "active") {
    el.classList.add("state-active");
    statusEl.textContent = "running";
  } else if (state === "success") {
    el.classList.add("state-success");
    statusEl.textContent = "success";
  } else if (state === "fail") {
    el.classList.add("state-fail");
    statusEl.textContent = "failed";
  } else if (state === "retry") {
    el.classList.add("state-retry");
    statusEl.textContent = "retrying";
  } else {
    statusEl.textContent = "";
  }
}

let rpaRunning = false;

async function runRpaSimulation() {
  if (rpaRunning) return;
  rpaRunning = true;
  $("#btn-run-rpa").disabled = true;
  $("#rpa-log").innerHTML = "";
  RPA_ORDER.forEach((k) => setNodeState(k, null));

  for (const key of RPA_ORDER) {
    const node = RPA_NODES[key];
    setNodeState(key, "active");
    appendRpaLog(`Node: ${node.label} | Status: RUNNING`);
    await delay(500);

    if (key === "update") {
      setNodeState(key, "fail");
      appendRpaLog(`Node: ${node.label} | Status: FAILED | Reason: TMS API timeout`, "log-fail");
      await delay(500);
      setNodeState(key, "retry");
      appendRpaLog(`Node: ${node.label} | Retry 1/3 (backoff 5s, simulated)`, "log-retry");
      await delay(700);
    }

    setNodeState(key, "success");
    appendRpaLog(`Node: ${node.label} | Status: SUCCESS`);
    await delay(300);
  }

  appendRpaLog("Run complete — audit trail written for all 5 nodes.");
  rpaRunning = false;
  $("#btn-run-rpa").disabled = false;
}

$("#btn-run-rpa").addEventListener("click", runRpaSimulation);

$("#btn-reset-rpa").addEventListener("click", () => {
  if (rpaRunning) return;
  RPA_ORDER.forEach((k) => setNodeState(k, null));
  $("#rpa-log").innerHTML = "";
});

selectRpaNode("receive");

/* ============================================================
   MODULE 4 · Enterprise Integration Map
   ============================================================ */

const INTEGRATION_LAYERS = [
  { label: "AI & Automation Layer", systems: ["claude", "power-automate"] },
  { label: "Integration Layer", systems: ["rest-api", "sql"] },
  { label: "Business Systems", systems: ["hubspot", "tms", "erp", "workday"] },
  { label: "Analytics Layer", systems: ["powerbi"] },
];

const INTEGRATION_SYSTEMS = {
  claude: {
    name: "Claude",
    input: "Unstructured messages, documents, and exception data.",
    action: "Classifies, extracts, and reasons over context within defined guardrails.",
    output: "Structured decisions, extracted fields, or a drafted response for human review.",
  },
  "power-automate": {
    name: "Power Automate / RPA",
    tag: "lab",
    input: "A triggering event — new file, status change, scheduled run.",
    action: "Executes a deterministic, rule-based workflow (see the RPA Workflow module).",
    output: "An updated system record plus an audit log entry.",
  },
  "rest-api": {
    name: "REST API",
    input: "A request from a bot, workflow, or another system.",
    action: "Authenticates the caller and routes the request to the right service.",
    output: "A structured JSON response.",
  },
  sql: {
    name: "SQL / PostgreSQL",
    input: "Structured data produced by extraction or automation steps.",
    action: "Stores, queries, and joins operational data.",
    output: "A queryable dataset that feeds reporting.",
  },
  hubspot: {
    name: "CRM — HubSpot",
    input: "A customer interaction, inquiry, or support ticket.",
    action: "Logs the interaction and updates the contact or deal record.",
    output: "An updated customer timeline visible to the team.",
  },
  tms: {
    name: "TMS",
    input: "A load tender or a shipment status update.",
    action: "Creates or updates the shipment record.",
    output: "A live shipment status feed other systems can read.",
  },
  erp: {
    name: "ERP",
    input: "An invoice or purchase order.",
    action: "Matches it against the expected record (PO, rate confirmation).",
    output: "An approved transaction, or a flagged exception for AP review.",
  },
  workday: {
    name: "Workday",
    tag: "concept",
    input: "(Concept) An HR event, such as a new hire or role change.",
    action: "(Concept) Would trigger a business process to sync the record downstream.",
    output: "(Concept) A synced profile in connected systems.",
  },
  powerbi: {
    name: "Power BI",
    input: "Aggregated logs and KPIs from the automations above.",
    action: "Visualizes trends, thresholds, and exceptions.",
    output: "The performance dashboard (see the Performance Dashboard module).",
  },
};

function renderIntegrationLayers() {
  const el = $("#integration-layers");
  el.innerHTML = INTEGRATION_LAYERS.map(
    (layer) => `
    <div class="integration-layer">
      <p class="integration-layer-label">${escapeHtml(layer.label)}</p>
      <div class="integration-grid">
        ${layer.systems
          .map((key) => {
            const sys = INTEGRATION_SYSTEMS[key];
            const sub = sys.tag === "concept" ? "Concept / target system" : sys.tag === "lab" ? "Hands-on lab" : "";
            return `<button class="integration-node${sys.tag === "concept" ? " concept" : ""}" data-system="${key}" type="button">${escapeHtml(
              sys.name
            )}${sub ? `<span class="node-sub">${escapeHtml(sub)}</span>` : ""}</button>`;
          })
          .join("")}
      </div>
    </div>`
  ).join("");

  $$(".integration-node").forEach((node) => {
    node.addEventListener("click", () => selectIntegrationSystem(node.dataset.system));
  });
}

function selectIntegrationSystem(key) {
  $$(".integration-node").forEach((n) => n.classList.toggle("selected", n.dataset.system === key));
  const sys = INTEGRATION_SYSTEMS[key];
  const tagHtml =
    sys.tag === "concept"
      ? '<span class="tag-badge tag-concept">Integration architecture concept / target system</span>'
      : sys.tag === "lab"
      ? '<span class="tag-badge tag-lab">Hands-on lab</span>'
      : "";
  $("#integration-detail").innerHTML = `
    <p class="integration-detail-title">${escapeHtml(sys.name)} ${tagHtml}</p>
    <div class="integration-flow-grid">
      <div><h4>Input</h4><p>${escapeHtml(sys.input)}</p></div>
      <div><h4>Action</h4><p>${escapeHtml(sys.action)}</p></div>
      <div><h4>Output</h4><p>${escapeHtml(sys.output)}</p></div>
    </div>
  `;
}

renderIntegrationLayers();

/* ============================================================
   MODULE 5 · Automation Performance Dashboard
   ============================================================ */

const DASHBOARD_DATA = [
  { workflow: "copilot", department: "dispatch", tasksRemoved: 180, successRate: 92, exceptionsPct: 9, avgTimeMin: 1.1, hoursSaved: 28, resolutionRate: 85 },
  { workflow: "copilot", department: "customer-service", tasksRemoved: 310, successRate: 89, exceptionsPct: 12, avgTimeMin: 0.9, hoursSaved: 45, resolutionRate: 78 },
  { workflow: "copilot", department: "ap-finance", tasksRemoved: 40, successRate: 90, exceptionsPct: 8, avgTimeMin: 1.4, hoursSaved: 6, resolutionRate: 80 },
  { workflow: "copilot", department: "compliance", tasksRemoved: 25, successRate: 95, exceptionsPct: 4, avgTimeMin: 1.6, hoursSaved: 5, resolutionRate: 90 },
  { workflow: "document", department: "dispatch", tasksRemoved: 150, successRate: 93, exceptionsPct: 7, avgTimeMin: 2.8, hoursSaved: 22, resolutionRate: 87 },
  { workflow: "document", department: "customer-service", tasksRemoved: 95, successRate: 91, exceptionsPct: 10, avgTimeMin: 3.1, hoursSaved: 14, resolutionRate: 88 },
  { workflow: "document", department: "ap-finance", tasksRemoved: 420, successRate: 94, exceptionsPct: 15, avgTimeMin: 3.4, hoursSaved: 62, resolutionRate: 81 },
  { workflow: "document", department: "compliance", tasksRemoved: 60, successRate: 97, exceptionsPct: 3, avgTimeMin: 2.6, hoursSaved: 9, resolutionRate: 93 },
  { workflow: "rpa", department: "dispatch", tasksRemoved: 310, successRate: 96, exceptionsPct: 4, avgTimeMin: 0.6, hoursSaved: 48, resolutionRate: 95 },
  { workflow: "rpa", department: "customer-service", tasksRemoved: 70, successRate: 95, exceptionsPct: 3, avgTimeMin: 0.5, hoursSaved: 11, resolutionRate: 94 },
  { workflow: "rpa", department: "ap-finance", tasksRemoved: 180, successRate: 97, exceptionsPct: 5, avgTimeMin: 0.7, hoursSaved: 27, resolutionRate: 96 },
  { workflow: "rpa", department: "compliance", tasksRemoved: 50, successRate: 98, exceptionsPct: 2, avgTimeMin: 0.8, hoursSaved: 8, resolutionRate: 97 },
];

function average(nums) {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function computeAggregate(workflow, department) {
  const rows = DASHBOARD_DATA.filter(
    (r) => (workflow === "all" || r.workflow === workflow) && (department === "all" || r.department === department)
  );
  if (rows.length === 0) return null;
  return {
    tasksRemoved: rows.reduce((sum, r) => sum + r.tasksRemoved, 0),
    successRate: average(rows.map((r) => r.successRate)),
    exceptionsPct: average(rows.map((r) => r.exceptionsPct)),
    avgTimeMin: average(rows.map((r) => r.avgTimeMin)),
    hoursSaved: rows.reduce((sum, r) => sum + r.hoursSaved, 0),
    resolutionRate: average(rows.map((r) => r.resolutionRate)),
  };
}

function meterCard(label, value, sub, meterClass) {
  return `
    <div class="kpi-stat-card">
      <p class="kpi-stat-label">${escapeHtml(label)}</p>
      <p class="kpi-stat-value">${value}</p>
      ${sub ? `<p class="kpi-stat-sub">${sub}</p>` : ""}
      ${meterClass !== undefined ? `<div class="kpi-meter-track"><div class="kpi-meter-fill ${meterClass.cls}" style="width:${meterClass.pct}%"></div></div>` : ""}
    </div>`;
}

function renderDashboard() {
  const workflow = $("#filter-workflow").value;
  const department = $("#filter-department").value;
  const agg = computeAggregate(workflow, department);
  const grid = $("#kpi-grid");
  if (!agg) {
    grid.innerHTML = "";
    return;
  }

  grid.innerHTML = [
    meterCard("Manual tasks removed", agg.tasksRemoved.toLocaleString("en-US") + " / mo", "Tasks no longer done by hand each month"),
    meterCard(
      "Automation success rate",
      agg.successRate.toFixed(0) + "%",
      "Completed without error or human override",
      { cls: agg.successRate >= 90 ? "good" : "warn", pct: agg.successRate }
    ),
    meterCard(
      "Exceptions requiring review",
      agg.exceptionsPct.toFixed(0) + "%",
      "Of volume routed to a human",
      { cls: agg.exceptionsPct <= 6 ? "good" : "warn", pct: agg.exceptionsPct }
    ),
    meterCard("Avg. processing time", agg.avgTimeMin.toFixed(1) + " min", "vs. ~18 min manual baseline (synthetic)"),
    meterCard("Hours saved", agg.hoursSaved.toLocaleString("en-US") + " hrs/mo", "Estimated team time returned monthly"),
    meterCard(
      "Bot resolution rate",
      agg.resolutionRate.toFixed(0) + "%",
      "Resolved without escalation to a human",
      { cls: agg.resolutionRate >= 85 ? "good" : "warn", pct: agg.resolutionRate }
    ),
  ].join("");
}

$("#filter-workflow").addEventListener("change", renderDashboard);
$("#filter-department").addEventListener("change", renderDashboard);

renderDashboard();
