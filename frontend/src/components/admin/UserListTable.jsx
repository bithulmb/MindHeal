import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from '../ui/button'
import api from '../api/api'
import { format } from 'date-fns'
  

const UserListTable = () => {
  
  const [users, setUsers] = useState([])
  useEffect( () => {
   
    api.get("/api/admin/users/")
    .then((response) => {
      setUsers(response.data)
      console.log(users)
    })
    .catch((error) => {
      console.error("error fetching users", error)
    })
      
  },[])

  const blockUser = async (userId, isBlocked) => {
    try{
      const response = await api.patch(`api/admin/users/${userId}`,{
        is_blocked : !isBlocked
      })

      if (response.status == 200){
        setUsers(users.map(user => 
          user.id === userId 
          ? {...user, is_blocked:!isBlocked}
          : user 
        ))
      }
      
    } catch (error){
      console.error("Error updating user block status", error);
    }
  }

  return (
    <div>
      <Table>  
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Sl No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>            
            <TableHead>Date Joined</TableHead>
            <TableHead>Is Active</TableHead>
            <TableHead>Is Email Verified</TableHead>
            <TableHead>Block/Unblock</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          { users.length > 0 ? (
            users.map((user,index) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{ format(new Date(user.created_at),'dd-MM-yyyy HH:mm:ss')}</TableCell>
                <TableCell>{user.is_active ? "Yes" :"No"}</TableCell>
                <TableCell>{user.is_email_verified ? "Yes" : "No"}</TableCell>
                <TableCell>
                <Button onClick={() => blockUser(user.id, user.is_blocked)} size="xsm" variant={!user.is_blocked ? "outline-danger" : "outline-default"}>
                    {!user.is_blocked ? "Block" : "Unblock"}
                  </Button>
                </TableCell>
                <TableCell  className="text-right"><Button variant="link">View</Button></TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="7" className="text-center p-4">
                No users found
              </TableCell>
            </TableRow>
          )

          }
         
        </TableBody>
      </Table>

    </div>
  )
}

export default UserListTable
