// import { BrowserRouter, Routes, Route } from "react-router-dom";

// // Public
// import LoginPage from "./pages/LoginPage";

// // Coordinator
// import FloorFlatManager from "./Module/Coordinator/Pages/FloorFlatManager";
// import ProjectManagerPage from "./Module/Coordinator/Pages/ProjectManagerPage";

// // Admin & VP & Driver
// import AdminDashboard from "./pages/AdminDashboard";
// import VPDashboard from "./pages/VPDashboard";
// import DriverDashboard from "./pages/DriverDashboard";
// import VehicleMonitoringPage from "./Module/Dispatch/Pages/VehicleMonitoringPage";
// import PlanningDashboard from "./pages/PlanningDashboard";

// // Dispatch
// import DispatchHome from "./Module/Dispatch/Pages/DispatchHome";
// import DispatchDashboard from "./Module/Dispatch/Pages/DispatchDashboard";
// import AddRoute from "./Module/Dispatch/Pages/AddRoute";
// import ViewRoutes from "./Module/Dispatch/Pages/ViewRoutes";
// import Drivers from "./Module/Dispatch/Pages/Drivers";
// import VehicleStatusImages from "./Module/Dispatch/Pages/VehicleStatusImages";
// import CancellationInfo from "./Module/Dispatch/Pages/CancellationInfo";
// import VehiclePortalPage from "./Module/Dispatch/Pages/VehiclePortalPage";
// import WindowManagerPage from "./Module/Dispatch/Pages/WindowManagerPage";
// import BulkUploadWindowPage from "./Module/Dispatch/Pages/BulkUploadWindowPage";
// import ItemDCPage from "./Module/Dispatch/Pages/ItemDCPage";
// import DispatchReport from "./Module/Dispatch/Pages/DispatchReport";
// import DailyReports from "./Module/Dispatch/Pages/DailyReports";

// // Other Dashboards
// import ProductionDashboard from "./pages/ProductionDashbaord";
// import SiteSupervisorDashboard from "./pages/SiteSupervisorDashboard";
// import PurchaseDashboard from "./pages/PurchaseDashboard";
// import CoordinatorDashboard from "./pages/CoordinatorDashboad";
// import PowderCoatingDashboard from "./pages/PowderCoatingDashboard";

// // Vehicle Requisition
// import AddVehicleRequisition from "./Module/Requisition/Pages/AddVehicleRequisition";
// import VehicleRequisitionList from "./Module/Requisition/Pages/VehicleRequisitionList";
// import LiveTrackingPage from "./Module/Dispatch/Pages/LiveTrackingPage";
// import VehicleExpensesPage from "./Module/Dispatch/Pages/VehicleExpensesPage";
// import TripHistoryPage from "./Module/Dispatch/Pages/TripHistoryPage";
// import ActiveVehiclePage from "./Module/Dispatch/Pages/ActiveVehiclePage";
// import InactiveVehiclePage from "./Module/Dispatch/Pages/InActiveVehiclePage";

// // ? Cash Tracker Module
// import CashTrackerHome   from "./Module/CashTracker/Pages/CashTrackerHome";
// import Dashboard         from "./Module/CashTracker/Pages/Dashboard";
// import CashDashboard     from "./Module/CashTracker/Pages/CashDashboard";
// import Projects          from "./Module/CashTracker/Pages/Projects";
// import CashProjectDetail from "./Module/CashTracker/Pages/CashProjectDetail";
// import CashProjectForm   from "./Module/CashTracker/Pages/CashProjectForm";
// import Transactions      from "./Module/CashTracker/Pages/Transactions";
// import AddTransaction    from "./Module/CashTracker/Pages/AddTransaction";
// import Transfers         from "./Module/CashTracker/Pages/Transfers";
// import AuditLog          from "./Module/CashTracker/Pages/AuditLog";
// import CrossProjectTracker from "./Module/CashTracker/Pages/CrossProjectTracker";
// import MasterSummary      from "./Module/CashTracker/Pages/MasterSummary";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* Public */}
//         <Route path="/" element={<LoginPage />} />

