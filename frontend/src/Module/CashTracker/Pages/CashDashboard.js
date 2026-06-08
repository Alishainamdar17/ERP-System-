import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaWallet, FaArrowUp, FaArrowDown, FaExchangeAlt,
    FaProjectDiagram, FaSpinner, FaPlus, FaExclamationTriangle,
} from "react-icons/fa";
import { getDashboard, getProjects } from "../Services/cashTrackerService";

const fmt = (n) =>
    `₹ ${(Number(n) || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function CashDashboard() {
    const navigate = useNavigate();
    const [dash, setDash] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        Promise.all([getDashboard(), getProjects()])
            .then(([dRes, pRes]) => {
                setDash(dRes);
                setProjects(pRes || []);
            })
            .catch(() => setError("Failed to load dashboard data."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: "#64748b" }}>
            <FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: 22 }} /> Loading dashboard…
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    if (error) return (
        <div style={{ padding: 30, color: "#ef4444", background: "#fef2f2", borderRadius: 10, margin: 20 }}>{error}</div>
    );

    const d = dash || {};

    // Master Summary — aggregate across all projects
    const totalClientReceived = projects.reduce((s, p) => s + (Number(p.totalValue) || 0), 0);
    const totalGivenOut = d.totalTransfersOut || 0;
    const totalBalance = d.totalBalance || 0;
    const totalExpense = d.totalExpense || 0;

    return (
        <div style={{ padding: "24px 28px", background: "#f8fafc", minHeight: "100vh" }}>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 26, flexWrap: "wrap", gap: 12 }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>💰 Cash Flow Tracker</h2>
                    <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>Project-wise ledger & master summary</p>
                </div>
                <button onClick={() => navigate("projects/new")} style={addBtn}>
                    <FaPlus style={{ marginRight: 7 }} /> New Project
                </button>
            </div>

            {/* ── MASTER SUMMARY (matches Excel) ── */}
            <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", marginBottom: 28, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", background: "#0f172a", borderRadius: "14px 14px 0 0" }}>
                    <span style={{ fontWeight: 800, fontSize: 14, color: "#fff", letterSpacing: "0.04em" }}>📊 MASTER SUMMARY</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={SumTH("left")}>Project</th>
                                <th style={SumTH()}>Client Received (₹)</th>
                                <th style={SumTH()}>Total Expense (₹)</th>
                                <th style={SumTH()}>Given Out (₹)</th>
                                <th style={SumTH()}>Received Back (₹)</th>
                                <th style={SumTH()}>Pending Recovery (₹)</th>
                                <th style={SumTH()}>Current Balance (₹)</th>
                                <th style={SumTH()}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length === 0 ? (
                                <tr><td colSpan={8} style={{ textAlign: "center", padding: 32, color: "#94a3b8", fontSize: 13 }}>No projects yet. Create one to begin.</td></tr>
                            ) : projects.map((p, i) => {
                                const bal = Number(p.currentBalance) || 0;
                                const shortfall = bal < 0;
                                return (
                                    <tr key={p.id}
                                        onClick={() => navigate(`projects/${p.id}`)}
                                        style={{ background: i % 2 === 0 ? "#fff" : "#f9fafb", cursor: "pointer" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "#eff6ff"}
                                        onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#f9fafb"}
                                    >
                                        <td style={{ ...SumTD, fontWeight: 700, color: "#1e293b" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.active ? "#10b981" : "#94a3b8" }} />
                                                {p.name}
                                                {p.clientName && <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>({p.clientName})</span>}
                                            </div>
                                        </td>
                                        <td style={{ ...SumTD, textAlign: "right" }}>{fmt(p.totalValue)}</td>
                                        <td style={{ ...SumTD, textAlign: "right", color: "#f59e0b" }}>—</td>
                                        <td style={{ ...SumTD, textAlign: "right", color: "#ef4444" }}>—</td>
                                        <td style={{ ...SumTD, textAlign: "right", color: "#10b981" }}>—</td>
                                        <td style={{ ...SumTD, textAlign: "right" }}>—</td>
                                        <td style={{ ...SumTD, textAlign: "right", fontWeight: 800, color: shortfall ? "#ef4444" : "#10b981" }}>
                                            {fmt(p.currentBalance)}
                                            {shortfall && <span style={{ display: "block", fontSize: 10, fontWeight: 600, color: "#ef4444" }}>⚠ SHORTFALL</span>}
                                        </td>
                                        <td style={{ ...SumTD, textAlign: "center" }}>
                                            <span style={{
                                                padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                                                background: p.active ? "#d1fae5" : "#f1f5f9",
                                                color: p.active ? "#065f46" : "#64748b",
                                            }}>{p.active ? "Active" : "Inactive"}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        {/* Totals Row */}
                        {projects.length > 0 && (
                            <tfoot>
                                <tr style={{ background: "#eff6ff" }}>
                                    <td style={{ ...SumTD, fontWeight: 800, color: "#1e293b" }}>TOTAL</td>
                                    <td style={{ ...SumTD, textAlign: "right", fontWeight: 800 }}>{fmt(projects.reduce((s, p) => s + (Number(p.totalValue) || 0), 0))}</td>
                                    <td style={{ ...SumTD, textAlign: "right", fontWeight: 800, color: "#f59e0b" }}>{fmt(d.totalExpense)}</td>
                                    <td style={{ ...SumTD, textAlign: "right", fontWeight: 800, color: "#ef4444" }}>{fmt(d.totalTransfersOut)}</td>
                                    <td style={{ ...SumTD, textAlign: "right", fontWeight: 800, color: "#10b981" }}>—</td>
                                    <td style={{ ...SumTD, textAlign: "right", fontWeight: 800 }}>—</td>
                                    <td style={{ ...SumTD, textAlign: "right", fontWeight: 800, color: (Number(d.totalBalance) || 0) < 0 ? "#ef4444" : "#6366f1" }}>{fmt(d.totalBalance)}</td>
                                    <td style={SumTD}></td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>

            {/* ── Quick Stats ── */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
                {[
                    { label: "Total Projects", value: d.totalProjects || 0, color: "#6366f1", icon: FaProjectDiagram, sub: `${d.activeProjects || 0} active` },
                    { label: "Total Balance", value: fmt(d.totalBalance), color: "#10b981", icon: FaWallet },
                    { label: "Total Income", value: fmt(d.totalIncome), color: "#3b82f6", icon: FaArrowUp },
                    { label: "Total Expense", value: fmt(d.totalExpense), color: "#f59e0b", icon: FaArrowDown },
                    { label: "In Shortfall", value: d.projectsInShortfall || 0, color: "#ef4444", icon: FaExclamationTriangle, sub: "projects" },
                ].map(({ label, value, color, icon: Icon, sub }) => (
                    <div key={label} style={{
                        background: "#fff", borderRadius: 12, padding: "18px 22px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.07)", borderLeft: `4px solid ${color}`,
                        flex: 1, minWidth: 150,
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Icon style={{ color, fontSize: 14 }} />
                            </div>
                            <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
                        </div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: "#1e293b" }}>{value}</div>
                        {sub && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{sub}</div>}
                    </div>
                ))}
            </div>

            {/* Quick links */}
            <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => navigate("transfers")} style={linkBtn("#6366f1")}>
                    <FaExchangeAlt style={{ marginRight: 8 }} /> View All Transfers
                </button>
            </div>
        </div>
    );
}

const SumTH = (align = "center") => ({
    padding: "11px 14px", textAlign: align, fontSize: 11, fontWeight: 700,
    color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em",
    background: "#f8fafc", borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap",
});
const SumTD = { padding: "12px 14px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" };
const addBtn = { padding: "10px 22px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13, display: "inline-flex", alignItems: "center" };
const linkBtn = (bg) => ({ padding: "9px 20px", background: bg + "18", color: bg, border: `1.5px solid ${bg}30`, borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13, display: "inline-flex", alignItems: "center" });

