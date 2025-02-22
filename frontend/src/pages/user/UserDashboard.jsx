// import React from 'react'

// const UserDashboard = () => {
//   return (
//     <div className=' h-screen '>
//       <div className='my-auto py-24 '>User Dashboard</div>
//     </div>
//   )
// }

// export default UserDashboard


// import React, { useState } from "react";
// import {
//   LayoutDashboard,
//   User,
//   Key,
//   Calendar,
//   MessageCircle,
//   Wallet,
// } from "lucide-react";

// const UserDashboard = () => {
//   const [activeTab, setActiveTab] = useState("dashboard");

//   const renderContent = () => {
//     switch (activeTab) {
//       case "dashboard":
//         return <div>Dashboard Content</div>;
//       case "profile":
//         return <div>My Profile Content</div>;
//       case "change-password":
//         return <div>Change Password Content</div>;
//       case "bookings":
//         return <div>My Bookings Content</div>;
//       case "chats":
//         return <div>My Chats Content</div>;
//       case "wallet":
//         return <div>Wallet Content</div>;
//       default:
//         return <div>Dashboard Content</div>;
//     }
//   };

//   const menuItems = [
//     { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
//     { id: "profile", label: "My Profile", icon: <User size={20} /> },
//     { id: "change-password", label: "Change Password", icon: <Key size={20} /> },
//     { id: "bookings", label: "My Bookings", icon: <Calendar size={20} /> },
//     { id: "chats", label: "My Chats", icon: <MessageCircle size={20} /> },
//     { id: "wallet", label: "Wallet", icon: <Wallet size={20} /> },
//   ];

//   return (
//     <div className="flex min-h-screen bg-background">
//       {/* Sidebar */}
//       <div className="w-64 bg-card shadow-lg border-r border-border">
//         <div className="p-6">
//           <h1 className="text-2xl font-bold text-primary">User Dashboard</h1>
//         </div>
//         <nav className="mt-6">
//           <ul>
//             {menuItems.map((item) => (
//               <li key={item.id}>
//                 <button
//                   className={`w-full flex items-center p-4 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all ${
//                     activeTab === item.id ? "bg-accent text-accent-foreground font-semibold" : ""
//                   }`}
//                   onClick={() => setActiveTab(item.id)}
//                 >
//                   <span className="mr-3">{item.icon}</span>
//                   {item.label}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-8">
//         <div className="bg-card p-6 rounded-lg shadow-md border border-border">
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;
