import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaChartLine, FaSignOutAlt, FaPlus, FaTrash,
  FaEdit, FaSave, FaTimes, FaChevronDown, FaChevronRight,
  FaFolderOpen, FaFolder, FaClipboardList, FaCheckCircle,
  FaCircleNotch, FaSearch, FaBriefcase, FaCalendarAlt,
  FaFileExcel, FaExpandAlt, FaCompressAlt, FaFilePdf, FaLink, FaUnlink,
  FaColumns, FaFilter, FaHistory, FaClock, FaExclamationTriangle,
  FaArrowRight, FaInfoCircle, FaTable
} from "react-icons/fa";

const API_BASE = process.env.REACT_APP_API_URL;
const API_TASK = `${API_BASE}/planning_project/api/tasks`;
const API_PROJECT = `${API_BASE}/projects`;

const DEPARTMENTS = [
  "", "DESIGN", "PURCHASE", "PRODUCTION",
  "POWDER COATING", "DISPATCH", "PROJECT TEAM", "BILLING", "ADMIN",
  "QC DEPT.", "FACTORY"
];
const STATUSES = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "DELAYED", "ON_HOLD"];
const STATUS_META = {
  NOT_STARTED: { bg: "#f1f5f9", color: "#64748b",  border: "#cbd5e1", label: "Not Started" },
  IN_PROGRESS:  { bg: "#dbeafe", color: "#1d4ed8",  border: "#93c5fd", label: "In Progress" },
  COMPLETED:    { bg: "#dcfce7", color: "#15803d",  border: "#86efac", label: "Completed" },
  DELAYED:      { bg: "#fee2e2", color: "#b91c1c",  border: "#fca5a5", label: "Delayed" },
  ON_HOLD:      { bg: "#fef9c3", color: "#a16207",  border: "#fde047", label: "On Hold" },
  DONE:         { bg: "#dcfce7", color: "#15803d",  border: "#86efac", label: "Done" },
};

const TASK_TYPES = [
  { v: "B", label: "Basic Task",       color: "#3b82f6" },
  { v: "P", label: "Predecessor Dep",  color: "#8b5cf6" },
  { v: "R", label: "Review",           color: "#f59e0b" },
  { v: "X", label: "Milestone",        color: "#ec4899" },
  { v: "O", label: "Optional",         color: "#06b6d4" },
  { v: "G", label: "Gate",             color: "#10b981" },
];
const TYPE_META = TASK_TYPES.reduce((a, t) => ({ ...a, [t.v]: t }), {});

const ALL_PDF_COLUMNS = [
  { key: "wbsId",           label: "WBS",           defaultOn: true  },
  { key: "name",            label: "Task / Details", defaultOn: true  },
  { key: "taskType",        label: "Type",           defaultOn: true  },
  { key: "startDate",       label: "Start Date",     defaultOn: true  },
  { key: "endDate",         label: "End Date",       defaultOn: true  },
  { key: "prevStartDate",   label: "Prev Start",     defaultOn: true  },
  { key: "prevEndDate",     label: "Prev End",       defaultOn: true  },
  { key: "dateChangeReason",label: "Change Reason",  defaultOn: true  },
  { key: "days",            label: "Days",           defaultOn: true  },
  { key: "department",      label: "Department",     defaultOn: true  },
  { key: "actionPerson",    label: "Action Person",  defaultOn: true  },
  { key: "quantitySqft",    label: "Qty (sqft)",     defaultOn: false },
  { key: "progressPercent", label: "Progress",       defaultOn: true  },
  { key: "status",          label: "Status",         defaultOn: true  },
  { key: "remark",          label: "Remark",         defaultOn: true  },
  { key: "dependency",      label: "Depends On",     defaultOn: true  },
];

// ── helpers ──
const fmtDate = v => { if (!v) return ""; return String(v).substring(0, 10); };
const calcDays = (s, e) => {
  if (!s || !e) return "-";
  const d = Math.ceil((new Date(fmtDate(e)) - new Date(fmtDate(s))) / 86400000);
  return d >= 0 ? d : "-";
};
const fmtDisplay = dateStr => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

// ── Local date history storage ──
const HISTORY_KEY = "task_date_history";
const getHistory = () => {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "{}"); }
  catch { return {}; }
};
const saveHistory = (taskId, entry) => {
  const all = getHistory();
  if (!all[taskId]) all[taskId] = [];
  all[taskId].unshift(entry);
  if (all[taskId].length > 20) all[taskId] = all[taskId].slice(0, 20);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(all));
};
const getTaskHistory = taskId => {
  const all = getHistory();
  return all[taskId] || [];
};

