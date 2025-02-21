import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthProtectedRoute = ({ children}) => {
 
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

    if (!isAuthenticated){
        return <Navigate to='user/login' />
    }

    return children

  
}

export default AuthProtectedRoute
