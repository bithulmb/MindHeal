
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/api';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from 'react-hook-form';


const resetPasswordSchema = z.object({
  email: z
  .string()
  .min(1, "Email is required")
  .email('Please enter a valid email address')
});

const ResetPasswordForm = () => {
  const [serverError,setServerError] = useState("")
  const [message, setMessage] = useState("");
  
  // const location = useLocation()
  // const isPsychologistLogin = location.pathname.includes("psychologist")

  // const userRole = isPsychologistLogin ? 'psychologist' : 'user'
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(resetPasswordSchema)
  });

  const navigate = useNavigate()
  
  const onSubmit = async (data) => {
    setServerError("")
    try{
        
        const response = await api.post("/api/auth/reset-password/",data)
        setMessage(response.data.message);
        console.log("email sent")
        navigate("")

    }
    catch (error){
      setMessage("Error sending password reset email.");
      console.log(error)
    }
  }

 
    return (
      <form onSubmit={handleSubmit(onSubmit) }>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email"  {...register("email")}  className={errors.email ? "border-red-500" : ""} disabled={isSubmitting}/>
            
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        
          </div>
          {message && <p>{message}</p>}
          <Button type="submit" className="w-full">
          {isSubmitting ? "Sending Reset Link..." : "Reset Password"}
          </Button>
          <div className="mt-4 text-center text-sm">
            Remembered your password?{" "}
            <span onClick={() => navigate(`/user/login`)} className="underline underline-offset-4 cursor-pointer">
              Login
            </span>
          </div>
        </div>
      </form>
    );
  };

  export default ResetPasswordForm;
  