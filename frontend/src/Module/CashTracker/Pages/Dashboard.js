import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDashboard,
  getAllProjects,
  getAllTransfers,
  getAllTransactions,
} from "../Services/cashTrackerService";
import NewProjectModal from "../Components/NewProjectModal";

// ─── helpers ────────────────────────────────────────────────────────────────
function fmt(n) {
  if (n == null || n === 0) return "₹0";
  const abs = Math.abs(Number(n));
  const str = "₹" + abs.toLocaleString("en-IN");
  return Number(n) < 0 ? "−" + str : str;
}

function projectBadge(p) {
  if (Number(p.currentBalance) < 0) return "red";
  if ((p.spentPercentage || 0) >= 90) return "amber";
  return "green";
}
function projectStatus(p) {
  if (Number(p.currentBalance) < 0) return "Shortfall";
  if ((p.spentPercentage || 0) >= 90) return "Warning";
  return "Active";
}
function barColor(p) {
  if (Number(p.currentBalance) < 0) return "#ef4444";
  if ((p.spentPercentage || 0) >= 90) return "#f59e0b";
  return "#22c55e";
}

const PROJECT_COLORS = [
  "#3b82f6","#22c55e","#f59e0b","#ef4444",
  "#a855f7","#14b8a6","#ec4899","#60a5fa",
];

