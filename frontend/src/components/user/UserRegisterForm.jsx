import React, { useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import api from '../api/api'

const userRegisterSchema = z.object({

  first_name : z
  .string()
  .min(2,{message : "First name should contain minimum 2 characters"})
  .regex(/^[A-Za-z]+(\s[A-Za-z]+)*$/, {message : "First name should contain only alphabets" }), 
  
  last_name: z
  .string()
  .min(2, { message: "Last name should contain minimum 2 characters" })
  .regex(/^[A-Za-z]+(\s[A-Za-z]+)*$/, { message: "Last name should contain only alphabets" }), 

  email : z
  .string()
  .email({message: "Invalid email address" }),

  mobile_number : z
  .string()
  .length(10,{message : "Mobile number must be exactly 10 digits"})
  .regex(/^\d{10}$/,{message : "Mobile number shuld contain only digits"}),

  password : z
  .string()
  .min(5, {message : "Password must be atleast 6 characters"}),

  confirm_password: z
  .string()
  .min(6, { message: "Confirm password must be at least 6 characters" }),

}).refine((data) => data.password === data.confirm_password,{
  message : "Passwords do not match",
  path : ['confirm_password'],
}
)


const UserRegisterForm = () => {

  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState("")

  const navigate = useNavigate()

  const { register, handleSubmit, formState : {errors}, reset } = useForm({
    resolver : zodResolver(userRegisterSchema)
  })

  const onSubmit = async (data) => {
    
    setLoading(true)
    setServerError("");

    const registerData = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      mobile_number: data.mobile_number,
      password: data.password,
    }
    
    try {
      
      const response = await api.post("api/auth/register/",registerData)
      console.log("Response:", response.data);
      reset(); 
      navigate("/user/verify-otp", {state : {
        email : data.email
      }})
    
    }
    catch (error) {
      
      console.error("Registration error",error.response?.data)
      setServerError(error.response?.data?.error || "Registration failed");

    }
    finally {
      setLoading(false)
    }
    
    
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6">
        
       
        <div className="flex gap-4">
          <div className="w-1/2">
            <Label htmlFor="first_name">First Name</Label>
            <Input id="first_name" {...register("first_name")} />
            {errors.first_name && <p className="text-red-500">{errors.first_name.message}</p>}
          </div>
          <div className="w-1/2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input id="last_name" {...register("last_name")} />
            {errors.last_name && <p className="text-red-500">{errors.last_name.message}</p>}
          </div>
        </div>

        
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" {...register("email")} />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        
        <div className="grid gap-2">
          <Label htmlFor="mobile_number">Mobile Number</Label>
          <Input id="mobile_number" {...register("mobile_number")} />
          {errors.mobile_number && <p className="text-red-500">{errors.mobile_number.message}</p>}
        </div>

        
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

       
        <div className="grid gap-2">
          <Label htmlFor="confirm_password">Confirm Password</Label>
          <Input id="confirm_password" type="password" {...register("confirm_password")} />
          {errors.confirm_password && <p className="text-red-500">{errors.confirm_password.message}</p>}
        </div>

       {serverError && <p className='text-red-500'>{serverError}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Registering" : "Register"}
        </Button>

      
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a onClick={() => navigate("/user/login")} className="underline underline-offset-4 cursor-pointer">
            Login
          </a>
        </div>
      </div>
    </form>
  );  
  
  //   return (
  //   <form>
  //   <div className="flex flex-col gap-6">
  //      <div className="flex gap-4">
  //     <div className="w-1/2">
  //       <Label htmlFor="firstname">First Name</Label>
  //       <Input id="firstname" type="text" required />
  //     </div>
  //     <div className="w-1/2">
  //       <Label htmlFor="lastname">Last Name</Label>
  //       <Input id="lastname" type="text"  required />
  //     </div>
  //   </div>

  //     <div className="grid gap-2">
  //       <Label htmlFor="email">Email</Label>
  //       <Input id="email" type="email"  required />
  //     </div>
  //     <div className="grid gap-2">
  //       <Label htmlFor="email">Mobile Number</Label>
  //       <Input id="mobilenum" type="text" required />
  //     </div>
  //     <div className="grid gap-2">
  //       <Label htmlFor="password1">Password</Label>
  //       <Input id="password1" type="password" required />
  //     </div>
  //     <div className="grid gap-2">
  //       <Label htmlFor="password2">Confirm Password</Label>
  //       <Input id="password2" type="password" required />
  //     </div>
  //     <Button type="submit" className="w-full">
  //       Register
  //     </Button>
  //     <div className="mt-4 text-center text-sm">
  //       Already have an account?{" "}
  //       <a onClick={() => navigate("/user/login")} className="underline underline-offset-4 cursor-pointer">
  //         Login
  //       </a>
  //     </div>
  //   </div>
  // </form>
  //   )
}

export default UserRegisterForm;
