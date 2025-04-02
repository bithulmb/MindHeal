import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PaginationComponent from "../common/PaginationComponent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  MessageCircle,
  MessageSquare,
  Mic,
  Star,
  StarIcon,
  Video,
  VideoIcon,
} from "lucide-react";
import { toast } from "sonner";
import Rating from "react-rating";
import { Input } from "../ui/input";
import useDebounce from "@/hooks/useDebounce";
import { LoadingSpinner } from "../common/LoadingPage";

const AdmInConsultationsTable = () => {
    const [consultations, setConsultations] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [patientFilter, setPatientFilter] = useState("all");
    const [psychologistFilter, setPsychologistFilter] = useState("all");
    const [patients, setPatients] = useState([]);
    const [psychologists, setPsychologists] = useState([]);
    
  
    const navigate = useNavigate();

  
    useEffect(() => {
      fetchConsultations();
    }, [page, statusFilter, patientFilter, psychologistFilter]);
  
    const fetchConsultations = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/admin/consultations/`, {
          params: {
            page,
            status: statusFilter === "all" ? "" : statusFilter,
            patient: patientFilter === "all" ? "" : patientFilter,
            psychologist: psychologistFilter === "all" ? "" : psychologistFilter,
          },
        });
  
        setConsultations(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 5));
      } catch (error) {
        if (error.response && error.response.status === 404 && page > 1) {
          setPage(1);
        } else {
          setError(
            error?.response?.data ||
              "Failed to load consultations. Please try again later."
          );
          console.error("Failed to fetch consultations", error);
        }
      } finally {
        setLoading(false);
      }
    };


const fetchFiltersData = async () => {
    try {
      const response = await api.get(`/api/admin/consultations/filters/`);
      setPatients(response.data.patient_names);
      setPsychologists(response.data.psychologist_names);
    } catch (error) {
      console.error("Failed to fetch filter data", error);
    }
  };
  
  useEffect(() => {
    fetchFiltersData();
  }, []);
  
    const getStatusBadgeVariant = (status) => {
      switch (status) {
        case "Scheduled":
          return "success";
        case "Completed":
          return "secondary";
        case "Cancelled":
          return "destructive";
        default:
          return "outline";
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
  
  
    if (loading) {
      return (
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner />
          <p className="text-lg font-medium text-gray-700">Loading...</p>
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
       
  
        <div className="flex justify-between items-center mb-4">
   {/* Filter by Patient Name */}
   <div className="mr-4">
    <h2 className="text-lg font-semibold mb-1">Filter by Patient:</h2>
    <Select value={patientFilter} onValueChange={setPatientFilter}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select Patient" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {patients.map((patient) => (
          <SelectItem key={patient} value={patient}>{patient}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* Filter by Psychologist Name */}
  <div className="mr-4">
    <h2 className="text-lg font-semibold mb-1">Filter by Psychologist:</h2>
    <Select value={psychologistFilter} onValueChange={setPsychologistFilter}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select Psychologist" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {psychologists.map((psychologist) => (
          <SelectItem key={psychologist} value={psychologist}>{psychologist}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
            {/* Filter by Status */}
  <div className="mr-4">
    <h2 className="text-lg font-semibold mb-1">Filter by Status:</h2>
    <Select value={statusFilter} onValueChange={setStatusFilter}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="Scheduled">Scheduled</SelectItem>
        <SelectItem value="Completed">Completed</SelectItem>
      </SelectContent>
    </Select>
  </div>
        </div>
  
        {consultations.length === 0 ? (
          <div className="text-center py-12  rounded-lg">
            <p className="text-xl text-muted-foreground">
              No consultations found.
            </p>
          </div>
        ) : (
          <div className="mx-auto border-opacity-10">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sl No</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Psychologist Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultations.map((consultation, index) => (
                  <TableRow key={consultation.id}>
                    <TableCell>{(page - 1) * 5 + index + 1}</TableCell>
                    <TableCell>{consultation.patient_name}</TableCell>
                    <TableCell>{consultation.psychologist_name}</TableCell>
                    <TableCell>
                      {new Date(consultation.time_slot.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {consultation.time_slot.start_time.slice(0, 5)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(
                          consultation.consultation_status
                        )}
                      >
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
              <PaginationComponent
                page={page}
                setPage={setPage}
                totalPages={totalPages}
              />
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
                  Detailed information about consultation.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
              <p>
                  <strong>Patient Name:</strong>{" "}
                  {selectedConsultation.patient_name}
                </p>
                <p>
                  <strong>Psychologist Name:</strong>{" "}
                  {selectedConsultation.psychologist_name}
                </p>
                <p>
                  <strong>Consultation Status:</strong>{" "}
                  {selectedConsultation.consultation_status}
                </p>
                <p>
                  <strong>Consultation Date:</strong>{" "}
                  {new Date(
                    selectedConsultation.time_slot.date
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Consultation Time:</strong>{" "}
                  {selectedConsultation.time_slot.start_time} -{" "}
                  {selectedConsultation.time_slot.end_time}
                </p>
                {selectedConsultation.payment && (
                  <div className="space-y-2">
                    <p>
                      <strong>Consultation Fees:</strong> ₹{" "}
                      {selectedConsultation.payment.amount}
                    </p>
                    <p>
                      <strong>Payment Status:</strong>{" "}
                      {selectedConsultation.payment.payment_status}
                    </p>
                    <p>
                      <strong>Payment Gateway:</strong>{" "}
                      {selectedConsultation.payment.payment_gateway}
                    </p>
                    <p>
                      <strong>Booked On:</strong>{" "}
                      {new Date(
                        selectedConsultation.payment.created_at
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
  
              <DialogFooter></DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
}

export default AdmInConsultationsTable


