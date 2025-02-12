
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver} from '@hookform/resolvers/zod'
import { useDispatch } from "react-redux";
import axios from "axios";
import api from "../api/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants/constants";
import { loginSuccess } from "@/redux/slices/authSlice";
import { GoogleLogin } from "@react-oauth/google";

  //defining form schema using zod
  const schema = z.object({
    email : z.string().email("Invalid email address"),
    password : z.string().min(6,"Password must be atleast 6 characters"),
  })


const LoginForm = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  

  const [serverError,setServerError] = useState("")

  const isPsychologistLogin = location.pathname.includes("psychologist")

  const userRole = isPsychologistLogin ? 'psychologist' : 'user'
   
   //initialising the form using useForm hook from react hook form
   const { register, control, handleSubmit, formState : {errors},} = useForm({
    resolver : zodResolver(schema)
  }) 

  const onSubmit = async (data) => {

    
    try{
      
      const response = await api.post("/api/auth/login/", data)

      if (response.status === 200){
        
        const {access,role} = response.data
        
        
        //checking if the user role is correct in url and response
        if ((isPsychologistLogin && role !== "Psychologist") || (!isPsychologistLogin && role !== "Patient")) {
          alert("Not authorised")
          setServerError("Invalid role for this login page. Please use the correct login portal.");
          return;
        }

        localStorage.setItem(ACCESS_TOKEN,response.data.access)
        dispatch(loginSuccess({
          token : access,
          role,
          }))

        
        
        let dashboardRoute = response.data.role === "Psychologist" ? '/psychologist/dashboard' : '/user/dashboard';
        
        navigate(`/${userRole}/dashboard`)
        console.log("login succesful")

      }

    }
    catch(error){
      console.log("login failed", error)
      if (error.response){
        setServerError(error.response.data.detail || "Invalid credentials")
      }
      else {
        setServerError("Something went wrong. Please try again.")
      }
    }
  } 
  
  //for implementing google authentication
  const handleSuccess = async (response) => {

      console.log("Google Login Success:", response);

      try{
        console.log("Credential received:", response.credential);  

        if (!response.credential) {
            console.error("Google token is missing!");
            return;
        }

        const res = await api.post('/api/auth/google/',{token: response.credential})
        
        console.log("Backend Response:", res.data);
      

      if (res.data.access_token) {
        localStorage.setItem(ACCESS_TOKEN,res.data.access_token)
        dispatch(loginSuccess({
          token : res.data.access_token, 
          role : res.data.role
        }
      )
    )
    let dashboardRoute = res.data.role === "Psychologist" ? '/psychologist/dashboard' : '/user/dashboard';
    navigate(dashboardRoute)
    console.log("google login succesful")

    }
    } catch (error) {
      console.error("Error during Google authentication:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
    }
  }
    
  };

  const handleFailure = (error) => {
      console.log("Google Login Failed:", error);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
                {serverError && (
              <p className="text-sm text-red-500 text-center">{serverError}</p>
            )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                {/* <Input
                 
                  {...register("email")}
                /> */}
                <Controller
                name="email"
                control={control}
                render={({field}) => <Input {...field}/> }
                />
                { errors.email && <p className="text-sm text-red-500 ">{errors.email.message}</p>}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <span
                    onClick={() => navigate(`/${userRole}/reset-password`)}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline cursor-pointer"
                  >
                    Forgot your password?
                  </span>
                </div>
                {/* <Input type="password" {...register("password")} /> */}
                 <Controller
                    name="password"
                    control={control}
                    render={({ field }) => <Input {...field} type="password"/>}
                  />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
              <div>
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="text-center">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or Continue
                </span>
              </div>
              {/* <Button variant="outline" className="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>Login with Google
              </Button> */}
              <GoogleLogin logo_alignment="center"  onSuccess={handleSuccess} onError={handleFailure} />
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a onClick={() => navigate(`/${userRole}/register`)} className="underline underline-offset-4 cursor-pointer">
                Sign up
              </a>
            </div>
          </form>
  );
};

export default LoginForm;
