import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './utils/ThemeProvider';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import store from './redux/store';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/common/Home';
import Services from './pages/common/Services';
import Psychologists from './pages/common/Psychologists';
import About from './pages/common/About';
import Contact from './pages/common/Contact';
import LoginPage from './pages/common/LoginPage';
import UserRegisterPage from './pages/common/UserRegisterPage';
import ResetPasswordPage from './pages/common/ResetPasswordPage';
import UserDashboard from './pages/user/UserDashboard';
import UserProtectedRoute from './utils/protected routes/UserProtectedRoute';
import NotFound from './components/common/NotFound';
import OtpVerficationPage from './pages/common/OtpVerificationPage';
import ResetPasswordConfirmPage from './pages/common/ResetPasswordConfirmPage';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import PsychologistDashboard from './pages/psychologist/PsychologistDashboard';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <GoogleOAuthProvider clientId={clientId}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout/>}>
                {/* Common Routes */}
                <Route index element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/psychologists" element={<Psychologists />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* User Routes */}
                <Route path="/user/login" element={<LoginPage />} />
                <Route path="/user/register" element={<UserRegisterPage />} />
                <Route path="/user/verify-otp" element={<OtpVerficationPage />} />
                <Route path="/user/reset-password" element={<ResetPasswordPage />} />
                <Route path="/user/reset-password-confirm/:uid/:token" element={<ResetPasswordConfirmPage />} />
                
                <Route element={<UserProtectedRoute />}>
                  <Route path="/user/dashboard" element={<UserDashboard />} />
                </Route>

                {/* Psychologist Routes */}
                <Route path="/psychologist/login" element={<LoginPage />} />
                <Route path="/psychologist/register" element={<UserRegisterPage />} />
                <Route path="/psychologist/verify-otp" element={<OtpVerficationPage />} />
                <Route path="/psychologist/reset-password" element={<ResetPasswordPage />} />
                <Route path="/psychologist/reset-password-confirm/:uid/:token" element={<ResetPasswordConfirmPage />} />


                <Route path="/psychologist/dashboard" element={<PsychologistDashboard/>} />
              </Route>


              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout/>}>
                <Route path="login" element={<LoginPage />} /> {/* /admin/login */}
                
              </Route>

              

              {/* Not Found Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
           
          </BrowserRouter>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;