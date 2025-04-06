import { Route } from "react-router-dom";
import { lazy } from "react";

import PublicRoute from "../utils/protected routes/PublicRoute";
import MainLayout from "@/layouts/MainLayout";

// Lazy load pages
const Home = lazy(() => import("../pages/common/Home"));
const Services = lazy(() => import("../pages/common/Services"));
const About = lazy(() => import("../pages/common/About"));
const Contact = lazy(() => import("../pages/common/Contact"));
const LoginPage = lazy(() => import("../pages/common/LoginPage"));
const UserRegisterPage = lazy(() => import("../pages/common/UserRegisterPage"));
const OtpVerficationPage = lazy(() => import("../pages/common/OtpVerificationPage"));
const ResetPasswordPage = lazy(() => import("../pages/common/ResetPasswordPage"));
const ResetPasswordConfirmPage = lazy(() => import("../pages/common/ResetPasswordConfirmPage"));
const BlockedUser = lazy(() => import("../pages/common/BlockedUserPage"));
const EmailNotVerifiedPage = lazy(() => import("../pages/common/EmailNotVerifiedPage"));
const NotFound = lazy(() => import("../pages/common/NotFound"));
const Unauthorised = lazy(() => import("../pages/common/Unauthorised"));
const PsychologistsPage = lazy(() => import("../pages/common/PsychologistsPage"));
const PsychologistDetailPage = lazy(() => import("../pages/common/PsychologistDetailPage"));

const CommonRoutes = () => (
  <>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="services" element={<Services />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="psychologists" element={<PsychologistsPage />} />
      <Route path="psychologists/:id" element={<PsychologistDetailPage />} />

      <Route element={<PublicRoute />}>
        <Route path="user/login" element={<LoginPage />} />
        <Route path="user/register" element={<UserRegisterPage />} />
        <Route path="user/psychologist-register" element={<UserRegisterPage />} />
      </Route>

      <Route path="user/verify-otp" element={<OtpVerficationPage />} />
      <Route path="user/reset-password" element={<ResetPasswordPage />} />
      <Route path="user/reset-password-confirm/:uid/:token" element={<ResetPasswordConfirmPage />} />
      <Route path="user/blocked" element={<BlockedUser />} />
      <Route path="user/verify-email" element={<EmailNotVerifiedPage />} />
    </Route>
    <Route path="/unauthorised" element={<Unauthorised />} />
    <Route path="*" element={<NotFound />} />
  </>
);

export default CommonRoutes;
