import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import LoginForm from "./LoginForm"
import Logo from "./Logo"
import { useLocation, useNavigate } from "react-router-dom"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import { useState } from "react"

export default function LoginFormCard({
  className,
  ...props
}) {



  const navigate = useNavigate()

  
  return (
    <div className={cn("flex flex-col gap-6 w-[400px] mx-auto ", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
              Login
                    
            </CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
         <LoginForm />
         <Separator className="my-3"/>
         <div className="text-center ">
          
         <Button variant="ghost" className="text-md" onClick={() => navigate(`/user/psychologist-register`)}>Are you a Psychologist, <span className="underline underline-offset-4">Join Us</span></Button>
         </div>
         
        </CardContent>
      </Card>
    </div>
  )
}

