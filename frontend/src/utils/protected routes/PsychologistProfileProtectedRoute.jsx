import LoadingPage from '@/components/common/LoadingPage'
import PsychologistProfileForm from '@/components/psychologist/PsychologistProfileForm'
import EmailNotVerifiedPage from '@/pages/common/EmailNotVerifiedPage'
import { fetchPsychologistProfile } from '@/redux/slices/psychologistProfileSlice'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet, Routes, useNavigate } from 'react-router-dom'



const PsychologistProfileProtectedRoute = () => {   

    const dispatch = useDispatch()
    const navigate = useNavigate()
  


    const { profile, loading } = useSelector((state) => state.psychologistProfile)
   

    //creating thunk to send api request to fetch psychologist profile data
    useEffect(() => {
        dispatch(fetchPsychologistProfile())
    },[dispatch,])

    useEffect(() => {
        if (profile && !loading) {
            switch (profile?.approval_status) {
                case 'Pending':
                    navigate('/psychologist/profile-submitted', { replace: true });
                    break;
                case 'Rejected':
                    navigate('/psychologist/profile-rejected', { replace: true });
                    break;
                case 'Approved':
                   
                    break;
                default:
                    
                    navigate('/psychologist/verify-profile', { replace: true });
            }
        }
    }, [profile, loading, navigate]);

    if (loading) {
        return <LoadingPage/>; 
      }
    
    
    if (!profile) {
        return <Navigate to="/psychologist/verify-profile" replace />;
    }



   
    return profile.approval_status === 'Approved' ? <Outlet /> : <LoadingPage/>;
}

export default PsychologistProfileProtectedRoute
