import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import api from "@/components/api/api";
import {
  MessageCircle,
  VideoIcon,
  Calendar,
  DollarSign,
  Users,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import useDebounce from "@/hooks/useDebounce";
import { useSelector } from "react-redux";

const PsychologistDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    upcomingConsultations: [],
    totalConsultations: 0,
    totalEarnings: 0,
    reviews: [],
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  const profile = useSelector((state) => state.psychologistProfile.profile);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/psychologist/dashboard/");
      const data = response.data;
      setDashboardData({
        upcomingConsultations: data.upcoming_consultations || [],

        totalConsultations: data.total_consultations || 0,
        totalEarnings: data.total_earnings || 0,

        reviews: data.reviews || [],
        averageRating: data.average_rating || 0,
      });
    } catch (error) {
      toast.error("Failed to load dashboard data.");
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllConsultations = () => {
    navigate("/psychologist/consultations");
  };

  const handleViewAllReviews = () => {};

  const startVideoCall = (consultationId) => {
    navigate(`/psychologist/video-call/${consultationId}`);
  };



  const startChat = (patientId, psychologistId) => {
    api
      .get("/api/chat/thread/", {
        params: { user_id: patientId, psychologist_id: psychologistId },
      })
      .then((response) =>
        navigate(`/psychologist/chats?thread_id=${response.data.thread_id}`)
      )
      .catch((error) => toast.error("Failed to start chat."));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Welcome {profile.first_name} {profile.last_name}
        </h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Consultations</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {dashboardData.totalConsultations}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Earnings</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ₹{dashboardData.totalEarnings}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Patient Satisfaction</CardTitle>
            <Star className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {dashboardData.averageRating.toFixed(1)}/5
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Consultations */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Consultations</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData.upcomingConsultations.length === 0 ? (
            <p className="text-muted-foreground">
              No upcoming consultations found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.upcomingConsultations.map((consultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell>{consultation.patient_name}</TableCell>
                    <TableCell>
                      {new Date(
                        consultation.time_slot.date
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {consultation.time_slot.start_time.slice(0, 5)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          consultation.consultation_status === "Scheduled"
                            ? "success"
                            : "secondary"
                        }
                      >
                        {consultation.consultation_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          startChat(
                            consultation.patient.id,
                            consultation.time_slot.psychologist
                          )
                        }
                      >
                        <MessageCircle className="h-4 w-4 mr-1" /> Chat
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startVideoCall(consultation.id)}
                      >
                        <VideoIcon className="h-4 w-4 mr-1" /> Video
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <div className="mt-4">
            <Button onClick={handleViewAllConsultations}>
              View All Consultations
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications (Optional) */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No new notifications.</p>
          {/* Add dynamic notifications here if available */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patient Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData.reviews.length === 0 ? (
            <p className="text-muted-foreground">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {dashboardData.reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{review.user_name}</p>
                    <Badge variant="outline">{review.rating}/5 <Star className="h-3 w-3 inline ml-1" /></Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4">
            <Button onClick={handleViewAllReviews}>View All Reviews</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PsychologistDashboard;
