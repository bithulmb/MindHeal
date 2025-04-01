import React, { useEffect, useState } from "react";
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
import api from "@/components/api/api";
import { DollarSign } from "lucide-react";
import { toast } from "sonner";

const PsychologistEarnings = () => {
  const [earningsData, setEarningsData] = useState({
    totalRevenue: 0,
    adminCommission: 0,
    psychologistEarnings: 0,
    consultations: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/psychologist/earnings/");
      const data = response.data;
      setEarningsData({
        totalRevenue: data.total_revenue || 0,
        adminCommission: data.admin_commission || 0,
        psychologistEarnings: data.psychologist_earnings || 0,
        consultations: data.consultations || [],
      });
    } catch (error) {
      toast.error("Failed to load earnings data.");
      console.error("Error fetching earnings data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 text-center">Loading...</div>
    );
  }

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Psychologist Earnings</h1>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹{earningsData.totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Total fees collected</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Admin Commission</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹{earningsData.adminCommission.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">20% of total revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Earnings</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹{earningsData.psychologistEarnings.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">80% of total revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Consultation Details */}
      <Card>
        <CardHeader>
          <CardTitle>Consultation Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          {earningsData.consultations.length === 0 ? (
            <p className="text-muted-foreground">No earnings data available.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Consultation ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Commission (20%)</TableHead>
                  <TableHead>Earnings (80%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earningsData.consultations.map((consultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell>{consultation.id}</TableCell>
                    <TableCell>{consultation.patient_name}</TableCell>
                    <TableCell>{new Date(consultation.date).toLocaleDateString()}</TableCell>
                    <TableCell>{consultation.start_time.slice(0, 5)}</TableCell>
                    <TableCell>₹{consultation.amount.toFixed(2)}</TableCell>
                    <TableCell>₹{consultation.commission.toFixed(2)}</TableCell>
                    <TableCell>₹{consultation.earnings.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PsychologistEarnings;