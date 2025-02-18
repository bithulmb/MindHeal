import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Home, User, Lock, CalendarCheck, DollarSign, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const PsychologistSidebar = () => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
  
    const menuItems = [
      { name: "Dashboard", icon: <Home />, path: "/dashboard" },
      { name: "My Profile", icon: <User />, path: "/profile" },
      { name: "Change Password", icon: <Lock />, path: "/change-password" },
      { name: "My Consultation", icon: <CalendarCheck />, path: "/consultation" },
      { name: "My Earnings", icon: <DollarSign />, path: "/earnings" },
    ];
  
    return (
      <div className="flex">
        {/* Mobile Sidebar Toggle Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
  
        {/* Sidebar for Desktop */}
        <aside
          className={`hidden md:flex h-screen w-64 flex-col border-r p-4 transition-all bg-background 
          }`}
        >
          <SidebarContent />
        </aside>
      </div>
    );
};


const SidebarContent = () => {
    const menuItems = [
      { name: "Dashboard", icon: <Home />, path: "dashboard" },
      { name: "My Profile", icon: <User />, path: "profile" },
      { name: "Change Password", icon: <Lock />, path: "change-password" },
      { name: "My Consultation", icon: <CalendarCheck />, path: "consultation" },
      { name: "My Earnings", icon: <DollarSign />, path: "earnings" },
    ];
  
    return (
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center space-x-3 p-3 rounded-lg transition hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    );
  };

export default PsychologistSidebar;
