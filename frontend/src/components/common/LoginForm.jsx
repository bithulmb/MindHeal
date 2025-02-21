
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver} from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import api from "../api/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants/constants";
import { loginSuccess } from "@/redux/slices/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import Swal from "sweetalert2";

  //zod form schema
  const schema = z.object({
    email : z.string().email("Invalid email address"),
    password : z.string().min(6,"Password must be atleast 6 characters"),
  })


const LoginForm = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()



  // const location = useLocation()
  
  const [loading, setLoading] = useState(false)
  const [serverError,setServerError] = useState("")

  // const isPsychologistLogin = location.pathname.includes("psychologist")

  // const userRole = isPsychologistLogin ? 'psychologist' : 'user'
   
   //initialising the form using useForm hook from react hook form
   const { register, control, handleSubmit, formState : {errors},} = useForm({
    resolver : zodResolver(schema)
  }) 

  const onSubmit = async (data) => {

    setLoading(true)
    setServerError(" ")
    
    try{
      
      const response = await api.post("/api/auth/login/", data)

      if (response.status === 200){ 
        
        const {access,refresh, role} = response.data
        
        
        //checking if the user role is correct in url and response
        // if ((isPsychologistLogin && role !== "Psychologist") || (!isPsychologistLogin && role !== "Patient")) {
        //   Swal.fire({
        //     title: 'Error!',
        //     text: 'You are not authorised',
        //     icon: 'error',
        //     confirmButtonColor: '#dc3545',
           
            
        //   })
          
        //   toast.warning("You are having invalid role")

        //   setServerError("Invalid role for this login page. Please use the correct login portal.");
        //   return;
        // }

       
       

        // if(user.is_blocked){
        //   navigate(`/${userRole}/blocked`)
          
        //   console.log("account is blocked")
        //   return
        // }
        const user = jwtDecode(access)

        localStorage.setItem(ACCESS_TOKEN,response.data.access)
        localStorage.setItem(REFRESH_TOKEN,refresh)
        dispatch(loginSuccess({
          token : access,
          role,
          }))

        if(!user.is_email_verified){
          Swal.fire({
            title:"Email Not Verified",
            text :"Verify your email",
            icon: 'error',
            iconColor: '#dc35', // Red color
            confirmButtonColor: '#dc3545'

          })
            navigate(`/verify-email`)
            toast.error("Email not verified")
            console.log("email not verified")
            return
          }
        
        const userRole = role==="Psychologist" ? "psychologist" : "user"
        
        navigate(`/${userRole}/dashboard`)
        toast.success("You have succesfully logged in")
        console.log("login succesful")

      }

    }
    catch(error){
      console.log("login failed", error)
      
      if (error.response){
        Swal.fire({
                title: 'Error!',
                text: 'Invalid credentials',
                icon: 'error',
                iconColor: '#dc35', // Red color
                confirmButtonColor: '#dc3545'
              });
              toast.error("Your credentails does not match")
        setServerError(error.response.data.detail || "Invalid credentials")
      }
      else {
        setServerError("Something went wrong. Please try again.")
        toast.error("Login failed. Please Try again")
      }
    }  finally {
      setLoading(false)
    }
    
  } 
  
  //for implementing google authentication
  const handleSuccess = async (response) => {

      

      try{
       

        if (!response.credential) {
            console.error("Google token is missing!");
            return;
        }

        const res = await api.post('/api/auth/google/',{token: response.credential})
        
        if (res.data){
          const {access, refresh, role} = res.data
          console.log(access, role)
          // if ((isPsychologistLogin && role !== "Psychologist") || (!isPsychologistLogin && role !== "Patient")) {
          //   toast.warning("You are having inavlid role")
          //   setServerError("Invalid role for this login page. Please use the correct login portal.");
          //   return;
          // }

          localStorage.setItem(ACCESS_TOKEN,access)
          localStorage.setItem(REFRESH_TOKEN,refresh)
          dispatch(loginSuccess({
            token : access, 
            role : role
          }
        )
      )

      let dashboardRoute = res.data.role === "Psychologist" ? '/psychologist/dashboard' : '/user/dashboard';
      
      navigate(dashboardRoute)
      toast.success("login succesful")
      console.log("google login succesful")
    }
        
    } catch (error) {
      toast.error("Login failed. Try again")
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
                    onClick={() => navigate(`/user/reset-password`)}
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
              {loading ? "Logging in" : "Login"}
              </Button>
              <div className="text-center">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or Continue
                </span>
              </div>
              <GoogleLogin logo_alignment="center"  onSuccess={handleSuccess} onError={handleFailure} />
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a onClick={() => navigate(`/user/register`)} className="underline underline-offset-4 cursor-pointer">
                Sign up
              </a>
            </div>
          </form>
  );
};

export default LoginForm;
