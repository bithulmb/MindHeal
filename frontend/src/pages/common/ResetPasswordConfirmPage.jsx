import ResetPasswordConfirmCard from '@/components/common/ResetPasswordConfirmCard'
import React from 'react'

const ResetPasswordConfirmPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted  md:p-10">
    <div className="w-full max-w-sm md:max-w-3xl">
      <ResetPasswordConfirmCard/>
    </div>
  </div>
  )
}

export default ResetPasswordConfirmPage
