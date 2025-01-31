import React from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'

const UserRegisterForm = ({switchToLogin}) => {
  const navigate = useNavigate()
    return (
    <form>
    <div className="flex flex-col gap-6">
       <div className="flex gap-4">
      <div className="w-1/2">
        <Label htmlFor="firstname">First Name</Label>
        <Input id="firstname" type="text" placeholder="John" required />
      </div>
      <div className="w-1/2">
        <Label htmlFor="lastname">Last Name</Label>
        <Input id="lastname" type="text" placeholder="Doe" required />
      </div>
    </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Mobile Number</Label>
        <Input id="mobilenum" type="text" placeholder="9037841778" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password1">Password</Label>
        <Input id="password1" type="password" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password2">Confirm Password</Label>
        <Input id="password2" type="password" required />
      </div>
      <Button type="submit" className="w-full">
        Register
      </Button>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <a onClick={() => navigate("/user/login")} className="underline underline-offset-4 cursor-pointer">
          Login
        </a>
      </div>
    </div>
  </form>
    )
}

export default UserRegisterForm;
