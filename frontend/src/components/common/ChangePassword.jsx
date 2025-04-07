
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { resetPatientProfile } from '@/redux/slices/patientProfileSlice';
import { resetPsychologistProfile } from '@/redux/slices/psychologistProfileSlice';



const ChangePasswordSchema = z.object({
  old_password: z.string().min(1, { message: "Old password is required" }),
  new_password: z.string().min(6, { message: "New password must be at least 6 characters" }),
  confirm_password: z.string().min(1, { message: "Please confirm your password" })
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

const ChangePassword = () => {
  
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setError(null)
      const response = await api.put("/api/auth/change-password/",{
        old_password : data.old_password,
        new_password : data.new_password,
      })
      if (response.status === 200){
        toast.success("Password updated succesfully. Please login again")
        localStorage.clear()
        dispatch(logout())
        dispatch(resetPatientProfile())
        dispatch(resetPsychologistProfile())

        navigate('/user/login')
      
      }
    
    } catch (error) {
      
      if (error.response?.data?.old_password[0] === "Old Password is not correct"){
        toast.error("Old Password is not correct")
        setError("Old Password is not correct")
      } else {
        toast.error("Password change failed")
        setError("Password change failed. Try again")
      }
      console.log(error.response?.data || "Password change failed",)
    }
  };

  return (
    <Card className="max-w-lg mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-2xl">Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          
          <div>
         
            <Label htmlFor="old_password">Old Password</Label>
            <Input
              id="old_password"
              type="password"
              placeholder="Enter old password"
              {...register("old_password")}
            />
            {errors.old_password && (
              <p className="text-red-500 text-sm">{errors.old_password.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="new_password">New Password</Label>
            <Input
              id="new_password"
              type="password"
              placeholder="Enter new password"
              {...register("new_password")}
            />
            {errors.new_password && (
              <p className="text-red-500 text-sm">{errors.new_password.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirm_password">Confirm New Password</Label>
            <Input
              id="confirm_password"
              type="password"
              placeholder="Confirm new password"
              {...register("confirm_password")}
            />
            {errors.confirm_password && (
              <p className="text-red-500 text-sm">{errors.confirm_password.message}</p>
            )}
          </div>
          {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          <Button type="submit" className="w-full">
            Change Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;


