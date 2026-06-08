// import React, { useEffect, useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAllProjects } from "../Services/cashTrackerService";

// const fmt = (n) => {
//   if (n == null) return "₹0";
//   const abs = Math.abs(Number(n));
//   const str = "₹" + abs.toLocaleString("en-IN", { maximumFractionDigits: 0 });
//   return Number(n) < 0 ? "−" + str : str;
// };

// const PROJECT_COLORS = ["#185FA5","#3B6D11","#854F0B","#A32D2D","#1D9E75","#9F4F00","#5C1EA0","#005F73"];

// const s = {
//   screen:   { padding: "20px 24px", fontFamily: "sans-serif" },
//   header:   { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 10 },
//   title:    { fontSize: 17, fontWeight: 500, color: "#1a1a18" },
//   sub:      { fontSize: 12, color: "#737370", marginTop: 3 },
//   btn:      { display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 6, fontSize: 12.5, border: "0.5px solid #d0d0cc", background: "#fff", color: "#1a1a18", cursor: "pointer" },
//   btnBlue:  { background: "#185FA5", color: "#fff", borderColor: "#185FA5", fontWeight: 500 },
//   card:     { background: "#fff", border: "0.5px solid #e5e5e0", borderRadius: 10, marginBottom: 16 },
//   cHead:    { padding: "12px 16px", borderBottom: "0.5px solid #e5e5e0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 },
//   cTitle:   { fontSize: 13, fontWeight: 500, color: "#1a1a18" },
//   metrics:  { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 },
//   metric:   { background: "#f0f0ed", borderRadius: 6, padding: "12px 14px", flex: "1 1 130px", minWidth: 120 },
//   mLbl:     { fontSize: 11, color: "#737370", marginBottom: 5 },
//   mVal:     (c) => ({ fontSize: 20, fontWeight: 500, color: c || "#1a1a18" }),
//   th:       { padding: "8px 12px", textAlign: "left", fontSize: 10, fontWeight: 500, color: "#737370", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "0.5px solid #e5e5e0", background: "#fafaf8", whiteSpace: "nowrap" },
//   thR:      { textAlign: "right" },
//   td:       { padding: "10px 12px", borderBottom: "0.5px solid #f0f0ed", verticalAlign: "top", fontSize: 13, color: "#1a1a18" },
//   tdR:      { textAlign: "right", fontVariantNumeric: "tabular-nums" },
//   tdMono:   { fontFamily: "monospace", fontSize: 12 },
//   trFoot:   { background: "#f5f5f3", fontWeight: 500 },
//   spin:     { textAlign: "center", padding: 40, color: "#737370", fontSize: 13 },
//   usingTag: { display: "inline-flex", alignItems: "center", gap: 3, background: "#f0f0ed", border: "0.5px solid #e0e0db", borderRadius: 4, padding: "2px 7px", fontSize: 11, color: "#4a4a47", marginBottom: 3, marginRight: 3 },
//   pendingPill: { background: "#FAEEDA", color: "#854F0B", border: "0.5px solid #FAC775", borderRadius: 4, padding: "2px 7px", fontSize: 12, fontFamily: "monospace" },
//   inp:  { border: "0.5px solid #d0d0cc", borderRadius: 6, padding: "6px 10px", fontSize: 12.5, color: "#1a1a18", background: "#fafaf8", outline: "none" },
//   filterBar: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", padding: "10px 16px", borderBottom: "0.5px solid #e5e5e0" },
// };

// export default function MasterSummary() {
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [expandedRows, setExpandedRows] = useState({});
//   const [expandAll, setExpandAll] = useState(false);

//   const load = async () => {
//     setLoading(true); setError("");
//     try { setProjects(await getAllProjects()); }
//     catch (e) { setError(e.message || "Failed to load."); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { load(); }, []);

