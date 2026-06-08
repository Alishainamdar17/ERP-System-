import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const styles = {
  sidebar: {
    background: "#fff",
    borderRight: "0.5px solid #e5e5e0",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    width: 200,
    minHeight: "100vh",
  },
  brand: {
    padding: "16px 16px 12px",
    borderBottom: "0.5px solid #e5e5e0",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  brandIcon: {
    width: 28,
    height: 28,
    background: "#E6F1FB",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: { fontSize: 13, fontWeight: 500, color: "#1a1a18" },
  brandSub: { fontSize: 11, color: "#737370" },
  section: {
    padding: "12px 10px 4px",
    fontSize: 10,
    color: "#a0a09d",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  item: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 10px",
    margin: "1px 6px",
    borderRadius: 6,
    fontSize: 13,
    color: active ? "#0C447C" : "#737370",
    background: active ? "#E6F1FB" : "transparent",
    fontWeight: active ? 500 : 400,
    cursor: "pointer",
    textDecoration: "none",
    border: "none",
    width: "calc(100% - 12px)",
    textAlign: "left",
  }),
  badge: {
    marginLeft: "auto",
    background: "#FCEBEB",
    color: "#A32D2D",
    fontSize: 10,
    padding: "1px 6px",
    borderRadius: 10,
    fontWeight: 500,
  },
  footer: {
    marginTop: "auto",
    borderTop: "0.5px solid #e5e5e0",
    padding: 10,
  },
  user: { display: "flex", alignItems: "center", gap: 8, padding: "6px 4px" },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#E6F1FB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 500,
    color: "#0C447C",
  },
};

function CashTrackerSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.brand}>
        <div style={styles.brandIcon}>
          <span style={{ fontSize: 15, color: "#185FA5" }}>₹</span>
        </div>
        <div>
          <div style={styles.brandName}>Cash Tracker</div>
          <div style={styles.brandSub}>Onedeoleela ERP</div>
        </div>
      </div>

      <div style={styles.section}>Main</div>
      <Link to="/cash-tracker/dashboard" style={styles.item(isActive("/cash-tracker/dashboard"))}>
        🏠 Dashboard
      </Link>
      <Link to="/cash-tracker/projects" style={styles.item(isActive("/cash-tracker/projects"))}>
        📁 Projects
      </Link>

      <div style={styles.section}>Tracking</div>
      <Link to="/cash-tracker/cross-project" style={styles.item(isActive("/cash-tracker/cross-project"))}>
        🔗 Cross-project
      </Link>
      <Link to="/cash-tracker/master-summary" style={styles.item(isActive("/cash-tracker/master-summary"))}>
        📊 Master summary
      </Link>

      <div style={styles.section}>Finance</div>
      <Link to="/cash-tracker/transactions" style={styles.item(isActive("/cash-tracker/transactions"))}>
        ↓ Transactions
      </Link>
      <Link to="/cash-tracker/transfers" style={styles.item(isActive("/cash-tracker/transfers"))}>
        ⇄ Transfers
      </Link>
      <Link to="/cash-tracker/reports" style={styles.item(isActive("/cash-tracker/reports"))}>
        📈 Reports
      </Link>

      <div style={styles.section}>System</div>
      <Link to="/cash-tracker/audit" style={styles.item(isActive("/cash-tracker/audit"))}>
        📋 Audit log
      </Link>

      <div style={styles.footer}>
        <div style={styles.user}>
          <div style={styles.avatar}>AD</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#1a1a18" }}>Admin</div>
            <div style={{ fontSize: 11, color: "#737370" }}>Administrator</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CashTrackerSidebar;