// ─── CSS injection ────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .dash-screen * { box-sizing: border-box; }

  .dash-screen {
    min-height: 100vh;
    background: #f5f5f4;
    color: #1c1917;
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 28px 32px;
  }

  /* metric cards */
  .metric-card {
    background: #ffffff;
    border: 1px solid #e7e5e4;
    border-radius: 12px;
    padding: 20px 22px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .metric-card:hover {
    border-color: #d6d3d1;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }

  /* project cards */
  .proj-card {
    background: #ffffff;
    border: 1px solid #e7e5e4;
    border-radius: 10px;
    padding: 16px 18px;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.15s, transform 0.15s;
  }
  .proj-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59,130,246,0.10);
    transform: translateY(-1px);
  }

  /* table */
  .dash-table tr:hover td { background: #fafaf9 !important; }

  /* tab */
  .nav-tab {
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 12.5px;
    cursor: pointer;
    border: 1px solid transparent;
    background: none;
    color: #a8a29e;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.15s;
  }
  .nav-tab:hover { color: #1c1917; }
  .nav-tab.active {
    background: #ffffff;
    border-color: #e7e5e4;
    color: #1c1917;
  }

  /* pending debt card */
  .debt-card {
    background: #fff7f7;
    border: 1px solid #fecaca;
    border-radius: 12px;
    padding: 20px 22px;
  }

  /* scrollbar */
  .dash-screen ::-webkit-scrollbar { width: 4px; height: 4px; }
  .dash-screen ::-webkit-scrollbar-track { background: #f5f5f4; }
  .dash-screen ::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 4px; }

  /* badge */
  .badge-green { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
  .badge-amber { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
  .badge-red   { background: #fff1f2; color: #dc2626; border: 1px solid #fecaca; }

  .pulse-dot {
    width: 7px; height: 7px; border-radius: 50%;
    display: inline-block; margin-right: 5px;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .number-font { font-family: 'DM Mono', monospace; }
  .title-font  { font-family: 'Plus Jakarta Sans', sans-serif; }

  .expand-row td { background: #fafaf9 !important; }

  .progress-track {
    height: 5px;
    background: #e7e5e4;
    border-radius: 4px;
    overflow: hidden;
    margin: 8px 0;
  }
  .progress-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.4s ease;
  }

  /* divider line */
  .section-divider {
    height: 1px;
    background: #e7e5e4;
    margin: 20px 0;
  }
`;

function StyleTag() {
  return <style>{CSS}</style>;
}

// ─── Pending Debt Summary Card ───────────────────────────────────────────────
function PendingDebtCard({ projects }) {
  const totalPending  = projects.reduce((a, p) => a + Number(p.totalPending  || 0), 0);
  const totalGiven    = projects.reduce((a, p) => a + Number(p.totalGivenOut || 0), 0);
  const totalReturned = projects.reduce((a, p) => a + Number(p.totalReturned || 0), 0);
  const recoveryPct   = totalGiven > 0 ? Math.round((totalReturned / totalGiven) * 100) : 0;
  const topDebtors    = [...projects]
    .filter(p => Number(p.totalPending || 0) > 0)
    .sort((a, b) => Number(b.totalPending) - Number(a.totalPending))
    .slice(0, 3);

  return (
    <div className="debt-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4, fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 700 }}>
            ⚠ Pending Debt
          </div>
          <div className="number-font" style={{ fontSize: 28, fontWeight: 500, color: "#dc2626", lineHeight: 1 }}>
            {fmt(totalPending)}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "#a8a29e", marginBottom: 4 }}>Recovery rate</div>
          <div className="number-font" style={{ fontSize: 22, fontWeight: 500, color: recoveryPct >= 70 ? "#16a34a" : recoveryPct >= 40 ? "#d97706" : "#dc2626" }}>
            {recoveryPct}%
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 14 }}>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${recoveryPct}%`, background: "linear-gradient(90deg, #ef4444, #f97316)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#a8a29e" }}>
          <span>Given: <span className="number-font" style={{ color: "#57534e" }}>{fmt(totalGiven)}</span></span>
          <span>Returned: <span className="number-font" style={{ color: "#16a34a" }}>{fmt(totalReturned)}</span></span>
        </div>
      </div>

      {/* Top debtors */}
      {topDebtors.length > 0 && (
        <div>
          <div style={{ fontSize: 10, color: "#a8a29e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
            Top pending
          </div>
          {topDebtors.map((p, i) => {
            const pct = totalPending > 0 ? (Number(p.totalPending) / totalPending) * 100 : 0;
            return (
              <div key={p.id} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                  <span style={{ color: "#57534e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>
                    {p.name}
                  </span>
                  <span className="number-font" style={{ color: "#dc2626", flexShrink: 0 }}>{fmt(p.totalPending)}</span>
                </div>
                <div className="progress-track" style={{ height: 3 }}>
                  <div className="progress-fill" style={{ width: `${pct}%`, background: PROJECT_COLORS[i] }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPending === 0 && (
        <div style={{ textAlign: "center", padding: "8px 0", fontSize: 13, color: "#16a34a" }}>
          ✓ No pending debts
        </div>
      )}
    </div>
  );
}

// ─── Master Summary Table ────────────────────────────────────────────────────
function MasterSummaryTable({ projects }) {
  const [expanded, setExpanded] = useState({});
  const toggle = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const totalFunded   = projects.reduce((a, p) => a + Number(p.totalValue    || 0), 0);
  const totalGiven    = projects.reduce((a, p) => a + Number(p.totalGivenOut || 0), 0);
  const totalReturned = projects.reduce((a, p) => a + Number(p.totalReturned || 0), 0);
  const totalPending  = projects.reduce((a, p) => a + Number(p.totalPending  || 0), 0);

  if (projects.length === 0) {
    return <div style={{ textAlign: "center", padding: 30, color: "#a8a29e", fontSize: 13 }}>No projects yet.</div>;
  }

  const thStyle = {
    padding: "10px 14px",
    textAlign: "left",
    fontSize: 10.5,
    fontWeight: 700,
    color: "#a8a29e",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    borderBottom: "1px solid #e7e5e4",
    background: "#fafaf9",
    whiteSpace: "nowrap",
    fontFamily: "Plus Jakarta Sans, sans-serif",
  };
  const tdStyle = {
    padding: "12px 14px",
    borderBottom: "1px solid #f0ede9",
    verticalAlign: "middle",
    fontSize: 13,
    background: "#ffffff",
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="dash-table" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Funding Project</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Amount</th>
            <th style={thStyle}>Using Projects</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Given Out</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Returned</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Pending</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p, pi) => {
            const color     = PROJECT_COLORS[pi % PROJECT_COLORS.length];
            const usingList = p.usingProjects || [];
            const isExp     = !!expanded[p.id];
            const badge     = projectBadge(p);
            const badgeClass = `badge-${badge}`;

            return (
              <React.Fragment key={p.id}>
                <tr
                  style={{ cursor: usingList.length > 0 ? "pointer" : "default", background: isExp ? "#fafaf9" : "#ffffff" }}
                  onClick={() => usingList.length > 0 && toggle(p.id)}
                >
                  <td style={{ ...tdStyle, background: isExp ? "#fafaf9" : "#ffffff" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: color + "18", border: `1.5px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                      {pi + 1}
                    </div>
                  </td>
                  <td style={{ ...tdStyle, background: isExp ? "#fafaf9" : "#ffffff" }}>
                    <div style={{ fontWeight: 600, color: "#1c1917", fontSize: 13 }}>{p.name}</div>
                    {p.clientName && <div style={{ fontSize: 11, color: "#a8a29e", marginTop: 1 }}>{p.clientName}</div>}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right", fontFamily: "DM Mono, monospace", color: "#16a34a", fontWeight: 500, background: isExp ? "#fafaf9" : "#ffffff" }}>
                    {fmt(p.totalValue)}
                  </td>
                  <td style={{ ...tdStyle, background: isExp ? "#fafaf9" : "#ffffff" }}>
                    {usingList.length === 0 ? (
                      <span style={{ color: "#d6d3d1" }}>—</span>
                    ) : (
                      <div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {usingList.slice(0, 2).map(u => (
                            <span key={u.id} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#f5f5f4", border: "1px solid #e7e5e4", borderRadius: 4, padding: "2px 8px", fontSize: 11, color: "#78716c" }}>
                              <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0 }}></span>
                              {u.name.length > 22 ? u.name.slice(0, 22) + "…" : u.name}
                            </span>
                          ))}
                        </div>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", fontSize: 11, padding: "3px 0", fontFamily: "Plus Jakarta Sans, sans-serif" }}
                          onClick={e => { e.stopPropagation(); toggle(p.id); }}>
                          {isExp ? "▲ hide" : usingList.length > 2 ? `▼ +${usingList.length - 2} more` : `▼ ${usingList.length} project${usingList.length !== 1 ? "s" : ""}`}
                        </button>
                      </div>
                    )}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right", fontFamily: "DM Mono, monospace", color: "#f59e0b", background: isExp ? "#fafaf9" : "#ffffff" }}>
                    {Number(p.totalGivenOut || 0) > 0 ? fmt(p.totalGivenOut) : <span style={{ color: "#d6d3d1" }}>—</span>}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right", fontFamily: "DM Mono, monospace", color: "#16a34a", background: isExp ? "#fafaf9" : "#ffffff" }}>
                    {Number(p.totalReturned || 0) > 0 ? fmt(p.totalReturned) : <span style={{ color: "#d6d3d1" }}>—</span>}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right", background: isExp ? "#fafaf9" : "#ffffff" }}>
                    {Number(p.totalPending || 0) > 0 ? (
                      <span style={{ background: "#fff1f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 4, padding: "2px 8px", fontSize: 11, fontFamily: "DM Mono, monospace" }}>
                        {fmt(p.totalPending)}
                      </span>
                    ) : <span style={{ color: "#d6d3d1" }}>—</span>}
                  </td>
                  <td style={{ ...tdStyle, background: isExp ? "#fafaf9" : "#ffffff" }}>
                    <span className={`number-font ${badgeClass}`} style={{ display: "inline-flex", alignItems: "center", fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>
                      <span className="pulse-dot" style={{ background: badge === "green" ? "#16a34a" : badge === "amber" ? "#d97706" : "#dc2626" }}></span>
                      {projectStatus(p)}
                    </span>
                  </td>
                </tr>

                {/* Expanded sub-rows */}
                {isExp && usingList.map((u, ui) => (
                  <tr key={u.id} className="expand-row">
                    <td style={{ ...tdStyle, borderBottom: ui === usingList.length - 1 ? "1px solid #e7e5e4" : "1px solid #f0ede9" }}></td>
                    <td style={{ ...tdStyle, paddingLeft: 32, borderBottom: ui === usingList.length - 1 ? "1px solid #e7e5e4" : "1px solid #f0ede9" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 3, height: 16, background: color, borderRadius: 2, flexShrink: 0 }}></div>
                        <div>
                          <div style={{ fontSize: 12, color: "#57534e" }}>{u.name}</div>
                          {u.refNo && <div style={{ fontSize: 10, color: "#a8a29e", fontFamily: "DM Mono, monospace" }}>{u.refNo}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ borderBottom: ui === usingList.length - 1 ? "1px solid #e7e5e4" : "1px solid #f0ede9", background: "#fafaf9" }}></td>
                    <td style={{ borderBottom: ui === usingList.length - 1 ? "1px solid #e7e5e4" : "1px solid #f0ede9", background: "#fafaf9" }}></td>
                    <td style={{ ...tdStyle, textAlign: "right", fontFamily: "DM Mono, monospace", color: "#f59e0b", fontSize: 12, borderBottom: ui === usingList.length - 1 ? "1px solid #e7e5e4" : "1px solid #f0ede9" }}>
                      {Number(u.amountGiven || 0) > 0 ? fmt(u.amountGiven) : <span style={{ color: "#d6d3d1" }}>—</span>}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right", fontFamily: "DM Mono, monospace", color: "#16a34a", fontSize: 12, borderBottom: ui === usingList.length - 1 ? "1px solid #e7e5e4" : "1px solid #f0ede9" }}>
                      {Number(u.amountReturned || 0) > 0 ? fmt(u.amountReturned) : <span style={{ color: "#d6d3d1" }}>—</span>}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right", borderBottom: ui === usingList.length - 1 ? "1px solid #e7e5e4" : "1px solid #f0ede9" }}>
                      {Number(u.pending || 0) > 0 ? (
                        <span style={{ background: "#fff1f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 4, padding: "2px 6px", fontSize: 10, fontFamily: "DM Mono, monospace" }}>
                          {fmt(u.pending)}
                        </span>
                      ) : <span style={{ color: "#d6d3d1" }}>—</span>}
                    </td>
                    <td style={{ borderBottom: ui === usingList.length - 1 ? "1px solid #e7e5e4" : "1px solid #f0ede9", background: "#fafaf9" }}></td>
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} style={{ padding: "12px 14px", background: "#fafaf9", fontWeight: 700, color: "#78716c", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", borderTop: "2px solid #e7e5e4" }}>
              TOTAL
            </td>
            <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "DM Mono, monospace", fontWeight: 700, color: "#16a34a", background: "#fafaf9", borderTop: "2px solid #e7e5e4" }}>{fmt(totalFunded)}</td>
            <td style={{ background: "#fafaf9", borderTop: "2px solid #e7e5e4" }}></td>
            <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "DM Mono, monospace", fontWeight: 700, color: "#f59e0b", background: "#fafaf9", borderTop: "2px solid #e7e5e4" }}>{totalGiven > 0 ? fmt(totalGiven) : "—"}</td>
            <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "DM Mono, monospace", fontWeight: 700, color: "#16a34a", background: "#fafaf9", borderTop: "2px solid #e7e5e4" }}>{totalReturned > 0 ? fmt(totalReturned) : "—"}</td>
            <td style={{ padding: "12px 14px", textAlign: "right", background: "#fafaf9", borderTop: "2px solid #e7e5e4" }}>
              {totalPending > 0 ? (
                <span style={{ background: "#fff1f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 4, padding: "3px 10px", fontSize: 12, fontFamily: "DM Mono, monospace", fontWeight: 700 }}>
                  {fmt(totalPending)}
                </span>
              ) : "—"}
            </td>
            <td style={{ background: "#fafaf9", borderTop: "2px solid #e7e5e4" }}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [dash,         setDash]         = useState(null);
  const [projects,     setProjects]     = useState([]);
  const [transfers,    setTransfers]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [showModal,    setShowModal]    = useState(false);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const results = await Promise.allSettled([
        getDashboard(),
        getAllProjects(true),
        getAllTransfers(),
        getAllTransactions ? getAllTransactions() : Promise.resolve([]),
      ]);
      if (results[0].status === "fulfilled") setDash(results[0].value);
      if (results[1].status === "fulfilled") setProjects(results[1].value);
      if (results[2].status === "fulfilled") setTransfers(results[2].value);
      if (results[0].status === "rejected") throw results[0].reason;
    } catch (e) {
      setError(e.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const shortfalls   = projects.filter(p => Number(p.currentBalance) < 0);
  const totalPending = projects.reduce((a, p) => a + Number(p.totalPending || 0), 0);

  const cardStyle = {
    background: "#ffffff",
    border: "1px solid #e7e5e4",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  };
  const cardHeadStyle = {
    padding: "14px 20px",
    borderBottom: "1px solid #f0ede9",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#fafaf9",
  };
  const cardTitleStyle = {
    fontSize: 13,
    fontWeight: 700,
    color: "#1c1917",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    display: "flex",
    alignItems: "center",
    gap: 7,
  };

  if (loading) return (
    <div className="dash-screen" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <StyleTag />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>⟳</div>
        <div style={{ color: "#a8a29e", fontSize: 13 }}>Loading dashboard…</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="dash-screen" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <StyleTag />
      <div style={{ textAlign: "center" }}>
        <div style={{ color: "#dc2626", marginBottom: 12 }}>⚠ {error}</div>
        <button onClick={load} style={{ padding: "8px 16px", background: "#ffffff", border: "1px solid #e7e5e4", borderRadius: 8, color: "#1c1917", cursor: "pointer", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="dash-screen">
      <StyleTag />

      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); load(); }}
        />
      )}

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div className="title-font" style={{ fontSize: 22, fontWeight: 700, color: "#1c1917", letterSpacing: "-0.02em" }}>
            Cash Tracker
          </div>
          <div style={{ fontSize: 12, color: "#a8a29e", marginTop: 3 }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            {" · "}{projects.length} active project{projects.length !== 1 ? "s" : ""}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => navigate("/cash-tracker/projects")}
            style={{ padding: "8px 14px", background: "#ffffff", border: "1px solid #e7e5e4", borderRadius: 8, color: "#57534e", cursor: "pointer", fontSize: 12.5, fontFamily: "Plus Jakarta Sans, sans-serif", display: "flex", alignItems: "center", gap: 5, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            📁 Projects
          </button>
          <button
            onClick={() => navigate("/cash-tracker/transfers")}
            style={{ padding: "8px 14px", background: "#ffffff", border: "1px solid #e7e5e4", borderRadius: 8, color: "#57534e", cursor: "pointer", fontSize: 12.5, fontFamily: "Plus Jakarta Sans, sans-serif", display: "flex", alignItems: "center", gap: 5, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            ⇄ Transfers
          </button>
          <button
            onClick={() => setShowModal(true)}
            style={{ padding: "8px 16px", background: "#1c1917", border: "none", borderRadius: 8, color: "#ffffff", cursor: "pointer", fontSize: 12.5, fontWeight: 700, fontFamily: "Plus Jakarta Sans, sans-serif", display: "flex", alignItems: "center", gap: 5, boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }}>
            + New Project
          </button>
        </div>
      </div>

      {/* ── Shortfall alerts ── */}
      {shortfalls.map(p => (
        <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, marginBottom: 10, fontSize: 12.5, background: "#fff1f2", border: "1px solid #fecaca", color: "#dc2626" }}>
          ⚠️ <span><strong>{p.name}</strong> is in shortfall — balance is <strong className="number-font">{fmt(p.currentBalance)}</strong></span>
        </div>
      ))}

      {/* ── Metric cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { lbl: "Active Projects",  val: dash?.activeProjects ?? 0,  hint: `${dash?.totalProjects ?? 0} total`,  color: "#3b82f6", icon: "📁" },
          { lbl: "Net Balance",      val: fmt(dash?.totalBalance),    hint: "Across all projects",                 color: Number(dash?.totalBalance) < 0 ? "#dc2626" : "#16a34a", icon: "⚖" },
          { lbl: "Total Income",     val: fmt(dash?.totalIncome),     hint: "All transactions",                    color: "#16a34a", icon: "↑" },
          { lbl: "Total Expense",    val: fmt(dash?.totalExpense),    hint: "All transactions",                    color: "#f59e0b", icon: "↓" },
        ].map((m, i) => (
          <div key={i} className="metric-card">
            <div style={{ fontSize: 11, color: "#a8a29e", marginBottom: 10, display: "flex", alignItems: "center", gap: 5, fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <span>{m.icon}</span> {m.lbl}
            </div>
            <div className="number-font" style={{ fontSize: 24, fontWeight: 500, color: m.color, lineHeight: 1, marginBottom: 6 }}>
              {m.val}
            </div>
            <div style={{ fontSize: 11, color: "#c4bfbb" }}>{m.hint}</div>
          </div>
        ))}
      </div>

      {/* ── Pending Debt + Projects grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14, marginBottom: 16 }}>

        {/* Pending Debt Card */}
        <PendingDebtCard projects={projects} />

        {/* Projects grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, alignContent: "start" }}>
          {projects.slice(0, 4).map((p, pi) => {
            const badge = projectBadge(p);
            const pct   = Math.min(100, Math.round(p.spentPercentage || 0));
            const color = PROJECT_COLORS[pi % PROJECT_COLORS.length];
            return (
              <div key={p.id} className="proj-card" onClick={() => navigate(`/cash-tracker/projects/${p.id}`)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                    <div className="title-font" style={{ fontSize: 13, fontWeight: 700, color: "#1c1917", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#a8a29e", marginTop: 2 }}>{p.clientName || "—"}</div>
                  </div>
                  <span className={`badge-${badge}`} style={{ display: "inline-flex", alignItems: "center", fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 700, fontFamily: "Plus Jakarta Sans, sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {projectStatus(p)}
                  </span>
                </div>

                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: barColor(p) }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <div style={{ fontSize: 10, color: "#a8a29e", marginBottom: 2 }}>Balance</div>
                    <div className="number-font" style={{ fontSize: 16, fontWeight: 500, color: Number(p.currentBalance) < 0 ? "#dc2626" : "#1c1917" }}>
                      {fmt(p.currentBalance)}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="number-font" style={{ fontSize: 11, color: "#a8a29e" }}>{pct}%</div>
                    <div style={{ fontSize: 10, color: "#c4bfbb" }}>of {fmt(p.totalValue)}</div>
                  </div>
                </div>

                {(p.usingProjects || []).length > 0 && (
                  <div style={{ marginTop: 8, fontSize: 11, color: color, borderTop: "1px solid #f0ede9", paddingTop: 8 }}>
                    ↳ {p.usingProjects.length} sub-project{p.usingProjects.length !== 1 ? "s" : ""}
                    {Number(p.totalPending || 0) > 0 && (
                      <span className="number-font" style={{ marginLeft: 8, color: "#dc2626" }}>· {fmt(p.totalPending)} pending</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {projects.length > 4 && (
            <div
              onClick={() => navigate("/cash-tracker/projects")}
              style={{ background: "#fafaf9", border: "1px dashed #d6d3d1", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#a8a29e", fontSize: 13, padding: "14px 16px" }}>
              +{projects.length - 4} more →
            </div>
          )}
        </div>
      </div>

      {/* ── Master Summary Table ── */}
      <div style={cardStyle}>
        <div style={cardHeadStyle}>
          <div style={cardTitleStyle}>📊 Master Summary</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#c4bfbb" }}>Funding → Using · Click to expand</span>
            <button
              onClick={() => navigate("/cash-tracker/master-summary")}
              style={{ padding: "5px 12px", background: "#ffffff", border: "1px solid #e7e5e4", borderRadius: 6, color: "#3b82f6", cursor: "pointer", fontSize: 11.5, fontFamily: "Plus Jakarta Sans, sans-serif", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
              Full view ↗
            </button>
          </div>
        </div>
        <MasterSummaryTable projects={projects} />
      </div>

      {/* ── Recent Transfers ── */}
      <div style={cardStyle}>
        <div style={cardHeadStyle}>
          <div style={cardTitleStyle}>⇄ Recent Transfers</div>
          <button
            onClick={() => navigate("/cash-tracker/transfers")}
            style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: 12, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            View all →
          </button>
        </div>
        {transfers.length === 0 ? (
          <div style={{ textAlign: "center", padding: 24, color: "#a8a29e", fontSize: 13 }}>No transfers yet.</div>
        ) : (
          <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {transfers.slice(0, 4).map(t => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#fafaf9", borderRadius: 8, border: "1px solid #f0ede9" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="title-font" style={{ fontSize: 12.5, fontWeight: 600, color: "#1c1917", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {t.fromProjectName}
                  </div>
                  <div style={{ fontSize: 11, color: "#a8a29e" }}>From</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, flexShrink: 0 }}>
                  <span style={{ color: "#3b82f6", fontSize: 16 }}>→</span>
                  <div className="number-font" style={{ fontSize: 12, fontWeight: 500, color: "#3b82f6" }}>{fmt(t.amount)}</div>
                </div>
                <div style={{ flex: 1, textAlign: "right", minWidth: 0 }}>
                  <div className="title-font" style={{ fontSize: 12.5, fontWeight: 600, color: "#1c1917", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {t.toProjectName}
                  </div>
                  <div style={{ fontSize: 11, color: "#a8a29e" }}>{t.transferDate}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}