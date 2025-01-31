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

const UserRegisterFormCard = ({
    className,
    ...props
  }) => {
 return (
     <div className={cn("flex flex-col gap-6 w-[400px] mx-auto mt-12 ", className)} {...props}>
       <Card>
         <CardHeader>
           <CardTitle className="text-2xl">Sign Up</CardTitle>
           <CardDescription>
             Enter your details to create a new account
           </CardDescription>
         </CardHeader>
         <CardContent>
          <UserRegisterForm/>
         </CardContent>
       </Card>
     </div>
   )
}

export default UserRegisterFormCard
