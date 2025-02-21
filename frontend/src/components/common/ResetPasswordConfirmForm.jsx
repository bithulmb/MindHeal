import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import api from "../api/api";
import { toast } from "sonner";

// Define schema using Zod
const resetPasswordConfirmSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPasswordConfirmForm = () => {
  const [serverError, setServerError] = useState("");
  const [message, setMessage] = useState("");

  const { uid, token } = useParams(); 
  const navigate = useNavigate();
 
  // const location = useLocation()
  // const isPsychologistLogin = location.pathname.includes("psychologist")

  // const userRole = isPsychologistLogin ? 'psychologist' : 'user'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordConfirmSchema),
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
        console.log(data.password)
        const response = await api.post(`api/auth/reset-password-confirm/${uid}/${token}/`,{password : data.password})
        setMessage(response.data.message);
      alert("password reset succesful")
      toast.success("Password reset succesful> Login with your new password")

     
     navigate(`/user/login`)
    } catch (error) {
      setMessage("Error resetting password.");
      toast.error("Password reset failed")
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            className={errors.password ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            className={errors.confirmPassword ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        {message && <p>{message}</p>}

        <Button type="submit" className="w-full">
          {isSubmitting ? "Resetting Password..." : "Reset Password"}
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordConfirmForm;
