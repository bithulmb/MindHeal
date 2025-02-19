import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/redux/slices/authSlice'
import { ACCESS_TOKEN, BASE_URL, REFRESH_TOKEN } from '@/utils/constants/constants'

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

  const handleLogin = () => {
    navigate("/user/login");
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)
    dispatch(logout())

    navigate("/")
  }



//   const [user, setUser] = useState({
//     isLoggedIn: false, // Change this to false for logged-out state
//     name: "John Doe",
//     profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
//   });



  return (
    <div className="flex items-center space-x-4">
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.profilePic} alt="Profile Picture" />
                <AvatarFallback className="bg-gray-500 text-white">{user.name[0]}</AvatarFallback>
              </Avatar>
              <span className="hidden md:block text-sm font-medium">{user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to={`/${userRole}/dashboard`}>My Profile</Link>
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