// ══════════════════════════════════════════════════════
// DATE HISTORY MODAL
// ══════════════════════════════════════════════════════
function DateHistoryModal({ task, onClose }) {
  const history = getTaskHistory(task.id);
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div className="modal-head-left">
            <FaHistory size={14} style={{ color: "#6366f1" }} />
            <div>
              <div className="modal-title">Date Change History</div>
              <div className="modal-sub">{task.name}</div>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><FaTimes size={12} /></button>
        </div>
        <div className="modal-body">
          {history.length === 0 ? (
            <div className="empty-hist">
              <FaHistory size={28} />
              <p>No date change history for this task.</p>
              <span>History is recorded whenever you change start or end dates.</span>
            </div>
          ) : (
            <div className="hist-list">
              {history.map((h, i) => (
                <div key={i} className={`hist-item ${i === 0 ? "hist-latest" : ""}`}>
                  <div className="hist-meta">
                    <span className={`hist-label ${i === 0 ? "label-latest" : "label-old"}`}>
                      {i === 0 ? "📍 Latest" : `#${history.length - i}`}
                    </span>
                    <span className="hist-time">{h.changedAt ? new Date(h.changedAt).toLocaleString("en-IN") : ""}</span>
                  </div>
                  <div className="hist-dates">
                    <div className="hist-prev">
                      <span className="hist-dtlabel">PREVIOUS</span>
                      <span>{fmtDisplay(h.prevStartDate)} → {fmtDisplay(h.prevEndDate)}</span>
                    </div>
                    <FaArrowRight size={10} style={{ color: "#94a3b8", flexShrink: 0 }} />
                    <div className="hist-new">
                      <span className="hist-dtlabel">NEW</span>
                      <span>{fmtDisplay(h.newStartDate)} → {fmtDisplay(h.newEndDate)}</span>
                    </div>
                  </div>
                  {h.reason && (
                    <div className="hist-reason">
                      <strong>Reason:</strong> {h.reason}
                    </div>
                  )}
                  {h.changedBy && <div className="hist-by">Changed by: <strong>{h.changedBy}</strong></div>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-foot">
          <div />
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// DATE CHANGE REASON MODAL
// ══════════════════════════════════════════════════════
function DateReasonModal({ task, newStart, newEnd, onConfirm, onSkip, onCancel }) {
  const [reason, setReason] = useState("");
  return (
    <div className="overlay">
      <div className="modal" style={{ maxWidth: 460 }}>
        <div className="modal-head">
          <div className="modal-head-left">
            <FaExclamationTriangle size={14} style={{ color: "#f59e0b" }} />
            <div>
              <div className="modal-title">Date Change Detected</div>
              <div className="modal-sub">Provide a reason for changing dates</div>
            </div>
          </div>
        </div>
        <div className="modal-body" style={{ padding: "16px 20px" }}>
          <div className="date-diff-row">
            <div className="diff-prev">
              <div className="diff-label">PREVIOUS</div>
              <div className="diff-val">{fmtDisplay(fmtDate(task.startDate))} → {fmtDisplay(fmtDate(task.endDate))}</div>
            </div>
            <FaArrowRight style={{ color: "#94a3b8" }} />
            <div className="diff-new">
              <div className="diff-label">NEW</div>
              <div className="diff-val">{fmtDisplay(newStart)} → {fmtDisplay(newEnd)}</div>
            </div>
          </div>
          <div className="field-group">
            <label className="field-label">Reason for Date Change *</label>
            <textarea
              autoFocus value={reason} onChange={e => setReason(e.target.value)}
              placeholder="e.g. Client requested revision, Material delayed..."
              className="reason-area"
            />
          </div>
          <div className="info-note"><FaInfoCircle size={11} /> Previous dates will be stored in history and viewable via the 🕐 button.</div>
        </div>
        <div className="modal-foot">
          <button className="btn-ghost" onClick={onCancel}>Cancel</button>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-ghost" onClick={onSkip}>Skip Reason</button>
            <button className="btn-primary" disabled={!reason.trim()} onClick={() => onConfirm(reason)}>
              <FaSave size={11} /> Save with Reason
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// PDF EXPORT MODAL
// ══════════════════════════════════════════════════════
function PDFExportModal({ tasks, selectedProject, deps, onClose }) {
  const today = new Date().toISOString().substring(0, 10);
  const [cols, setCols] = useState(() =>
    ALL_PDF_COLUMNS.reduce((acc, c) => ({ ...acc, [c.key]: c.defaultOn }), {})
  );
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selMonth, setSelMonth] = useState(today.substring(0, 7));
  const [groupByWO, setGroupByWO] = useState(true);
  const [sortBy, setSortBy] = useState("startDate");

  const toggleCol = key => setCols(prev => ({ ...prev, [key]: !prev[key] }));
  const allOn = ALL_PDF_COLUMNS.every(c => cols[c.key]);
  const toggleAll = () => setCols(ALL_PDF_COLUMNS.reduce((acc, c) => ({ ...acc, [c.key]: !allOn }), {}));
  const activeCols = ALL_PDF_COLUMNS.filter(c => cols[c.key]);
  const lineItems = tasks.filter(t => t.parentId);

  const applyFilter = list => {
    if (filterType === "range") return list.filter(t => {
      const sd = fmtDate(t.startDate), ed = fmtDate(t.endDate);
      if (dateFrom && sd && sd < dateFrom) return false;
      if (dateTo && ed && ed > dateTo) return false;
      return true;
    });
    if (filterType === "month") return list.filter(t => {
      const sd = fmtDate(t.startDate), ed = fmtDate(t.endDate);
      return (sd && sd.startsWith(selMonth)) || (ed && ed.startsWith(selMonth));
    });
    return list;
  };
  const filteredCount = applyFilter(lineItems).length;

  const doExport = () => {
    const woMap = {}, taskMap = {};
    tasks.filter(t => !t.parentId).forEach(w => { woMap[w.id] = w; });
    tasks.forEach(t => { taskMap[t.id] = t; });
    let flat = applyFilter([...lineItems]);
    flat.sort((a, b) => {
      if (sortBy === "startDate") return (new Date(fmtDate(a.startDate)||"9999")) - (new Date(fmtDate(b.startDate)||"9999"));
      if (sortBy === "department") return (a.department||"").localeCompare(b.department||"");
      if (sortBy === "status") return (a.status||"").localeCompare(b.status||"");
      return 0;
    });
    const thCells = activeCols.map(c => `<th>${c.label}</th>`).join("");
    const buildCells = t => {
      const sm = STATUS_META[t.status] || STATUS_META.NOT_STARTED;
      const tm = TYPE_META[t.taskType];
      const sd = fmtDate(t.startDate), ed = fmtDate(t.endDate);
      const psd = fmtDate(t.prevStartDate), ped = fmtDate(t.prevEndDate);
      const depInfo = deps[t.id];
      const depTask = depInfo ? taskMap[depInfo.parentId] : null;
      const hasDiff = (psd && psd !== sd) || (ped && ped !== ed);
      const cellMap = {
        wbsId: `<td>${t.wbsId||"—"}</td>`,
        name: `<td style="text-align:left">${t.name}</td>`,
        taskType: tm ? `<td><span style="background:${tm.color}22;color:${tm.color};padding:2px 6px;border-radius:3px;font-weight:700">${tm.v}</span></td>` : `<td>—</td>`,
        startDate: `<td style="color:${hasDiff?"#15803d":"inherit"};font-weight:${hasDiff?"700":"400"}">${sd||"—"}</td>`,
        endDate: `<td style="color:${hasDiff?"#15803d":"inherit"};font-weight:${hasDiff?"700":"400"}">${ed||"—"}</td>`,
        prevStartDate: `<td style="color:${hasDiff?"#b91c1c":"#94a3b8"};text-decoration:${hasDiff?"line-through":"none"}">${psd||"—"}</td>`,
        prevEndDate: `<td style="color:${hasDiff?"#b91c1c":"#94a3b8"};text-decoration:${hasDiff?"line-through":"none"}">${ped||"—"}</td>`,
        dateChangeReason: `<td style="text-align:left">${t.dateChangeReason||"—"}</td>`,
        days: `<td>${calcDays(sd,ed)}</td>`,
        department: `<td>${t.department||"—"}</td>`,
        actionPerson: `<td>${t.actionPerson||"—"}</td>`,
        quantitySqft: `<td>${t.quantitySqft||"—"}</td>`,
        progressPercent: `<td><div style="display:flex;align-items:center;gap:4px;justify-content:center"><div style="width:36px;height:4px;background:#e2e8f0;border-radius:2px;overflow:hidden"><div style="width:${t.progressPercent||0}%;height:4px;background:#6366f1"></div></div><span>${t.progressPercent||0}%</span></div></td>`,
        status: `<td><span style="background:${sm.bg};color:${sm.color};padding:2px 7px;border-radius:4px;font-size:8pt;font-weight:700">${sm.label}</span></td>`,
        remark: `<td style="text-align:left">${t.remark||"—"}</td>`,
        dependency: `<td>${depTask ? `${depTask.wbsId||""} ${depTask.name} (+${depInfo.lag||0}d)` : "—"}</td>`,
      };
      return activeCols.map(c => cellMap[c.key]||"<td>—</td>").join("");
    };
    let rows = "";
    if (groupByWO) {
      const groups = {};
      flat.forEach(t => { if (!groups[t.parentId]) groups[t.parentId] = []; groups[t.parentId].push(t); });
      Object.entries(groups).forEach(([woId, items]) => {
        const wo = woMap[woId] || {};
        rows += `<tr><td colspan="${activeCols.length}" style="background:#1e3a5f;color:#fff;padding:7px 10px;font-weight:700;text-align:left">📋 ${wo.name||"Work Order"} ${wo.woNumber ? `· WO#: ${wo.woNumber}` : ""} · ${items.length} items</td></tr>`;
        items.forEach((t, i) => { rows += `<tr class="${i%2===0?"even":""}">${buildCells(t)}</tr>`; });
      });
    } else {
      flat.forEach((t, i) => { rows += `<tr class="${i%2===0?"even":""}">${buildCells(t)}</tr>`; });
    }
    const done = flat.filter(t => t.status==="COMPLETED"||t.status==="DONE").length;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Work Schedule</title>
<style>@page{size:A4 landscape;margin:10mm 8mm}*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;font-size:8pt;color:#1e293b}.hdr{text-align:center;margin-bottom:8px;padding-bottom:8px;border-bottom:3px solid #1e3a5f}.hdr h1{font-size:13pt;color:#1e3a5f;font-weight:800}.hdr-meta{display:flex;justify-content:center;gap:18px;margin-top:5px;font-size:8pt;color:#64748b}table{width:100%;border-collapse:collapse}thead tr{background:#1e3a5f;color:#fff}th{padding:6px 8px;text-align:center;font-size:8pt;font-weight:700;white-space:nowrap}td{padding:4px 8px;border-bottom:1px solid #e2e8f0;text-align:center;font-size:8pt;vertical-align:middle}tr.even td{background:#f8fafc}.footer{margin-top:8px;text-align:right;font-size:7pt;color:#94a3b8}</style>
</head><body>
<div class="hdr"><h1>ONE DEO LEELA FACADE SYSTEMS PVT LTD</h1>
<div class="hdr-meta"><span><b>Project:</b> ${selectedProject?.projectName||""}</span><span><b>Date:</b> ${new Date().toLocaleDateString("en-IN")}</span><span><b>Records:</b> ${flat.length}</span><span><b>Completed:</b> ${done}/${flat.length}</span></div></div>
<table><thead><tr>${thCells}</tr></thead><tbody>${rows}</tbody></table>
<div class="footer">ONE DEO LEELA FACADE SYSTEMS · ${new Date().toLocaleString("en-IN")}</div>
</body></html>`;
    const w = window.open("","_blank");
    w.document.write(html); w.document.close(); w.focus();
    setTimeout(() => w.print(), 450);
    onClose();
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div className="modal-head-left">
            <FaFilePdf size={15} style={{ color: "#ef4444" }} />
            <div><div className="modal-title">Export to PDF</div><div className="modal-sub">{selectedProject?.projectName}</div></div>
          </div>
          <button className="icon-btn" onClick={onClose}><FaTimes size={12} /></button>
        </div>
        <div className="modal-body">
          <div className="modal-section">
            <div className="section-hd"><FaCalendarAlt size={11} /> Date Filter</div>
            <div className="radio-row">
              {[{v:"all",l:"All Dates"},{v:"range",l:"Date Range"},{v:"month",l:"By Month"}].map(o => (
                <label key={o.v} className={`radio-pill ${filterType===o.v?"active":""}`}>
                  <input type="radio" value={o.v} checked={filterType===o.v} onChange={() => setFilterType(o.v)} />{o.l}
                </label>
              ))}
            </div>
            {filterType === "range" && (
              <div className="date-range">
                <div className="date-f"><label>From</label><input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)}/></div>
                <span className="date-sep">→</span>
                <div className="date-f"><label>To</label><input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)}/></div>
                {(dateFrom||dateTo) && <button className="clr-btn" onClick={()=>{setDateFrom("");setDateTo("");}}>✕ Clear</button>}
              </div>
            )}
            {filterType === "month" && (
              <div className="month-row"><label>Month:</label><input type="month" value={selMonth} onChange={e=>setSelMonth(e.target.value)}/></div>
            )}
            <div className="filter-badge"><FaFilter size={9} /> {filteredCount} records will be included</div>
          </div>
          <div className="modal-section">
            <div className="section-hd"><FaColumns size={11} /> Columns
              <button className="toggle-all" onClick={toggleAll}>{allOn?"Deselect All":"Select All"}</button>
            </div>
            <div className="col-chips">
              {ALL_PDF_COLUMNS.map(c => (
                <label key={c.key} className={`col-chip ${cols[c.key]?"on":""}`}>
                  <input type="checkbox" checked={cols[c.key]} onChange={()=>toggleCol(c.key)}/>
                  <span className="chip-dot"/>{c.label}
                </label>
              ))}
            </div>
            {activeCols.length===0 && <div className="warn-pill">⚠️ Select at least one column</div>}
          </div>
          <div className="modal-section">
            <div className="section-hd">Layout</div>
            <div className="layout-row">
              <label className={`toggle-chip ${groupByWO?"on":""}`}>
                <input type="checkbox" checked={groupByWO} onChange={e=>setGroupByWO(e.target.checked)}/> Group by Work Order
              </label>
              <div className="sort-pick">
                <label>Sort:</label>
                <select value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                  <option value="startDate">Start Date</option>
                  <option value="department">Department</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <div className="foot-chips">
            <span className="foot-chip">{activeCols.length} cols</span>
            <span className="foot-chip">{filteredCount} rows</span>
            <span className="foot-chip">A4 Landscape</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn-pdf" disabled={activeCols.length===0||filteredCount===0} onClick={doExport}>
              <FaFilePdf size={12} /> Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════
export default function PlanningDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [expanded, setExpanded] = useState(new Set());
  const [allExpanded, setAllExpanded] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showWOForm, setShowWOForm] = useState(false);
  const [woForm, setWoForm] = useState({ name: "", woNumber: "", projectCode: "", startDate: "", endDate: "" });
  const [addingTo, setAddingTo] = useState(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "ok" });
  const [search, setSearch] = useState("");
  const [linkMode, setLinkMode] = useState(false);
  const [linkSource, setLinkSource] = useState(null);
  const [deps, setDeps] = useState({});
  const [linkLag, setLinkLag] = useState(0);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [historyTask, setHistoryTask] = useState(null);
  const [dateReasonModal, setDateReasonModal] = useState(null);
  const [showPrevCols, setShowPrevCols] = useState(true);

  useEffect(() => { loadProjects(); }, []);
  useEffect(() => { if (selectedProject?.id) loadTasks(selectedProject.id); }, [selectedProject]);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "ok" }), 3200);
  };

  const loadProjects = async () => {
    try {
      const r = await axios.get(API_PROJECT);
      setProjects((r.data || []).map(p => ({ ...p, id: p.id ?? p.projectId })));
    } catch (e) { console.error(e); }
  };

  const loadTasks = async id => {
    setFetching(true);
    try {
      const r = await axios.get(`${API_TASK}/project/${id}`);
      setTasks(r.data || []);
    } catch (e) { console.error(e); }
    finally { setFetching(false); }
  };

  const createProject = async () => {
    if (!newProjectName.trim()) return;
    setLoading(true);
    try {
      await axios.post(API_PROJECT, { projectName: newProjectName.trim() });
      setNewProjectName(""); setShowProjectForm(false);
      await loadProjects(); showToast("Project created!");
    } catch { showToast("Failed to create project", "err"); }
    finally { setLoading(false); }
  };

  const createWorkOrder = async () => {
    if (!woForm.name.trim() || !selectedProject?.id) { showToast("Select a project first", "err"); return; }
    setLoading(true);
    try {
      await axios.post(`${API_TASK}/root`, {
        name: woForm.name.trim(), projectId: String(selectedProject.id),
        woNumber: woForm.woNumber.trim(), projectCode: woForm.projectCode.trim(),
        startDate: woForm.startDate || null, endDate: woForm.endDate || null,
      });
      setWoForm({ name: "", woNumber: "", projectCode: "", startDate: "", endDate: "" });
      setShowWOForm(false);
      await loadTasks(selectedProject.id);
      showToast("Work Order created!");
    } catch (e) { showToast(e?.response?.data?.message || "Failed", "err"); }
    finally { setLoading(false); }
  };

  const addChild = async parentId => {
    if (!newTaskName.trim()) return;
    setLoading(true);
    try {
      await axios.post(`${API_TASK}/${parentId}/child`, { name: newTaskName.trim() });
      setNewTaskName(""); setAddingTo(null);
      await loadTasks(selectedProject.id);
      showToast("Line item added!");
    } catch { showToast("Failed", "err"); }
    finally { setLoading(false); }
  };

  const handleSaveEdit = () => {
    const task = tasks.find(t => t.id === editingId);
    if (!task) return;
    const prevSd = fmtDate(task.startDate), prevEd = fmtDate(task.endDate);
    const newSd = editForm.startDate || "", newEd = editForm.endDate || "";
    const datesChanged = (newSd && newSd !== prevSd) || (newEd && newEd !== prevEd);
    if (datesChanged) {
      setDateReasonModal({ task, newStart: newSd, newEnd: newEd });
    } else {
      doSaveEdit(null);
    }
  };

  const doSaveEdit = async (changeReason) => {
    setDateReasonModal(null);
    setLoading(true);
    const task = tasks.find(t => t.id === editingId);
    const prevSd = fmtDate(task?.startDate), prevEd = fmtDate(task?.endDate);
    const newSd = editForm.startDate || null, newEd = editForm.endDate || null;
    const datesChanged = (newSd && newSd !== prevSd) || (newEd && newEd !== prevEd);

    // Save history to localStorage BEFORE updating
    if (datesChanged) {
      saveHistory(editingId, {
        prevStartDate: prevSd,
        prevEndDate: prevEd,
        newStartDate: newSd,
        newEndDate: newEd,
        reason: changeReason || "",
        changedAt: new Date().toISOString(),
        changedBy: user.fullName || "User",
      });
    }

    try {
      await axios.put(`${API_TASK}/${editingId}/dates`, {
        startDate: newSd, endDate: newEd,
        prevStartDate: datesChanged ? prevSd : undefined,
        prevEndDate: datesChanged ? prevEd : undefined,
        dateChangeReason: changeReason || undefined,
      });
      await axios.put(`${API_TASK}/${editingId}`, {
        name: editForm.name || "",
        department: editForm.department || "",
        actionPerson: editForm.actionPerson || "",
        quantitySqft: editForm.quantitySqft ? Number(editForm.quantitySqft) : null,
        progressPercent: editForm.progressPercent ? Number(editForm.progressPercent) : 0,
        status: editForm.status || "NOT_STARTED",
        remark: editForm.remark || "",
        taskType: editForm.taskType || "",
        dateChangeReason: changeReason || editForm.dateChangeReason || "",
        prevStartDate: datesChanged ? prevSd : (task?.prevStartDate || ""),
        prevEndDate: datesChanged ? prevEd : (task?.prevEndDate || ""),
      });
      const savedId = editingId;
      setEditingId(null);
      await loadTasks(selectedProject.id);
      cascadeAll(savedId);
      showToast("Saved!" + (datesChanged && changeReason ? " Reason recorded." : ""));
    } catch { showToast("Update failed", "err"); }
    finally { setLoading(false); }
  };

  const addDependency = (sourceTask, targetTaskId, lag = 0) => {
    setDeps(prev => ({ ...prev, [targetTaskId]: { parentId: sourceTask.id, lag } }));
    cascadeFrom(sourceTask.id, lag, targetTaskId);
    setLinkMode(false); setLinkSource(null);
    showToast(`Linked: +${lag} days dependency set`);
  };

  const removeDependency = taskId => {
    setDeps(prev => { const n = { ...prev }; delete n[taskId]; return n; });
    showToast("Dependency removed");
  };

  const cascadeFrom = (predId, lag, targetId) => {
    setTasks(prev => {
      const pred = prev.find(t => t.id === predId);
      const target = prev.find(t => t.id === targetId);
      if (!pred?.endDate || !target) return prev;
      const newStart = new Date(fmtDate(pred.endDate));
      newStart.setDate(newStart.getDate() + lag);
      const dur = calcDays(fmtDate(target.startDate), fmtDate(target.endDate));
      const newEnd = new Date(newStart);
      if (dur !== "-") newEnd.setDate(newEnd.getDate() + Number(dur));
      const ns = newStart.toISOString().substring(0, 10);
      const ne = newEnd.toISOString().substring(0, 10);
      axios.put(`${API_TASK}/${targetId}/dates`, { startDate: ns, endDate: ne }).catch(console.error);
      return prev.map(t => t.id === targetId ? { ...t, startDate: ns, endDate: ne } : t);
    });
  };

  const cascadeAll = savedId => {
    Object.entries(deps).forEach(([childId, dep]) => {
      if (String(dep.parentId) === String(savedId)) cascadeFrom(savedId, dep.lag, Number(childId));
    });
  };

  const deleteTask = async id => {
    if (!window.confirm("Delete this task and all its sub-tasks?")) return;
    try {
      await axios.delete(`${API_TASK}/${id}`);
      setDeps(prev => { const n = { ...prev }; delete n[id]; return n; });
      await loadTasks(selectedProject.id);
      showToast("Deleted.");
    } catch (e) { showToast(e?.response?.data?.message || "Delete failed", "err"); }
  };

  const buildTree = list => {
    const map = {}, roots = [];
    list.forEach(t => (map[t.id] = { ...t, children: [] }));
    list.forEach(t => { t.parentId && map[t.parentId] ? map[t.parentId].children.push(map[t.id]) : roots.push(map[t.id]); });
    return roots;
  };

  const filterTree = (nodes, term) => {
    if (!term) return nodes;
    return nodes.reduce((acc, n) => {
      const hit = n.name?.toLowerCase().includes(term.toLowerCase()) || n.department?.toLowerCase().includes(term.toLowerCase()) || n.actionPerson?.toLowerCase().includes(term.toLowerCase());
      const fc = filterTree(n.children || [], term);
      if (hit || fc.length) acc.push({ ...n, children: fc });
      return acc;
    }, []);
  };

  const toggle = id => { const s = new Set(expanded); s.has(id) ? s.delete(id) : s.add(id); setExpanded(s); };
  const expandAll = () => { setExpanded(new Set(tasks.map(t => t.id))); setAllExpanded(true); };
  const collapseAll = () => { setExpanded(new Set()); setAllExpanded(false); };

  const tree = filterTree(buildTree(tasks), search);
  const lineItems = tasks.filter(t => t.parentId);
  const workOrders = tasks.filter(t => !t.parentId).length;
  const completed = lineItems.filter(t => t.status === "COMPLETED" || t.status === "DONE").length;
  const inProgress = lineItems.filter(t => t.status === "IN_PROGRESS").length;
  const delayed = lineItems.filter(t => t.status === "DELAYED").length;
  const onHold = lineItems.filter(t => t.status === "ON_HOLD").length;
  const dateChanged = lineItems.filter(t => t.prevStartDate || t.prevEndDate).length;
  const avgProgress = lineItems.length ? Math.round(lineItems.reduce((s, t) => s + (t.progressPercent || 0), 0) / lineItems.length) : 0;
  const taskMap = tasks.reduce((m, t) => { m[t.id] = t; return m; }, {});

  const renderRows = (nodes, level = 0) =>
    nodes.map(t => {
      const isWO = !t.parentId;
      const isEditing = editingId === t.id;
      const hasCh = t.children?.length > 0;
      const isOpen = expanded.has(t.id);
      const sm = STATUS_META[t.status] || STATUS_META.NOT_STARTED;
      const tm = TYPE_META[t.taskType];
      const sd = fmtDate(t.startDate), ed = fmtDate(t.endDate);
      const psd = fmtDate(t.prevStartDate), ped = fmtDate(t.prevEndDate);
      const hasDiff = (psd && psd !== sd) || (ped && ped !== ed);
      const depInfo = deps[t.id];
      const depTask = depInfo ? taskMap[depInfo.parentId] : null;
      // Also check localStorage history
      const histCount = getTaskHistory(t.id).length;

      return (
        <React.Fragment key={t.id}>
          {isWO && (
            <tr className="wo-row">
              <td colSpan={showPrevCols ? 17 : 14}>
                <div className="wo-bar">
                  <button className="exp-btn" onClick={() => toggle(t.id)}>
                    {isOpen ? <FaChevronDown size={10}/> : <FaChevronRight size={10}/>}
                  </button>
                  <FaBriefcase size={12} style={{ color: "#fff", opacity: .7, flexShrink: 0 }} />
                  <div className="wo-info">
                    <span className="wo-name">{t.name}</span>
                    <div className="wo-tags">
                      {t.woNumber && <span className="tag">WO#: {t.woNumber}</span>}
                      {t.projectCode && <span className="tag">Code: {t.projectCode}</span>}
                      {sd && <span className="tag tag-dt">{sd}</span>}
                      {ed && <span className="tag tag-dt">→ {ed}</span>}
                      {sd && ed && <span className="tag tag-days">{calcDays(sd,ed)} days</span>}
                    </div>
                  </div>
                  {t.children?.length > 0 && (() => {
                    const kids = t.children;
                    const done = kids.filter(k => k.status==="COMPLETED"||k.status==="DONE").length;
                    const pct = Math.round(kids.reduce((s,k) => s+(k.progressPercent||0),0)/kids.length);
                    return (
                      <div className="wo-prog">
                        <div className="wo-pbar"><div className="wo-pfill" style={{width:`${pct}%`}}/></div>
                        <span className="wo-ptxt">{pct}% · {done}/{kids.length}</span>
                      </div>
                    );
                  })()}
                  <div className="wo-actions">
                    <button className="wo-add" onClick={() => { setAddingTo(t.id); setExpanded(new Set([...expanded, t.id])); }}>
                      <FaPlus size={9}/> Add Item
                    </button>
                    <button className="wo-del" onClick={() => deleteTask(t.id)}><FaTrash size={9}/></button>
                  </div>
                </div>
              </td>
            </tr>
          )}

          {isWO && addingTo === t.id && (
            <tr className="add-row">
              <td colSpan={showPrevCols ? 17 : 14}>
                <div className="add-bar" style={{ paddingLeft: 36 }}>
                  <span className="add-pre">+</span>
                  <input autoFocus className="add-in" placeholder="Line item name…" value={newTaskName}
                    onChange={e => setNewTaskName(e.target.value)}
                    onKeyDown={e => { if(e.key==="Enter") addChild(t.id); if(e.key==="Escape"){setAddingTo(null);setNewTaskName("");} }}/>
                  <button className="btn-ok" onClick={() => addChild(t.id)} disabled={loading}>Add</button>
                  <button className="btn-no" onClick={() => { setAddingTo(null); setNewTaskName(""); }}>Cancel</button>
                </div>
              </td>
            </tr>
          )}

          {!isWO && (
            <tr
              className={`li-row${linkMode?" link-pick":""}${linkSource?.id===t.id?" link-sel":""}${hasDiff?" has-diff":""}`}
              onClick={() => {
                if (!linkMode) return;
                if (!linkSource) { setLinkSource({ id: t.id, name: t.name, endDate: t.endDate }); }
                else if (linkSource.id !== t.id) { addDependency(linkSource, t.id, linkLag); }
              }}>

              {/* WBS */}
              <td className="td-wbs">
                <div className="wbs-cell" style={{ paddingLeft: level * 16 }}>
                  {hasCh
                    ? <button className="exp-sm" onClick={e => { e.stopPropagation(); toggle(t.id); }}>
                        {isOpen ? <FaChevronDown size={8}/> : <FaChevronRight size={8}/>}
                      </button>
                    : <span className="no-exp"/>
                  }
                  <span className="wbs-num">{t.wbsId||"—"}</span>
                  {depInfo && <span className="dep-dot" title={`Dep: ${depTask?.name||""} +${depInfo.lag}d`}><FaLink size={7}/></span>}
                </div>
              </td>

              {/* Name */}
              <td className="td-name">
                {isEditing
                  ? <input className="ei" value={editForm.name||""} onChange={e => setEditForm({...editForm, name: e.target.value})}/>
                  : <div className="name-cell">
                      <span className="li-name">{t.name}</span>
                      {depTask && <span className="dep-pill"><FaLink size={7}/> {depTask.wbsId}</span>}
                    </div>
                }
              </td>

              {/* Type */}
              <td className="td-type">
                {isEditing
                  ? <select className="es" value={editForm.taskType||""} onChange={e => setEditForm({...editForm, taskType: e.target.value})}>
                      <option value="">—</option>
                      {TASK_TYPES.map(tt => <option key={tt.v} value={tt.v}>{tt.v} — {tt.label}</option>)}
                    </select>
                  : tm
                    ? <span className="type-pill" style={{background:tm.color+"18",color:tm.color,border:`1px solid ${tm.color}40`}}>{tm.v}</span>
                    : <span className="dim">—</span>
                }
              </td>

              {/* Sqft */}
              <td className="td-sqft">
                {isEditing
                  ? <input className="ei num" type="number" placeholder="sqft" value={editForm.quantitySqft||""} onChange={e=>setEditForm({...editForm,quantitySqft:e.target.value})}/>
                  : <span className="sqft-val">{t.quantitySqft||"—"}</span>
                }
              </td>

              {/* Dept */}
              <td className="td-dept">
                {isEditing
                  ? <select className="es" value={editForm.department||""} onChange={e=>setEditForm({...editForm,department:e.target.value})}>
                      {DEPARTMENTS.map((d,i) => <option key={i} value={d}>{d||"—"}</option>)}
                    </select>
                  : <span className="dept-pill">{t.department||"—"}</span>
                }
              </td>

              {/* Person */}
              <td className="td-per">
                {isEditing
                  ? <input className="ei" value={editForm.actionPerson||""} onChange={e=>setEditForm({...editForm,actionPerson:e.target.value})}/>
                  : <span className="person-val">{t.actionPerson||"—"}</span>
                }
              </td>

              {/* Start */}
              <td className={`td-dt${hasDiff&&!isEditing?" dt-new":""}`}>
                {isEditing
                  ? <input type="date" className="ei" value={editForm.startDate||""} onChange={e=>setEditForm({...editForm,startDate:e.target.value})}/>
                  : <span className="dt-val">{sd||"—"}</span>
                }
              </td>

              {/* End */}
              <td className={`td-dt${hasDiff&&!isEditing?" dt-new":""}`}>
                {isEditing
                  ? <input type="date" className="ei" value={editForm.endDate||""} onChange={e=>setEditForm({...editForm,endDate:e.target.value})}/>
                  : <span className="dt-val">{ed||"—"}</span>
                }
              </td>

              {/* Prev Start */}
              {showPrevCols && (
                <td className={`td-dt td-prev${hasDiff?" dt-prev-val":""}`}>
                  <span className={hasDiff?"dt-strike":"dim"}>{psd||"—"}</span>
                </td>
              )}

              {/* Prev End */}
              {showPrevCols && (
                <td className={`td-dt td-prev${hasDiff?" dt-prev-val":""}`}>
                  <span className={hasDiff?"dt-strike":"dim"}>{ped||"—"}</span>
                </td>
              )}

              {/* Change Reason */}
              {showPrevCols && (
                <td className="td-reason">
                  {isEditing
                    ? <input className="ei" placeholder="Reason…" value={editForm.dateChangeReason||""} onChange={e=>setEditForm({...editForm,dateChangeReason:e.target.value})}/>
                    : <span className={`reason-txt${hasDiff?" reason-active":""}`} title={t.dateChangeReason}>
                        {t.dateChangeReason||(hasDiff?<span style={{color:"#f59e0b",fontStyle:"italic"}}>No reason</span>:"—")}
                      </span>
                  }
                </td>
              )}

              {/* Days */}
              <td className="td-days"><span className="days-val">{calcDays(sd,ed)}</span></td>

              {/* Progress */}
              <td className="td-prog">
                {isEditing
                  ? <input type="number" min="0" max="100" className="ei num" value={editForm.progressPercent??0} onChange={e=>setEditForm({...editForm,progressPercent:e.target.value})}/>
                  : <div className="prog-row">
                      <div className="prog-bg">
                        <div className="prog-fill" style={{width:`${t.progressPercent||0}%`,background:t.progressPercent>=100?"#10b981":t.progressPercent>=50?"#6366f1":"#94a3b8"}}/>
                      </div>
                      <span className="prog-txt">{t.progressPercent||0}%</span>
                    </div>
                }
              </td>

              {/* Status */}
              <td className="td-status">
                {isEditing
                  ? <select className="es" value={editForm.status||"NOT_STARTED"} onChange={e=>setEditForm({...editForm,status:e.target.value})}>
                      {STATUSES.map((s,i) => <option key={i} value={s}>{STATUS_META[s].label}</option>)}
                    </select>
                  : <span className="status-pill" style={{background:sm.bg,color:sm.color,border:`1px solid ${sm.border}`}}>{sm.label}</span>
                }
              </td>

              {/* Remark */}
              <td className="td-rem">
                {isEditing
                  ? <input className="ei" value={editForm.remark||""} onChange={e=>setEditForm({...editForm,remark:e.target.value})}/>
                  : <span className="rem-txt" title={t.remark}>{t.remark||"—"}</span>
                }
              </td>

              {/* Actions */}
              <td className="td-act">
                {isEditing
                  ? <div className="act-row">
                      <button className="ib save" title="Save" onClick={handleSaveEdit} disabled={loading}><FaSave size={10}/></button>
                      <button className="ib canc" title="Cancel" onClick={()=>setEditingId(null)}><FaTimes size={10}/></button>
                    </div>
                  : <div className="act-row">
                      <button className={`ib hist${histCount>0?" hist-has":""}`} title={`Date History (${histCount} entries)`} onClick={()=>setHistoryTask(t)}>
                        <FaHistory size={9}/>
                        {histCount > 0 && <span className="hist-cnt">{histCount}</span>}
                      </button>
                      <button className="ib add" title="Add sub-task" onClick={()=>{setAddingTo(t.id);setExpanded(new Set([...expanded,t.id]));}}><FaPlus size={9}/></button>
                      <button className="ib edt" title="Edit" onClick={()=>{
                        setEditingId(t.id);
                        setEditForm({
                          name:t.name, department:t.department||"", actionPerson:t.actionPerson||"",
                          quantitySqft:t.quantitySqft||"", startDate:fmtDate(t.startDate), endDate:fmtDate(t.endDate),
                          progressPercent:t.progressPercent||0, status:t.status||"NOT_STARTED",
                          remark:t.remark||"", taskType:t.taskType||"", dateChangeReason:t.dateChangeReason||"",
                        });
                      }}><FaEdit size={9}/></button>
                      {depInfo && <button className="ib unlink" title="Remove dependency" onClick={()=>removeDependency(t.id)}><FaUnlink size={8}/></button>}
                      <button className="ib del" title="Delete" onClick={()=>deleteTask(t.id)}><FaTrash size={9}/></button>
                    </div>
                }
              </td>
            </tr>
          )}

          {!isWO && addingTo === t.id && (
            <tr className="add-row">
              <td colSpan={showPrevCols ? 17 : 14}>
                <div className="add-bar" style={{ paddingLeft: (level+1)*16+32 }}>
                  <span className="add-pre">{t.wbsId}.x</span>
                  <input autoFocus className="add-in" placeholder="Sub-task…" value={newTaskName}
                    onChange={e=>setNewTaskName(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter")addChild(t.id);if(e.key==="Escape"){setAddingTo(null);setNewTaskName("");}}}/>
                  <button className="btn-ok" onClick={()=>addChild(t.id)} disabled={loading}>Add</button>
                  <button className="btn-no" onClick={()=>{setAddingTo(null);setNewTaskName("");}}>Cancel</button>
                </div>
              </td>
            </tr>
          )}

          {isOpen && t.children?.length > 0 && renderRows(t.children, level+1)}
        </React.Fragment>
      );
    });

  return (
    <div className="app">
      {/* Toast */}
      {toast.msg && (
        <div className={`toast${toast.type==="err"?" toast-err":""}`}>
          <FaCheckCircle size={13}/> {toast.msg}
        </div>
      )}

      {showPDFModal && <PDFExportModal tasks={tasks} selectedProject={selectedProject} deps={deps} onClose={()=>setShowPDFModal(false)}/>}
      {historyTask && <DateHistoryModal task={historyTask} onClose={()=>setHistoryTask(null)}/>}
      {dateReasonModal && (
        <DateReasonModal
          task={dateReasonModal.task}
          newStart={editForm.startDate}
          newEnd={editForm.endDate}
          onConfirm={reason => doSaveEdit(reason)}
          onSkip={() => doSaveEdit(null)}
          onCancel={() => setDateReasonModal(null)}
        />
      )}

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><FaTable size={13}/></div>
          <div className="brand-text"><span className="brand-main">PLANNING</span><span className="brand-sub">DASHBOARD</span></div>
        </div>
        <div className="sidebar-section">PROJECTS</div>
        <div className="proj-list">
          {projects.map(p => (
            <div key={p.id} className={`proj-item${selectedProject?.id===p.id?" active":""}`} onClick={()=>setSelectedProject(p)}>
              {selectedProject?.id===p.id ? <FaFolderOpen size={12}/> : <FaFolder size={12}/>}
              <span>{p.projectName}</span>
            </div>
          ))}
        </div>
        <button className="btn-new-proj" onClick={()=>setShowProjectForm(v=>!v)}><FaPlus size={9}/> New Project</button>
        {showProjectForm && (
          <div className="new-proj-form">
            <input placeholder="Project name…" value={newProjectName} onChange={e=>setNewProjectName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&createProject()}/>
            <button onClick={createProject} disabled={loading}>Create</button>
          </div>
        )}
        <div className="logout" onClick={()=>{localStorage.removeItem("user");navigate("/");}}>
          <FaSignOutAlt size={11}/> Logout
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* Top bar */}
        <div className="topbar">
          <div className="topbar-left">
            <div>
              <h1 className="topbar-title">{selectedProject ? selectedProject.projectName : "Select a Project"}</h1>
              <p className="topbar-meta">
                {selectedProject
                  ? `${workOrders} work orders · ${lineItems.length} tasks · ${avgProgress}% avg${dateChanged>0?` · ${dateChanged} date changes`:""}`
                  : "Choose a project from the sidebar"}
              </p>
            </div>
          </div>
          <div className="topbar-user">
            <div className="avatar">{user.fullName?.charAt(0)?.toUpperCase()||"P"}</div>
            <span>{user.fullName||"Planning"}</span>
          </div>
        </div>

        {selectedProject && (
          <div className="content">
            {/* Stats row */}
            <div className="stats-row">
              <div className="stat s-wo"><div className="stat-val">{workOrders}</div><div className="stat-lbl">Work Orders</div></div>
              <div className="stat s-all"><div className="stat-val">{lineItems.length}</div><div className="stat-lbl">Total Tasks</div></div>
              <div className="stat s-ip"><div className="stat-val">{inProgress}</div><div className="stat-lbl">In Progress</div></div>
              <div className="stat s-done"><div className="stat-val">{completed}</div><div className="stat-lbl">Completed</div></div>
              <div className="stat s-del"><div className="stat-val">{delayed}</div><div className="stat-lbl">Delayed</div></div>
              <div className="stat s-oh"><div className="stat-val">{onHold}</div><div className="stat-lbl">On Hold</div></div>
              {dateChanged > 0 && <div className="stat s-dc"><div className="stat-val">{dateChanged}</div><div className="stat-lbl">Date Changed</div></div>}
              <div className="stat s-prog">
                <div className="stat-prog-bar"><div className="stat-prog-fill" style={{width:`${avgProgress}%`}}/></div>
                <div className="stat-val">{avgProgress}%</div>
                <div className="stat-lbl">Overall</div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="toolbar">
              <div className="search-box">
                <FaSearch size={11} style={{color:"#94a3b8"}}/>
                <input placeholder="Search tasks, departments, people…" value={search} onChange={e=>setSearch(e.target.value)}/>
                {search && <button className="clr-search" onClick={()=>setSearch("")}><FaTimes size={9}/></button>}
              </div>
              <div className="toolbar-btns">
                <button className="tb-btn" title={allExpanded?"Collapse all":"Expand all"} onClick={allExpanded?collapseAll:expandAll}>
                  {allExpanded ? <FaCompressAlt size={11}/> : <FaExpandAlt size={11}/>}
                </button>
                <button className={`tb-btn${showPrevCols?" tb-btn-on":""}`} title="Toggle Prev Date Columns" onClick={()=>setShowPrevCols(v=>!v)}>
                  <FaClock size={11}/>
                </button>
                <button className="tb-btn tb-btn-pdf" title="Export PDF" onClick={()=>setShowPDFModal(true)} disabled={tasks.length===0}>
                  <FaFilePdf size={12}/>
                </button>
                <button className={`tb-btn${linkMode?" tb-btn-on":""}`} title={linkMode?"Cancel Link Mode":"Set Dependency"} onClick={()=>{setLinkMode(v=>!v);setLinkSource(null);}}>
                  {linkMode ? <FaUnlink size={11}/> : <FaLink size={11}/>}
                </button>
                <button className="btn-primary" onClick={()=>setShowWOForm(v=>!v)}>
                  <FaBriefcase size={11}/> New Work Order
                </button>
              </div>
            </div>

            {/* Link mode banner */}
            {linkMode && (
              <div className="link-banner">
                <FaLink size={10}/>
                {linkSource
                  ? <span>Click the <strong>target task</strong> — it will follow <em>{linkSource.name}</em>'s end date</span>
                  : <span>Click a row to set it as the <strong>predecessor task</strong></span>
                }
                <div className="lag-input">
                  <label>Lag days:</label>
                  <input type="number" value={linkLag} min={-30} max={60} onChange={e=>setLinkLag(Number(e.target.value))}/>
                </div>
                <button className="btn-no" style={{marginLeft:"auto"}} onClick={()=>{setLinkMode(false);setLinkSource(null);}}>Cancel</button>
              </div>
            )}

            {/* Date change legend */}
            {showPrevCols && dateChanged > 0 && (
              <div className="legend-bar">
                <FaHistory size={10}/>
                <strong>{dateChanged}</strong> tasks have changed dates.
                <span className="leg-item"><span className="leg-dot green"/>Current (updated)</span>
                <span className="leg-item"><span className="leg-dot red"/>Previous (struck through)</span>
                <span style={{color:"#94a3b8",fontSize:10}}>Click 🕐 to view full history per task</span>
              </div>
            )}

            {/* WO Form */}
            {showWOForm && (
              <div className="wo-form-card">
                <div className="wo-form-head"><FaClipboardList size={13}/><h4>Create Work Order</h4></div>
                <div className="wo-form-grid">
                  <div className="field fg-2"><label>WO Name *</label>
                    <input placeholder="e.g. TOILET CASEMENT WINDOW WORK SCHEDULE" value={woForm.name} onChange={e=>setWoForm({...woForm,name:e.target.value})} onKeyDown={e=>e.key==="Enter"&&createWorkOrder()}/></div>
                  <div className="field fg-2"><label>WO Number</label>
                    <input placeholder="e.g. ARPL/REGENT/FAÇADE/2025-26/206" value={woForm.woNumber} onChange={e=>setWoForm({...woForm,woNumber:e.target.value})}/></div>
                  <div className="field"><label>Project Code</label>
                    <input placeholder="e.g. ODL1054" value={woForm.projectCode} onChange={e=>setWoForm({...woForm,projectCode:e.target.value})}/></div>
                  <div className="field"><label>Start Date</label>
                    <input type="date" value={woForm.startDate} onChange={e=>setWoForm({...woForm,startDate:e.target.value})}/></div>
                  <div className="field"><label>End Date</label>
                    <input type="date" value={woForm.endDate} onChange={e=>setWoForm({...woForm,endDate:e.target.value})}/></div>
                </div>
                <div className="wo-form-foot">
                  <button className="btn-primary" onClick={createWorkOrder} disabled={loading}>
                    {loading ? <FaCircleNotch className="spin"/> : "Create Work Order"}
                  </button>
                  <button className="btn-ghost" onClick={()=>setShowWOForm(false)}>Cancel</button>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="table-wrap">
              {fetching ? (
                <div className="loading-state"><FaCircleNotch className="spin-lg"/> Loading tasks…</div>
              ) : tasks.length === 0 ? (
                <div className="empty-state">
                  <FaClipboardList size={40}/>
                  <p>No work orders yet</p>
                  <span>Click <strong>New Work Order</strong> to get started.</span>
                </div>
              ) : (
                <table className="main-table">
                  <thead>
                    <tr>
                      <th className="th-wbs">WBS</th>
                      <th className="th-name">Task / Material Details</th>
                      <th className="th-type">Type</th>
                      <th className="th-sqft">Qty (sqft)</th>
                      <th className="th-dept">Department</th>
                      <th className="th-per">Action Person</th>
                      <th className="th-dt">Plan Start</th>
                      <th className="th-dt">Plan End</th>
                      {showPrevCols && <th className="th-dt th-prev">Prev Start</th>}
                      {showPrevCols && <th className="th-dt th-prev">Prev End</th>}
                      {showPrevCols && <th className="th-reason th-prev">Change Reason</th>}
                      <th className="th-days">Days</th>
                      <th className="th-prog">Progress</th>
                      <th className="th-sts">Status</th>
                      <th className="th-rem">Remark</th>
                      <th className="th-act">Actions</th>
                    </tr>
                  </thead>
                  <tbody>{renderRows(tree)}</tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {!selectedProject && (
          <div className="no-project">
            <FaFolderOpen size={48}/>
            <h2>No Project Selected</h2>
            <p>Pick a project from the sidebar or create a new one.</p>
          </div>
        )}
      </main>

      <style>{`
/* ─── RESET & BASE ─── */
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',system-ui,sans-serif;font-size:13px;background:#eef2f7}
.app{display:flex;height:100vh;overflow:hidden}

/* ─── TOAST ─── */
.toast{position:fixed;top:16px;right:16px;background:#1e3a5f;color:#fff;padding:10px 18px;border-radius:8px;display:flex;align-items:center;gap:8px;font-size:12px;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,.25);animation:toastIn .2s ease}
.toast-err{background:#dc2626}
@keyframes toastIn{from{transform:translateX(110%)}to{transform:translateX(0)}}

/* ─── SIDEBAR ─── */
.sidebar{width:210px;background:#1e3a5f;display:flex;flex-direction:column;padding:16px 12px;flex-shrink:0;overflow-y:auto}
.brand{display:flex;align-items:center;gap:10px;margin-bottom:22px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,.1)}
.brand-icon{background:rgba(255,255,255,.15);width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0}
.brand-text{display:flex;flex-direction:column;gap:1px}
.brand-main{font-size:11px;font-weight:800;letter-spacing:2px;color:#fff}
.brand-sub{font-size:8px;letter-spacing:1px;color:rgba(255,255,255,.45);font-weight:600}
.sidebar-section{font-size:9px;font-weight:700;color:rgba(255,255,255,.3);letter-spacing:1.5px;margin-bottom:6px;padding:0 4px}
.proj-list{margin-bottom:8px;flex:1;overflow-y:auto}
.proj-item{display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:6px;cursor:pointer;color:rgba(255,255,255,.55);font-size:12px;margin-bottom:2px;transition:all .15s;white-space:nowrap;overflow:hidden}
.proj-item span{overflow:hidden;text-overflow:ellipsis}
.proj-item:hover{background:rgba(255,255,255,.08);color:#fff}
.proj-item.active{background:rgba(255,255,255,.18);color:#fff;font-weight:600}
.btn-new-proj{display:flex;align-items:center;gap:6px;width:100%;background:transparent;border:1px dashed rgba(255,255,255,.2);color:rgba(255,255,255,.45);padding:7px 9px;border-radius:6px;cursor:pointer;font-size:11px;transition:all .15s;margin-bottom:6px}
.btn-new-proj:hover{border-color:rgba(255,255,255,.5);color:rgba(255,255,255,.8)}
.new-proj-form{margin-bottom:8px;display:flex;flex-direction:column;gap:5px}
.new-proj-form input{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:#fff;padding:7px 9px;border-radius:6px;font-size:12px;outline:none}
.new-proj-form input::placeholder{color:rgba(255,255,255,.35)}
.new-proj-form input:focus{border-color:rgba(255,255,255,.4)}
.new-proj-form button{background:rgba(255,255,255,.18);color:#fff;border:none;padding:7px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;transition:background .15s}
.new-proj-form button:hover{background:rgba(255,255,255,.28)}
.logout{display:flex;align-items:center;gap:8px;padding:9px 7px;color:rgba(255,255,255,.35);cursor:pointer;font-size:12px;border-radius:6px;transition:all .15s;margin-top:auto}
.logout:hover{color:#ef4444;background:rgba(239,68,68,.1)}

/* ─── MAIN ─── */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;background:#f1f5f9}

/* ─── TOPBAR ─── */
.topbar{background:#fff;padding:10px 20px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e2e8f0;flex-shrink:0;gap:12px}
.topbar-title{font-size:15px;font-weight:700;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.topbar-meta{font-size:11px;color:#64748b;margin-top:1px;white-space:nowrap}
.topbar-user{display:flex;align-items:center;gap:8px;font-size:12px;color:#475569;flex-shrink:0}
.avatar{background:#1e3a5f;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;flex-shrink:0}

/* ─── CONTENT AREA ─── */
.content{flex:1;overflow-y:auto;padding:12px 16px;display:flex;flex-direction:column;gap:10px}

/* ─── STATS ─── */
.stats-row{display:flex;gap:8px;flex-wrap:wrap;flex-shrink:0}
.stat{background:#fff;border-radius:8px;padding:8px 14px;display:flex;align-items:center;gap:8px;border:1px solid #e2e8f0;min-width:0}
.stat-val{font-size:18px;font-weight:700;line-height:1;color:#1e3a5f}
.stat-lbl{font-size:9px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap}
.s-ip .stat-val{color:#2563eb}
.s-done .stat-val{color:#16a34a}
.s-del .stat-val{color:#dc2626}
.s-oh .stat-val{color:#d97706}
.s-dc{border:1px solid #fca5a5}.s-dc .stat-val{color:#dc2626}
.stat-prog-bar{width:48px;height:4px;background:#e2e8f0;border-radius:99px;overflow:hidden}
.stat-prog-fill{height:100%;background:#1e3a5f;border-radius:99px;transition:width .4s}

/* ─── TOOLBAR ─── */
.toolbar{display:flex;gap:8px;align-items:center;flex-shrink:0;background:#fff;padding:8px 12px;border-radius:8px;border:1px solid #e2e8f0}
.search-box{display:flex;align-items:center;gap:6px;flex:1;padding:0 4px}
.search-box input{border:none;outline:none;font-size:12px;width:100%;background:transparent;color:#334155}
.clr-search{background:none;border:none;cursor:pointer;color:#94a3b8;padding:0;display:flex}
.toolbar-btns{display:flex;gap:6px;align-items:center;flex-shrink:0}
.tb-btn{background:#f8fafc;border:1px solid #e2e8f0;color:#64748b;width:30px;height:30px;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0}
.tb-btn:hover{background:#eef2ff;border-color:#6366f1;color:#6366f1}
.tb-btn:disabled{opacity:.4;cursor:not-allowed}
.tb-btn-on{background:#eef2ff !important;border-color:#6366f1 !important;color:#6366f1 !important}
.tb-btn-pdf{color:#dc2626 !important}.tb-btn-pdf:hover{border-color:#dc2626 !important;background:#fef2f2 !important}
.btn-primary{display:flex;align-items:center;gap:6px;background:#1e3a5f;color:#fff;border:none;padding:7px 14px;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600;white-space:nowrap;transition:background .15s;flex-shrink:0}
.btn-primary:hover{background:#1e4d8c}
.btn-primary:disabled{opacity:.6;cursor:not-allowed}
.btn-ghost{background:#f1f5f9;color:#475569;border:none;padding:7px 12px;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600;transition:all .15s}
.btn-ghost:hover{background:#e2e8f0}

/* ─── LINK BANNER ─── */
.link-banner{display:flex;align-items:center;gap:10px;background:#eef2ff;border:1px solid #c7d2fe;border-radius:8px;padding:8px 14px;font-size:12px;color:#3730a3;flex-shrink:0;flex-wrap:wrap}
.lag-input{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:600}
.lag-input input{width:48px;padding:2px 6px;border-radius:5px;border:1px solid #c7d2fe;font-size:12px;outline:none;text-align:center}

/* ─── LEGEND BAR ─── */
.legend-bar{display:flex;align-items:center;gap:10px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:7px 14px;font-size:11px;color:#92400e;flex-shrink:0;flex-wrap:wrap}
.leg-item{display:flex;align-items:center;gap:4px;font-weight:600}
.leg-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.leg-dot.green{background:#16a34a}
.leg-dot.red{background:#dc2626}

/* ─── WO FORM CARD ─── */
.wo-form-card{background:#fff;border-radius:10px;padding:14px 16px;border:1px solid #e2e8f0;flex-shrink:0}
.wo-form-head{display:flex;align-items:center;gap:8px;margin-bottom:12px;color:#1e3a5f}
.wo-form-head h4{font-size:13px;font-weight:700;color:#0f172a}
.wo-form-grid{display:grid;grid-template-columns:2fr 2fr 1fr 1fr 1fr;gap:10px;margin-bottom:12px}
.field{display:flex;flex-direction:column;gap:3px}
.fg-2{grid-column:span 1}
.field label{font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px}
.field input,.field select{border:1px solid #e2e8f0;border-radius:6px;padding:6px 9px;font-size:12px;outline:none;color:#1e293b;transition:border-color .15s;background:#fff}
.field input:focus{border-color:#1e3a5f;box-shadow:0 0 0 3px rgba(30,58,95,.08)}
.wo-form-foot{display:flex;gap:8px}

/* ─── TABLE WRAP ─── */
.table-wrap{background:#fff;border-radius:10px;overflow:auto;border:1px solid #e2e8f0;flex:1;min-height:0}
.main-table{width:100%;border-collapse:collapse;min-width:1400px}

/* ─── TABLE HEAD ─── */
.main-table thead tr{background:#1e3a5f;position:sticky;top:0;z-index:3}
.main-table th{padding:8px 10px;text-align:left;font-size:9px;font-weight:700;color:rgba(255,255,255,.75);text-transform:uppercase;letter-spacing:.5px;white-space:nowrap;border-right:1px solid rgba(255,255,255,.08)}
.main-table th:last-child{border-right:none}
.th-prev{background:#2d4d6e !important;color:rgba(255,200,100,.85) !important}
.th-wbs{width:78px}.th-name{min-width:190px}.th-type{width:68px}.th-sqft{width:82px}
.th-dept{width:115px}.th-per{width:105px}.th-dt{width:92px}
.th-reason{width:145px}.th-days{width:48px;text-align:center}.th-prog{width:110px}
.th-sts{width:98px}.th-rem{width:100px}.th-act{width:105px}

/* ─── WO ROW ─── */
.wo-row td{padding:0;border-bottom:2px solid #c7d2fe}
.wo-bar{display:flex;align-items:center;gap:9px;background:linear-gradient(90deg,#1e3a5f 0%,#2d5282 100%);padding:8px 12px;min-height:44px}
.exp-btn{background:rgba(255,255,255,.2);border:none;border-radius:4px;width:18px;height:18px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;flex-shrink:0;transition:background .15s}
.exp-btn:hover{background:rgba(255,255,255,.35)}
.wo-info{flex:1;min-width:0}
.wo-name{font-size:12px;font-weight:700;color:#fff;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wo-tags{display:flex;align-items:center;gap:4px;margin-top:3px;flex-wrap:wrap}
.tag{font-size:10px;background:rgba(255,255,255,.15);color:rgba(255,255,255,.85);padding:1px 6px;border-radius:3px;white-space:nowrap}
.tag-dt{background:rgba(255,255,255,.1)}
.tag-days{background:rgba(255,200,100,.2);color:rgba(255,220,120,1);font-weight:700}
.wo-prog{display:flex;flex-direction:column;gap:2px;min-width:80px;flex-shrink:0}
.wo-pbar{height:3px;background:rgba(255,255,255,.2);border-radius:99px;overflow:hidden}
.wo-pfill{height:100%;background:rgba(255,255,255,.8);border-radius:99px}
.wo-ptxt{font-size:10px;color:rgba(255,255,255,.7);font-weight:600;white-space:nowrap}
.wo-actions{display:flex;align-items:center;gap:5px;flex-shrink:0}
.wo-add{display:flex;align-items:center;gap:4px;background:rgba(255,255,255,.15);color:#fff;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;font-size:11px;font-weight:600;transition:background .15s;white-space:nowrap}
.wo-add:hover{background:rgba(255,255,255,.28)}
.wo-del{background:rgba(239,68,68,.2);color:rgba(255,200,200,1);border:none;width:24px;height:24px;border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s}
.wo-del:hover{background:rgba(239,68,68,.4)}

/* ─── LINE ITEM ROW ─── */
.li-row td{padding:5px 9px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#334155;vertical-align:middle;border-right:1px solid #f8fafc}
.li-row:hover td{background:#f8fafc !important}
.li-row:nth-child(even) td{background:#fafafa}
.has-diff td:nth-child(7),.has-diff td:nth-child(8){background:#f0fdf4 !important;color:#15803d !important}
.li-row.link-pick{cursor:crosshair !important}
.li-row.link-pick:hover td{background:#eef2ff !important;outline:2px dashed #6366f1}
.li-row.link-sel td{background:#e0e7ff !important}

/* ─── CELLS ─── */
.wbs-cell{display:flex;align-items:center;gap:3px}
.exp-sm{background:#e2e8f0;border:none;border-radius:3px;width:15px;height:15px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#475569;flex-shrink:0;transition:all .15s}
.exp-sm:hover{background:#1e3a5f;color:#fff}
.no-exp{width:15px;flex-shrink:0;display:inline-block}
.wbs-num{font-size:10px;color:#94a3b8;font-weight:700;white-space:nowrap}
.dep-dot{background:#6366f1;color:#fff;border-radius:3px;width:12px;height:12px;display:inline-flex;align-items:center;justify-content:center;margin-left:2px;cursor:help;flex-shrink:0}
.name-cell{display:flex;align-items:center;gap:5px}
.li-name{font-size:12px;color:#1e293b;font-weight:500}
.dep-pill{display:inline-flex;align-items:center;gap:3px;background:#ede9fe;color:#5b21b6;font-size:9px;font-weight:700;padding:1px 5px;border-radius:3px;white-space:nowrap;flex-shrink:0}
.type-pill{font-size:11px;font-weight:800;padding:2px 7px;border-radius:4px;display:inline-block;letter-spacing:.5px}
.sqft-val{font-size:11px;color:#0369a1;font-weight:600}
.dept-pill{font-size:10px;background:#f1f5f9;color:#475569;padding:2px 6px;border-radius:3px;white-space:nowrap;display:inline-block}
.person-val{font-size:11px;color:#334155}
.dt-val{font-size:11px;color:#475569;white-space:nowrap}
.dt-new .dt-val{color:#15803d !important;font-weight:700}
.td-prev{background:#fffbeb !important}
.dt-prev-val{background:#fff7ed !important}
.dt-strike{font-size:11px;color:#dc2626;text-decoration:line-through;white-space:nowrap}
.dim{color:#d1d5db;font-size:11px}
.reason-txt{font-size:11px;color:#94a3b8;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:143px}
.reason-active{color:#a16207;font-weight:500}
.days-val{font-size:11px;font-weight:700;color:#1e3a5f;display:block;text-align:center}
.prog-row{display:flex;align-items:center;gap:5px}
.prog-bg{flex:1;background:#e2e8f0;border-radius:99px;height:4px;overflow:hidden}
.prog-fill{height:4px;border-radius:99px;transition:width .3s}
.prog-txt{font-size:10px;color:#64748b;min-width:26px;text-align:right}
.status-pill{font-size:10px;font-weight:600;padding:2px 7px;border-radius:4px;white-space:nowrap;display:inline-block}
.rem-txt{font-size:11px;color:#94a3b8;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:98px}

/* ─── ACTIONS ─── */
.act-row{display:flex;gap:3px;flex-wrap:wrap}
.ib{border:none;border-radius:4px;cursor:pointer;width:21px;height:21px;display:flex;align-items:center;justify-content:center;transition:all .15s;position:relative}
.ib:hover{filter:brightness(.88)}
.ib:disabled{opacity:.5;cursor:not-allowed}
.ib.add{background:#dcfce7;color:#15803d}
.ib.edt{background:#dbeafe;color:#1d4ed8}
.ib.del{background:#fee2e2;color:#b91c1c}
.ib.save{background:#dcfce7;color:#15803d}
.ib.canc{background:#f1f5f9;color:#475569}
.ib.unlink{background:#ede9fe;color:#5b21b6}
.ib.hist{background:#fff7ed;color:#d97706}
.ib.hist-has{background:#fef3c7;color:#b45309;box-shadow:0 0 0 1px #fde68a}
.hist-cnt{position:absolute;top:-4px;right:-4px;background:#ef4444;color:#fff;font-size:7px;font-weight:700;border-radius:99px;min-width:12px;height:12px;display:flex;align-items:center;justify-content:center;padding:0 2px;line-height:1}

/* ─── EDIT INPUTS ─── */
.ei{border:1px solid #93c5fd;border-radius:4px;padding:3px 6px;font-size:12px;outline:none;width:100%;color:#1e293b;box-shadow:0 0 0 2px rgba(59,130,246,.1)}
.ei.num{width:70px}
.es{border:1px solid #93c5fd;border-radius:4px;padding:3px 5px;font-size:11px;outline:none;width:100%;color:#1e293b;background:#fff}

/* ─── ADD ROW ─── */
.add-row td{background:#eef2ff;padding:5px 10px;border-bottom:1px solid #c7d2fe}
.add-bar{display:flex;align-items:center;gap:7px}
.add-pre{font-size:11px;font-weight:700;color:#6366f1;white-space:nowrap;min-width:26px}
.add-in{border:1px solid #6366f1;border-radius:6px;padding:5px 9px;font-size:12px;outline:none;flex:1;color:#1e293b;box-shadow:0 0 0 3px rgba(99,102,241,.08)}
.btn-ok{background:#1e3a5f;color:#fff;border:none;padding:5px 11px;border-radius:5px;cursor:pointer;font-size:12px;font-weight:600;transition:background .15s}
.btn-ok:hover{background:#1e4d8c}
.btn-ok:disabled{opacity:.6;cursor:not-allowed}
.btn-no{background:#f1f5f9;color:#475569;border:none;padding:5px 9px;border-radius:5px;cursor:pointer;font-size:12px;transition:all .15s}
.btn-no:hover{background:#e2e8f0}

/* ─── STATES ─── */
.loading-state{display:flex;align-items:center;justify-content:center;gap:12px;height:180px;color:#94a3b8;font-size:13px}
.empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;height:260px;color:#94a3b8;gap:10px;text-align:center}
.empty-state p{font-size:14px;font-weight:600;color:#64748b}
.empty-state span{font-size:12px;color:#94a3b8}
.no-project{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;color:#94a3b8;gap:12px}
.no-project h2{font-size:16px;color:#64748b;font-weight:600}
.no-project p{font-size:12px}
.spin{animation:rot 1s linear infinite;display:inline-block}
.spin-lg{font-size:24px;animation:rot 1s linear infinite;color:#1e3a5f}
@keyframes rot{from{transform:rotate(0)}to{transform:rotate(360deg)}}

/* ─── SCROLLBARS ─── */
.table-wrap::-webkit-scrollbar,.content::-webkit-scrollbar{width:5px;height:5px}
.table-wrap::-webkit-scrollbar-track,.content::-webkit-scrollbar-track{background:transparent}
.table-wrap::-webkit-scrollbar-thumb,.content::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
.table-wrap::-webkit-scrollbar-thumb:hover,.content::-webkit-scrollbar-thumb:hover{background:#94a3b8}
.sidebar::-webkit-scrollbar{width:3px}
.sidebar::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}

/* ─── MODALS ─── */
.overlay{position:fixed;inset:0;background:rgba(15,23,42,.6);display:flex;align-items:center;justify-content:center;z-index:10000;backdrop-filter:blur(4px);padding:16px}
.modal{background:#fff;border-radius:14px;width:100%;max-width:600px;display:flex;flex-direction:column;box-shadow:0 24px 60px rgba(0,0,0,.3);max-height:90vh;overflow:hidden;animation:modalIn .2s ease}
@keyframes modalIn{from{transform:scale(.95) translateY(10px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
.modal-head{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #f1f5f9;flex-shrink:0;background:#fafbff}
.modal-head-left{display:flex;align-items:center;gap:10px}
.modal-title{font-size:14px;font-weight:700;color:#0f172a}
.modal-sub{font-size:11px;color:#64748b;margin-top:1px}
.icon-btn{background:#f1f5f9;border:none;width:26px;height:26px;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#64748b;transition:all .15s}
.icon-btn:hover{background:#fee2e2;color:#ef4444}
.modal-body{overflow-y:auto;flex:1}
.modal-body::-webkit-scrollbar{width:4px}
.modal-body::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:2px}
.modal-section{padding:14px 18px;border-bottom:1px solid #f8fafc}
.modal-section:last-child{border-bottom:none}
.section-hd{display:flex;align-items:center;gap:7px;font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.7px;margin-bottom:10px}
.modal-foot{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-top:1px solid #f1f5f9;background:#fafbff;border-radius:0 0 14px 14px;gap:10px;flex-wrap:wrap;flex-shrink:0}
.foot-chips{display:flex;gap:5px}
.foot-chip{background:#f1f5f9;color:#64748b;font-size:10px;font-weight:600;padding:3px 8px;border-radius:4px}

/* PDF Modal specifics */
.radio-row{display:flex;gap:7px;margin-bottom:10px;flex-wrap:wrap}
.radio-pill{display:flex;align-items:center;gap:6px;padding:5px 11px;border:1px solid #e2e8f0;border-radius:6px;cursor:pointer;font-size:12px;color:#475569;transition:all .15s;user-select:none}
.radio-pill input{display:none}
.radio-pill:hover{border-color:#1e3a5f;color:#1e3a5f}
.radio-pill.active{background:#eef2ff;border-color:#6366f1;color:#4338ca;font-weight:600}
.date-range{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:8px}
.date-f{display:flex;flex-direction:column;gap:3px}
.date-f label{font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px}
.date-f input{border:1px solid #e2e8f0;border-radius:6px;padding:5px 8px;font-size:12px;outline:none;color:#1e293b}
.date-f input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.08)}
.date-sep{font-size:14px;color:#94a3b8;margin-top:13px;font-weight:700}
.clr-btn{display:flex;align-items:center;gap:3px;background:#fee2e2;color:#b91c1c;border:none;padding:4px 8px;border-radius:5px;cursor:pointer;font-size:11px;font-weight:600;margin-top:13px}
.month-row{display:flex;align-items:center;gap:9px;margin-bottom:8px;font-size:12px;color:#475569;font-weight:600}
.month-row input{border:1px solid #e2e8f0;border-radius:6px;padding:5px 8px;font-size:12px;outline:none;color:#1e293b}
.filter-badge{display:inline-flex;align-items:center;gap:5px;background:#f0fdf4;border:1px solid #bbf7d0;color:#15803d;padding:3px 9px;border-radius:5px;font-size:11px;font-weight:600;margin-top:4px}
.toggle-all{margin-left:auto;background:none;border:none;cursor:pointer;font-size:10px;color:#6366f1;font-weight:600;padding:2px 6px;border-radius:4px;text-transform:none;letter-spacing:0}
.toggle-all:hover{background:#eef2ff}
.col-chips{display:flex;flex-wrap:wrap;gap:6px}
.col-chip{display:flex;align-items:center;gap:5px;padding:5px 10px;border:1px solid #e2e8f0;border-radius:6px;cursor:pointer;font-size:12px;color:#475569;transition:all .15s;user-select:none}
.col-chip input{display:none}
.chip-dot{width:6px;height:6px;border-radius:50%;background:#e2e8f0;flex-shrink:0;transition:background .15s}
.col-chip:hover{border-color:#1e3a5f;color:#1e3a5f}
.col-chip.on{background:#eef2ff;border-color:#6366f1;color:#4338ca;font-weight:600}
.col-chip.on .chip-dot{background:#6366f1}
.warn-pill{font-size:11px;color:#b91c1c;background:#fee2e2;padding:5px 10px;border-radius:5px;margin-top:6px}
.layout-row{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.toggle-chip{display:flex;align-items:center;gap:7px;padding:6px 11px;border:1px solid #e2e8f0;border-radius:7px;cursor:pointer;font-size:12px;color:#475569;transition:all .15s;user-select:none}
.toggle-chip input{accent-color:#6366f1;width:13px;height:13px;cursor:pointer}
.toggle-chip.on{background:#eef2ff;border-color:#6366f1;color:#4338ca;font-weight:600}
.sort-pick{display:flex;align-items:center;gap:8px;font-size:12px;color:#475569;font-weight:600}
.sort-pick select{border:1px solid #e2e8f0;border-radius:6px;padding:5px 9px;font-size:12px;outline:none;color:#1e293b;background:#fff;cursor:pointer}
.sort-pick select:focus{border-color:#6366f1}
.btn-pdf{display:flex;align-items:center;gap:6px;background:#dc2626;color:#fff;border:none;padding:8px 16px;border-radius:7px;cursor:pointer;font-size:13px;font-weight:700;transition:background .15s}
.btn-pdf:hover{background:#b91c1c}
.btn-pdf:disabled{opacity:.5;cursor:not-allowed}

/* Date Reason Modal */
.date-diff-row{display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap}
.diff-prev{flex:1;background:#fee2e2;border:1px solid #fca5a5;border-radius:8px;padding:10px 12px}
.diff-new{flex:1;background:#dcfce7;border:1px solid #86efac;border-radius:8px;padding:10px 12px}
.diff-label{font-size:9px;font-weight:700;text-transform:uppercase;margin-bottom:4px;letter-spacing:.5px}
.diff-prev .diff-label{color:#b91c1c}
.diff-new .diff-label{color:#15803d}
.diff-val{font-size:12px;font-weight:600}
.diff-prev .diff-val{color:#7f1d1d}
.diff-new .diff-val{color:#14532d}
.field-group{margin-bottom:10px}
.field-label{font-size:11px;font-weight:700;color:#475569;display:block;margin-bottom:6px}
.reason-area{width:100%;border:1px solid #93c5fd;border-radius:7px;padding:8px 10px;font-size:13px;outline:none;resize:vertical;min-height:75px;color:#1e293b;box-shadow:0 0 0 3px rgba(59,130,246,.08);font-family:inherit}
.reason-area:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}
.info-note{display:flex;align-items:flex-start;gap:6px;font-size:11px;color:#94a3b8;line-height:1.5}

/* History Modal */
.empty-hist{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;color:#94a3b8;text-align:center;gap:10px}
.empty-hist p{font-size:13px;color:#64748b;font-weight:500}
.empty-hist span{font-size:11px;color:#94a3b8}
.hist-list{display:flex;flex-direction:column;gap:9px;padding:14px 18px}
.hist-item{border:1px solid #e2e8f0;border-radius:9px;padding:11px 13px;background:#fafbff}
.hist-latest{border-color:#c7d2fe;background:#eef2ff}
.hist-meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.hist-label{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.7px;padding:2px 7px;border-radius:3px}
.label-latest{background:#c7d2fe;color:#3730a3}
.label-old{background:#f1f5f9;color:#64748b}
.hist-time{font-size:10px;color:#94a3b8}
.hist-dates{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px}
.hist-prev{background:#fee2e2;padding:4px 8px;border-radius:5px;font-size:11px;color:#b91c1c;flex:1}
.hist-new{background:#dcfce7;padding:4px 8px;border-radius:5px;font-size:11px;color:#15803d;flex:1}
.hist-dtlabel{display:block;font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;opacity:.7}
.hist-reason{margin-top:7px;font-size:11px;color:#475569;background:#fff;border:1px solid #e2e8f0;border-radius:5px;padding:5px 8px}
.hist-by{margin-top:5px;font-size:10px;color:#94a3b8}
      `}</style>
    </div>
  );
}
