import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";



const UserConsultations = () => {
  
  const [consultations, setConsultations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate()
  

  useEffect(() => {
    fetchConsultations();
  }, [page,statusFilter]);

  const fetchConsultations = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/consultations/?page=${page}&status=${statusFilter==="all" ? "" :statusFilter}`);
      setConsultations(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10)); 
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

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
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
          <Button className="mt-4" onClick={() => navigate("/psychologists")}>Book a Consultation</Button>
        </div>
      ) : (
        <div className=' mx-auto border-opacity-10'>
          <Table>
            <TableHeader>
              <TableRow>
              <TableHead>Sl No</TableHead>
                <TableHead>Psychologist Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultations.map((consultation,index) => (
                <TableRow key={consultation.id}>
                   <TableCell>{index + 1}</TableCell>
                  <TableCell>{consultation.psychologist_name}</TableCell>
                  <TableCell>{new Date(consultation.time_slot.date).toLocaleDateString()}</TableCell>
                  <TableCell>{consultation.time_slot.start_time.slice(0, 5)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(consultation.consultation_status)}>
                      {consultation.consultation_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="secondary" size="sm">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePreviousPage}
                disabled={page === 1}
              />
            </PaginationItem>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <PaginationItem>
              <PaginationNext
                onClick={handleNextPage}
                disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

        </div>
      )}
    </div>
  );
};

export default UserConsultations;


