import { useState } from 'react'
import Header from './components/common/Header'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './pages/common/Home'
import Services from './pages/common/Services'
import Psychologists from './pages/common/Psychologists'
import About from './pages/common/About'
import Contact from './pages/common/Contact'
import { ThemeProvider } from './utils/ThemeProvider'
import Footer from './components/common/Footer'
import LoginPage from './pages/common/LoginPage'
import UserRegisterPage from './pages/common/UserRegisterPage'
import ResetPasswordPage from './pages/common/ResetPasswordPage'
import { Provider } from 'react-redux'
import store from './redux/store'
import UserDashboard from './pages/user/UserDashboard'
import UserProtectedRoute from './utils/protected routes/UserProtectedRoute'
import NotFound from './components/common/NotFound'
import OtpVerficationPage from './pages/common/OtpVerificationPage'
import { GoogleOAuthProvider } from '@react-oauth/google'


const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

 

function App() {

 
  return (
    <>
    <Provider store={store}>
      <ThemeProvider  defaultTheme="dark" storageKey="vite-ui-theme">
        <GoogleOAuthProvider clientId={clientId}>
        <BrowserRouter>
        <div className="flex flex-col min-h-screen"> 
          <Header/>

          <main className="flex-grow pt-16"> 
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/services" element={<Services/>}/>
            <Route path="/psychologists" element={<Psychologists/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/user/login"  element={<LoginPage/>}/>
            <Route path="/user/register"  element={<UserRegisterPage/>}/>
            <Route path="/user/reset-password"  element={<ResetPasswordPage/>}/>
            <Route path="/user/verify-otp"  element={<OtpVerficationPage/>}/>
            
            <Route element={<UserProtectedRoute/>}>
                <Route path="/user/dashboard"  element={<UserDashboard/>}/>
            </Route>

            <Route path = "*" element={<NotFound/>}/>

            
          </Routes>
          </main>
          <Footer/>
          </div>
        </BrowserRouter>
        </GoogleOAuthProvider>
      </ThemeProvider>
      </Provider>
      
    </>

  )
}

export default App
      