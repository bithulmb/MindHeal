import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const PsychologistProtectedRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  
      const role = useSelector((state) => state.auth.role)
  
      if (!isAuthenticated){
        return <Navigate to="/psychologist/login" replace/>
      }
  
      if (role !== "Psychologist"){
        return <Navigate to='/unauthorised' replace/>
      }
     
      return <Outlet/>
  
}

export default PsychologistProtectedRoute
