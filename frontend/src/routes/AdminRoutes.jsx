import { lazy } from "react";
import { Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import AdminProtectedRoute from "../utils/protected routes/AdminProtectedRoute";

// Lazy loaded components and pages
const AdminLoginPage = lazy(() => import("../pages/admin/AdminLoginPage"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("../pages/admin/AdminUsers"));
const AdminPsychologists = lazy(() => import("../pages/admin/AdminPsychologists"));
const AdminApproveRequestPage = lazy(() => import("../pages/admin/AdminApproveRequestPage"));
const AdminApproveRejectCard = lazy(() => import("../components/admin/AdminApproveRejectCard"));
const AdminConsultations = lazy(() => import("../pages/admin/AdminConsultations"));
const AdminComplaints = lazy(() => import("../components/admin/AdminComplaints"));

const AdminRoutes = () => (
  <>
    <Route path="/admin/login" element={<AdminLoginPage />} />
    <Route path="/admin" element={<AdminLayout />}>
      <Route element={<AdminProtectedRoute />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="psychologists" element={<AdminPsychologists />} />
        <Route path="approvals" element={<AdminApproveRequestPage />} />
        <Route path="approvals/:id" element={<AdminApproveRejectCard />} />
        <Route path="consultations" element={<AdminConsultations />} />
        <Route path="complaints" element={<AdminComplaints />} />
      </Route>
    </Route>
  </>
);

export default AdminRoutes;
