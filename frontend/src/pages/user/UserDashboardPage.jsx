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
} from "lucide-react";
import { toast } from "sonner";
import useDebounce from "@/hooks/useDebounce";
import { useSelector } from "react-redux";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const UserDashboardPage = () => {
    const [dashboardData, setDashboardData] = useState({
      upcomingConsultations: [],
      stats: { totalConsultations: 0, upcomingToday: 0, totalPayments: 0 },
      profile: { first_name: '', last_name: '' },
    });
    const [loading, setLoading] = useState(true);
  
    const profile = useSelector((state) => state.userProfile.profile); // Assuming Redux store for user
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchDashboardData();
    }, []);
  
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/user/dashboard/");
        const data = response.data;
        setDashboardData({
          upcomingConsultations: data.upcoming_consultations || [],
          stats: {
            totalConsultations: data.stats.total_consultations || 0,
            upcomingToday: data.stats.upcoming_today || 0,
            totalPayments: data.stats.total_payments || 0,
          },
          profile: data.profile || profile || { first_name: '', last_name: '' },
        });
      } catch (error) {
        toast.error("Failed to load dashboard data.");
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
  
    const handleBookConsultation = () => {
      navigate("/user/book-consultation");
    };
  
    const handleViewAllConsultations = () => {
      navigate("/user/consultations");
    };
  
    const startVideoCall = (consultation) => {
      const consultationDate = consultation.time_slot.date;
      const consultationTime = consultation.time_slot.start_time;
      const scheduledDateTime = new Date(`${consultationDate}T${consultationTime}`);
      const now = new Date();
      const timeDifferenceInMinutes = (scheduledDateTime - now) / (1000 * 60);
  
      if (timeDifferenceInMinutes <= 30 && timeDifferenceInMinutes >= -60) {
        navigate(`/user/video-call/${consultation.id}`);
      } else {
        toast.error("You can only join the video call 30 minutes before the scheduled time.");
      }
    };
  
    const startChat = (psychologistId) => {
      api
        .get("/api/chat/thread/", {
          params: { user_id: profile.user_id, psychologist_id: psychologistId },
        })
        .then((response) =>
          navigate(`/user/chats?thread_id=${response.data.thread_id}`)
        )
        .catch((error) => toast.error("Failed to start chat."));
    };
  
    if (loading) {
      return (
        <div className="container mx-auto px-4 py-8 text-center">Loading...</div>
      );
    }
  
    return (
      <div className="flex">
        <UserSidebar />
        <div className="flex-1 md:ml-72">
          <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Welcome Section */}
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">
                Welcome, {dashboardData.profile.first_name} {dashboardData.profile.last_name}
              </h1>
              <Button onClick={handleBookConsultation}>Book a Consultation</Button>
            </div>
  
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Total Consultations</CardTitle>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{dashboardData.stats.totalConsultations}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Upcoming Today</CardTitle>
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{dashboardData.stats.upcomingToday}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Total Payments</CardTitle>
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">₹{dashboardData.stats.totalPayments}</p>
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
                  <p className="text-muted-foreground">No upcoming consultations found.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Psychologist</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboardData.upcomingConsultations.map((consultation) => (
                        <TableRow key={consultation.id}>
                          <TableCell>{consultation.psychologist_name}</TableCell>
                          <TableCell>{new Date(consultation.time_slot.date).toLocaleDateString()}</TableCell>
                          <TableCell>{consultation.time_slot.start_time.slice(0, 5)}</TableCell>
                          <TableCell>
                            <Badge variant={consultation.consultation_status === "Scheduled" ? "success" : "secondary"}>
                              {consultation.consultation_status}
                            </Badge>
                          </TableCell>
                          <TableCell className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startChat(consultation.psychologist_id)}
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
                  <Button onClick={handleViewAllConsultations}>View All Consultations</Button>
                </div>
              </CardContent>
            </Card>
  
            {/* Notifications */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No new notifications.</p>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    );
  };
  
  export default UserDashboardPage;