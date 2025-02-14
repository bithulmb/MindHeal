import { Button } from '@/components/ui/button';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from "react-router-dom";

const EmailNotVerifiedPage = () => {

    const location = useLocation()
    const isPsychologistLogin = location.pathname.includes("psychologist")

    const userRole = isPsychologistLogin ? 'psychologist' : 'user'
    const navigate = useNavigate()

    const email = useSelector((state) => state.auth.user?.email)
    console.log(email)

  return (
    <div className="flex flex-col items-center justify-center bg-muted md:p-10">
      <div className="flex flex-col items-center justify-center h-full w-full my-16">
        <div className="text-center p-6 max-w-md bg-background shadow-lg rounded-2xl">
          <h1 className="text-3xl font-bold text-foreground">📩 Email Not Verified</h1>
          <p className="text-foreground mt-2">
            Your email is not verified. Please check your inbox for the verification email.
          </p>
          <div className="mt-6 mx-autoflex gap-4">
            <Button onClick={() => navigate(`/${userRole}/verify-otp`,{state : {
                email : email
            }})}>
                Enter OTP
            </Button>
            
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailNotVerifiedPage;
