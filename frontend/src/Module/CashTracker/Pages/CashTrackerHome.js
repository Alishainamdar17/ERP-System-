import React from "react";
import { Outlet } from "react-router-dom";
import CashTrackerSidebar from "../Components/CashTrackerSidebar";

function CashTrackerHome() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <CashTrackerSidebar />
      <div style={{ background: "#f5f5f3", overflow: "auto" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default CashTrackerHome;
