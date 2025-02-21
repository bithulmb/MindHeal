import PsychologistProfileForm from '@/components/psychologist/PsychologistProfileForm'
import EmailNotVerifiedPage from '@/pages/common/EmailNotVerifiedPage'
import { fetchPsychologistProfile } from '@/redux/slices/psychologistProfileSlice'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet, Routes, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const PsychologistProtectedRoute = () => {

     
      const navigate = useNavigate()


      const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)  
      const role = useSelector((state) => state.auth.role)      
      const isEmailVerified = useSelector((state) => state.auth?.user?.is_email_verified)
     
      if (!isAuthenticated){
        return <Navigate to="/user/login" replace/>
      }
  
      if (role !== "Psychologist"){
        return <Navigate to='/unauthorised' replace/>
      }
      
      if (!isEmailVerified){
        return <Navigate to='/user/verify-email' replace/>
        
      }

     
      return <Outlet/>
  
}

export default PsychologistProtectedRoute
