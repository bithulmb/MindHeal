import { lazy } from "react";
import { Route } from "react-router-dom";

import PsychologistProtectedRoute from "../utils/protected routes/PsychologistProtectedRoute";
import PsychologistProfileProtectedRoute from "../utils/protected routes/PsychologistProfileProtectedRoute";
import MainLayout from "@/layouts/MainLayout";
import PsychologistLayout from "../layouts/PsychologistLayout";

// Lazy loaded components
const PsychologistDashboard = lazy(() => import("../pages/psychologist/PsychologistDashboard"));
const PsychologistProfile = lazy(() => import("../components/psychologist/PsychologistProfile"));
const PsychologistProfileForm = lazy(() => import("../components/psychologist/PsychologistProfileForm"));
const PsychologistProfileSubmitted = lazy(() => import("../components/psychologist/PsychologistProfileSubmitted"));
const PsychologistProfileRejected = lazy(() => import("../components/psychologist/PsychologistProfileRejected"));
const PsychologistProfileUpdateForm = lazy(() => import("../components/psychologist/PsychologistProfileUpdateForm"));
const PsychologistEarnings = lazy(() => import("../components/psychologist/PsychologistEarnings"));
const TimeSlots = lazy(() => import("../components/psychologist/TimeSlots"));
const UserChats = lazy(() => import("../components/user/UserChats"));
const UserComplaints = lazy(() => import("../components/common/UserComplaints"));
const PsychologistConsultationsPage = lazy(() => import("../pages/psychologist/PsychologistConsultationsPage"));
const ChangePassword = lazy(() => import("../components/common/ChangePassword"));
const VideoCallPage = lazy(() => import("../components/video-call/VIdeoCallPage"));

const PsychologistRoutes = () => (
  <>
    <Route path="/" element={<MainLayout />}>
      <Route element={<PsychologistProtectedRoute />}>
        <Route
          path="/psychologist/verify-profile"
          element={<PsychologistProfileForm />}
        />
        <Route
          path="/psychologist/profile-submitted"
          element={<PsychologistProfileSubmitted />}
        />
        <Route
          path="/psychologist/profile-rejected"
          element={<PsychologistProfileRejected />}
        />

        <Route element={<PsychologistProfileProtectedRoute />}>
          <Route path="/psychologist" element={<PsychologistLayout />}>
            <Route path="dashboard" element={<PsychologistDashboard />} />
            <Route path="profile" element={<PsychologistProfile />} />
            <Route path="profile/update" element={<PsychologistProfileUpdateForm />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="consultations" element={<PsychologistConsultationsPage />} />
            <Route path="chats" element={<UserChats />} />
            <Route path="complaints" element={<UserComplaints />} />
            <Route path="earnings" element={<PsychologistEarnings />} />
            <Route path="slots" element={<TimeSlots />} />
            <Route path="video-call/:consultation_id" element={<VideoCallPage />} />
          </Route>
        </Route>
      </Route>
    </Route>
  </>
);

export default PsychologistRoutes;
