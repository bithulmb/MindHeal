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
import Swal from 'sweetalert2'
import PaginationComponent from '../common/PaginationComponent'
import { LoadingSpinner } from '../common/LoadingPage'
import { Input } from '../ui/input'
import useDebounce from '@/hooks/useDebounce'

  

const UserListTable = () => {
  
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearchQuery = useDebounce(searchQuery,500)


  const fetchUsers = async (page,query) => {
    try{

      setLoading(true)
      
      const response = await api.get(`/api/admin/users/?page=${page}&search=${query}`)
      
      setUsers(response.data.results)
      setTotalPages(Math.ceil(response.data.count / 5))
    } catch (error){

      console.error("error fetching users", error)
    
    } finally{
      setLoading(false)
    }
  }

  useEffect( () => {
   
      fetchUsers(currentPage,debouncedSearchQuery)
      
  },[currentPage, debouncedSearchQuery])


  useEffect(() => {
    
    setCurrentPage(1);
  }, [debouncedSearchQuery]);


  const blockUser = async (userId, isBlocked) => {

    Swal.fire({
      title: 'Are you sure?',
      
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then(async (result) => {
      if (result.isConfirmed) {
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
    });
  };

  return (
    <div>

        <div className="flex w-1/4 my-4">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>



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
          { loading ? (
            <TableRow>
              <TableCell colSpan="8" className="text-center p-4">
                <div className="flex flex-col items-center space-y-4">
                        <LoadingSpinner/>
                        <p className="text-lg font-medium text-gray-700">Loading...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
           users.length > 0 ? (
            users.map((user,index) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{(currentPage - 1) * 5 + index + 1}</TableCell>
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
        )
          }
         
        </TableBody>
      </Table>


      {totalPages > 1 && (
            <PaginationComponent page={currentPage} setPage={setCurrentPage} totalPages={totalPages} />
      )}

    </div>
  )
}

export default UserListTable
