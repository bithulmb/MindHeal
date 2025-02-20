import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthProtectedRoute = () => {
 
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

    if (!isAuthenticated){
        return <Navigate to='user/login' />
    }

    return <Outlet/>

  
}

export default AuthProtectedRoute
