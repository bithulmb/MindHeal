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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CLOUDINARY_BASE_URL } from '@/utils/constants/constants'
  

const PsychologistListTable = () => {
 
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPsychologist, setSelectedPsychologist] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const debouncedSearchQuery = useDebounce(searchQuery,500)


  const fetchPsychologists = async (page,query) => {
    try{

      setLoading(true)
      
      const response = await api.get(`/api/admin/psychologists/?page=${page}&search=${query}`)
      
      setUsers(response.data.results)
      setTotalPages(Math.ceil(response.data.count / 5))
    } catch (error){

      console.error("error fetching users", error)
    
    } finally{
      setLoading(false)
    }
  }

 useEffect( () => {
   
      fetchPsychologists(currentPage,debouncedSearchQuery)
      
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

  const handleViewClick = (psychologist) => {
    setSelectedPsychologist(psychologist)
    setIsDialogOpen(true)
  }

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
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="w-[100px]">Sl No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>            
            <TableHead>Date Joined</TableHead>
            <TableHead>Is Active</TableHead>
            <TableHead>Is Admin Approved</TableHead>
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
                <TableCell className="text-center">{user.is_active ? "Yes" :"No"}</TableCell>
                <TableCell className="text-center">{user?.psychologist_profile?.approval_status==="Approved" ? "Yes" : "No"}</TableCell>
                <TableCell>
                <Button onClick={() => blockUser(user.id, user.is_blocked)} size="xsm" variant={!user.is_blocked ? "outline-danger" : "outline-default"}>
                    {!user.is_blocked ? "Block" : "Unblock"}
                  </Button>
                </TableCell>
                <TableCell  className="text-right ">
                <Button 
                      variant="outline"
                      size="xsm"
                      onClick={() => handleViewClick(user)}
                    >
                      View
                    </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="7" className="text-center p-4">
                No Psychologists found
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

{selectedPsychologist && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent  className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Psychologist Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Add profile picture section */}
              {selectedPsychologist.psychologist_profile?.profile_image && (
                <div className="flex justify-center">
                  <img
                    src={`${CLOUDINARY_BASE_URL}${selectedPsychologist.psychologist_profile.profile_image}`}
                    alt={`${selectedPsychologist.first_name} ${selectedPsychologist.last_name}`}
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.target.src = 'path/to/fallback-image.jpg' // Optional: Add a fallback image
                    }}
                  />
                </div>
              )}

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Name:</p>
                    <p>{`${selectedPsychologist.first_name} ${selectedPsychologist.last_name}`}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Email:</p>
                    <p>{selectedPsychologist.email}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Date Joined:</p>
                    <p>{format(new Date(selectedPsychologist.created_at), 'dd-MM-yyyy HH:mm:ss')}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Status:</p>
                    <p>{selectedPsychologist.is_active ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
                
                {selectedPsychologist.psychologist_profile && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Professional Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold">Date of Birth:</p>
                        <p>{selectedPsychologist.psychologist_profile.date_of_birth}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Gender:</p>
                        <p>{selectedPsychologist.psychologist_profile.gender}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Mobile Number:</p>
                        <p>{selectedPsychologist.psychologist_profile.mobile_number}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Qualification:</p>
                        <p>{selectedPsychologist.psychologist_profile.qualification}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Experience:</p>
                        <p>{selectedPsychologist.psychologist_profile.experience} years</p>
                      </div>
                      <div>
                        <p className="font-semibold">Specialization:</p>
                        <p>{selectedPsychologist.psychologist_profile.specialization}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Fees:</p>
                        <p>₹{selectedPsychologist.psychologist_profile.fees}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Approval Status:</p>
                        <p>{selectedPsychologist.psychologist_profile.approval_status}</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">About:</p>
                      <p>{selectedPsychologist.psychologist_profile.about_me}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default PsychologistListTable
