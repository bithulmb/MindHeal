import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import api from "../api/api"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import PaginationComponent from "../common/PaginationComponent"

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [resolutionMessage, setResolutionMessage] = useState("")
  const [resolving, setResolving] = useState(false)
  const [statusFilter, setStatusFilter] = useState("All")
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAllComplaints = async () => {
    try {
      const res = await api.get("/api/complaints/",{
        params :{
            page,
            status : statusFilter === "All" ? "" : statusFilter,
        }
      })
      setComplaints(res.data.results)
      setTotalPages(Math.ceil(res.data.count / 5))
    } catch (error) {
        if (error.response && error.response.status === 404 && page > 1) {
            setPage(1);
          } else{
            console.error("Failed to fetch complaints", error)
            toast.error("Could not fetch complaints")
          }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllComplaints()
  }, [page,statusFilter])



  const handleResolveClick = (complaint) => {
    setSelectedComplaint(complaint)
    setResolutionMessage("")
    setOpen(true)
  }

  const handleResolveSubmit = async () => {
    if (!resolutionMessage.trim()) {
      toast.error("Please provide a resolution message")
      return
    }

    setResolving(true)
    try {
      await api.patch(`/api/complaints/${selectedComplaint.id}/resolve/`, {
        resolution_message: resolutionMessage
      })
      toast.success("Complaint resolved")
      setOpen(false)
      fetchAllComplaints()
    } catch (err) {
      console.error("Failed to resolve complaint", err)
      toast.error("Resolution failed")
    } finally {
      setResolving(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Complaints Management</h2>
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
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center text-muted-foreground">Loading complaints...</div>
        ) : complaints.length === 0 ? (
          <div className="text-center text-muted-foreground">No complaints found.</div>
        ) : (
          <table className="min-w-full border rounded-lg text-sm">
            <thead className="bg-muted">
              <tr className="text-left">
              <th className="p-3">Sl No</th>
                <th className="p-3">User</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c,index) => (
                <tr key={c.id} className="border-t">
                <td className="p-3">{index+1}</td>
                  <td className="p-3">{`${c.full_name}`}</td>
                  <td className="p-3">{c.subject}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        c.status === "Resolved"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(c.created_at).toLocaleString()}</td>
                  <td className="p-3 space-x-2">
                
                      <Button size="sm" onClick={() => handleResolveClick(c)}>
                        View
                      </Button>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
              <PaginationComponent
                page={page}
                setPage={setPage}
                totalPages={totalPages}
              />
            )}

      {/* Dialog for Resolving */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Resolve Complaint</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">        
              <p>
                  <strong>Complaint by:</strong>{" "}
                  {selectedComplaint?.full_name}
                </p>
                <p>
                  <strong>Subject:</strong>{" "}
                  {selectedComplaint?.subject}
                </p>
                <p>
                  <strong>Complaint:</strong>{" "}
                  {selectedComplaint?.message}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedComplaint?.status}
                </p>
             {selectedComplaint?.status === "Pending" ? (
                      <div>
                             <Textarea
                           placeholder="Enter your resolution message..."
                           rows={4}
                           value={resolutionMessage}
                           onChange={(e) => setResolutionMessage(e.target.value)}
                         />
                         <Button onClick={handleResolveSubmit} disabled={resolving} className="w-full mt-6">
                           {resolving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                           Resolve
                         </Button>
                      </div>
             ) : (
                <>
                     <p>
                  <strong>Resolve Message:</strong>{" "}
                  {selectedComplaint?.resolution_message}
                </p>
                <p>
                  <strong>Resolved at:</strong>{" "}
                  {new Date(selectedComplaint?.resolved_at).toLocaleString()}
                </p>
                </>
             )}  
     
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminComplaints
