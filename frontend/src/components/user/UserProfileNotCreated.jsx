import React from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const UserProfileNotCreated = () => {
    const navigate = useNavigate()
  return (
    <div>
        <div className="text-center mt-10">
            <h1 className='text-4xl font-bold my-4'>Profile Not Created</h1>
            <p> Your Profile has not been created. create one now</p>
            <Button onClick={() => navigate("/user/profile/create")} className="my-3">Create</Button>
        </div>
    
    </div>
  )
}

export default UserProfileNotCreated
