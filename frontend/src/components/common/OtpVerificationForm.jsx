import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '../api/api'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { toast } from "sonner"


const otpSchema = z.object({
  otp: z.string().min(6, {
    message: "OTP must be 6 digits"
  }).regex(/^\d{6}$/, "Only numbers allowed"),
})

const OtpVerificationForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ""
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState("")
  const [resendLoading, setResendLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setServerError("")
    try {
      const response = await api.post("/api/auth/verify-otp/", {
        email,
        otp: data.otp
      })
      console.log(response.data.message)
      form.reset()
      console.log("user otp verified successfully")
      navigate("/")
      
      toast.success("Email verified succesfully")
    } catch (error) {
      console.error("OTP Verification Error:", error.response?.data)
      setServerError(error.response?.data?.error || "OTP verification failed!")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setResendLoading(true)
    setServerError("")
    try {
      await api.post("/api/auth/resend-otp/", { email })
      toast.success("OTP resend to you email")
    } catch (error) {
      console.error("Resend OTP Error:", error.response?.data)
      setServerError(error.response?.data?.error || "Failed to resend OTP.")
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter OTP</FormLabel>
              <FormControl>
                <InputOTP 
                  maxLength={6} 
                  value={field.value}
                  onChange={field.onChange}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              {/* <FormDescription>
                Please enter the 6-digit code sent to your email.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        
        {serverError && <p className="text-red-500">{serverError}</p>}
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          className="underline underline-offset-4 text-sm text-blue-600"
          onClick={handleResendOtp}
          disabled={resendLoading}
        >
          {resendLoading ? "Resending OTP..." : "Resend OTP"}
        </Button>
      </form>
    </Form>
  )
}

export default OtpVerificationForm