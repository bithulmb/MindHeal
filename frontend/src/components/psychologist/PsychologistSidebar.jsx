import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Home, User, Lock, CalendarCheck, DollarSign, Menu, X, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const PsychologistSidebar = () => {
    
    const [isOpen, setIsOpen] = useState(false);
  
    const menuItems = [
      { name: "Dashboard", icon: <LayoutDashboard />, path: "/dashboard" },
      { name: "My Profile", icon: <User />, path: "/profile" },
      { name: "Change Password", icon: <Lock />, path: "/change-password" },
      { name: "My Consultations", icon: <CalendarCheck />, path: "/consultation" },
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
            <SidebarContent menuItems={menuItems}/>
          </SheetContent>
        </Sheet>
  
        {/* Sidebar for Desktop */}
        <aside
          className={`hidden md:flex h-screen w-64 flex-col border-r p-4 transition-all bg-background 
          }`}
        >
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary">Psychologist Dashboard</h1>
        </div>
          <SidebarContent menuItems={menuItems} />
        </aside>
      </div>
    );
};


const SidebarContent = ({menuItems}) => {

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
