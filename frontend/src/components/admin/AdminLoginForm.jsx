import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "../api/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants/constants";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/slices/authSlice";
import Swal from "sweetalert2";
import { toast } from "sonner";

const AdminLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [serverError, setServerError] = useState("");
  
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const validateForm = () => {

    let isValid = true;
    setEmailError("")
    setPasswordError("")
    
    if(!email.trim()){
        setEmailError("Email is required")
        isValid = false
    }
    if (!password.trim()) {
        setPasswordError("Password is required");
        isValid = false;
      } else if (password.length < 6) {
        setPasswordError("Password must be at least 6 characters");
        isValid = false;
      }
      return isValid;
    }
  

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!validateForm()) return;

   try {
    const response = await api.post("/api/auth/login/",{email,password})

    if (response.status === 200){
        const {access, role} = response.data
        if (role !== "Admin"){
          Swal.fire({
            title: 'Error!',
            text: 'You are not authorised',
            icon: 'error',
            confirmButtonColor: '#dc3545',
           
            
          });
            setServerError("You are not authorised to view this page")
            toast.error("Invalid role")
            return
        }
        localStorage.setItem(ACCESS_TOKEN,response.data.access)
        localStorage.setItem(REFRESH_TOKEN,response.data.refresh)
        dispatch(loginSuccess(
            {
            token : access,
            role,
            }))
        navigate('/admin/dashboard')
        toast.success("Admin Login Succesful")
    }   

   }
   catch(error){
    Swal.fire({
      title: 'Error!',
      text: 'Invalid credentials',
      icon: 'error',
      iconColor: '#dc35', // Red color
      confirmButtonColor: '#dc3545'
    });
    toast.error("Your credentails does not match")
    console.log("login failed", error)
    if (error.response){
      setServerError(error.response.data.detail || "Invalid credentials")
    }
    else {
      setServerError("Something went wrong. Please try again.")
    }
  }

 
    
  };

  return (
    <div className="flex items-center justify-center  p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          {serverError && <p className="text-red-500 text-sm text-center">{serverError}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium my-2">Email</label>
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium my-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginForm;