//         {/* Admin */}
//         <Route path="/admin-dashboard" element={<AdminDashboard />} />
//         <Route path="/planning-dashboard" element={<PlanningDashboard />} />

//         {/* VP */}
//         <Route path="/vp-dashboard" element={<VPDashboard />} />

//         {/* Driver */}
//         <Route path="/driver-dashboard" element={<DriverDashboard />} />

//         {/* Dispatch Layout */}
//         <Route path="/dispatch-dashboard" element={<DispatchHome />}>
//           <Route path="vehicles" element={<DispatchDashboard />} />
//           <Route path="active-vehicles" element={<ActiveVehiclePage />} />
//           <Route path="inactive-vehicles" element={<InactiveVehiclePage />} />
//           <Route path="routes/add" element={<AddRoute />} />
//           <Route path="routes" element={<ViewRoutes />} />
//           <Route path="routes/history/:tripId" element={<TripHistoryPage />} />
//           <Route path="vehicle-portal" element={<VehiclePortalPage />} />
//           <Route path="drivers" element={<Drivers />} />
//           <Route path="vehicle-status-images" element={<VehicleStatusImages />} />
//           <Route path="live-tracking" element={<LiveTrackingPage />} />
//           <Route path="expenses" element={<VehicleExpensesPage />} />
//           <Route path="/dispatch-dashboard/vehicle-monitoring" element={<VehicleMonitoringPage />} />
//           <Route path="/dispatch-dashboard/routes/cancellation/:id" element={<CancellationInfo />} />
//           <Route path="/dispatch-dashboard/window-dc" element={<WindowManagerPage />} />
//           <Route path="/dispatch-dashboard/bulk-upload-window" element={<BulkUploadWindowPage />} />
//           <Route path="material-dc" element={<ItemDCPage />} />
//           <Route path="/dispatch-dashboard/dispatch-report" element={<DispatchReport />} />
//           <Route path="daily-reports" element={<DailyReports />} />
//         </Route>

//         {/* Other Dashboards */}
//         <Route path="production-dashboard" element={<ProductionDashboard />} />
//         <Route path="purchase-dashboard" element={<PurchaseDashboard />} />
//         <Route path="site_supervisor-dashboard" element={<SiteSupervisorDashboard />} />

//         {/* Coordinator */}
//         <Route path="coordinator-dashboard" element={<CoordinatorDashboard />}>
//           <Route path="projects" element={<ProjectManagerPage />} />
//           <Route path="floor-flat" element={<FloorFlatManager />} />
//           <Route path="planning/create" element={<AddVehicleRequisition />} />
//           <Route path="planning/view" element={<VehicleRequisitionList />} />
//         </Route>

//         <Route path="powder_coating-dashboard" element={<PowderCoatingDashboard />} />
//         <Route path="/vehicle-requisition" element={<AddVehicleRequisition />} />
//         <Route path="/vehicle-requisition-list" element={<VehicleRequisitionList />} />

//         {/* ? Cash Tracker � all nested routes */}
//         <Route path="/cash-tracker" element={<CashTrackerHome />}>
//           <Route index element={<Dashboard />} />
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="reports" element={<CashDashboard />} />
//           <Route path="projects"              element={<Projects />} />
//           <Route path="projects/new"          element={<CashProjectForm />} />
//           <Route path="projects/:id"          element={<CashProjectDetail />} />
//           <Route path="projects/:id/edit"     element={<CashProjectForm />} />
//           <Route path="transactions"          element={<Transactions />} />
//           <Route path="transactions/add"      element={<AddTransaction />} />
//           <Route path="transactions/add/:projectId" element={<AddTransaction />} />
//           <Route path="transfers"             element={<Transfers />} />
//           <Route path="cross-project"          element={<CrossProjectTracker />} />
//           <Route path="master-summary"         element={<MasterSummary />} />
//           <Route path="audit"                 element={<AuditLog />} />
//         </Route>

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public
import LoginPage from "./pages/LoginPage";

