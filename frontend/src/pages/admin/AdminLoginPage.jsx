import AdminFooter from '@/components/admin/AdminFooter'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminLoginForm from '@/components/admin/AdminLoginForm'
import React from 'react'

const AdminLoginPage = () => {
  return (
    <div className='w-full min-h-screen flex flex-col'>
        <div className=''><AdminHeader/></div>
        <div className='flex-grow my-auto mt-16'><AdminLoginForm/></div>
        <div><AdminFooter/></div>
        
        
        
        
      
    </div>
  )
}

export default AdminLoginPage
