import React, { useEffect, useState, useMemo } from "react";
import {
  getAllProjects,
  addUsingProjectWithTransaction,
  updateUsingProjectWithTransaction,
  deleteUsingProject,
} from "../Services/cashTrackerService";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => {
  if (n == null) return "₹0";
  const abs = Math.abs(Number(n));
  const str = "₹" + abs.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  return Number(n) < 0 ? "−" + str : str;
};

const EMPTY_FORM = { name: "", refNo: "", amountGiven: "", amountReturned: "" };

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  screen:    { padding: "20px 24px", fontFamily: "sans-serif", background: "#f7f8fc", minHeight: "100vh" },
  header:    { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 10 },
  title:     { fontSize: 17, fontWeight: 500, color: "#1a1a18" },
  sub:       { fontSize: 12, color: "#737370", marginTop: 3 },

  btn: {
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: "7px 14px", borderRadius: 6, fontSize: 12.5,
    border: "0.5px solid #d0d0cc", background: "#fff",
    color: "#1a1a18", cursor: "pointer", fontWeight: 400,
  },
  btnBlue:  { background: "#185FA5", color: "#fff", borderColor: "#185FA5", fontWeight: 500 },
  btnRed:   { background: "#FCEBEB", color: "#A32D2D", borderColor: "#F7C1C1" },
  btnGhost: { background: "transparent", border: "none", color: "#737370", cursor: "pointer", padding: "4px 6px", fontSize: 12 },

  card:      { background: "#fff", border: "0.5px solid #e5e5e0", borderRadius: 10, marginBottom: 16 },
  cHead:     { padding: "12px 16px", borderBottom: "0.5px solid #e5e5e0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 },
  cTitle:    { fontSize: 13, fontWeight: 500, color: "#1a1a18" },

  metrics:   { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 },
  metric:    { background: "#fff", border: "0.5px solid #e5e5e0", borderRadius: 8, padding: "12px 16px", flex: "1 1 120px", minWidth: 110 },
  mLbl:      { fontSize: 10, color: "#a0a09d", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" },

  filterBar: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", padding: "10px 16px", borderBottom: "0.5px solid #e5e5e0" },
  inp:       { border: "0.5px solid #d0d0cc", borderRadius: 6, padding: "6px 10px", fontSize: 12.5, color: "#1a1a18", background: "#fafaf8", outline: "none" },
  sel:       { border: "0.5px solid #d0d0cc", borderRadius: 6, padding: "6px 10px", fontSize: 12.5, color: "#1a1a18", background: "#fff", outline: "none", cursor: "pointer" },

  th:        { padding: "8px 12px", textAlign: "left", fontSize: 10, fontWeight: 500, color: "#737370", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "0.5px solid #e5e5e0", background: "#fafaf8", whiteSpace: "nowrap" },
  thR:       { textAlign: "right" },
  td:        { padding: "10px 12px", borderBottom: "0.5px solid #f0f0ed", verticalAlign: "middle", fontSize: 13, color: "#1a1a18" },
  tdR:       { textAlign: "right", fontVariantNumeric: "tabular-nums" },
  tdMono:    { fontFamily: "monospace", fontSize: 12 },
  tfootRow:  { background: "#f5f5f3", fontWeight: 500 },

  spin:      { textAlign: "center", padding: 40, color: "#737370", fontSize: 13 },

  // toast notification
  toast:     (type) => ({
    position: "fixed", bottom: 24, right: 24, zIndex: 9999,
    padding: "10px 16px", borderRadius: 8, fontSize: 12.5, fontWeight: 500,
    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
    background: type === "error" ? "#FCEBEB" : "#EAF3DE",
    color:      type === "error" ? "#A32D2D" : "#3B6D11",
    border:     `0.5px solid ${type === "error" ? "#F7C1C1" : "#C0DD97"}`,
    maxWidth: 340,
    animation: "fadeIn 0.2s ease",
  }),

  pill: (type) => {
    const map = {
      warning: { bg: "#FAEEDA", color: "#854F0B", border: "#FAC775" },
      success: { bg: "#EAF3DE", color: "#3B6D11", border: "#C0DD97" },
      info:    { bg: "#E6F1FB", color: "#185FA5", border: "#B5D4F4" },
      danger:  { bg: "#FCEBEB", color: "#A32D2D", border: "#F7C1C1" },
    };
    const c = map[type] || map.info;
    return { display: "inline-flex", alignItems: "center", fontSize: 10.5, padding: "2px 8px", borderRadius: 10, fontWeight: 500, background: c.bg, color: c.color, border: `0.5px solid ${c.border}` };
  },

  addPanel:      { background: "#fff", border: "0.5px solid #B5D4F4", borderRadius: 10, marginBottom: 16, overflow: "hidden" },
  addPanelHead:  { background: "#E6F1FB", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "0.5px solid #B5D4F4" },
  addPanelTitle: { fontSize: 13, fontWeight: 500, color: "#0C447C" },
  addPanelBody:  { padding: "16px" },

  fieldGroup: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 12, marginBottom: 14 },
  label:      { display: "block", fontSize: 10, fontWeight: 500, color: "#737370", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" },
  fieldInp:   { border: "0.5px solid #d0d0cc", borderRadius: 6, padding: "7px 10px", fontSize: 13, color: "#1a1a18", background: "#fafaf8", outline: "none", width: "100%", boxSizing: "border-box" },
  fieldInpFocus: { borderColor: "#378ADD", background: "#fff" },
  errBox:     { background: "#FCEBEB", color: "#A32D2D", padding: "7px 12px", borderRadius: 6, marginBottom: 12, fontSize: 12 },

  // transaction preview badge
  txPreview:  { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  txBadge:    (type) => ({
    display: "inline-flex", alignItems: "center", gap: 4,
    fontSize: 11, padding: "3px 10px", borderRadius: 10, fontWeight: 500,
    background: type === "INCOME" ? "#EAF3DE" : "#FCEBEB",
    color:      type === "INCOME" ? "#3B6D11"  : "#A32D2D",
    border:     `0.5px solid ${type === "INCOME" ? "#C0DD97" : "#F7C1C1"}`,
  }),

  editRow:   { background: "#EEF5FF" },
  editCell:  { padding: "8px 6px", borderBottom: "0.5px solid #B5D4F4", verticalAlign: "middle" },
  editInp:   { border: "0.5px solid #B5D4F4", borderRadius: 5, padding: "5px 8px", fontSize: 12, color: "#1a1a18", background: "#fff", outline: "none", width: "100%", boxSizing: "border-box" },
};

// ─── Toast helper ─────────────────────────────────────────────────────────────
function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return <div style={s.toast(type)}>{message}</div>;
}

// ─── Transaction preview (shows what will be auto-created) ───────────────────
function TxPreview({ oldGiven = 0, oldReturned = 0, newGiven = 0, newReturned = 0 }) {
  const givenDiff    = Number(newGiven)    - Number(oldGiven);
  const returnedDiff = Number(newReturned) - Number(oldReturned);

  const previews = [];
  if (givenDiff > 0)    previews.push({ type: "EXPENSE", label: `EXPENSE  −${fmt(givenDiff)}  (given out)` });
  if (givenDiff < 0)    previews.push({ type: "INCOME",  label: `INCOME  +${fmt(Math.abs(givenDiff))}  (given reduced)` });
  if (returnedDiff > 0) previews.push({ type: "INCOME",  label: `INCOME  +${fmt(returnedDiff)}  (returned)` });
  if (returnedDiff < 0) previews.push({ type: "EXPENSE", label: `EXPENSE  −${fmt(Math.abs(returnedDiff))}  (returned reduced)` });

  if (previews.length === 0) return null;

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10, color: "#737370", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        Auto-transactions that will be created:
      </div>
      <div style={s.txPreview}>
        {previews.map((p, i) => (
          <span key={i} style={s.txBadge(p.type)}>{p.label}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Inline Add Form Panel ────────────────────────────────────────────────────
function AddUsingForm({ fundingProjectId, onClose, onSaved }) {
  const [form, setForm]           = useState(EMPTY_FORM);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [focusField, setFocusField] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Project name is required."); return; }
    setLoading(true); setError("");
    try {
      // ── use new function that also creates transaction ──
      await addUsingProjectWithTransaction(fundingProjectId, {
        name:           form.name.trim(),
        refNo:          form.refNo.trim() || null,
        amountGiven:    Number(form.amountGiven)    || 0,
        amountReturned: Number(form.amountReturned) || 0,
      });
      setForm(EMPTY_FORM);
      onSaved();
    } catch (e) {
      setError(e.message || "Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const inpStyle = (field) => ({
    ...s.fieldInp,
    ...(focusField === field ? s.fieldInpFocus : {}),
  });

  const givenAmt    = Number(form.amountGiven)    || 0;
  const returnedAmt = Number(form.amountReturned) || 0;

  return (
    <div style={s.addPanel}>
      <div style={s.addPanelHead}>
        <div style={s.addPanelTitle}>+ Add using project</div>
        <button style={s.btnGhost} onClick={onClose} title="Close">✕</button>
      </div>
      <div style={s.addPanelBody}>
        {error && <div style={s.errBox}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={s.fieldGroup}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={s.label}>Project / Site name *</label>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                onFocus={() => setFocusField("name")}
                onBlur={() => setFocusField(null)}
                style={inpStyle("name")}
                placeholder="e.g. Soltaire Business Hub SBH 02"
                autoFocus
              />
            </div>
            <div>
              <label style={s.label}>Ref No (ODL code)</label>
              <input
                value={form.refNo}
                onChange={(e) => set("refNo", e.target.value)}
                onFocus={() => setFocusField("refNo")}
                onBlur={() => setFocusField(null)}
                style={inpStyle("refNo")}
                placeholder="e.g. ODL1017"
              />
            </div>
            <div>
              <label style={s.label}>Amount given (₹)</label>
              <input
                type="number"
                value={form.amountGiven}
                onChange={(e) => set("amountGiven", e.target.value)}
                onFocus={() => setFocusField("amountGiven")}
                onBlur={() => setFocusField(null)}
                style={inpStyle("amountGiven")}
                placeholder="0"
                min="0"
                step="1"
              />
            </div>
            <div>
              <label style={s.label}>Amount returned (₹)</label>
              <input
                type="number"
                value={form.amountReturned}
                onChange={(e) => set("amountReturned", e.target.value)}
                onFocus={() => setFocusField("amountReturned")}
                onBlur={() => setFocusField(null)}
                style={inpStyle("amountReturned")}
                placeholder="0"
                min="0"
                step="1"
              />
            </div>
          </div>

          {/* Live pending preview */}
          {(givenAmt > 0 || returnedAmt > 0) && (
            <div style={{ marginBottom: 14, padding: "8px 12px", background: "#f5f5f3", borderRadius: 6, fontSize: 12, color: "#737370", display: "flex", gap: 16, flexWrap: "wrap" }}>
              <span>Given: <strong style={{ color: "#854F0B" }}>{fmt(givenAmt)}</strong></span>
              <span>Returned: <strong style={{ color: "#3B6D11" }}>{fmt(returnedAmt)}</strong></span>
              <span>Pending: <strong style={{ color: Math.max(0, givenAmt - returnedAmt) > 0 ? "#A32D2D" : "#3B6D11" }}>
                {fmt(Math.max(0, givenAmt - returnedAmt))}
              </strong></span>
            </div>
          )}

          {/* Auto-transaction preview */}
          <TxPreview newGiven={givenAmt} newReturned={returnedAmt} />

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} style={s.btn}>Cancel</button>
            <button type="submit" disabled={loading} style={{ ...s.btn, ...s.btnBlue }}>
              {loading ? "Saving…" : "Save using project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Inline Edit Row ──────────────────────────────────────────────────────────
function EditRow({ u, fundingProjectId, onCancel, onSaved }) {
  const [form, setForm]       = useState({
    name:           u.name || "",
    refNo:          u.refNo || "",
    amountGiven:    u.amountGiven    ?? "",
    amountReturned: u.amountReturned ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Name required"); return; }
    setLoading(true);
    try {
      // ── pass old values so service can diff and create transactions ──
      await updateUsingProjectWithTransaction(
        u.id,
        { amountGiven: u.amountGiven, amountReturned: u.amountReturned }, // OLD values
        {
          name:           form.name.trim(),
          refNo:          form.refNo.trim() || null,
          amountGiven:    Number(form.amountGiven)    || 0,
          amountReturned: Number(form.amountReturned) || 0,
        },
        fundingProjectId,
        form.name.trim()
      );
      onSaved("✅ Updated! Transactions auto-created.");
    } catch (e) {
      setError(e.message || "Failed");
      setLoading(false);
    }
  };

  const newGiven    = Number(form.amountGiven)    || 0;
  const newReturned = Number(form.amountReturned) || 0;

  return (
    <>
      {error && (
        <tr style={s.editRow}>
          <td colSpan={9} style={{ ...s.editCell, padding: "4px 12px" }}>
            <span style={{ color: "#A32D2D", fontSize: 11 }}>⚠ {error}</span>
          </td>
        </tr>
      )}
      <tr style={s.editRow}>
        <td style={{ ...s.editCell, textAlign: "center", color: "#a0a09d", fontSize: 11, padding: "8px 6px 8px 12px" }}>✏️</td>

        {/* Name */}
        <td style={s.editCell}>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            style={s.editInp}
            autoFocus
            placeholder="Project name *"
          />
        </td>

        {/* Ref No */}
        <td style={s.editCell}>
          <input
            value={form.refNo}
            onChange={(e) => set("refNo", e.target.value)}
            style={s.editInp}
            placeholder="ODL code"
          />
        </td>

        {/* Amount Given */}
        <td style={{ ...s.editCell, textAlign: "right" }}>
          <input
            type="number"
            value={form.amountGiven}
            onChange={(e) => set("amountGiven", e.target.value)}
            style={{ ...s.editInp, textAlign: "right" }}
            placeholder="0"
            min="0"
          />
        </td>

        {/* Amount Returned */}
        <td style={{ ...s.editCell, textAlign: "right" }}>
          <input
            type="number"
            value={form.amountReturned}
            onChange={(e) => set("amountReturned", e.target.value)}
            style={{ ...s.editInp, textAlign: "right" }}
            placeholder="0"
            min="0"
          />
        </td>

        {/* Pending (live calc) */}
        <td style={{ ...s.editCell, textAlign: "right" }}>
          <span style={{ fontSize: 12, fontFamily: "monospace", color: "#854F0B" }}>
            {fmt(Math.max(0, newGiven - newReturned))}
          </span>
        </td>

        {/* Auto-tx preview inline */}
        <td style={{ ...s.editCell }} colSpan={2}>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TxPreview
              oldGiven={u.amountGiven}
              oldReturned={u.amountReturned}
              newGiven={newGiven}
              newReturned={newReturned}
            />
          </div>
        </td>

        {/* Save / Cancel */}
        <td style={{ ...s.editCell, whiteSpace: "nowrap" }}>
          <div style={{ display: "flex", gap: 4 }}>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{ ...s.btn, ...s.btnBlue, padding: "3px 10px", fontSize: 11 }}
            >
              {loading ? "…" : "Save"}
            </button>
            <button onClick={onCancel} style={{ ...s.btn, padding: "3px 8px", fontSize: 11 }}>
              ✕
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CrossProjectTracker() {
  const [projects,      setProjects]     = useState([]);
  const [loading,       setLoading]      = useState(true);
  const [error,         setError]        = useState("");
  const [selectedId,    setSelectedId]   = useState("");
  const [search,        setSearch]       = useState("");
  const [filterStatus,  setFilterStatus] = useState("all");
  const [showAddForm,   setShowAddForm]  = useState(false);
  const [editingId,     setEditingId]    = useState(null);

  // ── toast state ──
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = (message, type = "success") => setToast({ message, type });

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await getAllProjects();
      setProjects(data);
      if (!selectedId && data.length > 0) setSelectedId(String(data[0].id));
    } catch (e) {
      setError(e.message || "Failed to load.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const selectedProject = useMemo(
    () => projects.find((p) => String(p.id) === String(selectedId)),
    [projects, selectedId]
  );

  const rows = useMemo(() => {
    const list = selectedProject?.usingProjects || [];
    return list.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        (u.refNo || "").toLowerCase().includes(search.toLowerCase());
      const pen = (Number(u.amountGiven) || 0) - (Number(u.amountReturned) || 0);
      if (filterStatus === "pending") return matchSearch && pen > 0;
      if (filterStatus === "settled") return matchSearch && pen <= 0;
      return matchSearch;
    });
  }, [selectedProject, search, filterStatus]);

  const totals = useMemo(() => ({
    given:    rows.reduce((s, r) => s + (Number(r.amountGiven)    || 0), 0),
    returned: rows.reduce((s, r) => s + (Number(r.amountReturned) || 0), 0),
    pending:  rows.reduce((s, r) => s + Math.max(0, (Number(r.amountGiven) || 0) - (Number(r.amountReturned) || 0)), 0),
  }), [rows]);

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete "${u.name}"?`)) return;
    try {
      await deleteUsingProject(u.id);
      showToast(`🗑 "${u.name}" deleted.`);
      await load();
    } catch (e) {
      showToast("Error: " + e.message, "error");
    }
  };

  const handleAdded = async () => {
    setShowAddForm(false);
    showToast("✅ Using project added! Transactions auto-created.");
    await load();
  };

  const handleEdited = async (msg) => {
    setEditingId(null);
    showToast(msg || "✅ Updated!");
    await load();
  };

  const handleProjectChange = (id) => {
    setSelectedId(id);
    setSearch("");
    setFilterStatus("all");
    setShowAddForm(false);
    setEditingId(null);
  };

  if (loading) return <div style={s.spin}>Loading...</div>;
  if (error)   return (
    <div style={{ ...s.spin, color: "#A32D2D" }}>
      ⚠ {error}{" "}
      <button style={s.btn} onClick={load}>Retry</button>
    </div>
  );

  return (
    <div style={s.screen}>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}

      {/* Page header */}
      <div style={s.header}>
        <div>
          <div style={s.title}>Cross-project tracker</div>
          <div style={s.sub}>Track where funding project money is deployed and recovered · Changes auto-create transactions</div>
        </div>
        <button
          style={{ ...s.btn, ...s.btnBlue }}
          onClick={() => { setShowAddForm((v) => !v); setEditingId(null); }}
        >
          {showAddForm ? "✕ Close" : "+ Add using project"}
        </button>
      </div>

      {/* Inline Add Form */}
      {showAddForm && (
        <AddUsingForm
          fundingProjectId={selectedId}
          onClose={() => setShowAddForm(false)}
          onSaved={handleAdded}
        />
      )}

      {/* Funding project selector */}
      <div style={s.card}>
        <div style={s.cHead}>
          <div style={s.cTitle}>Funding project</div>
          <span style={{ fontSize: 11, color: "#a0a09d" }}>
            {(selectedProject?.usingProjects || []).length} using projects total
          </span>
        </div>
        <div style={{ padding: "12px 16px", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <select
            value={selectedId}
            onChange={(e) => handleProjectChange(e.target.value)}
            style={{ ...s.sel, minWidth: 260, fontWeight: 500 }}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}{p.clientName ? ` — ${p.clientName}` : ""}
              </option>
            ))}
          </select>
          {selectedProject && (
            <span style={s.pill("info")}>
              Project value: {fmt(selectedProject.totalValue)}
            </span>
          )}
        </div>
      </div>

      {/* Metric cards */}
      {selectedProject && (
        <div style={s.metrics}>
          <div style={s.metric}>
            <div style={s.mLbl}>Project value</div>
            <div style={{ fontSize: 18, fontWeight: 500, color: "#185FA5" }}>{fmt(selectedProject.totalValue)}</div>
          </div>
          <div style={s.metric}>
            <div style={s.mLbl}>Total given out</div>
            <div style={{ fontSize: 18, fontWeight: 500, color: "#854F0B" }}>{fmt(totals.given)}</div>
          </div>
          <div style={s.metric}>
            <div style={s.mLbl}>Total returned</div>
            <div style={{ fontSize: 18, fontWeight: 500, color: "#3B6D11" }}>{fmt(totals.returned)}</div>
          </div>
          <div style={s.metric}>
            <div style={s.mLbl}>Total pending</div>
            <div style={{ fontSize: 18, fontWeight: 500, color: totals.pending > 0 ? "#A32D2D" : "#3B6D11" }}>
              {fmt(totals.pending)}
            </div>
          </div>
          <div style={s.metric}>
            <div style={s.mLbl}>Using projects</div>
            <div style={{ fontSize: 18, fontWeight: 500, color: "#1a1a18" }}>
              {(selectedProject.usingProjects || []).length}
            </div>
          </div>
          <div style={s.metric}>
            <div style={s.mLbl}>Pending entries</div>
            <div style={{ fontSize: 18, fontWeight: 500, color: "#854F0B" }}>
              {rows.filter((r) => (Number(r.amountGiven) || 0) - (Number(r.amountReturned) || 0) > 0).length}
            </div>
          </div>
        </div>
      )}

      {/* Table card */}
      <div style={s.card}>
        <div style={s.filterBar}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or ref no..."
            style={{ ...s.inp, flex: "1 1 200px", minWidth: 180 }}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={s.sel}
          >
            <option value="all">All</option>
            <option value="pending">Pending only</option>
            <option value="settled">Settled only</option>
          </select>
          <span style={{ fontSize: 11, color: "#a0a09d", marginLeft: "auto" }}>
            {rows.length} entries
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ ...s.th, width: 36, textAlign: "center" }}>#</th>
                <th style={s.th}>Using project</th>
                <th style={s.th}>Ref no</th>
                <th style={{ ...s.th, ...s.thR }}>Given (₹)</th>
                <th style={{ ...s.th, ...s.thR }}>Returned (₹)</th>
                <th style={{ ...s.th, ...s.thR }}>Pending (₹)</th>
                <th style={s.th}>Status</th>
                <th style={{ ...s.th, width: 90, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ ...s.td, textAlign: "center", color: "#a0a09d", padding: 40 }}>
                    {search || filterStatus !== "all" ? "No results match your filter." : (
                      <div>
                        <div style={{ marginBottom: 10, fontSize: 14 }}>No using projects yet.</div>
                        <button style={{ ...s.btn, ...s.btnBlue }} onClick={() => setShowAddForm(true)}>
                          + Add first using project
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                rows.map((u, i) => {
                  const pen     = Math.max(0, (Number(u.amountGiven) || 0) - (Number(u.amountReturned) || 0));
                  const settled = pen <= 0;

                  if (editingId === u.id) {
                    return (
                      <EditRow
                        key={u.id}
                        u={u}
                        fundingProjectId={selectedId}   // ← passed to service
                        onCancel={() => setEditingId(null)}
                        onSaved={handleEdited}
                      />
                    );
                  }

                  return (
                    <tr key={u.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafaf8" }}>
                      <td style={{ ...s.td, color: "#a0a09d", textAlign: "center" }}>{i + 1}</td>
                      <td style={{ ...s.td, fontWeight: 500 }}>{u.name}</td>
                      <td style={{ ...s.td, ...s.tdMono, color: "#737370" }}>{u.refNo || "—"}</td>
                      <td style={{ ...s.td, ...s.tdR, ...s.tdMono, color: "#854F0B" }}>{fmt(u.amountGiven)}</td>
                      <td style={{ ...s.td, ...s.tdR, ...s.tdMono, color: "#3B6D11" }}>{fmt(u.amountReturned)}</td>
                      <td style={{ ...s.td, ...s.tdR, fontWeight: 500 }}>
                        {pen > 0 ? (
                          <span style={{ background: "#FAEEDA", color: "#854F0B", border: "0.5px solid #FAC775", borderRadius: 4, padding: "2px 7px", fontFamily: "monospace", fontSize: 12 }}>
                            {fmt(pen)}
                          </span>
                        ) : (
                          <span style={{ color: "#c0c0bd" }}>—</span>
                        )}
                      </td>
                      <td style={s.td}>
                        <span style={s.pill(settled ? "success" : "warning")}>
                          {settled ? "Settled ✓" : "Pending"}
                        </span>
                      </td>
                      <td style={{ ...s.td, textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                          <button
                            onClick={() => { setEditingId(u.id); setShowAddForm(false); }}
                            style={{ ...s.btn, padding: "3px 8px", fontSize: 11 }}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            style={{ ...s.btn, ...s.btnRed, padding: "3px 8px", fontSize: 11 }}
                            title="Delete"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {rows.length > 0 && (
              <tfoot>
                <tr style={s.tfootRow}>
                  <td style={{ ...s.td, fontWeight: 500 }} colSpan={3}>
                    Total ({rows.length} entries)
                  </td>
                  <td style={{ ...s.td, ...s.tdR, ...s.tdMono, color: "#854F0B" }}>{fmt(totals.given)}</td>
                  <td style={{ ...s.td, ...s.tdR, ...s.tdMono, color: "#3B6D11" }}>{fmt(totals.returned)}</td>
                  <td style={{ ...s.td, ...s.tdR, fontWeight: 500, color: totals.pending > 0 ? "#A32D2D" : "#3B6D11" }}>
                    {fmt(totals.pending)}
                  </td>
                  <td colSpan={2} />
                </tr>
                <tr>
                  <td colSpan={8} style={{ padding: "10px 12px", borderTop: "0.5px solid #e5e5e0", background: "#fafaf8" }}>
                    <button
                      style={{ ...s.btn, ...s.btnBlue, fontSize: 12 }}
                      onClick={() => { setShowAddForm(true); setEditingId(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    >
                      + Add using project
                    </button>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}