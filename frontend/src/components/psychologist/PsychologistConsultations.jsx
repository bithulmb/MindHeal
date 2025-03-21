import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import PaginationComponent from '../common/PaginationComponent';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { MessageCircle, MessageSquare, Mic, Video, VideoIcon } from "lucide-react";



const PsychologistConsultations = () => {
  
  const [consultations, setConsultations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [threadId,setThreadId] = useState(null)
  

  const navigate = useNavigate()
  

  useEffect(() => {
    fetchConsultations();
  }, [page,statusFilter]);

  const fetchConsultations = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/consultations/?page=${page}&status=${statusFilter==="all" ? "" :statusFilter}`);
      setConsultations(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 5)); 
    } catch (error) {
      setError(error?.response?.data || "Failed to load consultations. Please try again later.")
      console.error("Failed to fetch consultations", error);
    } finally {
      setLoading(false)
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Scheduled': return 'success';
      case 'Completed': return 'secondary';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };


  const handleFilterChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const openDialog = (consultation) => {
    setSelectedConsultation(consultation);
    setIsDialogOpen(true);
  };

  const startVideoCall = () => {
   
    navigate(`/psychologist/video-call/${selectedConsultation.id}`);
    
  };

  const startChat = async () => {
    if (!selectedConsultation) return;

    const userId = selectedConsultation.patient.id;
    const psychologistId = selectedConsultation.time_slot.psychologist;
    
    try{
      const response = await api.get('/api/chat/thread/',{
        params : {
          user_id :userId,
          psychologist_id : psychologistId,
        }
      
      })
     
      navigate(`/psychologist/chats?thread_id=${response.data.thread_id}`);
    
    } catch (error){
      console.error('error fetching tread'. error)
    }


  };


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl text-muted-foreground">Loading consultations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">My Consultations</h1>

      <div className="flex justify-end items-center mb-4">
        <h2 className="text-lg text-right font-semibold me-4">Filter by Status:</h2>
        
        <Select  value={statusFilter} onValueChange={handleFilterChange} defaultValue="all">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {consultations.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-xl text-muted-foreground">
            No consultations found for this status.
          </p>
        </div>
      ) : (
        <div className=' mx-auto border-opacity-10'>
          <Table>
            <TableHeader>
              <TableRow>
              <TableHead>Sl No</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultations.map((consultation,index) => (
                <TableRow key={consultation.id}>
                   <TableCell>{(page-1) * 5 + index + 1}</TableCell>
                  <TableCell>{consultation.patient_name}</TableCell>
                  <TableCell>{new Date(consultation.time_slot.date).toLocaleDateString()}</TableCell>
                  <TableCell>{consultation.time_slot.start_time.slice(0, 5)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(consultation.consultation_status)}>
                      {consultation.consultation_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openDialog(consultation)}
                      >
                        View Details
                      </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
           <PaginationComponent page={page} setPage={setPage} totalPages={totalPages} />
      )}

        </div>
      )}

      {/* Consultation Details Dialog */}
            {selectedConsultation && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Consultation Details</DialogTitle>
                    <DialogDescription>
                      Detailed information about your consultation.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
               
                    <p>
                      <strong>Patient Name:</strong>{" "}
                      {selectedConsultation.patient_name}
                    </p>
                    <p>
                      <strong>Consultation Status:</strong> {selectedConsultation.consultation_status}
                    </p>
                    <p>
                      <strong>Consultation Date:</strong>{" "}
                      {new Date(selectedConsultation.time_slot.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Consultation Time:</strong> {selectedConsultation.time_slot.start_time} -{" "}
                      {selectedConsultation.time_slot.end_time}
                    </p>
                    {selectedConsultation.payment && (
                    <div  className="space-y-2">
                       <p>
                      <strong>Consultation Fees:</strong> ₹ {selectedConsultation.payment.amount}
                      </p>
                        <p>                  
                        <strong>Payment Status:</strong>{" "}
                        {selectedConsultation.payment.payment_status} 
                      </p>
                      <p>
                      <strong>Payment Gateway:</strong> {selectedConsultation.payment.payment_gateway}
                     </p>
                     <p>
                      <strong>Booked On:</strong> {new Date(selectedConsultation.payment.created_at).toLocaleDateString()}
                    </p>
                    </div>
                    )}
                  </div>
                  {
                    selectedConsultation.consultation_status==="Scheduled" && (
                      <div className="flex justify-center gap-4 mt-6">
                    <Button onClick={startChat}>
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Start Chat
                    </Button>
                    <Button onClick={startVideoCall}>
                      <VideoIcon className="h-5 w-5 mr-2" />
                      Start Video Call
                    </Button>
                  </div>
                    )
                  }   
                  
                  <DialogFooter>
                    
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

    </div>
  );
};

export default PsychologistConsultations;


