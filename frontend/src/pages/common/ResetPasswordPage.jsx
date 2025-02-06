
import ResetPasswordCard from '@/components/common/ResetPasswordCard'
import React from 'react'

const ResetPasswordPage = () => {
  return (
   <div className="flex min-h-svh flex-col items-center justify-center bg-muted  md:p-10">
         <div className="w-full max-w-sm md:max-w-3xl">
           <ResetPasswordCard/>
         </div>
       </div>
  )
}

export default ResetPasswordPage
