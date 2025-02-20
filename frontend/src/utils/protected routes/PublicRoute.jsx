import React from 'react'
import { Outlet } from 'react-router-dom'

const PublicRoute = () => {
 
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

    if (!isAuthenticated){
        return <Navigate to='/' />
    }

    return <Outlet/>

  
}

export default PublicRoute
