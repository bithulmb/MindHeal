import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const AdminDashboard = () => {
  const [isPsychologistMenuOpen, setPsychologistMenuOpen] = useState(false);

  return (
    <h1>Admin Dashboard</h1>
  )
};

export default AdminDashboard;
