import React, { useState } from "react";
import { createTransfer } from "../Services/cashTrackerService";

const s = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" },
  modal: { background: "#fff", borderRadius: 10, width: 440, border: "0.5px solid #e5e5e0", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" },
  header: { padding: "14px 18px", borderBottom: "0.5px solid #e5e5e0", display: "flex", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 14, fontWeight: 500, color: "#1a1a18" },
  close: { fontSize: 18, color: "#737370", cursor: "pointer", background: "none", border: "none", lineHeight: 1 },
  body: { padding: 18 },
  group: { marginBottom: 14 },
  label: { display: "block", fontSize: 12, color: "#737370", marginBottom: 5 },
  input: { width: "100%", padding: "8px 10px", border: "0.5px solid #d0d0cc", borderRadius: 6, fontSize: 13, color: "#1a1a18", background: "#fff", outline: "none", boxSizing: "border-box" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  footer: { padding: "12px 18px", borderTop: "0.5px solid #e5e5e0", display: "flex", justifyContent: "flex-end", gap: 8 },
  btn: { padding: "7px 14px", borderRadius: 6, fontSize: 13, border: "0.5px solid #d0d0cc", background: "#fff", color: "#1a1a18", cursor: "pointer" },
  btnBlue: { background: "#185FA5", color: "#fff", borderColor: "#185FA5", fontWeight: 500 },
  error: { fontSize: 12, color: "#A32D2D", marginTop: 8 },
};

function AddTransferModal({ projects = [], onClose, onCreated }) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ fromProjectId: "", toProjectId: "", amount: "", transferDate: today, note: "" });
  const [loading, setLoading] = useState(false);gf
  const [error, setError] = useState("");
  
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.fromProjectId || !form.toProjectId) { setError("Both projects are required."); return; }
    if (form.fromProjectId === form.toProjectId) { setError("From and To projects must be different."); return; }
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) { setError("Amount must be > 0."); return; }
    setError("");
    setLoading(true);
    try {
      const created = await createTransfer({
        fromProjectId: Number(form.fromProjectId),
        toProjectId: Number(form.toProjectId),
        amount: Number(form.amount),
        transferDate: form.transferDate,
        note: form.note.trim(),
      }); 
      onCreated(created);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create transfer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <div style={s.title}>⇄ New transfer</div>
          <button style={s.close} onClick={onClose}>×</button>
        </div>
        <div style={s.body}>
          <div style={s.row}>
            <div style={s.group}>
              <label style={s.label}>From project *</label>
              <select style={s.input} name="fromProjectId" value={form.fromProjectId} onChange={handleChange}>
                <option value="">Select...</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div style={s.group}>
              <label style={s.label}>To project *</label>
              <select style={s.input} name="toProjectId" value={form.toProjectId} onChange={handleChange}>
                <option value="">Select...</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div style={s.row}>
            <div style={s.group}>
              <label style={s.label}>Amount (₹) *</label>
              <input style={s.input} name="amount" type="number" min="1" placeholder="0" value={form.amount} onChange={handleChange} />
            </div>
            <div style={s.group}>
              <label style={s.label}>Date *</label>
              <input style={s.input} name="transferDate" type="date" value={form.transferDate} onChange={handleChange} />
            </div>
          </div>
          <div style={s.group}>
            <label style={s.label}>Note</label>
            <input style={s.input} name="note" placeholder="Reason for transfer" value={form.note} onChange={handleChange} />
          </div>
          {error && <div style={s.error}>⚠ {error}</div>}
        </div>
        <div style={s.footer}>
          <button style={s.btn} onClick={onClose}>Cancel</button>
          <button style={{ ...s.btn, ...s.btnBlue }} onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "✓ Transfer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTransferModal;
