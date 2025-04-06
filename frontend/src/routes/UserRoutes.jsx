import { lazy } from "react";
import { Route } from "react-router-dom";

import UserProtectedRoute from "../utils/protected routes/UserProtectedRoute";
import UserProfileProtectedRoute from "../utils/protected routes/UserProfileProtectedRoute";
import MainLayout from "@/layouts/MainLayout";
import UserLayout from "../layouts/UserLayout";

// Lazy loaded components
const UserDashboard = lazy(() => import("../components/user/UserDashboard"));
const UserProfile = lazy(() => import("../components/user/UserProfile"));
const UserConsultationsPage = lazy(() => import("../pages/user/UserConsultationsPage"));
const ChangePassword = lazy(() => import("../components/common/ChangePassword"));
const UserChats = lazy(() => import("../components/user/UserChats"));
const UserWallet = lazy(() => import("../components/user/UserWallet"));
const UserProfileCreationForm = lazy(() => import("../components/user/UserProfileCreationForm"));
const UserProfileUpdateForm = lazy(() => import("../components/user/UserProfileUpdateForm"));
const VideoCallPage = lazy(() => import("../components/video-call/VIdeoCallPage"));
const UserComplaints = lazy(() => import("../components/common/UserComplaints"));

const UserRoutes = () => (
  <>
    <Route path="/" element={<MainLayout />}>
      <Route element={<UserProtectedRoute />}>
        <Route
          path="/user/profile/create"
          element={<UserProfileCreationForm />}
        />

        <Route element={<UserProfileProtectedRoute />}>
          <Route path="/user" element={<UserLayout />}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="consultations" element={<UserConsultationsPage />} />
            <Route path="chats" element={<UserChats />} />
            <Route path="wallet" element={<UserWallet />} />
            <Route path="profile/update" element={<UserProfileUpdateForm />} />
            <Route path="video-call/:consultation_id" element={<VideoCallPage />} />
            <Route path="complaints" element={<UserComplaints />} />
          </Route>
        </Route>
      </Route>
    </Route>
  </>
);

export default UserRoutes;
