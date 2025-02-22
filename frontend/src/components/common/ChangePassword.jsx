
import React from 'react';
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



const ChangePasswordSchema = z.object({
  old_password: z.string().min(1, { message: "Old password is required" }),
  new_password: z.string().min(6, { message: "New password must be at least 6 characters" }),
  confirm_password: z.string().min(1, { message: "Please confirm your password" })
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

const ChangePassword = () => {
  

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
     
      const response = await api.put("/api/auth/change-password/",{
        old_password : data.old_password,
        new_password : data.new_password,
      })


     toast.success("Password updated succesfully")
     console.log(response.data)
      reset();
    } catch (error) {
      toast.error("Password change failed")
      console.log(error.response?.data?.detail || "Password change failed",)
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

          <Button type="submit" className="w-full">
            Change Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;


