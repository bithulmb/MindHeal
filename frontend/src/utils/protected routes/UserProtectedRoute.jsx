import { fetchPatientProfile } from '@/redux/slices/patientProfileSlice'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const UserProtectedRoute = () => {

  // const dispatch = useDispatch()
  console.log("inside")

 
 
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

    const role = useSelector((state) => state.auth?.role)

    const isEmailVerified = useSelector((state) => state.auth?.user?.is_email_verified)

    // useEffect(() => {
    //   if (isAuthenticated && role==="Patient"){
    //   dispatch(fetchPatientProfile());
    //   }
    // }, [dispatch]);
      

    if (!isAuthenticated){
      return <Navigate to="/user/login" replace/>
    }

    if (role !== "Patient"){
      return <Navigate to='/unauthorised' replace/>
    }

    if (!isEmailVerified){
      return <Navigate to='/user/verify-email' replace/>
    }
   console.log("outlet")
    return <Outlet/>

 
}

export default UserProtectedRoute
