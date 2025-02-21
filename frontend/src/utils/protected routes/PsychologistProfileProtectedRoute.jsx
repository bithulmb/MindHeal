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

 
    const [initialLoadDone, setInitialLoadDone] = useState(false);
  
    // Fetch profile once on mount
    useEffect(() => {
      dispatch(fetchPsychologistProfile())
        .then(() => setInitialLoadDone(true));
    }, [dispatch]);
  
    // Handle navigation after profile is loaded
    useEffect(() => {
      if (profile && !loading && initialLoadDone) {
        switch (profile.approval_status) {
          case 'Pending':
            navigate('/psychologist/profile-submitted', { replace: true });
            break;
          case 'Rejected':
            navigate('/psychologist/profile-rejected', { replace: true });
            break;
          case 'Approved':
            // Stay on current route
            break;
          default:
            navigate('/psychologist/verify-profile', { replace: true });
        }
      }
    }, [profile, loading, navigate, initialLoadDone]);
  
    // Show loading state during initial load
    if (loading || !initialLoadDone) {
      return <LoadingPage />;
    }
  
    // After initial load, handle no profile case
    if (!profile) {
      return <Navigate to="/psychologist/verify-profile" replace />;
    }
  
    // Render outlet for approved profiles
    return profile.approval_status === 'Approved' ? <Outlet /> : <LoadingPage />;
}

export default PsychologistProfileProtectedRoute
