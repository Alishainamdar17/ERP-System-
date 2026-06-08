import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProjects } from "../Services/cashTrackerService";
import ReassignModal from "../Components/ReassignModal";

// ─── helpers ────────────────────────────────────────────────────────────────
function fmt(n) {
  if (n == null || n === 0) return "₹0";
  const abs = Math.abs(Number(n));
  const str = "₹" + abs.toLocaleString("en-IN");
  return Number(n) < 0 ? "−" + str : str;
}

const PROJECT_COLORS = ["#185FA5","#3B6D11","#854F0B","#A32D2D","#1D9E75","#9F4F00","#5C1EA0","#005F73"];

// ─── CSV download helper ─────────────────────────────────────────────────────
// Exports:
//   • One header row
//   • For each funding project → 1 summary row (Type = "Funding Project")
//   • For each using-project under it → 1 detail row (Type = "  └ Using Project")
//   • One blank separator row between funding projects
//   • One TOTAL row at the bottom
function downloadCSV(filteredProjects, selectedProject) {
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const num    = (v) => Number(v || 0);

  const headers = [
    "Type",
    "Funding Project",
    "Using Project",
    "Ref No",
    "Client",
    "Funded (₹)",
    "Given Out (₹)",
    "Returned (₹)",
    "Pending (₹)",
    "Status",
  ];

  const rows = [];

  filteredProjects.forEach((p) => {
    const bal    = num(p.currentBalance);
    const status = bal < 0 ? "Shortfall" : (p.spentPercentage || 0) >= 90 ? "Warning" : "Active";

    // ── Funding project summary row ──
    rows.push([
      escape("Funding Project"),
      escape(p.name),
      escape(""),                        // Using Project (blank for parent)
      escape(""),                        // Ref No
      escape(p.clientName || ""),
      num(p.totalValue),
      num(p.totalGivenOut),
      num(p.totalReturned),
      num(p.totalPending),
      escape(status),
    ]);

    // ── Using-project detail rows ──
    const usingList = p.usingProjects || [];
    usingList.forEach((u) => {
      rows.push([
        escape("  └ Using Project"),
        escape(p.name),                  // parent funding project name for context
        escape(u.name),
        escape(u.refNo || ""),
        escape(""),                      // client (not on sub-project)
        escape(""),                      // funded amount (belongs to parent only)
        num(u.amountGiven),
        num(u.amountReturned),
        num(u.pending),
        escape(""),                      // status (belongs to parent only)
      ]);
    });

    // blank separator row between funding projects
    rows.push(new Array(headers.length).fill(""));
  });

  // ── Grand total row ──
  const totalFunded   = filteredProjects.reduce((a, p) => a + num(p.totalValue),    0);
  const totalGiven    = filteredProjects.reduce((a, p) => a + num(p.totalGivenOut), 0);
  const totalReturned = filteredProjects.reduce((a, p) => a + num(p.totalReturned), 0);
  const totalPending  = filteredProjects.reduce((a, p) => a + num(p.totalPending),  0);

  rows.push([
    escape("TOTAL"),
    escape(""),
    escape(""),
    escape(""),
    escape(""),
    totalFunded,
    totalGiven,
    totalReturned,
    totalPending,
    escape(""),
  ]);

  const csv  = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }); // BOM for Excel ₹ symbol
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  const name = selectedProject === "all"
    ? "master-summary"
    : (filteredProjects[0]?.name || "project");
  a.href     = url;
  a.download = `${name.replace(/\s+/g, "-").replace(/[^\w-]/g, "").toLowerCase()}-report.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── styles ─────────────────────────────────────────────────────────────────
const s = {
  screen:      { padding: "20px 24px", fontFamily: "sans-serif", minHeight: "100vh", background: "#fafaf8" },
  header:      { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  title:       { fontSize: 17, fontWeight: 500, color: "#1a1a18", display: "flex", alignItems: "center", gap: 8 },
  sub:         { fontSize: 12, color: "#737370", marginTop: 3 },
  headerRight: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  btn:         { display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 6, fontSize: 12.5, border: "0.5px solid #d0d0cc", background: "#fff", color: "#1a1a18", cursor: "pointer" },
  btnBlue:     { background: "#185FA5", color: "#fff", borderColor: "#185FA5", fontWeight: 500 },
  btnGreen:    { background: "#EAF3DE", color: "#3B6D11", borderColor: "#9dc96b", fontWeight: 500 },
  select:      { padding: "7px 10px", borderRadius: 6, fontSize: 12.5, border: "0.5px solid #d0d0cc", background: "#fff", color: "#1a1a18", cursor: "pointer", outline: "none" },
  // metric cards
  metrics:     { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 18 },
  metric:      { background: "#fff", border: "0.5px solid #e5e5e0", borderRadius: 8, padding: "12px 14px" },
  mLbl:        { fontSize: 11, color: "#737370", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" },
  mVal:        (c) => ({ fontSize: 20, fontWeight: 500, color: c || "#1a1a18", fontFamily: "monospace" }),
  // table card
  card:        { background: "#fff", border: "0.5px solid #e5e5e0", borderRadius: 10, overflow: "hidden" },
  cHead:       { padding: "12px 16px", borderBottom: "0.5px solid #e5e5e0", display: "flex", alignItems: "center", justifyContent: "space-between" },
  cTitle:      { fontSize: 13, fontWeight: 500, color: "#1a1a18" },
  // table
  tableWrap:   { overflowX: "auto" },
  table:       { width: "100%", borderCollapse: "collapse", fontSize: 12 },
  th:          { padding: "9px 12px", textAlign: "left", fontSize: 10, fontWeight: 500, color: "#737370", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "0.5px solid #e5e5e0", background: "#fafaf8", whiteSpace: "nowrap" },
  thR:         { textAlign: "right" },
  td:          { padding: "11px 12px", borderBottom: "0.5px solid #f0f0ed", verticalAlign: "middle" },
  tdR:         { textAlign: "right", fontVariantNumeric: "tabular-nums" },
  tdM:         { fontFamily: "monospace" },
  // funder row
  expandBtn:   { background: "none", border: "none", cursor: "pointer", padding: "2px 5px", color: "#185FA5", fontSize: 11 },
  numBadge:    (color) => ({ width: 22, height: 22, borderRadius: "50%", background: color, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, flexShrink: 0 }),
  tag:         { display: "inline-flex", alignItems: "center", gap: 3, background: "#f0f0ed", border: "0.5px solid #e0e0db", borderRadius: 4, padding: "2px 7px", fontSize: 11, color: "#4a4a47", marginBottom: 2, marginRight: 2 },
  tagDot:      (c) => ({ width: 5, height: 5, borderRadius: "50%", background: c, flexShrink: 0 }),
  pendPill:    { background: "#FAEEDA", color: "#854F0B", border: "0.5px solid #FAC775", borderRadius: 4, padding: "1px 6px", fontSize: 11, fontFamily: "monospace" },
  statusDot:   (c) => ({ width: 6, height: 6, borderRadius: "50%", background: c, display: "inline-block", marginRight: 4 }),
  badge:       (t) => ({ display: "inline-flex", alignItems: "center", fontSize: 10.5, padding: "2px 7px", borderRadius: 10, fontWeight: 500, ...(t === "red" ? { background: "#FCEBEB", color: "#A32D2D" } : t === "amber" ? { background: "#FAEEDA", color: "#854F0B" } : { background: "#EAF3DE", color: "#3B6D11" }) }),
  // using sub-row
  subTd:       { padding: "8px 12px", borderBottom: "0.5px solid #f7f7f5", background: "#fafaf9", verticalAlign: "middle" },
  subTdR:      { textAlign: "right", fontVariantNumeric: "tabular-nums" },
  subBar:      (color) => ({ width: 3, height: 14, background: color, borderRadius: 2, display: "inline-block", marginRight: 8, verticalAlign: "middle", flexShrink: 0 }),
  // reassign button
  reassignBtn: { display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 5, fontSize: 11, border: "0.5px solid #A8C8F8", background: "#EDF4FD", color: "#185FA5", cursor: "pointer", whiteSpace: "nowrap" },
  // reassign history section
  historyWrap: { padding: "10px 20px 14px 28px", background: "#f5f0fd", borderBottom: "1px solid #e5ddf5" },
  historyTitle:{ fontSize: 11, fontWeight: 600, color: "#5C1EA0", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 },
  historyItem: { fontSize: 11, color: "#4a4a47", marginBottom: 5, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" },
  historyAmt:  { fontFamily: "monospace", color: "#854F0B", fontWeight: 500 },
  historyArrow:{ color: "#9c9a92" },
  historyDate: { color: "#a0a09d", fontSize: 10.5 },
  historyFrom: { fontWeight: 500, color: "#3d3d3a" },
  historyTo:   { fontWeight: 500, color: "#185FA5" },
  historySub:  { color: "#737370", fontSize: 10.5, fontStyle: "italic" },
  historyNote: { color: "#9c9a92", fontSize: 10.5 },
  // footer row
  footTd:      { padding: "10px 12px", background: "#f5f5f3", fontWeight: 600, borderTop: "1px solid #e5e5e0" },
  footTdR:     { textAlign: "right", fontFamily: "monospace" },
  // states
  spin:        { textAlign: "center", padding: 40, color: "#737370", fontSize: 13 },
  empty:       { textAlign: "center", padding: 40, color: "#a0a09d", fontSize: 13 },
};

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function MasterSummaryPage() {
  const navigate = useNavigate();
  const [projects,    setProjects]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [expanded,    setExpanded]    = useState({});      // { [projectId]: boolean }
  const [reassignFor, setReassignFor] = useState(null);   // fundingProject object | null

  // ── NEW: filter state ──
  const [selectedProject, setSelectedProject] = useState("all");

  // ── NEW: reassign history visibility per project ──
  const [historyOpen, setHistoryOpen] = useState({});     // { [projectId]: boolean }

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await getAllProjects(true);
      setProjects(data);
    } catch (e) {
      setError(e.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleExpand  = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleHistory = (id) => setHistoryOpen(prev => ({ ...prev, [id]: !prev[id] }));

  // ── NEW: filtered list ──
  const filteredProjects = selectedProject === "all"
    ? projects
    : projects.filter(p => String(p.id) === String(selectedProject));

  // ── Totals (based on filtered list) ──
  const totalFunded   = filteredProjects.reduce((a, p) => a + Number(p.totalValue    || 0), 0);
  const totalGiven    = filteredProjects.reduce((a, p) => a + Number(p.totalGivenOut || 0), 0);
  const totalReturned = filteredProjects.reduce((a, p) => a + Number(p.totalReturned || 0), 0);
  const totalPending  = filteredProjects.reduce((a, p) => a + Number(p.totalPending  || 0), 0);

  if (loading) return <div style={s.spin}>Loading master summary…</div>;
  if (error)   return <div style={{ ...s.spin, color: "#A32D2D" }}>⚠ {error} <button style={{ marginLeft: 10, ...s.btn }} onClick={load}>Retry</button></div>;

  return (
    <div style={s.screen}>

      {/* Reassign modal */}
      {reassignFor && (
        <ReassignModal
          fundingProject={reassignFor}
          allProjects={projects}
          onClose={() => setReassignFor(null)}
          onSuccess={() => { setReassignFor(null); load(); }}
        />
      )}

      {/* Page header */}
      <div style={s.header}>
        <div>
          <div style={s.title}>📊 Master Summary</div>
          <div style={s.sub}>Funding projects → Using projects · Click a row to expand</div>
        </div>

        {/* ── NEW: filter + download + nav ── */}
        <div style={s.headerRight}>

          {/* Project filter dropdown */}
          <select
            value={selectedProject}
            onChange={e => setSelectedProject(e.target.value)}
            style={s.select}
          >
            <option value="all">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={String(p.id)}>{p.name}</option>
            ))}
          </select>

          {/* Download CSV */}
          <button
            style={{ ...s.btn, ...s.btnGreen }}
            onClick={() => downloadCSV(filteredProjects, selectedProject)}
            title="Download filtered data as CSV"
          >
            ⬇ Download CSV
          </button>

          {/* Dashboard nav */}
          <button style={{ ...s.btn, ...s.btnBlue }} onClick={() => navigate("/cash-tracker")}>
            ← Dashboard
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <div style={s.metrics}>
        {[
          { lbl: "Total Funded",   val: fmt(totalFunded),   color: "#3B6D11" },
          { lbl: "Given Out",      val: fmt(totalGiven),    color: "#854F0B" },
          { lbl: "Returned",       val: fmt(totalReturned), color: "#3B6D11" },
          { lbl: "Pending",        val: fmt(totalPending),  color: totalPending > 0 ? "#A32D2D" : "#3B6D11" },
        ].map((m, i) => (
          <div key={i} style={s.metric}>
            <div style={s.mLbl}>{m.lbl}</div>
            <div style={s.mVal(m.color)}>{m.val}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={s.card}>
        <div style={s.cHead}>
          <div style={s.cTitle}>
            {selectedProject === "all"
              ? "All Funding Projects"
              : `Filtered: ${filteredProjects[0]?.name || ""}`}
          </div>
          <span style={{ fontSize: 11, color: "#a0a09d" }}>
            {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
            {selectedProject !== "all" && (
              <button
                style={{ marginLeft: 8, ...s.btn, padding: "2px 8px", fontSize: 11 }}
                onClick={() => setSelectedProject("all")}
              >
                ✕ Clear filter
              </button>
            )}
          </span>
        </div>

        {filteredProjects.length === 0 ? (
          <div style={s.empty}>No projects found.</div>
        ) : (
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>#</th>
                  <th style={s.th}>Funding Project</th>
                  <th style={{ ...s.th, ...s.thR }}>Amount (₹)</th>
                  <th style={s.th}>Using Projects</th>
                  <th style={{ ...s.th, ...s.thR }}>Given Out (₹)</th>
                  <th style={{ ...s.th, ...s.thR }}>Returned (₹)</th>
                  <th style={{ ...s.th, ...s.thR }}>Pending (₹)</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProjects.map((p, pi) => {
                  const color       = PROJECT_COLORS[pi % PROJECT_COLORS.length];
                  const usingList   = p.usingProjects || [];
                  const isExpanded  = !!expanded[p.id];
                  const isHistOpen  = !!historyOpen[p.id];
                  const bal         = Number(p.currentBalance || 0);
                  const badgeType   = bal < 0 ? "red" : (p.spentPercentage || 0) >= 90 ? "amber" : "green";
                  const statusLabel = bal < 0 ? "Shortfall" : (p.spentPercentage || 0) >= 90 ? "Warning" : "Active";
                  const statusColor = badgeType === "red" ? "#A32D2D" : badgeType === "amber" ? "#BA7517" : "#3B6D11";
                  const hasPending  = Number(p.totalPending || 0) > 0;
                  const history     = p.reassignHistory || [];

                  return (
                    <React.Fragment key={p.id}>

                      {/* ── Funding project row ── */}
                      <tr
                        style={{ cursor: usingList.length > 0 ? "pointer" : "default", background: isExpanded ? "#f7f9fd" : "#fff" }}
                        onClick={() => usingList.length > 0 && toggleExpand(p.id)}
                      >
                        {/* # */}
                        <td style={{ ...s.td, width: 36 }}>
                          <span style={s.numBadge(color)}>{pi + 1}</span>
                        </td>

                        {/* Name */}
                        <td style={s.td}>
                          <div style={{ fontWeight: 500, color: "#1a1a18", fontSize: 13 }}>{p.name}</div>
                          {p.clientName && <div style={{ fontSize: 11, color: "#737370", marginTop: 1 }}>{p.clientName}</div>}
                        </td>

                        {/* Funded amount */}
                        <td style={{ ...s.td, ...s.tdR, ...s.tdM }}>
                          <span style={{ color: "#3B6D11", fontWeight: 500 }}>{fmt(p.totalValue)}</span>
                        </td>

                        {/* Using project tags */}
                        <td style={s.td}>
                          {usingList.length === 0 ? (
                            <span style={{ color: "#c0c0bd", fontSize: 11 }}>—</span>
                          ) : (
                            <div>
                              <div style={{ display: "flex", flexWrap: "wrap" }}>
                                {usingList.slice(0, 3).map(u => (
                                  <span key={u.id} style={s.tag}>
                                    <span style={s.tagDot(color)}></span>
                                    {u.name.length > 26 ? u.name.slice(0, 26) + "…" : u.name}
                                  </span>
                                ))}
                              </div>
                              <button style={s.expandBtn} onClick={e => { e.stopPropagation(); toggleExpand(p.id); }}>
                                {isExpanded ? "▲ hide" : `▼ ${usingList.length > 3 ? `+${usingList.length - 3} more` : `${usingList.length} project${usingList.length !== 1 ? "s" : ""}`}`}
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Given out */}
                        <td style={{ ...s.td, ...s.tdR, ...s.tdM }}>
                          {Number(p.totalGivenOut || 0) > 0
                            ? <span style={{ color: "#854F0B" }}>{fmt(p.totalGivenOut)}</span>
                            : <span style={{ color: "#c0c0bd" }}>—</span>}
                        </td>

                        {/* Returned */}
                        <td style={{ ...s.td, ...s.tdR, ...s.tdM }}>
                          {Number(p.totalReturned || 0) > 0
                            ? <span style={{ color: "#3B6D11" }}>{fmt(p.totalReturned)}</span>
                            : <span style={{ color: "#c0c0bd" }}>—</span>}
                        </td>

                        {/* Pending */}
                        <td style={{ ...s.td, ...s.tdR }}>
                          {Number(p.totalPending || 0) > 0
                            ? <span style={s.pendPill}>{fmt(p.totalPending)}</span>
                            : <span style={{ color: "#c0c0bd", fontSize: 11 }}>—</span>}
                        </td>

                        {/* Status badge */}
                        <td style={s.td}>
                          <span style={s.statusDot(statusColor)}></span>
                          <span style={s.badge(badgeType)}>{statusLabel}</span>
                        </td>

                        {/* Actions */}
                        <td style={{ ...s.td }} onClick={e => e.stopPropagation()}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            {hasPending && (
                              <button
                                style={s.reassignBtn}
                                onClick={() => setReassignFor(p)}
                                title="Move sub-project debts to another funder"
                              >
                                🔄 Reassign debt
                              </button>
                            )}
                            {/* ── NEW: toggle reassign history button ── */}
                            {history.length > 0 && (
                              <button
                                style={{ ...s.reassignBtn, background: "#F0EBF8", borderColor: "#C8AAEC", color: "#5C1EA0" }}
                                onClick={() => toggleHistory(p.id)}
                                title="View reassign history for this project"
                              >
                                🕓 History ({history.length})
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* ── NEW: Reassign history sub-section ── */}
                      {isHistOpen && history.length > 0 && (
                        <tr>
                          <td colSpan={9} style={{ padding: 0 }}>
                            <div style={s.historyWrap}>
                              <div style={s.historyTitle}>
                                🕓 Reassign history — {p.name}
                                <button
                                  style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#9c9a92", fontSize: 12 }}
                                  onClick={() => toggleHistory(p.id)}
                                >
                                  ✕ close
                                </button>
                              </div>
                              {history.map((h, hi) => (
                                <div key={hi} style={s.historyItem}>
                                  {/* Amount */}
                                  <span style={s.historyAmt}>{fmt(h.amount)}</span>

                                  {/* From → To */}
                                  <span style={s.historyArrow}>moved from</span>
                                  <span style={s.historyFrom}>{h.fromFunderName || p.name}</span>
                                  <span style={s.historyArrow}>→</span>
                                  <span style={s.historyTo}>{h.toFunderName || "—"}</span>

                                  {/* Sub-project name */}
                                  {h.subProjectName && (
                                    <>
                                      <span style={s.historyArrow}>·</span>
                                      <span style={s.historySub}>{h.subProjectName}</span>
                                    </>
                                  )}

                                  {/* Note */}
                                  {h.note && (
                                    <>
                                      <span style={s.historyArrow}>·</span>
                                      <span style={s.historyNote}>"{h.note}"</span>
                                    </>
                                  )}

                                  {/* Date */}
                                  {h.createdAt && (
                                    <>
                                      <span style={s.historyArrow}>·</span>
                                      <span style={s.historyDate}>
                                        {new Date(h.createdAt).toLocaleDateString("en-IN", {
                                          day: "2-digit", month: "short", year: "numeric"
                                        })}
                                      </span>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* ── Expanded using-project sub-rows ── */}
                      {isExpanded && usingList.map((u, ui) => {
                        const uPending = Number(u.pending || 0);
                        const isLast   = ui === usingList.length - 1;
                        return (
                          <tr key={u.id} style={{ background: "#f9fafb" }}>
                            <td style={{ ...s.subTd, borderBottom: isLast ? "1.5px solid #e5e5e0" : undefined }}></td>
                            <td style={{ ...s.subTd, paddingLeft: 28, borderBottom: isLast ? "1.5px solid #e5e5e0" : undefined }} colSpan={1}>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <span style={s.subBar(color)}></span>
                                <div>
                                  <div style={{ fontSize: 12, color: "#2a2a28" }}>{u.name}</div>
                                  {u.refNo && <div style={{ fontSize: 10, color: "#a0a09d", fontFamily: "monospace" }}>{u.refNo}</div>}
                                </div>
                              </div>
                            </td>
                            <td style={{ ...s.subTd, borderBottom: isLast ? "1.5px solid #e5e5e0" : undefined }}></td>
                            <td style={{ ...s.subTd, borderBottom: isLast ? "1.5px solid #e5e5e0" : undefined }}>
                              <span style={{ ...s.tag, background: "#fff" }}>
                                <span style={s.tagDot(color)}></span>
                                {u.name.length > 30 ? u.name.slice(0, 30) + "…" : u.name}
                              </span>
                            </td>
                            <td style={{ ...s.subTd, ...s.subTdR, ...s.tdM, color: "#854F0B", borderBottom: isLast ? "1.5px solid #e5e5e0" : undefined }}>
                              {Number(u.amountGiven || 0) > 0 ? fmt(u.amountGiven) : <span style={{ color: "#c0c0bd" }}>—</span>}
                            </td>
                            <td style={{ ...s.subTd, ...s.subTdR, ...s.tdM, color: "#3B6D11", borderBottom: isLast ? "1.5px solid #e5e5e0" : undefined }}>
                              {Number(u.amountReturned || 0) > 0 ? fmt(u.amountReturned) : <span style={{ color: "#c0c0bd" }}>—</span>}
                            </td>
                            <td style={{ ...s.subTd, ...s.subTdR, borderBottom: isLast ? "1.5px solid #e5e5e0" : undefined }}>
                              {uPending > 0
                                ? <span style={{ ...s.pendPill, fontSize: 10 }}>{fmt(uPending)}</span>
                                : <span style={{ color: "#c0c0bd", fontSize: 11 }}>—</span>}
                            </td>
                            <td style={{ ...s.subTd, borderBottom: isLast ? "1.5px solid #e5e5e0" : undefined }} colSpan={2}></td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </tbody>

              {/* Footer totals */}
              <tfoot>
                <tr>
                  <td style={s.footTd} colSpan={2}>TOTAL</td>
                  <td style={{ ...s.footTd, ...s.footTdR, color: "#3B6D11" }}>{fmt(totalFunded)}</td>
                  <td style={s.footTd}></td>
                  <td style={{ ...s.footTd, ...s.footTdR, color: "#854F0B" }}>{totalGiven > 0 ? fmt(totalGiven) : "—"}</td>
                  <td style={{ ...s.footTd, ...s.footTdR, color: "#3B6D11" }}>{totalReturned > 0 ? fmt(totalReturned) : "—"}</td>
                  <td style={{ ...s.footTd, ...s.footTdR }}>
                    {totalPending > 0
                      ? <span style={{ ...s.pendPill, fontWeight: 600 }}>{fmt(totalPending)}</span>
                      : "—"}
                  </td>
                  <td style={s.footTd} colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
