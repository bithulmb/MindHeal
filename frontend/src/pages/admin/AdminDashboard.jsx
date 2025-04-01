import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import api from "@/components/api/api";
import {
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  LayoutDashboard,
  User,
  Lock,
  CalendarCheck,
  Menu,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import calculateAge from "@/utils/util functions/calculateAge";
import { CLOUDINARY_BASE_URL } from "@/utils/constants/constants";
const AdminDashboard = () => {

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalPsychologists: 0,
      totalConsultations: 0,
      totalRevenue: 0,
      adminCommission: 0,
      psychologistEarnings: 0,
    },
    pendingPsychologists: [],
    recentConsultations: [],
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/admin/dashboard/");
      const data = response.data;
      setDashboardData({
        stats: {
          totalUsers: data.stats.total_users || 0,
          totalPsychologists: data.stats.total_psychologists || 0,
          totalConsultations: data.stats.total_consultations || 0,
          totalRevenue: data.stats.total_revenue || 0,
          adminCommission: data.stats.admin_commission || 0,
          psychologistEarnings: data.stats.psychologist_earnings || 0,
        },
        pendingPsychologists: data.pending_psychologists || [],
        recentConsultations: data.recent_consultations || [],
      });
    } catch (error) {
      toast.error("Failed to load dashboard data.");
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePsychologist = async (psychologistId) => {
    try {
      await api.post(`/api/admin/psychologists/${psychologistId}/approve/`);
      toast.success("Psychologist approved successfully.");
      fetchDashboardData(); // Refresh data
    } catch (error) {
      toast.error("Failed to approve psychologist.");
      console.error("Approval error", error);
    }
  };

  const handleRejectPsychologist = async (psychologistId) => {
    try {
      await api.post(`/api/admin/psychologists/${psychologistId}/reject/`);
      toast.success("Psychologist rejected successfully.");
      fetchDashboardData(); // Refresh data
    } catch (error) {
      toast.error("Failed to reject psychologist.");
      console.error("Rejection error", error);
    }
  };

  const handleViewAllConsultations = () => {
    navigate("/admin/consultations");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">Loading...</div>
    );
  }

  return (
    <div className="flex">
     
      <div className="flex-1 ">
        <div className="container mx-auto px-4 py-8 space-y-8">
          
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Welcome, Admin</h1>
          </div>

        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Total Users</CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{dashboardData.stats.totalUsers}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Total Psychologists</CardTitle>
                <UserCheck className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{dashboardData.stats.totalPsychologists}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Total Consultations</CardTitle>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{dashboardData.stats.totalConsultations}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Total Revenue</CardTitle>
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₹{dashboardData.stats.totalRevenue.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Admin Commission</CardTitle>
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₹{dashboardData.stats.adminCommission.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Psychologist Earnings</CardTitle>
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₹{dashboardData.stats.psychologistEarnings.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Pending Psychologists */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Psychologist Approvals</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                      {dashboardData && dashboardData.pendingPsychologists.length > 0 ? (
                       dashboardData.pendingPsychologists.map((profile) => (
                        <Card key={profile.id} className="shadow-lg border rounded-2xl p-4">
                          <div className="flex justify-between items-start">
                            {/* Left Side: Name, Age, Specialization, Experience */}
                            <div className="flex-1">
                              <CardHeader>
                                <CardTitle className="text-lg font-semibold">{`${profile?.first_name} ${profile?.last_name}`}</CardTitle>
                              </CardHeader>
                              <CardContent className="">
                                <p><strong>Age:</strong> {calculateAge(profile.date_of_birth)}</p>
                                <p><strong>Specialization:</strong> {profile.specialization}</p>
                                <p><strong>Experience:</strong> {profile.experience}</p>
                                <Button className="mt-4 w-full" onClick={() => navigate(`/admin/approvals/${profile.id}`)}>
                                  View
                                </Button>
                              </CardContent>
                            </div>
                
                            {/* Right Side: Profile Image */}
                            <div className="ml-4 mt-5">
                              {profile.profile_image ? (
                                <img
                                  src={`${CLOUDINARY_BASE_URL}${profile.profile_image}`}
                                  alt={`${profile.user.first_name} ${profile.user.last_name}`}
                                  className="w-28 h-28 rounded-lg my-auto object-cover border-2 border-gray-200"
                                />
                              ) : (
                                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                  No Image
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))
                      ) : (
                        <div>No Approval Requests Pending</div>
                      )
                    }
                    </div>
            </CardContent>
          </Card>

          {/* Recent Consultations */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.recentConsultations.length === 0 ? (
                <p className="text-muted-foreground">No recent consultations.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sl No</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Psychologist</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Fees</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.recentConsultations.map((consultation,index) => (
                      <TableRow key={consultation.id}>
                        <TableCell>{index+1}</TableCell>
                        <TableCell>{consultation.patient_name}</TableCell>
                        <TableCell>{consultation.psychologist_name}</TableCell>
                        <TableCell>{new Date(consultation.time_slot.date).toLocaleDateString()}</TableCell>
                        <TableCell>{consultation.time_slot.start_time.slice(0, 5)}</TableCell>
                        <TableCell>
                          <Badge variant={consultation.consultation_status === "Scheduled" ? "success" : "secondary"}>
                            {consultation.consultation_status}
                          </Badge>
                        </TableCell>
                        <TableCell>₹ {consultation.payment.amount}</TableCell>
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
