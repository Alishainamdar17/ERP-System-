import React, { useState, useMemo } from "react";
import { reassignUsingProjects } from "../Services/cashTrackerService";

// ─── helpers ────────────────────────────────────────────────────────────────
function fmt(n) {
  if (n == null || n === 0) return "₹0";
  const abs = Math.abs(Number(n));
  const str = "₹" + abs.toLocaleString("en-IN");
  return Number(n) < 0 ? "−" + str : str;
}

// ─── styles ─────────────────────────────────────────────────────────────────
const s = {
  overlay:    { position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" },
  modal:      { background: "#fff", borderRadius: 10, width: 560, maxHeight: "90vh", display: "flex", flexDirection: "column", border: "0.5px solid #e5e5e0", boxShadow: "0 12px 40px rgba(0,0,0,0.15)" },
  header:     { padding: "14px 18px", borderBottom: "0.5px solid #e5e5e0", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 },
  hTitle:     { fontSize: 14, fontWeight: 500, color: "#1a1a18" },
  hSub:       { fontSize: 11, color: "#737370", marginTop: 2 },
  close:      { fontSize: 20, color: "#737370", cursor: "pointer", background: "none", border: "none", lineHeight: 1, padding: "0 4px" },
  stepper:    { display: "flex", padding: "12px 18px", gap: 0, borderBottom: "0.5px solid #f0f0ed", flexShrink: 0 },
  step:       (active, done) => ({
    display: "flex", alignItems: "center", gap: 6, flex: 1,
    fontSize: 12, fontWeight: active ? 500 : 400,
    color: done ? "#3B6D11" : active ? "#185FA5" : "#a0a09d",
  }),
  stepDot:    (active, done) => ({
    width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: 10, fontWeight: 600, flexShrink: 0,
    background: done ? "#EAF3DE" : active ? "#185FA5" : "#f0f0ed",
    color:      done ? "#3B6D11" : active ? "#fff"    : "#a0a09d",
    border:     active ? "none" : done ? "0.5px solid #C0DD97" : "0.5px solid #e0e0db",
  }),
  stepLine:   { flex: 1, height: 1, background: "#e5e5e0", margin: "0 6px" },
  body:       { flex: 1, overflowY: "auto", padding: "16px 18px" },
  footer:     { padding: "12px 18px", borderTop: "0.5px solid #e5e5e0", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 },
  btn:        { padding: "7px 16px", borderRadius: 6, fontSize: 13, border: "0.5px solid #d0d0cc", background: "#fff", color: "#1a1a18", cursor: "pointer" },
  btnBlue:    { background: "#185FA5", color: "#fff", borderColor: "#185FA5", fontWeight: 500 },
  btnGreen:   { background: "#3B6D11", color: "#fff", borderColor: "#3B6D11", fontWeight: 500 },
  btnDis:     { opacity: 0.4, cursor: "not-allowed" },
  // step 1 – checkbox list
  checkRow:   (checked) => ({
    display: "flex", alignItems: "flex-start", gap: 10,
    padding: "10px 12px", borderRadius: 6, marginBottom: 5, cursor: "pointer",
    border: `0.5px solid ${checked ? "#A8C8F8" : "#e5e5e0"}`,
    background: checked ? "#EDF4FD" : "#fff",
  }),
  checkbox:   { marginTop: 2, accentColor: "#185FA5", width: 14, height: 14, flexShrink: 0, cursor: "pointer" },
  rowName:    { fontSize: 13, fontWeight: 500, color: "#1a1a18" },
  rowRef:     { fontSize: 11, color: "#a0a09d", fontFamily: "monospace" },
  rowAmts:    { display: "flex", gap: 10, marginTop: 4, fontSize: 11 },
  pill:       (color) => ({ background: color === "red" ? "#FCEBEB" : color === "green" ? "#EAF3DE" : "#f0f0ed", color: color === "red" ? "#A32D2D" : color === "green" ? "#3B6D11" : "#737370", borderRadius: 4, padding: "1px 6px", fontFamily: "monospace" }),
  selAll:     { fontSize: 12, color: "#185FA5", cursor: "pointer", background: "none", border: "none", padding: 0, marginBottom: 8 },
  // step 2 – project picker
  projCard:   (sel) => ({
    display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 6,
    marginBottom: 6, cursor: "pointer",
    border: `0.5px solid ${sel ? "#A8C8F8" : "#e5e5e0"}`,
    background: sel ? "#EDF4FD" : "#fff",
  }),
  projDot:    (color) => ({ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }),
  projName:   { fontSize: 13, fontWeight: 500, color: "#1a1a18", flex: 1 },
  projBal:    (neg) => ({ fontSize: 12, fontWeight: 500, color: neg ? "#A32D2D" : "#3B6D11", fontFamily: "monospace" }),
  arrow:      { fontSize: 11, color: "#737370", display: "flex", alignItems: "center", gap: 4 },
  // step 3 – note
  label:      { fontSize: 12, color: "#737370", display: "block", marginBottom: 5 },
  textarea:   { width: "100%", padding: "8px 10px", border: "0.5px solid #d0d0cc", borderRadius: 6, fontSize: 13, color: "#1a1a18", resize: "vertical", outline: "none", boxSizing: "border-box", minHeight: 80 },
  // summary box
  summaryBox: { background: "#f5f5f3", border: "0.5px solid #e5e5e0", borderRadius: 8, padding: "14px 16px", marginBottom: 12 },
  summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, marginBottom: 6 },
  summaryLbl: { color: "#737370" },
  summaryVal: { fontWeight: 500, color: "#1a1a18", fontFamily: "monospace" },
  // success screen
  successWrap:{ textAlign: "center", padding: "28px 18px" },
  successIcon:{ fontSize: 40, marginBottom: 12 },
  successTit: { fontSize: 16, fontWeight: 500, color: "#1a1a18", marginBottom: 6 },
  successSub: { fontSize: 13, color: "#737370", marginBottom: 20 },
  successCard:{ background: "#EAF3DE", border: "0.5px solid #C0DD97", borderRadius: 8, padding: "12px 16px", marginBottom: 16, textAlign: "left" },
  // error
  errBox:     { background: "#FCEBEB", border: "0.5px solid #F7C1C1", borderRadius: 6, padding: "8px 12px", fontSize: 12, color: "#A32D2D", marginTop: 10 },
};

