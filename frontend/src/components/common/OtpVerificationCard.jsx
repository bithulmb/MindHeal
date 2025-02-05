import React from 'react'
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import OtpVerificationForm from './OtpVerificationForm'



const OtpVerficationCard = ({
    className,
    ...props
  }) => {
 return (
     <div className={cn("flex flex-col gap-6 w-[400px] mx-auto mt-12 ", className)} {...props}>
       <Card>
         <CardHeader>
           <CardTitle className="text-2xl">Verify OTP?</CardTitle>
           <CardDescription>
             Enter the OTP recieved in your email.
           </CardDescription>
         </CardHeader>
         <CardContent>
          <OtpVerificationForm/>
         </CardContent>
       </Card>
     </div>
   )
}

export default OtpVerficationCard
