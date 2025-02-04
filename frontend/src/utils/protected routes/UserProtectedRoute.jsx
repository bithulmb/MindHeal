import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const UserProtectedRoute = () => {
    
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)


  return isAuthenticated ? <Outlet/> : <Navigate to="/user/login" replace />
}

export default UserProtectedRoute
