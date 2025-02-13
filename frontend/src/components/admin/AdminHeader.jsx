import React from 'react'
import Logo from '../common/Logo'
import { ModeToggle } from '@/utils/ModeToggle'
import { SidebarTrigger } from '../ui/sidebar'

const AdminHeader = () => {
  return (
        <header className="p-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex items-center justify-between">
                <div  className="container flex items-center justify-between space-x-2">
                    
                
                    <div className="text-xl col-span-2 font-semibold"></div>
                    <div className="text-xl col-span-4 font-semibold"><Logo/></div>
                    <div className="text-xl col-span-2 font-semibold"><ModeToggle/></div>
                </div>
            </div>
        </header>
  )
}

export default AdminHeader