// Coordinator
import FloorFlatManager from "./Module/Coordinator/Pages/FloorFlatManager";
import ProjectManagerPage from "./Module/Coordinator/Pages/ProjectManagerPage";

// Admin & VP & Driver
import AdminDashboard from "./pages/AdminDashboard";
import VPDashboard from "./pages/VPDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import VehicleMonitoringPage from "./Module/Dispatch/Pages/VehicleMonitoringPage";
import PlanningDashboard from "./pages/PlanningDashboard";

// Dispatch
import DispatchHome from "./Module/Dispatch/Pages/DispatchHome";
import DispatchDashboard from "./Module/Dispatch/Pages/DispatchDashboard";
import AddRoute from "./Module/Dispatch/Pages/AddRoute";
import ViewRoutes from "./Module/Dispatch/Pages/ViewRoutes";
import Drivers from "./Module/Dispatch/Pages/Drivers";
import VehicleStatusImages from "./Module/Dispatch/Pages/VehicleStatusImages";
import CancellationInfo from "./Module/Dispatch/Pages/CancellationInfo";
import VehiclePortalPage from "./Module/Dispatch/Pages/VehiclePortalPage";
import WindowManagerPage from "./Module/Dispatch/Pages/WindowManagerPage";
import BulkUploadWindowPage from "./Module/Dispatch/Pages/BulkUploadWindowPage";
import ItemDCPage from "./Module/Dispatch/Pages/ItemDCPage";
import DispatchReport from "./Module/Dispatch/Pages/DispatchReport";
import DailyReports from "./Module/Dispatch/Pages/DailyReports";

// Other Dashboards
import ProductionDashboard from "./pages/ProductionDashbaord";
import SiteSupervisorDashboard from "./pages/SiteSupervisorDashboard";
import PurchaseDashboard from "./pages/PurchaseDashboard";
import CoordinatorDashboard from "./pages/CoordinatorDashboad";
import PowderCoatingDashboard from "./pages/PowderCoatingDashboard";

// Vehicle Requisition
import AddVehicleRequisition from "./Module/Requisition/Pages/AddVehicleRequisition";
import VehicleRequisitionList from "./Module/Requisition/Pages/VehicleRequisitionList";
import LiveTrackingPage from "./Module/Dispatch/Pages/LiveTrackingPage";
import VehicleExpensesPage from "./Module/Dispatch/Pages/VehicleExpensesPage";
import TripHistoryPage from "./Module/Dispatch/Pages/TripHistoryPage";
import ActiveVehiclePage from "./Module/Dispatch/Pages/ActiveVehiclePage";
import InactiveVehiclePage from "./Module/Dispatch/Pages/InActiveVehiclePage";

