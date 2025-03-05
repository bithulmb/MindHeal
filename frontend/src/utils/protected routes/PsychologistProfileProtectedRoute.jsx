import LoadingPage from '@/components/common/LoadingPage'
import { fetchPsychologistProfile } from '@/redux/slices/psychologistProfileSlice'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'



const PsychologistProfileProtectedRoute = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.psychologistProfile);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  
    const role = useSelector((state) => state.auth?.role)

  useEffect(() => {
    if (isAuthenticated && role==="Psychologist"){
    dispatch(fetchPsychologistProfile())
      .then(() => {
        setInitialLoadDone(true);
      })
      .catch(() => {
        setInitialLoadDone(true); 
      });
    }
  }, [dispatch]);

 //show loading  page while loading or in initial state
  if (!initialLoadDone || loading) {
    return <LoadingPage />;
  }

  // if no profile exists after fetching, redirect to verify profile page
  if (!profile) {
    return <Navigate to="/psychologist/verify-profile" replace />;
  }

  //if profile exists redirect based on approval status choice
  switch (profile.approval_status) {
    case 'Approved':
      return <Outlet />; 
    case 'Pending':
      return <Navigate to="/psychologist/profile-submitted" replace />;
    case 'Rejected':
      return <Navigate to="/psychologist/profile-rejected" replace />;
    default:
      return <Navigate to="/psychologist/verify-profile" replace />;
  }
};
export default PsychologistProfileProtectedRoute