const PROJECT_COLORS = ["#185FA5","#3B6D11","#854F0B","#A32D2D","#1D9E75","#9F4F00","#5C1EA0","#005F73"];

// ─── STEP 1 — Select sub-projects ──────────────────────────────────────────
function Step1({ fundingProject, selected, setSelected }) {
  const subProjects = fundingProject.usingProjects || [];
  const pendingOnly = subProjects.filter(u => Number(u.pending || 0) > 0);
  const all = pendingOnly.length > 0 ? pendingOnly : subProjects;

  const allSelected = all.length > 0 && all.every(u => selected.includes(u.id));

  const toggle = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelected(allSelected ? [] : all.map(u => u.id));

  return (
    <div>
      <div style={{ fontSize: 13, color: "#1a1a18", marginBottom: 4 }}>
        Select which sub-projects to reassign from <strong>{fundingProject.name}</strong>
      </div>
      <div style={{ fontSize: 11, color: "#737370", marginBottom: 12 }}>
        Only sub-projects with pending balance are shown. Amounts will not change — only the funder changes.
      </div>

      {all.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px", color: "#a0a09d", fontSize: 13 }}>
          No sub-projects with pending balance found.
        </div>
      ) : (
        <>
          <button style={s.selAll} onClick={toggleAll}>
            {allSelected ? "✕ Deselect all" : "✓ Select all"}
          </button>
          {all.map(u => {
            const checked = selected.includes(u.id);
            const pending = Number(u.pending || 0);
            return (
              <div key={u.id} style={s.checkRow(checked)} onClick={() => toggle(u.id)}>
                <input
                  type="checkbox"
                  style={s.checkbox}
                  checked={checked}
                  onChange={() => toggle(u.id)}
                  onClick={e => e.stopPropagation()}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={s.rowName}>{u.name}</div>
                  {u.refNo && <div style={s.rowRef}>{u.refNo}</div>}
                  <div style={s.rowAmts}>
                    <span style={s.pill("gray")}>Given: {fmt(u.amountGiven)}</span>
                    <span style={s.pill("green")}>Back: {fmt(u.amountReturned)}</span>
                    <span style={s.pill("red")}>Pending: {fmt(pending)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

// ─── STEP 2 — Pick new funder ───────────────────────────────────────────────
function Step2({ fundingProject, allProjects, newFunderId, setNewFunderId, selectedRows }) {
  const candidates = allProjects.filter(p => p.id !== fundingProject.id && p.active !== false);

  const totalPending = selectedRows.reduce((a, u) => a + Number(u.pending || 0), 0);

  return (
    <div>
      <div style={{ fontSize: 13, color: "#1a1a18", marginBottom: 4 }}>
        Who becomes the new funder for the <strong>{selectedRows.length}</strong> selected sub-project{selectedRows.length !== 1 ? "s" : ""}?
      </div>
      <div style={{ fontSize: 11, color: "#737370", marginBottom: 14 }}>
        The selected sub-projects will owe <strong>{fmt(totalPending)}</strong> to the project you choose below.
      </div>

      {/* Preview of what moves */}
      <div style={{ ...s.summaryBox, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "#737370", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>Moving</div>
        {selectedRows.map(u => (
          <div key={u.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: "#1a1a18" }}>{u.name}</span>
            <span style={s.pill("red")}>{fmt(u.pending)}</span>
          </div>
        ))}
        <div style={{ borderTop: "0.5px solid #e0e0db", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 500 }}>
          <span>Total pending</span>
          <span style={{ color: "#A32D2D", fontFamily: "monospace" }}>{fmt(totalPending)}</span>
        </div>
      </div>

      {/* Project list */}
      {candidates.length === 0 ? (
        <div style={{ textAlign: "center", padding: 24, color: "#a0a09d", fontSize: 13 }}>
          No other active projects available.
        </div>
      ) : (
        candidates.map((p, pi) => {
          const sel = newFunderId === p.id;
          const bal = Number(p.currentBalance || 0);
          const balAfter = bal - totalPending;
          return (
            <div key={p.id} style={s.projCard(sel)} onClick={() => setNewFunderId(p.id)}>
              <span style={s.projDot(PROJECT_COLORS[pi % PROJECT_COLORS.length])}></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={s.projName}>{p.name}</div>
                {p.clientName && <div style={{ fontSize: 11, color: "#737370" }}>{p.clientName}</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={s.projBal(bal < 0)}>{fmt(bal)}</div>
                {sel && (
                  <div style={s.arrow}>
                    <span>→</span>
                    <span style={{ color: balAfter < 0 ? "#A32D2D" : "#3B6D11" }}>{fmt(balAfter)}</span>
                    <span style={{ color: "#a0a09d" }}>after</span>
                  </div>
                )}
              </div>
              <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${sel ? "#185FA5" : "#d0d0cc"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {sel && <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#185FA5", display: "block" }}></span>}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ─── STEP 3 — Note + confirm ────────────────────────────────────────────────
function Step3({ fundingProject, newFunder, selectedRows, note, setNote }) {
  const totalPending = selectedRows.reduce((a, u) => a + Number(u.pending || 0), 0);
  const totalGiven   = selectedRows.reduce((a, u) => a + Number(u.amountGiven || 0), 0);

  return (
    <div>
      {/* Summary */}
      <div style={s.summaryBox}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "#737370", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>Reassignment summary</div>
        <div style={s.summaryRow}>
          <span style={s.summaryLbl}>From (current funder)</span>
          <span style={{ ...s.summaryVal, color: "#A32D2D" }}>{fundingProject.name}</span>
        </div>
        <div style={s.summaryRow}>
          <span style={s.summaryLbl}>To (new funder)</span>
          <span style={{ ...s.summaryVal, color: "#3B6D11" }}>{newFunder?.name}</span>
        </div>
        <div style={s.summaryRow}>
          <span style={s.summaryLbl}>Sub-projects moving</span>
          <span style={s.summaryVal}>{selectedRows.length}</span>
        </div>
        <div style={s.summaryRow}>
          <span style={s.summaryLbl}>Total given</span>
          <span style={s.summaryVal}>{fmt(totalGiven)}</span>
        </div>
        <div style={{ ...s.summaryRow, marginBottom: 0 }}>
          <span style={s.summaryLbl}>Total pending (debt moving)</span>
          <span style={{ ...s.summaryVal, color: "#A32D2D" }}>{fmt(totalPending)}</span>
        </div>
      </div>

      {/* Sub-project list */}
      <div style={{ fontSize: 11, fontWeight: 500, color: "#737370", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>Sub-projects</div>
      {selectedRows.map(u => (
        <div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "0.5px solid #f5f5f3", fontSize: 12 }}>
          <span style={{ color: "#1a1a18" }}>{u.name}</span>
          <span style={s.pill("red")}>{fmt(u.pending)}</span>
        </div>
      ))}

      {/* Note */}
      <div style={{ marginTop: 16 }}>
        <label style={s.label}>Note (optional — saved in audit log)</label>
        <textarea
          style={s.textarea}
          placeholder={`e.g. ${newFunder?.name || "New funder"} funded ${fundingProject.name}; debts transferred`}
          value={note}
          onChange={e => setNote(e.target.value)}
        />
      </div>
    </div>
  );
}

// ─── SUCCESS SCREEN ──────────────────────────────────────────────────────────
function SuccessScreen({ result, onClose }) {
  return (
    <div style={s.successWrap}>
      <div style={s.successIcon}>✅</div>
      <div style={s.successTit}>Debt reassigned successfully</div>
      <div style={s.successSub}>
        {result.reassignedCount} sub-project{result.reassignedCount !== 1 ? "s" : ""} moved from{" "}
        <strong>{result.oldFundingProjectName}</strong> to{" "}
        <strong>{result.newFundingProjectName}</strong>
      </div>

      <div style={s.successCard}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
          <span style={{ color: "#737370" }}>Total amount reassigned</span>
          <span style={{ fontWeight: 500, color: "#1a1a18", fontFamily: "monospace" }}>{fmt(result.totalAmountReassigned)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
          <span style={{ color: "#737370" }}>Total pending reassigned</span>
          <span style={{ fontWeight: 500, color: "#3B6D11", fontFamily: "monospace" }}>{fmt(result.totalPendingReassigned)}</span>
        </div>
      </div>

      <div style={{ fontSize: 12, color: "#737370", marginBottom: 20 }}>
        {result.reassigned.map(u => (
          <div key={u.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "0.5px solid #f0f0ed" }}>
            <span>{u.name}</span>
            <span style={{ fontFamily: "monospace", color: "#3B6D11" }}>{fmt(u.pending)}</span>
          </div>
        ))}
      </div>

      <button style={{ ...s.btn, ...s.btnGreen, width: "100%", justifyContent: "center" }} onClick={onClose}>
        Done
      </button>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
/**
 * ReassignModal
 *
 * Props:
 *   fundingProject  — the project whose sub-projects are being reassigned
 *                     must have .usingProjects[] array
 *   allProjects     — all active CashProject objects (to pick new funder from)
 *   onClose()       — called when modal should close (cancel or after success)
 *   onSuccess()     — called after a successful reassignment (reload parent data)
 *
 * Usage:
 *   {showReassign && (
 *     <ReassignModal
 *       fundingProject={project}
 *       allProjects={allProjects}
 *       onClose={() => setShowReassign(false)}
 *       onSuccess={() => { setShowReassign(false); reload(); }}
 *     />
 *   )}
 */
export default function ReassignModal({ fundingProject, allProjects, onClose, onSuccess }) {
  const [step, setStep]           = useState(1);
  const [selected, setSelected]   = useState([]);   // array of UsingProject IDs
  const [newFunderId, setNewFunderId] = useState(null);
  const [note, setNote]           = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [result, setResult]       = useState(null);  // ReassignResponse on success

  // Rows corresponding to selected IDs (for preview in steps 2 & 3)
  const selectedRows = useMemo(
    () => (fundingProject.usingProjects || []).filter(u => selected.includes(u.id)),
    [fundingProject, selected]
  );

  const newFunder = useMemo(
    () => allProjects.find(p => p.id === newFunderId) || null,
    [allProjects, newFunderId]
  );

  const canNext = step === 1 ? selected.length > 0
                : step === 2 ? newFunderId != null
                : true;

  const handleNext = () => { setError(""); setStep(s => s + 1); };
  const handleBack = () => { setError(""); setStep(s => s - 1); };

  const handleConfirm = async () => {
    setLoading(true); setError("");
    try {
      const res = await reassignUsingProjects(selected, newFunderId, note);
      setResult(res);
      onSuccess();
    } catch (e) {
      setError(e.message || "Reassignment failed.");
    } finally {
      setLoading(false);
    }
  };

  const STEPS = ["Select sub-projects", "Choose new funder", "Confirm & note"];

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && !loading && onClose()}>
      <div style={s.modal}>

        {/* Header */}
        <div style={s.header}>
          <div>
            <div style={s.hTitle}>🔄 Reassign debt</div>
            <div style={s.hSub}>{fundingProject.name}</div>
          </div>
          <button style={s.close} onClick={() => !loading && onClose()}>×</button>
        </div>

        {/* Stepper — hidden on success */}
        {!result && (
          <div style={s.stepper}>
            {STEPS.map((label, i) => {
              const num   = i + 1;
              const active = step === num;
              const done   = step > num;
              return (
                <React.Fragment key={num}>
                  <div style={s.step(active, done)}>
                    <span style={s.stepDot(active, done)}>{done ? "✓" : num}</span>
                    <span>{label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div style={s.stepLine} />}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Body */}
        <div style={s.body}>
          {result ? (
            <SuccessScreen result={result} onClose={onClose} />
          ) : (
            <>
              {step === 1 && (
                <Step1
                  fundingProject={fundingProject}
                  selected={selected}
                  setSelected={setSelected}
                />
              )}
              {step === 2 && (
                <Step2
                  fundingProject={fundingProject}
                  allProjects={allProjects}
                  newFunderId={newFunderId}
                  setNewFunderId={setNewFunderId}
                  selectedRows={selectedRows}
                />
              )}
              {step === 3 && (
                <Step3
                  fundingProject={fundingProject}
                  newFunder={newFunder}
                  selectedRows={selectedRows}
                  note={note}
                  setNote={setNote}
                />
              )}
              {error && <div style={s.errBox}>⚠ {error}</div>}
            </>
          )}
        </div>

        {/* Footer — hidden on success */}
        {!result && (
          <div style={s.footer}>
            <div>
              {step > 1 && (
                <button style={s.btn} onClick={handleBack} disabled={loading}>← Back</button>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={s.btn} onClick={onClose} disabled={loading}>Cancel</button>
              {step < 3 ? (
                <button
                  style={{ ...s.btn, ...s.btnBlue, ...(canNext ? {} : s.btnDis) }}
                  onClick={canNext ? handleNext : undefined}
                  disabled={!canNext}
                >
                  Next →
                </button>
              ) : (
                <button
                  style={{ ...s.btn, ...s.btnGreen }}
                  onClick={handleConfirm}
                  disabled={loading}
                >
                  {loading ? "Reassigning…" : "✓ Confirm reassignment"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
