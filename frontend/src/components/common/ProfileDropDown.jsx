import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/redux/slices/authSlice'
import { ACCESS_TOKEN, BASE_URL, CLOUDINARY_BASE_URL, REFRESH_TOKEN } from '@/utils/constants/constants'
import { resetPsychologistProfile } from "@/redux/slices/psychologistProfileSlice";
import { resetPatientProfile } from "@/redux/slices/patientProfileSlice";

const ProfileDropdown = () => {
  const { theme } = useTheme();

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation()
  

  // const isPsychologistLogin = location.pathname.includes("psychologist")
  // const userRole = isPsychologistLogin ? 'psychologist' : 'user'

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const user = useSelector((state) => state.auth.user)
  if (user){
    var userRole = user.role ==="Psychologist" ? "psychologist" : "user"
  }

  const profilePic = userRole==="psychologist" ? useSelector((state) => state?.psychologistProfile?.profile?.profile_image) : useSelector((state) => state?.patientProfile?.profile?.profile_image)


  const handleLogin = () => {
    navigate("/user/login");
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)
    localStorage.clear()
    dispatch(logout())
    dispatch(resetPsychologistProfile())
    dispatch(resetPatientProfile())

    navigate("/")
  }

  return (
    <div className="flex items-center space-x-4">
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Avatar className="w-10 h-10">
                <AvatarImage src={`${CLOUDINARY_BASE_URL}${profilePic}`} alt="Profile Picture" />
                <AvatarFallback className="bg-gray-500 text-white">{user.name[0]}</AvatarFallback>
              </Avatar>
              <span className="hidden md:block text-sm font-medium">{user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to={`/${userRole}/dashboard`}>Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button asChild>
          <Link to="/user/login">Login</Link>
        </Button>
      )}
    </div>
  );
};

export default ProfileDropdown;
