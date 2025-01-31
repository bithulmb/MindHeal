import React from 'react'
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ResetPasswordForm from './ResetPassword'


const ResetPasswordCard = ({
    className,
    ...props
  }) => {
 return (
     <div className={cn("flex flex-col gap-6 w-[400px] mx-auto mt-12 ", className)} {...props}>
       <Card>
         <CardHeader>
           <CardTitle className="text-2xl">Forgot Password?</CardTitle>
           <CardDescription>
             Enter your email below to reset your password
           </CardDescription>
         </CardHeader>
         <CardContent>
          <ResetPasswordForm/>
         </CardContent>
       </Card>
     </div>
   )
}

export default ResetPasswordCard
