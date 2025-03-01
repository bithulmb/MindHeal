"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import api from "../api/api";
import { toast } from "sonner";
import calculateAge from "@/utils/util functions/calculateAge";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPsychologistProfile } from "@/redux/slices/psychologistProfileSlice";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_DOC_TYPES = [...ACCEPTED_IMAGE_TYPES, "application/pdf"];

const formSchema = z.object({
  profile_image: z
    .custom()
    .refine((files) => files?.length === 1, "Profile image is required")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 2MB")
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
  date_of_birth: z.date({
    required_error: "Date of birth is required",
  }).refine((dob) => calculateAge(dob) >=21 ,{
    message : "You must be atleast 21 years old",
  }),
  gender: z.string({
    required_error: "Please select a gender",
  }),
  mobile_number: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number must not exceed 12 digits")
    .regex(/^\+?[1-9]\d{9,11}$/, "Please enter a valid phone number"),
  about_me: z
    .string()
    .min(50, "About me must be at least 50 characters")
    .max(800, "About me must not exceed 800 characters"),
  qualification: z
    .string()
    .min(2, "Qualification is required")
    .max(100, "Qualification must not exceed 100 characters"),
  experience: z.number().min(0, "Experience cannot be negative").max(30, "Experience seems too high"),
  specialization: z
    .string()
    .min(2, "Specialization is required")
    .max(100, "Specialization must not exceed 100 characters"),
  fees: z.number().min(0, "Fees cannot be negative").max(10000, "Fees seems too high"),
  id_card: z
    .custom()
    .refine((files) => files?.length === 1, "ID card is required")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 5MB")
    .refine(
      (files) => ACCEPTED_DOC_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png, .webp and .pdf formats are supported"
    ),
  education_certificate: z
    .custom()
    .refine((files) => files?.length === 1, "Education certificate is required")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 5MB")
    .refine(
      (files) => ACCEPTED_DOC_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png, .webp and .pdf formats are supported"
    ),
  experience_certificate: z
    .custom()
    .refine((files) => files?.length === 1, "Experience certificate is required")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 5MB")
    .refine(
      (files) => ACCEPTED_DOC_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png, .webp and .pdf formats are supported"
    ),
});

export default function PsychologistProfileForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values) {
    setIsSubmitting(true);
    const formData = new FormData();

  

    // Append all form values to FormData
    Object.entries(values).forEach(([key, value]) => {
      if (value instanceof FileList) {
        formData.append(key, value[0]);
      } else if (value instanceof Date) {
        
        const formattedDate = format(value, "yyyy-MM-dd");
        formData.append(key, formattedDate);
      } else {
        formData.append(key, String(value));
      }
    });

    try {
        const formDataObj = Object.fromEntries(formData.entries());
        console.log(formDataObj);
        toast("form submitting")

        const response = await api.post("/api/psychologist/profile/",formData,{
            headers: {
              'Content-Type': 'multipart/form-data'
            }})
            console.log('form submitted and succesful')
            dispatch(setPsychologistProfile(response.data))
            navigate("/psychologist/profile-submitted")
            toast.success("Form Submitted succesfully")
            console.log(response.data)
            
    
    } catch (error) {
     
      console.error("Registration failed:", error);
      toast("form submission failed")
      if (error.response && error.response.data) {
        console.error('Validation errors:', error.response.data);
        
      } else {
        console.error('Unknown error:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Psychologist Profile</CardTitle>
          <CardDescription>Submit your details to verify your profile and get approved. All fields are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Enter your DOB</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1950-01-01")}
                        initialFocus
                        captionLayout="dropdown-buttons"
                        fromYear={1950}
                        toYear={new Date().getFullYear()}
                        classNames={{
                          caption_label: "hidden", 
                        }}
                        
                      />               
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Unspecified">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobile_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="about_me"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Me</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your background and approach..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Minimum 50 characters, maximum 500 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualification</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Ph.D. in Psychology" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Clinical Psychology" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consultation Fees</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="profile_image"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Profile Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Upload a professional photo of yourself. Max size: 5MB</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="id_card"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>ID Card</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept={ACCEPTED_DOC_TYPES.join(",")}
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Upload a valid ID card. Accepted formats: PDF, JPG, PNG</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="education_certificate"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Education Certificate</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept={ACCEPTED_DOC_TYPES.join(",")}
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload your highest education certificate. Accepted formats: PDF, JPG, PNG
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience_certificate"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Experience Certificate</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept={ACCEPTED_DOC_TYPES.join(",")}
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload your experience certificate. Accepted formats: PDF, JPG, PNG
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Profile"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}