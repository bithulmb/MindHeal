import React from 'react'
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import UserRegisterForm from './UserRegisterForm'
import { useLocation, useNavigate } from 'react-router-dom'
import { Separator } from '../ui/separator'

const UserRegisterFormCard = ({
    className,
    ...props
  }) => {
    const location = useLocation()
    const navigate = useNavigate()

    const isPsychologistLogin = location.pathname.includes("/psychologist-register")

 return (
     <div className={cn("flex flex-col gap-6 w-[400px] mx-auto ", className)} {...props}>
       <Card>
         <CardHeader>
           <CardTitle className="text-2xl">Sign Up as {isPsychologistLogin ? "Psychologist" : "User"}</CardTitle>
           <CardDescription>
             Enter your details to create a new account
           </CardDescription>
         </CardHeader>
         <CardContent>
          <UserRegisterForm/>
          <Separator className="my-3"/>
          {!isPsychologistLogin ? (
            
            <div className="mt-4 text-center text-md">
            Are you a Pyschologist, 
             <a onClick={() => navigate(`/user/psychologist-register`)} className="mx-2 underline underline-offset-4 cursor-pointer">
               Join Us
             </a>
           </div>
          ) : " "}
         </CardContent>
       </Card>
     </div>
   )
}

export default UserRegisterFormCard