//   const toggleRow = (id) => setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
//   const handleExpandAll = () => {
//     const next = !expandAll;
//     setExpandAll(next);
//     const map = {};
//     projects.forEach((p) => { if ((p.usingProjects || []).length > 0) map[p.id] = next; });
//     setExpandedRows(map);
//   };

//   const filtered = useMemo(() => {
//     return projects.filter((p) => {
//       const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
//         (p.clientName || "").toLowerCase().includes(search.toLowerCase());
//       const pen = Number(p.totalPending || 0);
//       if (filterStatus === "pending") return matchSearch && pen > 0;
//       if (filterStatus === "settled") return matchSearch && pen <= 0;
//       return matchSearch;
//     });
//   }, [projects, search, filterStatus]);

//   const grand = useMemo(() => ({
//     value:    filtered.reduce((s, p) => s + Number(p.totalValue || 0), 0),
//     given:    filtered.reduce((s, p) => s + Number(p.totalGivenOut || 0), 0),
//     returned: filtered.reduce((s, p) => s + Number(p.totalReturned || 0), 0),
//     pending:  filtered.reduce((s, p) => s + Number(p.totalPending || 0), 0),
//     using:    filtered.reduce((s, p) => s + (p.usingProjects || []).length, 0),
//   }), [filtered]);

//   if (loading) return <div style={s.spin}>Loading master summary...</div>;
//   if (error)   return <div style={{ ...s.spin, color: "#A32D2D" }}>⚠ {error} <button style={s.btn} onClick={load}>Retry</button></div>;

//   return (
//     <div style={s.screen}>
//       <div style={s.header}>
//         <div>
//           <div style={s.title}>Master summary</div>
//           <div style={s.sub}>All funding projects → using projects — pending recovery overview</div>
//         </div>
//         <button style={s.btn} onClick={load}>↺ Refresh</button>
//       </div>

//       {/* Metric cards */}
//       <div style={s.metrics}>
//         <div style={s.metric}>
//           <div style={s.mLbl}>Funding projects</div>
//           <div style={s.mVal()}>{filtered.length}</div>
//         </div>
//         <div style={s.metric}>
//           <div style={s.mLbl}>Using projects</div>
//           <div style={s.mVal()}>{grand.using}</div>
//         </div>
//         <div style={s.metric}>
//           <div style={s.mLbl}>Total project value</div>
//           <div style={s.mVal("#185FA5")}>{fmt(grand.value)}</div>
//         </div>
//         <div style={s.metric}>
//           <div style={s.mLbl}>Total deployed</div>
//           <div style={s.mVal("#854F0B")}>{fmt(grand.given)}</div>
//         </div>
//         <div style={s.metric}>
//           <div style={s.mLbl}>Total recovered</div>
//           <div style={s.mVal("#3B6D11")}>{fmt(grand.returned)}</div>
//         </div>
//         <div style={s.metric}>
//           <div style={s.mLbl}>Total outstanding</div>
//           <div style={s.mVal(grand.pending > 0 ? "#A32D2D" : "#3B6D11")}>{fmt(grand.pending)}</div>
//         </div>
//       </div>

//       {/* Table */}
//       <div style={s.card}>
//         <div style={s.filterBar}>
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search projects..."
//             style={{ ...s.inp, flex: "1 1 180px", minWidth: 160 }}
//           />
//           <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ border: "0.5px solid #d0d0cc", borderRadius: 6, padding: "6px 10px", fontSize: 12.5, color: "#1a1a18", background: "#fff", outline: "none" }}>
//             <option value="all">All projects</option>
//             <option value="pending">Has pending</option>
//             <option value="settled">Fully settled</option>
//           </select>
//           <button style={{ ...s.btn, fontSize: 11 }} onClick={handleExpandAll}>
//             {expandAll ? "▲ Collapse all" : "▼ Expand all"}
//           </button>
//           <span style={{ fontSize: 11, color: "#a0a09d", marginLeft: "auto" }}>{filtered.length} projects</span>
//         </div>

