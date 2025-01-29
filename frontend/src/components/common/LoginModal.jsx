import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LoginForm from "./LoginForm"; 
import Logo from "./Logo";
import UserRegisterForm from "../user/UserRegisterForm";
import ResetPasswordForm from "./ResetPassword";

const LoginModal = () => {

    const [modalType,setModalType] = useState("login")


  return (
    <Dialog className="">
      <DialogTrigger asChild>
        <Button>Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center flex-col gap-4">
            <div className="flex-1 text-center ">
                <Logo/> 
            </div>
            <div className="flex-2 text-left">
                <h1 className="text-left mb-4 ">
                {modalType==="login" && "Login As User"} 
                {modalType==="register" && "Sign Up"} 
                {modalType==="resetPassword" && "Reset Password"} 
                </h1>
            </div>
            
            </DialogTitle>
          <DialogDescription className="my-4">
                {modalType==="login" && "Enter you credentials"} 
                {modalType==="register" && "Enter the details to create a account"} 
                {modalType==="resetPassword" && "Enter the email to reset password"} 
        </DialogDescription>
        </DialogHeader>
        {modalType ==="login" && <LoginForm switchToRegister={() => setModalType("register")} switchToResetPassword={() => setModalType("resetPassword")}/>} 
        {modalType ==="register" && <UserRegisterForm switchToLogin={() => setModalType("login")}/>} 
        {modalType ==="resetPassword" && <ResetPasswordForm  switchToLogin={() => setModalType("login")}/>} 
        
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
