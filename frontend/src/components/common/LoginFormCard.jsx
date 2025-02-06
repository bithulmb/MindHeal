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

export default function LoginFormCard({
  className,
  ...props
}) {
  return (
    <div className={cn("flex flex-col gap-6 w-[400px] mx-auto ", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
         <LoginForm/>
        </CardContent>
      </Card>
    </div>
  )
}

