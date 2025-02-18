import { fetchPsychologistProfile } from '@/redux/slices/psychologistProfileSlice'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet, Routes, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const PsychologistProtectedRoute = () => {

      const dispatch = useDispatch()
      const navigate = useNavigate()


      const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)  
      const role = useSelector((state) => state.auth.role)      
      const isEmailVerified = useSelector((state) => state.auth?.user?.is_email_verified)

      const profile = useSelector((state) => state.psychologistProfile.profile)

      //creating thunk to send api request to fetch psychologist profile data
      useEffect(() => {
        if (isAuthenticated && role==="Psychologist"){
          dispatch(fetchPsychologistProfile())
        }
      },[dispatch, isAuthenticated, role])

      //redirect to the Routes
      useEffect(() => {
        if (profile){
          if (profile.approval_status == "Pending"){
            navigate("/psychologist/verify-profile");
            toast.warning("Your profile has not been verified")
          } else if (profile.approval_status == "Submitted"){
            navigate("/psychologist/profile-submitted");
            toast.warning("Your Profile is Under Verification")
          } else if (profile.approval_status == "Approved"){
            navigate('psychologist/dashboard');
            toast.success("You have succesfully logged in")
          }
        }
      },[profile, navigate])
  
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
