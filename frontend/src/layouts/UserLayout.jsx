import { ScrollArea } from '@/components/ui/scroll-area'
import UserSidebar from '@/components/user/UserSidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const UserLayout = () => {
    return (
        <div className="flex">
          <UserSidebar className="fixed left-0 top-0 "/>
          {/* <main className="flex-1 p-6">
            <Outlet />
          </main> */}
            <ScrollArea className="flex-1 h-screen">
                  <Outlet />
            </ScrollArea>
        </div>
  )
}

export default UserLayout
