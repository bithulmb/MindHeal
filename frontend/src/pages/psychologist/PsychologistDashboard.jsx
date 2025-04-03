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
  User,
  Percent,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import useDebounce from "@/hooks/useDebounce";
import { useSelector } from "react-redux";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useNotificationContext } from "@/layouts/PsychologistLayout";

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

  const notifications = useNotificationContext()

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

  const startVideoCall = (selectedConsultation) => {
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
      navigate(`/psychologist/video-call/${selectedConsultation.id}`);
    } else {
      toast.error(
        "You can only start the video call 30 minutes before the scheduled time."
      );
    }
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
       <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card className="col-start-2 col-span-2">
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

        <Card className="col-start-4 col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Patient Satisfaction</CardTitle>
            <Star className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {dashboardData.averageRating !== 0 ? `${dashboardData.averageRating.toFixed(1)}/5` : "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>


      <div>
        <Card className="max-w-md mx-auto p-4">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-2">
            <CardTitle className="">Earnings Overview</CardTitle>
            <DollarSign className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent className="mt-4">
            <div className="space-y-3">
             
              <div className="flex justify-between items-center">
                <span className="text-md font-medium">Total Revenue:</span>
                <span className="text-xl font-bold text-green-600">
                  ₹{dashboardData.totalEarnings.toFixed(2)}
                </span>
              </div>

             
              <div className="flex justify-between items-center">
                <span className="text-md font-medium">
                  Admin Commission (20%):
                </span>
                <span className="text-xl font-bold text-red-500">
                  ₹{(dashboardData.totalEarnings * 0.2).toFixed(2)}
                </span>
              </div>

             
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-md font-medium">
                  Your Earnings (80%):
                </span>
                <span className="text-xl font-bold text-blue-500">
                  ₹{(dashboardData.totalEarnings * 0.8).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    
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
                        onClick={() => startVideoCall(consultation)}
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
      {/* <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-muted-foreground">No new notifications.</p>
          ) : (
            <ul className="space-y-2">
              {notifications.map((notification, index) => (
                <li key={index} className="text-sm p-2 rounded">
                  {notification.message}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card> */}

      <Card>
        <CardHeader>
          <CardTitle>Patient Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData.reviews.length === 0 ? (
            <p className="text-muted-foreground">No reviews yet.</p>
          ) : (
            <ScrollArea className="w-full">
              <div className="flex gap-4 pb-2">
                {dashboardData.reviews.map((review) => (
                  <Card key={review.id} className="p-4 min-w-[280px] shadow-sm">
                    <div className="flex items-center gap-3">
                      <User className="h-8 w-8 text-gray-500" />
                      <div>
                        <p className="font-semibold">{review.user_name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm mt-2">{review.comment}</p>
                    <div className="flex items-center mt-2">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        {review.rating}{" "}
                        <Star className="h-4 w-4 text-yellow-500" />
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
          <div className="mt-4 text-center">
            <Button onClick={handleViewAllReviews}>View All Reviews</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PsychologistDashboard;
