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
import OtpVerficationPage from './pages/common/OtpVerificationPage';
import ResetPasswordConfirmPage from './pages/common/ResetPasswordConfirmPage';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import PsychologistDashboard from './pages/psychologist/PsychologistDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPsychologists from './pages/admin/AdminPsychologists';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import NotFound from './pages/common/NotFound';
import Unauthorised from './pages/common/Unauthorised';
import PsychologistProtectedRoute from './utils/protected routes/PsychologistProtectedRoute';
import AdminProtectedRoute from './utils/protected routes/AdminProtectedRoute';
import BlockedUser from './pages/common/BlockedUserPage';
import EmailNotVerifiedPage from './pages/common/EmailNotVerifiedPage';
import PsychologistProfileForm from './components/psychologist/PsychologistProfileForm';
import PsychologistLayout from './layouts/PsychologistLayout';
import PsychologistProfileSubmitted from './components/psychologist/PsychologistProfileSubmitted';
import { Toaster } from 'sonner';
import AdminApproveRequestPage from './pages/admin/AdminApproveRequestPage';
import AdminApproveRejectCard from './components/admin/AdminApproveRejectCard';
import PsychologistProfileRejected from './components/psychologist/PsychologistProfileRejected';


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
                <Route path="/user/blocked" element={<BlockedUser/>} />
                
                <Route path="/user/verify-email" element={<EmailNotVerifiedPage/>} />

                <Route element={<UserProtectedRoute />}>
                  
                  <Route path="/user/dashboard" element={<UserDashboard />} />
                </Route>

                {/* Psychologist Routes */}
                <Route path="/psychologist/login" element={<LoginPage />} />
                <Route path="/psychologist/register" element={<UserRegisterPage />} />
                <Route path="/psychologist/verify-otp" element={<OtpVerficationPage />} />
                <Route path="/psychologist/reset-password" element={<ResetPasswordPage />} />
                <Route path="/psychologist/reset-password-confirm/:uid/:token" element={<ResetPasswordConfirmPage />} />
                <Route path="/psychologist/blocked" element={<BlockedUser/>} />
                <Route path="/psychologist/verify-email" element={<EmailNotVerifiedPage/>} />
                
                <Route element={<PsychologistProtectedRoute/>}>

                    
                    <Route path="/psychologist/verify-profile" element={<PsychologistProfileForm/>} />
                    <Route path="/psychologist/profile-submitted" element={<PsychologistProfileSubmitted/>} />
                    <Route path="/psychologist/profile-rejected" element={<PsychologistProfileRejected/>} />
                  
                  <Route path='/psychologist' element={<PsychologistLayout/>} >
                    <Route path="dashboard" element={<PsychologistDashboard/>} />
            
                  </Route>
                </Route>
                
              </Route>


              {/* Admin Routes */}
              <Route path='/admin/login/' element={<AdminLoginPage/>}/>
              <Route path="/admin" element={<AdminLayout/>}>
                
                <Route element={<AdminProtectedRoute/>}>
                  <Route path='dashboard/' element={<AdminDashboard/>} />
                  <Route path='users/' element={<AdminUsers/>} />
                  <Route path='psychologists/' element={<AdminPsychologists/>} />
                  <Route path='approvals/' element={<AdminApproveRequestPage/>} /> 
                  <Route path='approvals/:id/' element={<AdminApproveRejectCard/>} />     

                  
                </Route>
             
              </Route>

              

              {/* Not Found Route */}
              <Route path="/unauthorised" element={<Unauthorised/>} />        
              <Route path="*" element={<NotFound/>} />
            </Routes>
           
          </BrowserRouter>
          <Toaster/>
          
        </GoogleOAuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;