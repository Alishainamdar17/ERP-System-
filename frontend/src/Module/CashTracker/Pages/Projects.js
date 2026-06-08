import React, { useEffect, useState } from "react";
import { getAllProjects, deactivateProject } from "../Services/cashTrackerService";
import NewProjectModal from "../Components/NewProjectModal";

function fmt(n) {
  if (n == null) return "₹0";
  const abs = Math.abs(n);
  const str = "₹" + abs.toLocaleString("en-IN");
  return n < 0 ? "−" + str : str;
}
function badge(p) {
  if (p.currentBalance < 0) return { label: "Shortfall", bg: "#FCEBEB", color: "#A32D2D" };
  if ((p.spentPercentage || 0) >= 90) return { label: "Warning", bg: "#FAEEDA", color: "#854F0B" };
  return { label: "Active", bg: "#EAF3DE", color: "#3B6D11" };
}

const s = {
  screen:  { padding: "20px 24px", fontFamily: "sans-serif" },
  header:  { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  title:   { fontSize: 17, fontWeight: 500, color: "#1a1a18" },
  sub:     { fontSize: 12, color: "#737370", marginTop: 3 },
  btn:     { display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 6, fontSize: 12.5, border: "0.5px solid #d0d0cc", background: "#fff", color: "#1a1a18", cursor: "pointer" },
  btnBlue: { background: "#185FA5", color: "#fff", borderColor: "#185FA5", fontWeight: 500 },
  card:    { background: "#fff", border: "0.5px solid #e5e5e0", borderRadius: 10 },
  th:      { fontSize: 11, color: "#737370", fontWeight: 500, padding: "8px 16px", textAlign: "left", borderBottom: "0.5px solid #e5e5e0", background: "#f5f5f3" },
  td:      { padding: "11px 16px", borderBottom: "0.5px solid #e5e5e0" },
  spin:    { textAlign: "center", padding: 40, color: "#737370", fontSize: 13 },
  empty:   { textAlign: "center", padding: 30, color: "#a0a09d", fontSize: 13 },
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeOnly, setActiveOnly] = useState(true);

  const load = async () => {
    setLoading(true); setError("");
    try { setProjects(await getAllProjects(activeOnly)); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [activeOnly]);

  const handleDeactivate = async (id, name) => {
    if (!window.confirm(`Deactivate project "${name}"? This cannot be undone.`)) return;
    try { await deactivateProject(id); load(); }
    catch (e) { alert("Error: " + e.message); }
  };

  return (
    <div style={s.screen}>
      {showModal && <NewProjectModal onClose={() => setShowModal(false)} onCreated={() => load()} />}

      <div style={s.header}>
        <div>
          <div style={s.title}>Projects</div>
          <div style={s.sub}>Manage all cash tracker projects</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ fontSize: 12, color: "#737370", display: "flex", alignItems: "center", gap: 5 }}>
            <input type="checkbox" checked={activeOnly} onChange={(e) => setActiveOnly(e.target.checked)} />
            Active only
          </label>
          <button style={{ ...s.btn, ...s.btnBlue }} onClick={() => setShowModal(true)}>+ New project</button>
        </div>
      </div>

      {loading ? <div style={s.spin}>Loading projects...</div> : error ? <div style={{ ...s.spin, color: "#A32D2D" }}>⚠ {error} <button style={s.btn} onClick={load}>Retry</button></div> : (
        <div style={s.card}>
          {projects.length === 0
            ? <div style={s.empty}>No projects found. <button style={{ ...s.btn, ...s.btnBlue, marginLeft: 8 }} onClick={() => setShowModal(true)}>+ Create first project</button></div>
            : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>{["Project","Client","Total Value","Balance","Spent %","Status",""].map((h, i) => <th key={i} style={s.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {projects.map((p) => {
                    const b = badge(p);
                    return (
                      <tr key={p.id}>
                        <td style={{ ...s.td, fontWeight: 500, color: "#1a1a18", fontSize: 13 }}>{p.name}</td>
                        <td style={{ ...s.td, fontSize: 12, color: "#737370" }}>{p.clientName || "—"}</td>
                        <td style={{ ...s.td, fontSize: 12.5 }}>{fmt(p.totalValue)}</td>
                        <td style={{ ...s.td, fontSize: 12.5, fontWeight: 500, color: p.currentBalance < 0 ? "#A32D2D" : "#1a1a18" }}>{fmt(p.currentBalance)}</td>
                        <td style={{ ...s.td, fontSize: 12 }}>{Math.round(p.spentPercentage || 0)}%</td>
                        <td style={s.td}><span style={{ display: "inline-flex", fontSize: 10.5, padding: "2px 7px", borderRadius: 10, fontWeight: 500, background: b.bg, color: b.color }}>{b.label}</span></td>
                        <td style={s.td}>
                          {p.active && (
                            <button style={{ ...s.btn, color: "#A32D2D", borderColor: "#F7C1C1", fontSize: 11 }} onClick={() => handleDeactivate(p.id, p.name)}>
                              Deactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
        </div>
      )}
    </div>
  );
}
