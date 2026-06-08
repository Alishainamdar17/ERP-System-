import React, { useState } from "react";
import { createProject } from "../Services/cashTrackerService";

const s = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" },
  modal: { background: "#fff", borderRadius: 10, width: 500, maxHeight: "90vh", overflowY: "auto", border: "0.5px solid #e5e5e0", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" },
  header: { padding: "14px 18px", borderBottom: "0.5px solid #e5e5e0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#fff", zIndex: 1 },
  title: { fontSize: 14, fontWeight: 500, color: "#1a1a18" },
  close: { fontSize: 18, color: "#737370", cursor: "pointer", background: "none", border: "none", lineHeight: 1 },
  body: { padding: 18 },
  section: { fontSize: 11, fontWeight: 500, color: "#737370", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10, marginTop: 6 },
  group: { marginBottom: 14 },
  label: { display: "block", fontSize: 12, color: "#737370", marginBottom: 5 },
  input: { width: "100%", padding: "8px 10px", border: "0.5px solid #d0d0cc", borderRadius: 6, fontSize: 13, color: "#1a1a18", background: "#fff", outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "8px 10px", border: "0.5px solid #d0d0cc", borderRadius: 6, fontSize: 12, color: "#1a1a18", background: "#fff", outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "monospace", lineHeight: 1.6 },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  divider: { borderTop: "0.5px solid #f0f0ed", margin: "16px 0" },
  usingRow: { display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 28px", gap: 6, alignItems: "center", marginBottom: 6 },
  usingHead: { display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 28px", gap: 6, marginBottom: 4 },
  usingHeadLbl: { fontSize: 10, color: "#a0a09d", textTransform: "uppercase", letterSpacing: "0.04em" },
  usingInput: { padding: "5px 7px", border: "0.5px solid #d0d0cc", borderRadius: 5, fontSize: 12, color: "#1a1a18", background: "#fafaf8", outline: "none", width: "100%", boxSizing: "border-box" },
  addBtn: { padding: "5px 10px", border: "0.5px solid #185FA5", borderRadius: 5, fontSize: 12, color: "#185FA5", background: "#E6F1FB", cursor: "pointer" },
  removeBtn: { width: 24, height: 24, border: "0.5px solid #F7C1C1", borderRadius: 5, fontSize: 14, color: "#A32D2D", background: "#FCEBEB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  footer: { padding: "12px 18px", borderTop: "0.5px solid #e5e5e0", display: "flex", justifyContent: "flex-end", gap: 8, position: "sticky", bottom: 0, background: "#fff" },
  btn: { padding: "7px 14px", borderRadius: 6, fontSize: 13, border: "0.5px solid #d0d0cc", background: "#fff", color: "#1a1a18", cursor: "pointer" },
  btnBlue: { background: "#185FA5", color: "#fff", borderColor: "#185FA5", fontWeight: 500 },
  hint: { fontSize: 11, color: "#a0a09d", marginTop: 4 },
  error: { fontSize: 12, color: "#A32D2D", marginTop: 8 },
};

const initialForm = { name: "", clientName: "", totalValue: "", openingBalance: "" };
const emptyUsing = () => ({ name: "", refNo: "", amountGiven: "", amountReturned: "" });

function NewProjectModal({ onClose, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [usingProjects, setUsingProjects] = useState([emptyUsing()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUsingChange = (index, field, value) => {
    const updated = usingProjects.map((u, i) => i === index ? { ...u, [field]: value } : u);
    setUsingProjects(updated);
  };

  const addUsingRow = () => setUsingProjects([...usingProjects, emptyUsing()]);

  const removeUsingRow = (index) => {
    if (usingProjects.length === 1) {
      setUsingProjects([emptyUsing()]);
    } else {
      setUsingProjects(usingProjects.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError("Project name is required."); return; }
    if (!form.totalValue || isNaN(form.totalValue) || Number(form.totalValue) < 0) {
      setError("Total value must be a valid positive number."); return;
    }
    setError("");
    setLoading(true);

    // Filter out empty using project rows
    const validUsing = usingProjects
      .filter(u => u.name.trim())
      .map(u => ({
        name: u.name.trim(),
        refNo: u.refNo.trim() || null,
        amountGiven: u.amountGiven ? Number(u.amountGiven) : 0,
        amountReturned: u.amountReturned ? Number(u.amountReturned) : 0,
      }));

    try {
      const created = await createProject({
        name: form.name.trim(),
        clientName: form.clientName.trim(),
        totalValue: Number(form.totalValue),
        openingBalance: form.openingBalance ? Number(form.openingBalance) : 0,
        usingProjects: validUsing,
      });
      onCreated(created);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <div style={s.title}>+ New project</div>
          <button style={s.close} onClick={onClose}>×</button>
        </div>

        <div style={s.body}>
          {/* Funding project details */}
          <div style={s.section}>Funding Project</div>
          <div style={s.group}>
            <label style={s.label}>Project name *</label>
            <input style={s.input} name="name" placeholder="e.g. Vasant Hyderabad" value={form.name} onChange={handleChange} />
          </div>
          <div style={s.group}>
            <label style={s.label}>Client name</label>
            <input style={s.input} name="clientName" placeholder="e.g. Godrej client" value={form.clientName} onChange={handleChange} />
          </div>
          <div style={s.row}>
            <div style={s.group}>
              <label style={s.label}>Total project value (₹) *</label>
              <input style={s.input} name="totalValue" type="number" min="0" placeholder="0" value={form.totalValue} onChange={handleChange} />
            </div>
            <div style={s.group}>
              <label style={s.label}>Opening balance (₹)</label>
              <input style={s.input} name="openingBalance" type="number" min="0" placeholder="0" value={form.openingBalance} onChange={handleChange} />
            </div>
          </div>

          <div style={s.divider} />

          {/* Using Projects */}
          <div style={s.section}>Using Projects <span style={{ fontSize: 10, color: "#a0a09d", textTransform: "none", fontWeight: 400 }}>(where this funding is used)</span></div>

          {/* Column headers */}
          <div style={s.usingHead}>
            <span style={s.usingHeadLbl}>Site / Project name</span>
            <span style={s.usingHeadLbl}>Ref No</span>
            <span style={s.usingHeadLbl}>Given (₹)</span>
            <span style={s.usingHeadLbl}>Returned (₹)</span>
            <span></span>
          </div>

          {/* Using project rows */}
          {usingProjects.map((u, i) => (
            <div key={i} style={s.usingRow}>
              <input
                style={s.usingInput}
                placeholder="e.g. Soltaire Business Hub ODL1017"
                value={u.name}
                onChange={(e) => handleUsingChange(i, "name", e.target.value)}
              />
              <input
                style={s.usingInput}
                placeholder="ODL1017"
                value={u.refNo}
                onChange={(e) => handleUsingChange(i, "refNo", e.target.value)}
              />
              <input
                style={s.usingInput}
                type="number"
                placeholder="0"
                value={u.amountGiven}
                onChange={(e) => handleUsingChange(i, "amountGiven", e.target.value)}
              />
              <input
                style={s.usingInput}
                type="number"
                placeholder="0"
                value={u.amountReturned}
                onChange={(e) => handleUsingChange(i, "amountReturned", e.target.value)}
              />
              <button style={s.removeBtn} onClick={() => removeUsingRow(i)}>×</button>
            </div>
          ))}

          <button style={s.addBtn} onClick={addUsingRow}>+ Add row</button>
          <div style={s.hint}>Each row = one site/project where this funding is being used. You can add more rows later from the project page.</div>

          {error && <div style={s.error}>⚠ {error}</div>}
        </div>

        <div style={s.footer}>
          <button style={s.btn} onClick={onClose}>Cancel</button>
          <button style={{ ...s.btn, ...s.btnBlue }} onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "✓ Create project"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewProjectModal;