import UserRegisterForm from '@/components/user/UserRegisterForm'
import UserRegisterFormCard from '@/components/user/UserRegisterFormCard'
import React from 'react'

const UserRegisterPage = () => {
 return (
     <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
       <div className="w-full max-w-sm md:max-w-3xl">
         <UserRegisterFormCard/>
       </div>
     </div>
  )
}

export default UserRegisterPage
