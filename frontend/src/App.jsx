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

 

function App() {

 
  return (
    <>
    <Provider store={store}>
      <ThemeProvider  defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Header/>
          
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/services" element={<Services/>}/>
            <Route path="/psychologists" element={<Psychologists/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/user/login"  element={<LoginPage/>}/>
            <Route path="/user/register"  element={<UserRegisterPage/>}/>
            <Route path="/user/reset-password"  element={<ResetPasswordPage/>}/>
          </Routes>
          <Footer/>
        </BrowserRouter>
      </ThemeProvider>
      </Provider>
      
    </>

  )
}

export default App
      