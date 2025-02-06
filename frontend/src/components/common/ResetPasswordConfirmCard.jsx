import React from 'react'
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ResetPasswordConfirmForm from './ResetPasswordConfirmForm'


const ResetPasswordConfirmCard = ({
    className,
    ...props
  }) => {
 return (
     <div className={cn("flex flex-col gap-6 w-[400px] mx-auto", className)} {...props}>
       <Card>
         <CardHeader>
           <CardTitle className="text-2xl">Reset Password?</CardTitle>
           <CardDescription>
            Enter the new password
           </CardDescription>
         </CardHeader>
         <CardContent>
          <ResetPasswordConfirmForm/>
         </CardContent>
       </Card>
     </div>
   )
}

export default ResetPasswordConfirmCard
