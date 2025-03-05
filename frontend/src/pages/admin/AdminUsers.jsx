import UserListTable from '@/components/admin/UserListTable'
import React from 'react'

const AdminUsers = () => {
  return (
    <div>
      <h3 className='text-2xl  font-bold mb-3'>Manage Users</h3>
      <div className="">
      <UserListTable/>
      </div>
      
    </div>
  )
}

export default AdminUsers
