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

const UserConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchConsultations();
  }, [page, statusFilter, debouncedSearchQuery]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      // const response = await api.get(
      //   `/api/consultations/?page=${page}&status=${
      //     statusFilter === "all" ? "" : statusFilter
      //   }`
      // );
      const response = await api.get(`/api/consultations/`, {
        params: {
          page,
          status: statusFilter === "all" ? "" : statusFilter,
          search: debouncedSearchQuery || "",
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

  const openReviewDialog = () => {
    setIsReviewDialogOpen(true);
    setIsDialogOpen(false);
  };

  const startVideoCall = () => {
    if (!selectedConsultation) return;

    const consultationDate = selectedConsultation.time_slot.date;
    const consultationTime = selectedConsultation.time_slot.start_time;

    const scheduledDateTime = new Date(
      `${consultationDate}T${consultationTime}`
    );

    const now = new Date();

    const timeDifference = scheduledDateTime - now;
    const timeDifferenceInMinutes = timeDifference / (1000 * 60);

    console.info(timeDifferenceInMinutes);
    if (timeDifferenceInMinutes <= 30) {
      navigate(`/user/video-call/${selectedConsultation.id}`);
    } else {
      toast.error(
        "You can only start the video call 30 minutes before the scheduled time."
      );
      return;
    }
  };

  const startChat = async () => {
    if (!selectedConsultation) return;

    const userId = selectedConsultation.patient.id;
    const psychologistId = selectedConsultation.time_slot.psychologist;

    try {
      const response = await api.get("/api/chat/thread/", {
        params: {
          user_id: userId,
          psychologist_id: psychologistId,
        },
      });
      // setThreadId(response.data.thread_id)
      navigate(`/user/chats?thread_id=${response.data.thread_id}`);
    } catch (error) {
      console.error("error fetching tread".error);
    }
  };

  const submitReview = async () => {
    if (!selectedConsultation) return;

    try {
      const response = await api.post("/api/consultation/submit-review/", {
        consultation_id: selectedConsultation.id,
        rating: reviewRating,
        comment: reviewComment,
      });
      console.log("Review submitted:", response.data);
      setIsReviewDialogOpen(false);
      setReviewRating(5); // Reset form
      setReviewComment("");
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    }
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
      <h1 className="text-3xl font-bold">My Consultations</h1>

      <div className="flex justify-between items-center mb-4">
        <div className="flex w-1/4 my-4">
          <Input
            type="text"
            placeholder="Search by Psychologist Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <h2 className="text-lg text-right font-semibold me-4">
            Filter by Status:
          </h2>

          <Select
            value={statusFilter}
            onValueChange={handleFilterChange}
            defaultValue="all"
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              {/* <SelectItem value="Cancelled">Cancelled</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
      </div>

      {consultations.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-xl text-muted-foreground">
            No consultations found.
          </p>
          <Button className="mt-4" onClick={() => navigate("/psychologists")}>
            Book a Consultation
          </Button>
        </div>
      ) : (
        <div className="mx-auto border-opacity-10">
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
              {consultations.map((consultation, index) => (
                <TableRow key={consultation.id}>
                  <TableCell>{(page - 1) * 5 + index + 1}</TableCell>
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
                Detailed information about your consultation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
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
            {selectedConsultation.consultation_status === "Scheduled" && (
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
            )}
            {selectedConsultation.consultation_status === "Completed" && (
              <div className="flex justify-center mt-6">
                <Button onClick={openReviewDialog}>
                  <Star className="h-5 w-5 mr-2" />
                  Submit Review
                </Button>
              </div>
            )}

            <DialogFooter></DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Review Submission Dialog */}
      {selectedConsultation && (
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Review</DialogTitle>
              <DialogDescription>
                Rate and comment on your consultation experience.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Rating:</label>
                <Rating
                  initialRating={reviewRating}
                  onChange={(value) => setReviewRating(value)}
                  emptySymbol={<Star className="h-6 w-6 text-gray-300" />}
                  fullSymbol={
                    <Star
                      className="h-6 w-6 text-yellow-500"
                      fill="currentColor"
                    />
                  }
                  fractions={1} // Whole stars only
                  stop={5} // Max 5 stars
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Comment (optional):
                </label>
                <textarea
                  className="w-full p-2 border rounded dark:text-background"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setIsReviewDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={submitReview}>Submit Review</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserConsultations;
