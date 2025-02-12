import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import LoginForm from "./LoginForm"
import Logo from "./Logo"
import { useLocation } from "react-router-dom"

export default function LoginFormCard({
  className,
  ...props
}) {
  const location = useLocation()

  const isPsychologistLogin = location.pathname.includes("/psychologist/login")
  const isAdminLogin = location.pathname.includes("/admin/login")
  
  return (
    <div className={cn("flex flex-col gap-6 w-[400px] mx-auto ", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
          {isPsychologistLogin 
            ? "Login as Psychologist"
            : isAdminLogin
            ? "Admin Login"
            : "Login as User"
          }
                    
            </CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
         <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}

