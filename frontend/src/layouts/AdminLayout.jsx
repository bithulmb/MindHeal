import AdminFooter from '@/components/admin/AdminFooter'
import AdminHeader from '@/components/admin/AdminHeader'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { AppSidebar } from '@/components/admin/AppSidebar'
import { Sidebar, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from 'sonner'

const AdminLayout = () => {
 

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          {/* Header */}
          <div className="w-full flex">
            <div><SidebarTrigger /></div>
            <div className='w-full'> <AdminHeader /></div>
            
           
          </div>

          {/* Page Content */}
          <div className="flex-1 p-6 w-full overflow-auto">
            <Outlet />
            
          </div>

          {/* Footer */}
          <div className="w-full">
            <Toaster/>
            <AdminFooter />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );

}

export default AdminLayout
