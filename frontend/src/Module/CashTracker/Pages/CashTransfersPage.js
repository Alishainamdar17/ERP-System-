import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner, FaExchangeAlt, FaArrowLeft } from "react-icons/fa";
import { getAllTransfers, getProjects, createTransfer } from "../Services/cashTrackerService";

const fmt = (n) =>
    `₹ ${(Number(n) || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN") : "—";

export default function CashTransfersPage() {
    const navigate = useNavigate();
    const [transfers, setTransfers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState("");

    const load = () => {
        setLoading(true);
        Promise.all([getAllTransfers(), getProjects()])
            .then(([tRes, pRes]) => {
                setTransfers(tRes.data?.data || tRes.data || []);
                setProjects(pRes.data?.data || pRes.data || []);
            })
            .catch(() => setError("Failed to load transfers."))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    if (loading) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: "#64748b" }}>
            <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> Loading…
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    return (
        <div style={{ padding: "24px 28px", background: "#f8fafc", minHeight: "100vh" }}>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <button onClick={() => navigate(-1)} style={backBtn}>
                        <FaArrowLeft style={{ marginRight: 6 }} /> Back
                    </button>
                    <h2 style={{ margin: "4px 0 2px", fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
                        <FaExchangeAlt style={{ marginRight: 10, color: "#6366f1" }} />
                        All Transfers
                    </h2>
                    <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Inter-project fund movements</p>
                </div>
                <button onClick={() => setShowModal(true)} style={addBtn}>
                    + New Transfer
                </button>
            </div>

            {error && <div style={{ color: "#ef4444", marginBottom: 16 }}>{error}</div>}

            <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {["Date", "From Project", "To Project", "Amount", "Note", "By"].map(h => (
                                <th key={h} style={TH}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {transfers.length === 0 ? (
                            <tr><td colSpan={6} style={{ textAlign: "center", padding: 50, color: "#94a3b8" }}>No transfers found.</td></tr>
                        ) : transfers.map((t, i) => (
                            <tr key={t.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                                <td style={TD}>{fmtDate(t.transferDate)}</td>
                                <td style={TD}>
                                    <span style={{ fontWeight: 600, color: "#ef4444" }}>{t.fromProjectName}</span>
                                </td>
                                <td style={TD}>
                                    <span style={{ fontWeight: 600, color: "#10b981" }}>{t.toProjectName}</span>
                                </td>
                                <td style={{ ...TD, fontWeight: 800, color: "#6366f1" }}>{fmt(t.amount)}</td>
                                <td style={TD}>{t.note || "—"}</td>
                                <td style={TD}>{t.createdBy || "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <NewTransferModal
                    projects={projects.filter(p => p.active)}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => { setShowModal(false); load(); }}
                />
            )}
        </div>
    );
}

function NewTransferModal({ projects, onClose, onSuccess }) {
    const [form, setForm] = useState({ fromProjectId: "", toProjectId: "", amount: "", transferDate: "", note: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (String(form.fromProjectId) === String(form.toProjectId)) { setError("From and To project cannot be the same."); return; }
        setLoading(true);
        try {
            await createTransfer({
                fromProjectId: Number(form.fromProjectId),
                toProjectId: Number(form.toProjectId),
                amount: Number(form.amount),
                transferDate: form.transferDate || null,
                note: form.note,
            });
            onSuccess();
        } catch { setError("Failed to create transfer."); }
        finally { setLoading(false); }
    };

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "28px 32px", width: "100%", maxWidth: 520, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
                    <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#1e293b" }}>New Transfer</h3>
                    <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8" }}>✕</button>
                </div>
                {error && <div style={{ color: "#ef4444", marginBottom: 14, fontSize: 13 }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        {[
                            { label: "From Project *", key: "fromProjectId", type: "select" },
                            { label: "To Project *", key: "toProjectId", type: "select" },
                        ].map(({ label, key }) => (
                            <div key={key}>
                                <label style={labelStyle}>{label}</label>
                                <select value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inputStyle} required>
                                    <option value="">Select…</option>
                                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                        ))}
                        <div>
                            <label style={labelStyle}>Amount (₹) *</label>
                            <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={inputStyle} required min="0.01" step="0.01" placeholder="e.g. 25000" />
                        </div>
                        <div>
                            <label style={labelStyle}>Date</label>
                            <input type="date" value={form.transferDate} onChange={e => setForm({ ...form, transferDate: e.target.value })} style={inputStyle} />
                        </div>
                        <div style={{ gridColumn: "1/-1" }}>
                            <label style={labelStyle}>Note</label>
                            <input type="text" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} style={inputStyle} placeholder="Optional note" />
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
                        <button type="button" onClick={onClose} style={cancelBtn}>Cancel</button>
                        <button type="submit" disabled={loading} style={submitBtnStyle}>
                            {loading ? "Saving…" : "Create Transfer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const TH = { padding: "11px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" };
const TD = { padding: "12px 14px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" };
const backBtn = { display: "inline-flex", alignItems: "center", marginBottom: 8, background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 13, fontWeight: 700, padding: 0 };
const addBtn = { padding: "10px 22px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 };
const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" };
const inputStyle = { width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, color: "#1e293b", outline: "none", boxSizing: "border-box", background: "#fff" };
const cancelBtn = { padding: "9px 20px", border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#fff", color: "#374151", fontWeight: 700, cursor: "pointer", fontSize: 13 };
const submitBtnStyle = { padding: "9px 24px", border: "none", borderRadius: 8, background: "#6366f1", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 };