//         <div style={{ overflowX: "auto" }}>
//           <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
//             <thead>
//               <tr>
//                 <th style={{ ...s.th, width: 32 }}>#</th>
//                 <th style={s.th}>Funding project</th>
//                 <th style={{ ...s.th, ...s.thR }}>Amount (₹)</th>
//                 <th style={s.th}>Using projects</th>
//                 <th style={{ ...s.th, ...s.thR }}>Given out (₹)</th>
//                 <th style={{ ...s.th, ...s.thR }}>Returned (₹)</th>
//                 <th style={{ ...s.th, ...s.thR }}>Pending (₹)</th>
//                 <th style={s.th}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={8} style={{ ...s.td, textAlign: "center", color: "#a0a09d", padding: 30 }}>
//                     No projects match your filter.
//                   </td>
//                 </tr>
//               ) : filtered.map((p, pi) => {
//                 const color = PROJECT_COLORS[pi % PROJECT_COLORS.length];
//                 const usingList = p.usingProjects || [];
//                 const isExpanded = expandedRows[p.id];
//                 const pen = Number(p.totalPending || 0);

//                 return (
//                   <React.Fragment key={p.id}>
//                     {/* Main row */}
//                     <tr
//                       style={{ cursor: usingList.length > 0 ? "pointer" : "default", background: pi % 2 === 0 ? "#fff" : "#fafaf8" }}
//                       onClick={() => usingList.length > 0 && toggleRow(p.id)}
//                     >
//                       <td style={s.td}>
//                         <span style={{ width: 22, height: 22, borderRadius: "50%", background: color, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600 }}>
//                           {pi + 1}
//                         </span>
//                       </td>
//                       <td style={s.td}>
//                         <div style={{ fontWeight: 500, color: "#1a1a18" }}>{p.name}</div>
//                         {p.clientName && <div style={{ fontSize: 11, color: "#737370", marginTop: 2 }}>{p.clientName}</div>}
//                       </td>
//                       <td style={{ ...s.td, ...s.tdR, ...s.tdMono, color: "#3B6D11", fontWeight: 500 }}>{fmt(p.totalValue)}</td>
//                       <td style={s.td}>
//                         {usingList.length === 0 ? (
//                           <span style={{ color: "#a0a09d", fontSize: 11 }}>—</span>
//                         ) : (
//                           <div>
//                             <div style={{ display: "flex", flexWrap: "wrap" }}>
//                               {usingList.slice(0, 2).map((u) => (
//                                 <span key={u.id} style={s.usingTag}>
//                                   <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0 }}></span>
//                                   {u.name.length > 24 ? u.name.slice(0, 24) + "…" : u.name}
//                                 </span>
//                               ))}
//                             </div>
//                             <span style={{ fontSize: 11, color: "#185FA5" }}>
//                               {isExpanded ? "▲ Hide" : `▼ ${usingList.length} sub-projects`}
//                             </span>
//                           </div>
//                         )}
//                       </td>
//                       <td style={{ ...s.td, ...s.tdR, ...s.tdMono, color: "#854F0B" }}>
//                         {Number(p.totalGivenOut) > 0 ? fmt(p.totalGivenOut) : <span style={{ color: "#c0c0bd" }}>—</span>}
//                       </td>
//                       <td style={{ ...s.td, ...s.tdR, ...s.tdMono, color: "#3B6D11" }}>
//                         {Number(p.totalReturned) > 0 ? fmt(p.totalReturned) : <span style={{ color: "#c0c0bd" }}>—</span>}
//                       </td>
//                       <td style={{ ...s.td, ...s.tdR }}>
//                         {pen > 0
//                           ? <span style={s.pendingPill}>{fmt(pen)}</span>
//                           : <span style={{ color: "#c0c0bd" }}>—</span>}
//                       </td>
//                       <td style={s.td}>
//                         <button
//                           onClick={(e) => { e.stopPropagation(); navigate(`/cash-tracker/projects/${p.id}`); }}
//                           style={{ ...s.btn, fontSize: 11, padding: "3px 8px" }}
//                         >
//                           ↗ Ledger
//                         </button>
//                       </td>
//                     </tr>

