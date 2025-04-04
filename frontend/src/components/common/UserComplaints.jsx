import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import api from "../api/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PaginationComponent from "../common/PaginationComponent";

const UserComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/api/complaints/", {
        params: {
          page,
          status: statusFilter === "All" ? "" : statusFilter,
        },
      });
      setComplaints(res.data.results);
      setTotalPages(Math.ceil(res.data.count / 5));
    } catch (error) {
      if (error.response && error.response.status === 404 && page > 1) {
        setPage(1);
      } else {
        console.error("Failed to fetch complaints", error);
        toast.error("Could not fetch complaints");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [page, statusFilter]);

  const handleSubmit = async () => {
    if (!subject || !message) return toast.error("All fields are required");
    setSubmitting(true);
    try {
      await api.post("/api/complaints/submit/", { subject, message });
      toast.success("Complaint submitted successfully");
      setOpen(false);
      setSubject("");
      setMessage("");
      fetchComplaints();
    } catch (err) {
      console.error("Complaint submission failed", err);
      toast.error("Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">My Complaints</h1>
      <div className="flex items-center justify-between">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button> Submit Complaint</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Submit Complaint</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <Textarea
                placeholder="Write your complaint..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full"
              >
                {submitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div>
          <div className="flex justify-end items-center">
            <h2 className="text-lg font-semibold m-4">Filter by Status:</h2>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center text-muted-foreground">
            Loading complaints...
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No complaints submitted yet.
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="w-[80px] ">Sl No</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Resolution</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {complaints.map((complaint, index) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{complaint.subject}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        complaint.status === "Resolved"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {complaint.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(complaint.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {complaint.status === "Resolved"
                      ? complaint.resolution_message
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {totalPages > 1 && (
        <PaginationComponent
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};

export default UserComplaints;
