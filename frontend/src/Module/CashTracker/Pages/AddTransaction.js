import React, { useState } from "react";

const s = {
  screen: { padding: "20px 24px" },
  title: { fontSize: 17, fontWeight: 500, color: "#1a1a18" },
  sub: { fontSize: 12, color: "#737370", marginTop: 3, marginBottom: 20 },
  card: { background: "#fff", border: "0.5px solid #e5e5e0", borderRadius: 10, maxWidth: 520 },
  cardHeader: { padding: "12px 16px", borderBottom: "0.5px solid #e5e5e0", fontSize: 13, fontWeight: 500, color: "#1a1a18" },
  formBody: { padding: 16 },
  formGroup: { marginBottom: 14 },
  label: { fontSize: 12, color: "#737370", marginBottom: 5, display: "block" },
  input: { width: "100%", padding: "8px 10px", border: "0.5px solid #d0d0cc", borderRadius: 6, fontSize: 13, color: "#1a1a18", background: "#fff", outline: "none", boxSizing: "border-box" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  footer: { padding: "12px 16px", borderTop: "0.5px solid #e5e5e0", display: "flex", justifyContent: "flex-end", gap: 8 },
  btn: { padding: "7px 12px", borderRadius: 6, fontSize: 12.5, border: "0.5px solid #d0d0cc", background: "#fff", color: "#1a1a18", cursor: "pointer" },
  btnBlue: { background: "#185FA5", color: "#fff", borderColor: "#185FA5", fontWeight: 500 },
};

function AddTransaction() {
  const [form, setForm] = useState({ project: "", type: "Income", amount: "", date: "2026-05-21", description: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    alert(`Transaction saved!\nProject: ${form.project}\nType: ${form.type}\nAmount: ₹${form.amount}\nDate: ${form.date}\nDescription: ${form.description}`);
  };

  return (
    <div style={s.screen}>
      <div style={s.title}>Add transaction</div>
      <div style={s.sub}>Record income or expense against a project</div>

      <div style={s.card}>
        <div style={s.cardHeader}>+ New transaction</div>
        <div style={s.formBody}>
          <div style={s.row}>
            <div style={s.formGroup}>
              <label style={s.label}>Project</label>
              <select style={s.input} name="project" value={form.project} onChange={handleChange}>
                <option value="">Select project...</option>
                <option>Project Alpha</option>
                <option>Project Beta</option>
                <option>Project Gamma</option>
                <option>Project Delta</option>
              </select>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Type</label>
              <select style={s.input} name="type" value={form.type} onChange={handleChange}>
                <option>Income</option>
                <option>Expense</option>
              </select>
            </div>
          </div>
          <div style={s.row}>
            <div style={s.formGroup}>
              <label style={s.label}>Amount (₹)</label>
              <input style={s.input} type="number" name="amount" placeholder="0.00" value={form.amount} onChange={handleChange} />
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Date</label>
              <input style={s.input} type="date" name="date" value={form.date} onChange={handleChange} />
            </div>
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Description</label>
            <input style={s.input} type="text" name="description" placeholder="What is this transaction for?" value={form.description} onChange={handleChange} />
          </div>
        </div>
        <div style={s.footer}>
          <button style={s.btn}>Cancel</button>
          <button style={{ ...s.btn, ...s.btnBlue }} onClick={handleSubmit}>✓ Save transaction</button>
        </div>
      </div>
    </div>
  );
}

export default AddTransaction;
