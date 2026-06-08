import React, { useEffect, useState } from "react";
import { getAllProjects, getAllTransfers, getAllReassignments } from "../Services/cashTrackerService";
import AddTransferModal from "../Components/AddTransferModal";

function fmt(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

const s = {
  screen:   { padding: "20px 24px", fontFamily: "sans-serif" },
  header:   { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  title:    { fontSize: 17, fontWeight: 500, color: "#1a1a18" },
  sub:      { fontSize: 12, color: "#737370", marginTop: 3 },
  btn:      { display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 6, fontSize: 12.5, border: "0.5px solid #d0d0cc", background: "#fff", color: "#1a1a18", cursor: "pointer" },
  btnBlue:  { background: "#185FA5", color: "#fff", borderColor: "#185FA5", fontWeight: 500 },
  alert:    { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 6, marginBottom: 14, fontSize: 12.5, background: "#FAEEDA", border: "0.5px solid #FAC775", color: "#633806" },
  cHead:    { padding: "12px 16px", borderBottom: "0.5px solid #e5e5e0", fontSize: 13, fontWeight: 500, color: "#1a1a18" },
  th:       { fontSize: 11, color: "#737370", fontWeight: 500, padding: "8px 16px", textAlign: "left", borderBottom: "0.5px solid #e5e5e0", background: "#f5f5f3" },
  td:       { padding: "10px 16px", borderBottom: "0.5px solid #e5e5e0", fontSize: 12.5 },
  spin:     { textAlign: "center", padding: 40, color: "#737370", fontSize: 13 },
  empty:    { textAlign: "center", padding: 30, color: "#a0a09d", fontSize: 13 },
  // tabs
  tabBar:   { display: "flex", gap: 4, marginBottom: 0 },
  tab:      (active) => ({
    padding: "7px 16px", borderRadius: "6px 6px 0 0", fontSize: 12.5, cursor: "pointer",
    border: "0.5px solid #d0d0cc", borderBottom: active ? "none" : "0.5px solid #d0d0cc",
    background: active ? "#fff" : "#f5f5f3",
    color: active ? "#185FA5" : "#737370",
    fontWeight: active ? 600 : 400,
    marginBottom: active ? "-1px" : 0,
    position: "relative", zIndex: active ? 1 : 0,
  }),
  tabWrap:  { border: "0.5px solid #e5e5e0", borderRadius: "0 8px 8px 8px", background: "#fff" },
  // reassign rows
  rRow:     { padding: "11px 16px", borderBottom: "0.5px solid #f0f0ed", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 12 },
  rAmt:     { fontFamily: "monospace", fontWeight: 600, color: "#854F0B", background: "#FAEEDA", border: "0.5px solid #FAC775", borderRadius: 4, padding: "2px 7px" },
  rFrom:    { fontWeight: 500, color: "#A32D2D" },
  rTo:      { fontWeight: 500, color: "#3B6D11" },
  rSub:     { color: "#737370", fontStyle: "italic" },
  rNote:    { color: "#9c9a92" },
  rDate:    { color: "#a0a09d", fontSize: 11, marginLeft: "auto" },
  rArrow:   { color: "#c0c0bd" },
  rRef:     { fontSize: 10.5, fontFamily: "monospace", color: "#a0a09d" },
};

export default function Transfers() {
  const [projects,      setProjects]      = useState([]);
  const [transfers,     setTransfers]     = useState([]);
  const [reassignments, setReassignments] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [showModal,     setShowModal]     = useState(false);
  const [activeTab,     setActiveTab]     = useState("transfers");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const [p, t, r] = await Promise.all([
        getAllProjects(),
        getAllTransfers(),
        getAllReassignments(),
      ]);
      setProjects(p);
      setTransfers(t);
      setReassignments(r);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const allReassignments  = reassignments;
  const transferCount     = transfers.length;
  const reassignmentCount = reassignments.length;

  return (
    <div style={s.screen}>
      {showModal && (
        <AddTransferModal
          projects={projects}
          onClose={() => setShowModal(false)}
          onCreated={(t) => setTransfers(prev => [t, ...prev])}
        />
      )}

      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={s.title}>Fund Movements</div>
          <div style={s.sub}>Inter-project transfers & debt reassignments</div>
        </div>
        {activeTab === "transfers" && (
          <button style={{ ...s.btn, ...s.btnBlue }} onClick={() => setShowModal(true)}>
            + New transfer
          </button>
        )}
      </div>

      {activeTab === "transfers" && (
        <div style={s.alert}>
          ℹ️ &nbsp;
          <span>Transfers reduce the sender's balance immediately. Repayment must be recorded as a reverse transfer.</span>
        </div>
      )}

      {loading ? (
        <div style={s.spin}>Loading...</div>
      ) : error ? (
        <div style={{ ...s.spin, color: "#A32D2D" }}>
          ⚠ {error} <button style={s.btn} onClick={load}>Retry</button>
        </div>
      ) : (
        <>
          {/* Tab bar */}
          <div style={s.tabBar}>
            <button style={s.tab(activeTab === "transfers")} onClick={() => setActiveTab("transfers")}>
              ⇄ Transfers {transferCount > 0 && `(${transferCount})`}
            </button>
            <button style={s.tab(activeTab === "reassignments")} onClick={() => setActiveTab("reassignments")}>
              🔄 Reassignments {reassignmentCount > 0 && `(${reassignmentCount})`}
            </button>
          </div>

          <div style={s.tabWrap}>

            {/* ── TAB 1: Transfers ── */}
            {activeTab === "transfers" && (
              <>
                <div style={s.cHead}>⇄ Transfer history</div>
                {transferCount === 0 ? (
                  <div style={s.empty}>
                    No transfers yet.{" "}
                    <button style={{ ...s.btn, ...s.btnBlue, marginLeft: 8 }} onClick={() => setShowModal(true)}>
                      + Add one
                    </button>
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {["Date", "From project", "", "To project", "Amount", "Note", "By"].map((h, i) => (
                          <th key={i} style={s.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {transfers.map(t => (
                        <tr key={t.id}>
                          <td style={{ ...s.td, color: "#737370" }}>{t.transferDate}</td>
                          <td style={s.td}>
                            <span style={{ display: "inline-flex", fontSize: 10.5, padding: "2px 7px", borderRadius: 10, fontWeight: 500, background: "#E6F1FB", color: "#185FA5" }}>
                              {t.fromProjectName}
                            </span>
                          </td>
                          <td style={{ ...s.td, color: "#185FA5", fontSize: 14 }}>→</td>
                          <td style={s.td}>
                            <span style={{ display: "inline-flex", fontSize: 10.5, padding: "2px 7px", borderRadius: 10, fontWeight: 500, background: "#E6F1FB", color: "#185FA5" }}>
                              {t.toProjectName}
                            </span>
                          </td>
                          <td style={{ ...s.td, fontWeight: 500, color: "#185FA5" }}>{fmt(t.amount)}</td>
                          <td style={{ ...s.td, color: "#737370" }}>{t.note || "—"}</td>
                          <td style={{ ...s.td, color: "#737370" }}>{t.createdBy || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}

            {/* ── TAB 2: Reassignments ── */}
            {activeTab === "reassignments" && (
              <>
                <div style={s.cHead}>🔄 Debt reassignment history</div>
                {reassignmentCount === 0 ? (
                  <div style={s.empty}>No reassignments recorded yet.</div>
                ) : (
                  allReassignments.map((r, i) => (
                    <div key={r.id || i} style={s.rRow}>

                      {/* Amount */}
                      <span style={s.rAmt}>{fmt(r.amount)}</span>

                      {/* Sub-project name */}
                      <span style={s.rSub}>{r.subProjectName}</span>

                      {/* Ref no */}
                      {r.subProjectRefNo && (
                        <span style={s.rRef}>({r.subProjectRefNo})</span>
                      )}

                      {/* From → To */}
                      <span style={s.rArrow}>·</span>
                      <span style={s.rFrom}>{r.fromFunderName}</span>
                      <span style={s.rArrow}>→</span>
                      <span style={s.rTo}>{r.toFunderName}</span>

                      {/* Note */}
                      {r.note && (
                        <>
                          <span style={s.rArrow}>·</span>
                          <span style={s.rNote}>"{r.note}"</span>
                        </>
                      )}

                      {/* Date */}
                      {r.createdAt && (
                        <span style={s.rDate}>
                          {new Date(r.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric"
                          })}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </>
            )}

          </div>
        </>
      )}
    </div>
  );
}