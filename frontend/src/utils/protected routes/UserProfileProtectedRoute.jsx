import LoadingPage from '@/components/common/LoadingPage';
import UserProfileNotCreated from '@/components/user/UserProfileNotCreated';
import { fetchPatientProfile } from '@/redux/slices/patientProfileSlice';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet, useSearchParams } from 'react-router-dom';

const UserProfileProtectedRoute = () => {
    const dispatch = useDispatch();
    const {profile,loading} = useSelector((state)=> state.patientProfile)
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
    const role = useSelector((state) => state.auth?.role)
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    useEffect(() => {
          console.log("user despatching")
          if (isAuthenticated && role==="Patient"){
          dispatch(fetchPatientProfile())
          .then(() => {
            setInitialLoadDone(true);
          })
          .catch(() => {
            setInitialLoadDone(true); 
          });
          }
        }, [dispatch]);

    if (!initialLoadDone || loading) {
            return <LoadingPage />;
       }
    
    if (!profile){
    //    return <Navigate to="/user/create-profile" replace />
            return <UserProfileNotCreated/>
    }

    return <Outlet/>

}

export default UserProfileProtectedRoute
