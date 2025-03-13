import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import api from '../api/api';
import AddTimeSlot from './AddTimeSlot';
import Swal from 'sweetalert2';

const TimeSlots = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch time slots on component mount
  useEffect(() => {
    const fetchTimeSlots = async () => {
      setLoading(true);
      setError('');
     
      try {
        const response = await api.get('api/timeslots/')
        setTimeSlots(response.data);
      } catch (err) {
        setError('Failed to fetch time slots.');
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, []);

 
  const refreshTimeSlots = async () => {
   
    try {
      const response = await api.get('/api/timeslots/')
      setTimeSlots(response.data);
    } catch (err) {
      setError('Failed to refresh time slots.');
    }
  };

  const handleDelete = async (slotId) => {
    Swal.fire({
      title: 'Are you sure?',
      
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Cancel it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/timeslots/${slotId}/`);
          setTimeSlots(timeSlots.filter((slot) => slot.id !== slotId));
          Swal.fire({
            title: 'Cancelled!',
            text: 'Your time slot has been cancelled.',
            icon: 'success',
          });
        } catch (err) {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete time slot.',
            icon: 'error',
          });
          setError('Failed to delete time slot.');
        }
      }
    });
  };




  return (
        <>
      
        <div className="w-full bg-primary-foreground p-6 flex flex-col gap-6 max-w-4xl mx-auto">
     
     <h2 className="text-3xl font-semibold">Manage Your Time Slots</h2>

     <div className="flex flex-col gap-4">
       <div className="flex justify-between items-center">
         <h3 className="text-lg font-medium "></h3>
         <Dialog>
           <DialogTrigger asChild>
             <Button variant="outline" className="text-sm">
               Add Time Slot
             </Button>
           </DialogTrigger>
           <DialogContent className="max-h-[90vh] overflow-y-auto">
             {/* <DialogHeader>
               <DialogTitle>Add New Time Slot</DialogTitle>
             </DialogHeader> */}
             <AddTimeSlot onSuccess={refreshTimeSlots} />
           </DialogContent>
         </Dialog>
       </div>

       <div className="border rounded-lg w-5/6 mx-auto">
         {loading ? (
           <p className="p-4 text-gray-500">Loading...</p>
         ) : error ? (
           <p className="p-4 text-red-500">{error}</p>
         ) : timeSlots.length === 0 ? (
           <p className="p-4 text-gray-500">No time slots available.</p>
         ) : (
           <Table className="bg-background">
             <TableHeader>
               <TableRow>
                 <TableHead>Date</TableHead>
                 <TableHead>Start Time</TableHead>
                 <TableHead>End Time</TableHead>
                 <TableHead>Status</TableHead>
                 <TableHead>Actions</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {timeSlots.map((slot) => (
                 <TableRow key={slot.id}>
                   <TableCell>{slot.date}</TableCell>
                   <TableCell>{slot.start_time.slice(0, 5)}</TableCell>
                   <TableCell>{slot.end_time.slice(0, 5)}</TableCell>
                   <TableCell>
                     {slot.is_booked ? 'Booked' : 'Not Booked'}
                   </TableCell>
                   <TableCell><Button
                         variant="outline-danger"
                         size="xsm"
                         onClick={() => handleDelete(slot.id)}
                         disabled={slot.is_booked} 
                       >
                         Cancel
                       </Button></TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         )}
       </div>
     </div>
   </div>
        </>
    
  );
};

export default TimeSlots;