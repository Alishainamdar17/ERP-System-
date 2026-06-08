import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft, FaEdit, FaTrash, FaSpinner, FaPlus,
    FaArrowUp, FaArrowDown, FaExchangeAlt, FaPrint,
} from "react-icons/fa";
import {
    getProjectById, getTransactionsByProject, getTransfersByProject,
    createTransaction, deleteTransaction, createTransfer, deleteProject,
    getProjects,
} from "../Services/cashTrackerService";

const fmt = (n) => `₹ ${(Number(n) || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const fmtDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

export default function CashProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [transfers, setTransfers] = useState([]);
    const [allProjects, setAllProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showTxnModal, setShowTxnModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);

    const loadAll = useCallback(() => {
        setLoading(true);
        Promise.all([
            getProjectById(id),
            getTransactionsByProject(id),
            getTransfersByProject(id),
            getProjects(),
        ])
            .then(([pRes, tRes, trRes, apRes]) => {
                setProject(pRes.data?.data || pRes.data);
                setTransactions(tRes.data?.data || tRes.data || []);
                setTransfers(trRes.data?.data || trRes.data || []);
                setAllProjects(apRes.data?.data || apRes.data || []);
            })
            .catch(() => setError("Failed to load project details."))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => { loadAll(); }, [loadAll]);

    const handleDeleteProject = async () => {
        if (!window.confirm("Deactivate this project?")) return;
        try { await deleteProject(id); navigate(-1); } catch { alert("Failed."); }
    };

    const handleDeleteTxn = async (txnId) => {
        if (!window.confirm("Delete this transaction?")) return;
        try { await deleteTransaction(txnId); loadAll(); } catch { alert("Failed."); }
    };

    if (loading) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: "#64748b" }}>
            <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> Loading…
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );
    if (error) return <div style={{ padding: 30, color: "#ef4444" }}>{error}</div>;
    if (!project) return null;

    const bal = Number(project.currentBalance) || 0;
    const shortfall = bal < 0;

    // Build running balance for ledger (like Excel)
    let running = Number(project.openingBalance) || 0;
    const ledger = [];

    // Opening row
    ledger.push({ key: "open", date: null, particular: "Opening Balance", debit: null, credit: null, runningBalance: running, isOpening: true });

    // Merge transactions + transfers into chronological ledger
    const allEntries = [
        ...transactions.map(t => ({
            ...t,
            entryType: "transaction",
            sortDate: t.transactionDate || t.createdAt,
        })),
        ...transfers.map(t => ({
            ...t,
            entryType: "transfer",
            sortDate: t.transferDate || t.createdAt,
        })),
    ].sort((a, b) => new Date(a.sortDate) - new Date(b.sortDate));

    allEntries.forEach((entry, idx) => {
        if (entry.entryType === "transaction") {
            const isIncome = entry.type === "INCOME";
            if (isIncome) running += Number(entry.amount) || 0;
            else running -= Number(entry.amount) || 0;
            ledger.push({
                key: `txn-${entry.id}`,
                date: entry.transactionDate || entry.createdAt,
                particular: entry.description || entry.type,
                debit: isIncome ? null : entry.amount,
                credit: isIncome ? entry.amount : null,
                runningBalance: running,
                type: entry.type,
                isTransaction: true,
                id: entry.id,
                createdBy: entry.createdBy,
            });
        } else {
            // Transfer
            const isOut = String(entry.fromProjectId) === String(id);
            if (isOut) running -= Number(entry.amount) || 0;
            else running += Number(entry.amount) || 0;
            ledger.push({
                key: `tr-${entry.id}`,
                date: entry.transferDate || entry.createdAt,
                particular: isOut
                    ? `Transferred to ${entry.toProjectName}`
                    : `Received from ${entry.fromProjectName}`,
                debit: isOut ? entry.amount : null,
                credit: isOut ? null : entry.amount,
                runningBalance: running,
                isTransfer: true,
                note: entry.note,
                createdBy: entry.createdBy,
            });
        }
    });

    // Summary stats
    const totalCredit = ledger.filter(r => r.credit).reduce((s, r) => s + (Number(r.credit) || 0), 0);
    const totalDebit = ledger.filter(r => r.debit).reduce((s, r) => s + (Number(r.debit) || 0), 0);

    // Transfers summary
    const givenOut = transfers.filter(t => String(t.fromProjectId) === String(id));
    const receivedBack = transfers.filter(t => String(t.toProjectId) === String(id));
    const totalGivenOut = givenOut.reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const totalReceivedBack = receivedBack.reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const pendingRecovery = totalGivenOut - totalReceivedBack;

    return (
        <div style={{ padding: "24px 28px", background: "#f8fafc", minHeight: "100vh" }}>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

            {/* Top bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
                <div>
                    <button onClick={() => navigate(-1)} style={backBtn}><FaArrowLeft style={{ marginRight: 6 }} /> Back</button>
                    <h2 style={{ margin: "4px 0 2px", fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
                        📁 {project.name}
                    </h2>
                    <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
                        {project.clientName && <>Client: <b>{project.clientName}</b> &nbsp;•&nbsp;</>}
                        <span style={{ color: project.active ? "#10b981" : "#94a3b8", fontWeight: 700 }}>
                            {project.active ? "● Active" : "● Inactive"}
                        </span>
                    </p>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <button onClick={() => navigate("edit")} style={iconBtn("#f1f5f9", "#374151")}><FaEdit style={{ marginRight: 5 }} /> Edit</button>
                    <button onClick={handleDeleteProject} style={iconBtn("#fef2f2", "#ef4444")}><FaTrash style={{ marginRight: 5 }} /> Deactivate</button>
                </div>
            </div>

            {/* ── PROJECT SUMMARY ROW (like Excel header stats) ── */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
                {[
                    { label: "Client Received", value: fmt(project.totalValue), color: "#6366f1", bg: "#eef2ff" },
                    { label: "Opening Balance", value: fmt(project.openingBalance), color: "#3b82f6", bg: "#eff6ff" },
                    { label: "Total Credit", value: fmt(totalCredit), color: "#10b981", bg: "#ecfdf5" },
                    { label: "Total Debit", value: fmt(totalDebit), color: "#ef4444", bg: "#fef2f2" },
                    { label: "Current Balance", value: fmt(project.currentBalance), color: shortfall ? "#ef4444" : "#0f172a", bg: shortfall ? "#fef2f2" : "#f1f5f9" },
                ].map(({ label, value, color, bg }) => (
                    <div key={label} style={{ flex: 1, minWidth: 130, background: bg, borderRadius: 10, padding: "14px 18px" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>{label}</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color }}>{value}</div>
                    </div>
                ))}
            </div>

            {/* ── PENDING / RECOVERY SUMMARY (from Excel "Given Out / Received Back / Pending Recovery") ── */}
            {(totalGivenOut > 0 || totalReceivedBack > 0) && (
                <div style={{ background: "#fff7ed", border: "1.5px solid #fed7aa", borderRadius: 12, padding: "16px 20px", marginBottom: 22, display: "flex", gap: 24, flexWrap: "wrap" }}>
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.05em" }}>Given Out</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#ef4444" }}>{fmt(totalGivenOut)}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.05em" }}>Received Back</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#10b981" }}>{fmt(totalReceivedBack)}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.05em" }}>Pending Recovery</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: pendingRecovery > 0 ? "#f59e0b" : "#10b981" }}>{fmt(pendingRecovery)}</div>
                    </div>
                </div>
            )}

            {/* ── ACTION BUTTONS ── */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                <button onClick={() => setShowTxnModal(true)} style={actionBtn("#10b981")}>
                    <FaPlus style={{ marginRight: 6 }} /> Add Entry
                </button>
                <button onClick={() => setShowTransferModal(true)} style={actionBtn("#6366f1")}>
                    <FaExchangeAlt style={{ marginRight: 6 }} /> Inter-Project Transfer
                </button>
            </div>

            {/* ── PROJECT LEDGER TABLE (matches Excel: Date | Particular | Debit | Credit | Running Balance) ── */}
            <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", overflow: "hidden", marginBottom: 24 }}>
                <div style={{ padding: "14px 20px", background: "#1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 800, fontSize: 14, color: "#fff" }}>📒 Project Ledger — {project.name}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>{ledger.length - 1} entries</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f8fafc" }}>
                                <th style={LTH("left", 120)}>Date</th>
                                <th style={LTH("left")}>Particular</th>
                                <th style={LTH("right", 140)}>Debit (Out)</th>
                                <th style={LTH("right", 140)}>Credit (In)</th>
                                <th style={LTH("right", 160)}>Running Balance</th>
                                <th style={LTH("center", 60)}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {ledger.map((row, i) => {
                                const rbNum = Number(row.runningBalance) || 0;
                                const rbNeg = rbNum < 0;
                                return (
                                    <tr key={row.key} style={{
                                        background: row.isOpening ? "#eff6ff" : i % 2 === 0 ? "#fff" : "#fafafa",
                                        borderLeft: row.isTransfer ? "3px solid #6366f1" : row.isOpening ? "3px solid #3b82f6" : "3px solid transparent",
                                    }}>
                                        <td style={{ ...LTD, color: "#64748b", fontSize: 12 }}>
                                            {row.date ? fmtDate(row.date) : "—"}
                                        </td>
                                        <td style={{ ...LTD, fontWeight: row.isOpening ? 700 : 500 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                                {row.isTransfer && <FaExchangeAlt style={{ color: "#6366f1", fontSize: 11 }} />}
                                                {row.isOpening && <FaWallet style={{ color: "#3b82f6", fontSize: 11 }} />}
                                                {!row.isTransfer && !row.isOpening && (
                                                    row.type === "INCOME"
                                                        ? <FaArrowUp style={{ color: "#10b981", fontSize: 11 }} />
                                                        : <FaArrowDown style={{ color: "#ef4444", fontSize: 11 }} />
                                                )}
                                                <span>{row.particular}</span>
                                                {row.note && <span style={{ fontSize: 10, color: "#94a3b8" }}>({row.note})</span>}
                                                {row.createdBy && <span style={{ fontSize: 10, color: "#cbd5e1", marginLeft: "auto" }}>by {row.createdBy}</span>}
                                            </div>
                                        </td>
                                        <td style={{ ...LTD, textAlign: "right", color: "#ef4444", fontWeight: row.debit ? 700 : 400 }}>
                                            {row.debit ? fmt(row.debit) : <span style={{ color: "#e2e8f0" }}>—</span>}
                                        </td>
                                        <td style={{ ...LTD, textAlign: "right", color: "#10b981", fontWeight: row.credit ? 700 : 400 }}>
                                            {row.credit ? fmt(row.credit) : <span style={{ color: "#e2e8f0" }}>—</span>}
                                        </td>
                                        <td style={{ ...LTD, textAlign: "right", fontWeight: 800, color: rbNeg ? "#ef4444" : "#0f172a" }}>
                                            {fmt(row.runningBalance)}
                                            {rbNeg && <div style={{ fontSize: 9, color: "#ef4444" }}>↓ SHORTFALL</div>}
                                        </td>
                                        <td style={{ ...LTD, textAlign: "center" }}>
                                            {row.isTransaction && (
                                                <button onClick={() => handleDeleteTxn(row.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: 4 }}>
                                                    <FaTrash style={{ fontSize: 11 }} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        {/* Totals footer */}
                        <tfoot>
                            <tr style={{ background: "#f1f5f9", borderTop: "2px solid #e2e8f0" }}>
                                <td style={{ ...LTD, fontWeight: 800, color: "#374151" }} colSpan={2}>TOTALS</td>
                                <td style={{ ...LTD, textAlign: "right", fontWeight: 800, color: "#ef4444" }}>{fmt(totalDebit)}</td>
                                <td style={{ ...LTD, textAlign: "right", fontWeight: 800, color: "#10b981" }}>{fmt(totalCredit)}</td>
                                <td style={{ ...LTD, textAlign: "right", fontWeight: 800, color: shortfall ? "#ef4444" : "#0f172a" }}>{fmt(project.currentBalance)}</td>
                                <td style={LTD}></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {showTxnModal && (
                <TransactionModal
                    projectId={id}
                    onClose={() => setShowTxnModal(false)}
                    onSuccess={() => { setShowTxnModal(false); loadAll(); }}
                />
            )}
            {showTransferModal && (
                <TransferModal
                    currentProjectId={id}
                    allProjects={allProjects}
                    onClose={() => setShowTransferModal(false)}
                    onSuccess={() => { setShowTransferModal(false); loadAll(); }}
                />
            )}
        </div>
    );
}

// ─── Transaction Modal (Add Entry) ────────────────────────────────────────────
function TransactionModal({ projectId, onClose, onSuccess }) {
    const [form, setForm] = useState({ type: "INCOME", amount: "", transactionDate: "", description: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createTransaction({
                projectId: Number(projectId),
                type: form.type,
                amount: Number(form.amount),
                transactionDate: form.transactionDate || null,
                description: form.description,
            });
            onSuccess();
        } catch { setError("Failed to save."); }
        finally { setLoading(false); }
    };

    return (
        <Modal title="📝 Add Ledger Entry" onClose={onClose}>
            {error && <div style={errStyle}>{error}</div>}
            <form onSubmit={handleSubmit}>
                {/* Type toggle */}
                <div style={{ display: "flex", gap: 0, marginBottom: 18, borderRadius: 8, overflow: "hidden", border: "1.5px solid #e2e8f0" }}>
                    {["INCOME", "EXPENSE"].map(t => (
                        <button key={t} type="button" onClick={() => setForm({ ...form, type: t })} style={{
                            flex: 1, padding: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13,
                            background: form.type === t ? (t === "INCOME" ? "#10b981" : "#ef4444") : "#fff",
                            color: form.type === t ? "#fff" : "#64748b",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        }}>
                            {t === "INCOME" ? <FaArrowUp /> : <FaArrowDown />} {t}
                        </button>
                    ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                        <label style={lbl}>Date</label>
                        <input type="date" value={form.transactionDate} onChange={e => setForm({ ...form, transactionDate: e.target.value })} style={inp} />
                    </div>
                    <div>
                        <label style={lbl}>Amount (₹) *</label>
                        <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={inp} required min="0.01" step="0.01" placeholder="e.g. 50,000" />
                    </div>
                    <div style={{ gridColumn: "1/-1" }}>
                        <label style={lbl}>Particular / Description</label>
                        <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={inp} placeholder={form.type === "INCOME" ? "e.g. Client payment received" : "e.g. Given to Adani"} />
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
                    <button type="button" onClick={onClose} style={cancelBtn}>Cancel</button>
                    <button type="submit" disabled={loading} style={submitBtn(form.type === "INCOME" ? "#10b981" : "#ef4444")}>
                        {loading ? "Saving…" : `Add ${form.type === "INCOME" ? "Credit" : "Debit"} Entry`}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

// ─── Transfer Modal ───────────────────────────────────────────────────────────
function TransferModal({ currentProjectId, allProjects, onClose, onSuccess }) {
    const [form, setForm] = useState({ fromProjectId: currentProjectId, toProjectId: "", amount: "", transferDate: "", note: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (String(form.fromProjectId) === String(form.toProjectId)) { setError("From and To cannot be the same."); return; }
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

    const opts = allProjects.filter(p => p.active);

    return (
        <Modal title="🔄 Inter-Project Transfer" onClose={onClose}>
            {error && <div style={errStyle}>{error}</div>}
            <p style={{ margin: "0 0 16px", fontSize: 12, color: "#64748b" }}>Move funds between projects (reflects as Debit in From, Credit in To)</p>
            <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                        <label style={lbl}>From Project *</label>
                        <select value={form.fromProjectId} onChange={e => setForm({ ...form, fromProjectId: e.target.value })} style={inp} required>
                            {opts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={lbl}>To Project *</label>
                        <select value={form.toProjectId} onChange={e => setForm({ ...form, toProjectId: e.target.value })} style={inp} required>
                            <option value="">Select…</option>
                            {opts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={lbl}>Date</label>
                        <input type="date" value={form.transferDate} onChange={e => setForm({ ...form, transferDate: e.target.value })} style={inp} />
                    </div>
                    <div>
                        <label style={lbl}>Amount (₹) *</label>
                        <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={inp} required min="0.01" step="0.01" placeholder="e.g. 1,00,000" />
                    </div>
                    <div style={{ gridColumn: "1/-1" }}>
                        <label style={lbl}>Note / Particular</label>
                        <input type="text" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} style={inp} placeholder="e.g. Temporary funds from Godrej" />
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
                    <button type="button" onClick={onClose} style={cancelBtn}>Cancel</button>
                    <button type="submit" disabled={loading} style={submitBtn("#6366f1")}>
                        {loading ? "Saving…" : "Create Transfer"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

// ─── Generic Modal ────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "28px 32px", width: "100%", maxWidth: 560, boxShadow: "0 24px 60px rgba(0,0,0,0.22)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#1e293b" }}>{title}</h3>
                    <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8" }}>✕</button>
                </div>
                {children}
            </div>
        </div>
    );
}

// Missing FaWallet import fix
function FaWallet({ style }) { return <span style={style}>💰</span>; }

// ─── Styles ───────────────────────────────────────────────────────────────────
const LTH = (align = "left", minW) => ({
    padding: "10px 14px", textAlign: align, fontSize: 11, fontWeight: 700, color: "#64748b",
    textTransform: "uppercase", letterSpacing: "0.04em", background: "#f8fafc",
    borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap",
    ...(minW ? { minWidth: minW } : {}),
});
const LTD = { padding: "10px 14px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" };
const backBtn = { display: "inline-flex", alignItems: "center", marginBottom: 8, background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 13, fontWeight: 700, padding: 0 };
const iconBtn = (bg, color) => ({ padding: "8px 16px", background: bg, border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", color });
const actionBtn = (bg) => ({ padding: "9px 18px", background: bg, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13, display: "inline-flex", alignItems: "center" });
const lbl = { display: "block", fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" };
const inp = { width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, color: "#1e293b", outline: "none", boxSizing: "border-box", background: "#fff" };
const cancelBtn = { padding: "9px 20px", border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#fff", color: "#374151", fontWeight: 700, cursor: "pointer", fontSize: 13 };
const submitBtn = (bg) => ({ padding: "9px 22px", border: "none", borderRadius: 8, background: bg, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 });
const errStyle = { background: "#fef2f2", color: "#ef4444", padding: "10px 14px", borderRadius: 8, marginBottom: 14, fontSize: 13 };
