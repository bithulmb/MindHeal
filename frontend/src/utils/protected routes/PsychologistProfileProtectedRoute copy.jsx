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
  


    const { profile, loading,error } = useSelector((state) => state.psychologistProfile)

    useEffect(() => {
        console.log('Current state:', { 
            profile, 
            loading,
            approvalStatus: profile?.approval_status,
            fullProfile: profile 
          });
      }, [profile, loading, error]);
   

    //creating thunk to send api request to fetch psychologist profile data
    useEffect(() => {
        dispatch(fetchPsychologistProfile())
    },[dispatch])

    useEffect(() => {
        if (profile && !loading) {
            console.log('Navigating with status:', profile.approval_status);
            switch (profile?.approval_status) {
                case 'Pending':
                    navigate('/psychologist/profile-submitted', { replace: true });
                    break;
                case 'Rejected':
                    navigate('/psychologist/profile-rejected', { replace: true });
                    break;
                case 'Approved':
                    console.log('User is approved, staying on current route');
                    break;
                default:
                    console.log("default")
                    navigate('/psychologist/verify-profile', { replace: true });
            }
        }
    }, [profile, loading, navigate]);

    if (loading) {
        return <LoadingPage/>; 
      }
    
    
    if (!profile && !loading) {
        console.log("no profile")
        return <Navigate to="/psychologist/verify-profile" replace />;
    }



    console.log("outlet or loadin page")
    return profile.approval_status === 'Approved' ? <Outlet /> : <LoadingPage/>;
}

export default PsychologistProfileProtectedRoute
