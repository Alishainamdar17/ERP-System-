import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave, FaSpinner } from "react-icons/fa";
import { createProject, getProjectById, updateProject } from "../Services/cashTrackerService";

export default function CashProjectForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        name: "",
        clientName: "",
        totalValue: "",
        openingBalance: "",
    });
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(isEdit);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isEdit) return;
        getProjectById(id)
            .then((res) => {
                const p = res.data?.data || res.data;
                setForm({
                    name: p.name || "",
                    clientName: p.clientName || "",
                    totalValue: p.totalValue || "",
                    openingBalance: p.openingBalance || "",
                });
            })
            .catch(() => setError("Failed to load project."))
            .finally(() => setFetchLoading(false));
    }, [id, isEdit]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const payload = {
                name: form.name,
                clientName: form.clientName,
                totalValue: Number(form.totalValue),
                openingBalance: Number(form.openingBalance) || 0,
            };
            if (isEdit) {
                await updateProject(id, payload);
            } else {
                await createProject(payload);
            }
            navigate(-1);
        } catch (err) {
            setError(err?.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: "#64748b" }}>
            <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> Loading…
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    return (
        <div style={{ padding: "28px", background: "#f8fafc", minHeight: "100vh" }}>
            <button onClick={() => navigate(-1)} style={backBtn}>
                <FaArrowLeft style={{ marginRight: 6 }} /> Back
            </button>

            <div style={card}>
                <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 800, color: "#1e293b" }}>
                    {isEdit ? "✏️ Edit Project" : "➕ New Cash Project"}
                </h2>
                <p style={{ margin: "0 0 28px", color: "#64748b", fontSize: 13 }}>
                    {isEdit ? "Update project details below." : "Fill in the details to create a new financial project."}
                </p>

                {error && (
                    <div style={{ background: "#fef2f2", color: "#ef4444", padding: "12px 16px", borderRadius: 8, marginBottom: 20, fontSize: 13 }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                        <Field label="Project Name *" name="name" value={form.name} onChange={handleChange} placeholder="e.g. VTP Tower Block A" required />
                        <Field label="Client Name" name="clientName" value={form.clientName} onChange={handleChange} placeholder="e.g. VTP Realty" />
                        <Field label="Total Project Value (₹) *" name="totalValue" type="number" value={form.totalValue} onChange={handleChange} placeholder="e.g. 5000000" required />
                        {!isEdit && (
                            <Field label="Opening Balance (₹)" name="openingBalance" type="number" value={form.openingBalance} onChange={handleChange} placeholder="0" />
                        )}
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 30, gap: 12 }}>
                        <button type="button" onClick={() => navigate(-1)} style={cancelBtn}>Cancel</button>
                        <button type="submit" disabled={loading} style={submitBtn}>
                            {loading ? <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> : <FaSave />}
                            <span style={{ marginLeft: 8 }}>{isEdit ? "Update Project" : "Create Project"}</span>
                        </button>
                    </div>
                </form>
            </div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );
}

function Field({ label, name, value, onChange, type = "text", placeholder, required }) {
    return (
        <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {label}
            </label>
            <input
                name={name} value={value} onChange={onChange}
                type={type} placeholder={placeholder} required={required}
                style={{
                    width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0",
                    borderRadius: 8, fontSize: 13, color: "#1e293b", outline: "none",
                    boxSizing: "border-box", transition: "border 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
        </div>
    );
}

const card = {
    background: "#fff", borderRadius: 16, padding: "32px 36px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)", maxWidth: 740,
};
const backBtn = {
    display: "inline-flex", alignItems: "center", marginBottom: 20,
    background: "none", border: "none", color: "#6366f1", cursor: "pointer",
    fontSize: 13, fontWeight: 700, padding: 0,
};
const cancelBtn = {
    padding: "10px 24px", border: "1.5px solid #e2e8f0", borderRadius: 8,
    background: "#fff", color: "#374151", fontWeight: 700, cursor: "pointer", fontSize: 13,
};
const submitBtn = {
    padding: "10px 28px", border: "none", borderRadius: 8,
    background: "#6366f1", color: "#fff", fontWeight: 700,
    cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center",
};
