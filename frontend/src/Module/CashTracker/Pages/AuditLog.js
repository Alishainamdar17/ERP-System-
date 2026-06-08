import React, { useEffect, useState } from "react";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

const dotColor = { CREATE: "#639922", UPDATE: "#BA7517", DELETE: "#E24B4A" };

const s = {
  screen:  { padding: "20px 24px", fontFamily: "sans-serif" },
  header:  { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  title:   { fontSize: 17, fontWeight: 500, color: "#1a1a18" },
  sub:     { fontSize: 12, color: "#737370", marginTop: 3 },
  btn:     { display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 6, fontSize: 12.5, border: "0.5px solid #d0d0cc", background: "#fff", color: "#1a1a18", cursor: "pointer" },
  card:    { background: "#fff", border: "0.5px solid #e5e5e0", borderRadius: 10 },
  filter:  { display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderBottom: "0.5px solid #e5e5e0" },
  input:   { flex: 1, padding: "6px 10px", border: "0.5px solid #d0d0cc", borderRadius: 6, fontSize: 12.5, background: "#fff", color: "#1a1a18", outline: "none" },
  sel:     { padding: "6px 8px", border: "0.5px solid #d0d0cc", borderRadius: 6, fontSize: 12, background: "#fff", color: "#1a1a18", outline: "none" },
  spin:    { textAlign: "center", padding: 40, color: "#737370", fontSize: 13 },
  empty:   { textAlign: "center", padding: 30, color: "#a0a09d", fontSize: 13 },
};

export default function AuditLog() {
  const [logs, setLogs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");
  const [search, setSearch] = useState("");
  const [filterEntity, setFilterEntity] = useState("");
  const [filterAction, setFilterAction] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${BASE}/api/cash/audit`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setLogs(json.data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = logs.filter((l) => {
    const matchSearch = !search || JSON.stringify(l).toLowerCase().includes(search.toLowerCase());
    const matchEntity = !filterEntity || l.entityType === filterEntity;
    const matchAction = !filterAction || l.action === filterAction;
    return matchSearch && matchEntity && matchAction;
  });

  const entities = [...new Set(logs.map((l) => l.entityType))];
  const actions  = [...new Set(logs.map((l) => l.action))];

  return (
    <div style={s.screen}>
      <div style={s.header}>
        <div>
          <div style={s.title}>Audit log</div>
          <div style={s.sub}>Complete history of all financial events</div>
        </div>
        <button style={s.btn} onClick={() => {
          const csv = ["Time,Entity,EntityId,Action,By,Old,New",
            ...filtered.map((l) => `${l.performedAt},${l.entityType},${l.entityId},${l.action},${l.performedBy},"${l.oldValue || ""}","${l.newValue || ""}"`)
          ].join("\n");
          const a = document.createElement("a");
          a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
          a.download = "audit_log.csv"; a.click();
        }}>⬇ Export log</button>
      </div>

      {loading ? <div style={s.spin}>Loading audit log...</div> : error ? <div style={{ ...s.spin, color: "#A32D2D" }}>⚠ {error} <button style={s.btn} onClick={load}>Retry</button></div> : (
        <div style={s.card}>
          <div style={s.filter}>
            <input style={s.input} placeholder="Search audit log..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select style={s.sel} value={filterEntity} onChange={(e) => setFilterEntity(e.target.value)}>
              <option value="">All entities</option>
              {entities.map((e) => <option key={e}>{e}</option>)}
            </select>
            <select style={s.sel} value={filterAction} onChange={(e) => setFilterAction(e.target.value)}>
              <option value="">All actions</option>
              {actions.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>

          {filtered.length === 0
            ? <div style={s.empty}>No audit entries found.</div>
            : filtered.map((log, i) => (
              <div key={log.id || i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 16px", borderBottom: i < filtered.length - 1 ? "0.5px solid #e5e5e0" : "none" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor[log.action] || "#aaa", marginTop: 4, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, color: "#1a1a18" }}>
                    <strong>{log.action}</strong> — {log.entityType} #{log.entityId}
                    {log.newValue && <span style={{ color: "#737370", fontWeight: 400 }}> → {log.newValue}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "#737370", marginTop: 2 }}>By {log.performedBy || "—"}</div>
                </div>
                <div style={{ fontSize: 11, color: "#a0a09d", whiteSpace: "nowrap" }}>
                  {log.performedAt ? new Date(log.performedAt).toLocaleString("en-IN") : "—"}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