// ── Cash Tracker Module ──────────────────────────────────────────────────────
import CashTrackerHome      from "./Module/CashTracker/Pages/CashTrackerHome";
import Dashboard            from "./Module/CashTracker/Pages/Dashboard";
import CashDashboard        from "./Module/CashTracker/Pages/CashDashboard";
import Projects             from "./Module/CashTracker/Pages/Projects";
import CashProjectDetail    from "./Module/CashTracker/Pages/CashProjectDetail";
import CashProjectForm      from "./Module/CashTracker/Pages/CashProjectForm";
import Transactions         from "./Module/CashTracker/Pages/Transactions";
import AddTransaction        from "./Module/CashTracker/Pages/AddTransaction";
import Transfers            from "./Module/CashTracker/Pages/Transfers";
import AuditLog             from "./Module/CashTracker/Pages/AuditLog";
import CrossProjectTracker  from "./Module/CashTracker/Pages/CrossProjectTracker";
import MasterSummaryPage        from "./Module/CashTracker/Pages/MasterSummaryPage";   // ← MasterSummaryPage.js renamed to MasterSummary.js
// ────────────────────────────────────────────────────────────────────────────

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public ── */}
        <Route path="/" element={<LoginPage />} />

        {/* ── Admin ── */}
        <Route path="/admin-dashboard"    element={<AdminDashboard />} />
        <Route path="/planning-dashboard" element={<PlanningDashboard />} />

        {/* ── VP ── */}
        <Route path="/vp-dashboard" element={<VPDashboard />} />

        {/* ── Driver ── */}
        <Route path="/driver-dashboard" element={<DriverDashboard />} />

        {/* ── Dispatch Layout ── */}
        <Route path="/dispatch-dashboard" element={<DispatchHome />}>
          <Route path="vehicles"                                              element={<DispatchDashboard />} />
          <Route path="active-vehicles"                                       element={<ActiveVehiclePage />} />
          <Route path="inactive-vehicles"                                     element={<InactiveVehiclePage />} />
          <Route path="routes/add"                                            element={<AddRoute />} />
          <Route path="routes"                                                element={<ViewRoutes />} />
          <Route path="routes/history/:tripId"                                element={<TripHistoryPage />} />
          <Route path="vehicle-portal"                                        element={<VehiclePortalPage />} />
          <Route path="drivers"                                               element={<Drivers />} />
          <Route path="vehicle-status-images"                                 element={<VehicleStatusImages />} />
          <Route path="live-tracking"                                         element={<LiveTrackingPage />} />
          <Route path="expenses"                                              element={<VehicleExpensesPage />} />
          <Route path="/dispatch-dashboard/vehicle-monitoring"                element={<VehicleMonitoringPage />} />
          <Route path="/dispatch-dashboard/routes/cancellation/:id"          element={<CancellationInfo />} />
          <Route path="/dispatch-dashboard/window-dc"                        element={<WindowManagerPage />} />
          <Route path="/dispatch-dashboard/bulk-upload-window"               element={<BulkUploadWindowPage />} />
          <Route path="material-dc"                                           element={<ItemDCPage />} />
          <Route path="/dispatch-dashboard/dispatch-report"                  element={<DispatchReport />} />
          <Route path="daily-reports"                                         element={<DailyReports />} />
        </Route>

        {/* ── Other Dashboards ── */}
        <Route path="production-dashboard"       element={<ProductionDashboard />} />
        <Route path="purchase-dashboard"         element={<PurchaseDashboard />} />
        <Route path="site_supervisor-dashboard"  element={<SiteSupervisorDashboard />} />

        {/* ── Coordinator ── */}
        <Route path="coordinator-dashboard" element={<CoordinatorDashboard />}>
          <Route path="projects"       element={<ProjectManagerPage />} />
          <Route path="floor-flat"     element={<FloorFlatManager />} />
          <Route path="planning/create" element={<AddVehicleRequisition />} />
          <Route path="planning/view"   element={<VehicleRequisitionList />} />
        </Route>

        <Route path="powder_coating-dashboard"    element={<PowderCoatingDashboard />} />
        <Route path="/vehicle-requisition"        element={<AddVehicleRequisition />} />
        <Route path="/vehicle-requisition-list"   element={<VehicleRequisitionList />} />

        {/* ── Cash Tracker — all nested routes ── */}
        <Route path="/cash-tracker" element={<CashTrackerHome />}>

          {/* Default index → Dashboard */}
          <Route index                                    element={<Dashboard />} />
          <Route path="dashboard"                         element={<Dashboard />} />

          

          {/* Projects */}
          <Route path="projects"                          element={<Projects />} />
          <Route path="projects/new"                      element={<CashProjectForm />} />
          <Route path="projects/:id"                      element={<CashProjectDetail />} />
          <Route path="projects/:id/edit"                 element={<CashProjectForm />} />

          {/* Transactions */}
          <Route path="transactions"                      element={<Transactions />} />
          <Route path="transactions/add"                  element={<AddTransaction />} />
          <Route path="transactions/add/:projectId"       element={<AddTransaction />} />

          {/* Transfers */}
          <Route path="transfers"                         element={<Transfers />} />

          {/* Cross Project Tracker */}
          <Route path="cross-project"                     element={<CrossProjectTracker />} />

          {/* Master Summary  ← NEW: shows funding → using projects table with Reassign debt */}
          <Route path="master-summary"                    element={<MasterSummaryPage />} />

          {/* Audit */}
          <Route path="audit"                             element={<AuditLog />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
