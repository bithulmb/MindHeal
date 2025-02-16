import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const PsychologistProtectedRoute = () => {

      const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  
      const role = useSelector((state) => state.auth.role)
      
      const isEmailVerified = useSelector((state) => state.auth?.user?.is_email_verified)
  
      if (!isAuthenticated){
        return <Navigate to="/psychologist/login" replace/>
      }
  
      if (role !== "Psychologist"){
        return <Navigate to='/unauthorised' replace/>
      }
      
      if (!isEmailVerified){
        return <Navigate to='/psychologist/verify-email' replace/>
      }
         
     
      return <Outlet/>
  
}

export default PsychologistProtectedRoute