//                     {/* Expanded using-project sub-rows */}
//                     {isExpanded && usingList.map((u, ui) => {
//                       const uPen = Math.max(0, (Number(u.amountGiven) || 0) - (Number(u.amountReturned) || 0));
//                       const isLast = ui === usingList.length - 1;
//                       const subBorder = isLast ? "1px solid #e5e5e0" : "0.5px solid #f0f0ed";
//                       return (
//                         <tr key={u.id} style={{ background: "#f8f8f6" }}>
//                           <td style={{ ...s.td, borderBottom: subBorder }}></td>
//                           <td style={{ ...s.td, paddingLeft: 28, borderBottom: subBorder }}>
//                             <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                               <span style={{ width: 3, height: 14, background: color, borderRadius: 2, flexShrink: 0 }}></span>
//                               <div>
//                                 <div style={{ fontSize: 12, color: "#2a2a28" }}>{u.name}</div>
//                                 {u.refNo && <div style={{ fontSize: 10, color: "#a0a09d", fontFamily: "monospace" }}>{u.refNo}</div>}
//                               </div>
//                             </div>
//                           </td>
//                           <td style={{ ...s.td, borderBottom: subBorder }}></td>
//                           <td style={{ ...s.td, borderBottom: subBorder }}>
//                             <span style={{ ...s.usingTag, background: "#fff" }}>
//                               <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0 }}></span>
//                               {u.name.length > 28 ? u.name.slice(0, 28) + "…" : u.name}
//                             </span>
//                           </td>
//                           <td style={{ ...s.td, ...s.tdR, ...s.tdMono, color: "#854F0B", fontSize: 12, borderBottom: subBorder }}>
//                             {Number(u.amountGiven) > 0 ? fmt(u.amountGiven) : <span style={{ color: "#c0c0bd" }}>—</span>}
//                           </td>
//                           <td style={{ ...s.td, ...s.tdR, ...s.tdMono, color: "#3B6D11", fontSize: 12, borderBottom: subBorder }}>
//                             {Number(u.amountReturned) > 0 ? fmt(u.amountReturned) : <span style={{ color: "#c0c0bd" }}>—</span>}
//                           </td>
//                           <td style={{ ...s.td, ...s.tdR, borderBottom: subBorder }}>
//                             {uPen > 0
//                               ? <span style={{ ...s.pendingPill, fontSize: 10 }}>{fmt(uPen)}</span>
//                               : <span style={{ color: "#c0c0bd", fontSize: 11 }}>—</span>}
//                           </td>
//                           <td style={{ ...s.td, borderBottom: subBorder }}></td>
//                         </tr>
//                       );
//                     })}
//                   </React.Fragment>
//                 );
//               })}
//             </tbody>
//             <tfoot>
//               <tr style={s.trFoot}>
//                 <td style={s.td} colSpan={2}><strong>Grand total</strong></td>
//                 <td style={{ ...s.td, ...s.tdR, ...s.tdMono, color: "#3B6D11" }}>{fmt(grand.value)}</td>
//                 <td style={s.td}><span style={{ fontSize: 11, color: "#737370" }}>{grand.using} total sub-projects</span></td>
//                 <td style={{ ...s.td, ...s.tdR, ...s.tdMono, color: "#854F0B" }}>{grand.given > 0 ? fmt(grand.given) : "—"}</td>
//                 <td style={{ ...s.td, ...s.tdR, ...s.tdMono, color: "#3B6D11" }}>{grand.returned > 0 ? fmt(grand.returned) : "—"}</td>
//                 <td style={{ ...s.td, ...s.tdR }}>
//                   {grand.pending > 0
//                     ? <span style={{ ...s.pendingPill, fontWeight: 600 }}>{fmt(grand.pending)}</span>
//                     : "—"}
//                 </td>
//                 <td style={s.td}></td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
