import React, { useEffect, useState } from "react";
import { getAllProjects, getAllTransactions, deleteTransaction } from "../Services/cashTrackerService";
import AddTransactionModal from "../Components/AddTransactionModal";

const badgeStyle = {
  INCOME:  { background: "#EAF3DE", color: "#3B6D11" },
  EXPENSE: { background: "#FCEBEB", color: "#A32D2D" },
};

function fmt(n, type) {
  const abs = Math.abs(n);
  const str = "₹" + abs.toLocaleString("en-IN");
  return type === "INCOME" ? "+" + str : "−" + str;
}

const s = {
  screen:  { padding: "20px 24px", fontFamily: "sans-serif" },
  header:  { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  title:   { fontSize: 17, fontWeight: 500, color: "#1a1a18" },
  sub:     { fontSize: 12, color: "#737370", marginTop: 3 },
  btn:     { display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 6, fontSize: 12.5, border: "0.5px solid #d0d0cc", background: "#fff", color: "#1a1a18", cursor: "pointer" },
  btnBlue: { background: "#185FA5", color: "#fff", borderColor: "#185FA5", fontWeight: 500 },
  card:    { background: "#fff", border: "0.5px solid #e5e5e0", borderRadius: 10 },
  filter:  { display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderBottom: "0.5px solid #e5e5e0" },
  input:   { flex: 1, padding: "6px 10px", border: "0.5px solid #d0d0cc", borderRadius: 6, fontSize: 12.5, background: "#fff", color: "#1a1a18", outline: "none" },
  sel:     { padding: "6px 8px", border: "0.5px solid #d0d0cc", borderRadius: 6, fontSize: 12, background: "#fff", color: "#1a1a18", outline: "none" },
  th:      { fontSize: 11, color: "#737370", fontWeight: 500, padding: "8px 16px", textAlign: "left", borderBottom: "0.5px solid #e5e5e0", background: "#f5f5f3" },
  td:      { padding: "10px 16px", borderBottom: "0.5px solid #e5e5e0" },
  spin:    { textAlign: "center", padding: 40, color: "#737370", fontSize: 13 },
  empty:   { textAlign: "center", padding: 30, color: "#a0a09d", fontSize: 13 },
  delBtn:  { background: "none", border: "none", color: "#a0a09d", cursor: "pointer", fontSize: 16 },
};

export default function Transactions() {
  const [projects, setProjects]     = useState([]);
  const [transactions, setTxs]      = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [filterPid, setFilterPid]   = useState("");
  const [filterType, setFilterType] = useState("");
  const [showModal, setShowModal]   = useState(false);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const [p, t] = await Promise.all([getAllProjects(), getAllTransactions()]);
      setProjects(p); setTxs(t);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try { await deleteTransaction(id); setTxs((prev) => prev.filter((t) => t.id !== id)); }
    catch (e) { alert("Error: " + e.message); }
  };

  const filtered = transactions.filter((t) => {
    const matchSearch = !search || t.description?.toLowerCase().includes(search.toLowerCase());
    const matchPrj    = !filterPid  || String(t.projectId) === filterPid;
    const matchType   = !filterType || t.type === filterType;
    return matchSearch && matchPrj && matchType;
  });

  return (
    <div style={s.screen}>
      {showModal && (
        <AddTransactionModal
          projects={projects}
          onClose={() => setShowModal(false)}
          onCreated={(tx) => { setTxs((prev) => [tx, ...prev]); }}
        />
      )}

      <div style={s.header}>
        <div>
          <div style={s.title}>Transactions</div>
          <div style={s.sub}>All income and expense entries</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={s.btn} onClick={() => {
            const csv = ["Date,Project,Type,Description,Amount,By",
              ...filtered.map((t) => `${t.transactionDate},${t.projectName},${t.type},"${t.description}",${t.amount},${t.createdBy}`)
            ].join("\n");
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
            a.download = "transactions.csv"; a.click();
          }}>⬇ Export CSV</button>
          <button style={{ ...s.btn, ...s.btnBlue }} onClick={() => setShowModal(true)}>+ Add transaction</button>
        </div>
      </div>

      {loading ? <div style={s.spin}>Loading...</div> : error ? <div style={{ ...s.spin, color: "#A32D2D" }}>⚠ {error} <button style={s.btn} onClick={load}>Retry</button></div> : (
        <div style={s.card}>
          <div style={s.filter}>
            <input style={s.input} placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select style={s.sel} value={filterPid} onChange={(e) => setFilterPid(e.target.value)}>
              <option value="">All projects</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select style={s.sel} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">All types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>
          {filtered.length === 0
            ? <div style={s.empty}>No transactions found.</div>
            : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>{["Date","Project","Type","Description","Amount","Added by",""].map((h, i) => <th key={i} style={s.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id}>
                      <td style={{ ...s.td, fontSize: 12, color: "#737370" }}>{t.transactionDate}</td>
                      <td style={s.td}><span style={{ display: "inline-flex", fontSize: 10.5, padding: "2px 7px", borderRadius: 10, fontWeight: 500, background: "#E6F1FB", color: "#185FA5" }}>{t.projectName}</span></td>
                      <td style={s.td}><span style={{ display: "inline-flex", fontSize: 11, padding: "2px 7px", borderRadius: 10, fontWeight: 500, ...badgeStyle[t.type] }}>{t.type === "INCOME" ? "↓" : "↑"} {t.type}</span></td>
                      <td style={{ ...s.td, fontSize: 12.5, color: "#1a1a18" }}>{t.description || "—"}</td>
                      <td style={{ ...s.td, fontSize: 12.5, fontWeight: 500, color: t.type === "INCOME" ? "#3B6D11" : "#A32D2D" }}>{fmt(t.amount, t.type)}</td>
                      <td style={{ ...s.td, fontSize: 12, color: "#737370" }}>{t.createdBy || "—"}</td>
                      <td style={s.td}><button style={s.delBtn} title="Delete" onClick={() => handleDelete(t.id)}>🗑</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      )}
    </div>
  );
}
