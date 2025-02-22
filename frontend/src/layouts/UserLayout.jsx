import UserSidebar from '@/components/user/UserSidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const UserLayout = () => {
    return (
        <div className="flex">
          <UserSidebar/>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
  )
}

export default UserLayout
