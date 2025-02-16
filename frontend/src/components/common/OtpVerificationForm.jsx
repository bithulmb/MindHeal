import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod'
import api from '../api/api';
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from 'sonner';


const otpSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d{6}$/, "Only numbers allowed"),
  });


const OtpVerificationForm = () => {

    const navigate = useNavigate()
    const location = useLocation()
    
    const email = location.state?.email || ""

    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");
    const [resendLoading, setResendLoading] = useState(false);

    const {register,handleSubmit,formState : {errors}, reset} =useForm({
        resolver : zodResolver(otpSchema)
    })

    const onSubmit = async (data) => {
        setLoading (true)
        setServerError("")
        try {
            const response = await api.post("/api/auth/verify-otp/",{email,otp : data.otp})
            console.log(response.data.message)
            reset()
            console.log("user otp verified succesfullly")
            
            navigate("/")
            toast.success("User email verified succesfully. Please login")
        } catch (error){
            console.error("OTP Verification Error:", error.response?.data);
            setServerError(error.response?.data?.error || "OTP verification failed!");
        } finally{
            setLoading(false)
        }
    }

    const handleResendOtp = async () => {
        setResendLoading(true);
        setServerError("");
    
        try {
          await api.post("/api/auth/resend-otp/", { email });
          alert("OTP resent successfully!");
        } catch (error) {
          console.error("Resend OTP Error:", error.response?.data);
          setServerError(error.response?.data?.error || "Failed to resend OTP.");
        } finally {
          setResendLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
           
            <div className="grid gap-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input id="otp" {...register("otp")} />
              {errors.otp && <p className="text-red-500">{errors.otp.message}</p>}
            </div>
    
           
            {serverError && <p className="text-red-500">{serverError}</p>}
    
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
    
           
            <button
              type="button"
              onClick={handleResendOtp}
              className="underline underline-offset-4 text-sm text-blue-600"
              disabled={resendLoading}
            >
              {resendLoading ? "Resending OTP..." : "Resend OTP"}
            </button>
          </div>
        </form>
      );
    
}

export default OtpVerificationForm
