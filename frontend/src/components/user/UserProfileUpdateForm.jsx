import React, { useState,useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner'; 
import api from '../api/api';
import calculateAge from '@/utils/util functions/calculateAge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useLocation, useNavigate } from 'react-router-dom';
import { setPatientProfile } from '@/redux/slices/patientProfileSlice';
import { useDispatch } from 'react-redux';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


const profileSchema = z.object({
    first_name : z
    .string()
    .min(2,{message : "First name should contain minimum 2 characters"})
    .regex(/^[A-Za-z]+(\s[A-Za-z]+)*$/, {message : "First name should contain only alphabets" })
    .optional(),

    last_name: z
    .string()
    .min(2, { message: "Last name should contain minimum 2 characters" })
    .regex(/^[A-Za-z]+(\s[A-Za-z]+)*$/, { message: "Last name should contain only alphabets" })
    .optional(),

    date_of_birth: z
    .date()
    .refine((dob) => calculateAge(dob) >= 10, {
      message: "You must be at least 10 years old",
    })
    .optional(),

    gender: z.string().optional(),

    occupation: z.string().optional(),

    mobile_number: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(12, "Phone number must not exceed 12 digits")
        .regex(/^\+?[1-9]\d{9,11}$/, "Please enter a valid phone number")
        .optional(),

    medical_history: z.string().optional(),

});

const UserProfileUpdateForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation()
  const profileData = location?.state?.profile
 
  const dispatch = useDispatch()

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
        first_name: profileData?.first_name,
        last_name: profileData?.last_name,
        date_of_birth: profileData?.date_of_birth
          ? new Date(profileData.date_of_birth)
          : undefined,
        gender: profileData?.gender || "",
        occupation: profileData?.occupation || "",
        mobile_number: profileData?.mobile_number || "",
        medical_history: profileData?.medical_history || "",
       
      },
  });


  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Append only changed/non-empty fields to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (value instanceof FileList) {
            formData.append(key, value[0]);
          } else if (value instanceof Date) {
            const formattedDate = format(value, "yyyy-MM-dd");
            formData.append(key, formattedDate);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      console.log("inside")
      const response = await api.patch("api/user/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(setPatientProfile(response.data))
      navigate("/user/profile");
      toast.success("Patient profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to update profile");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto">
          <CardContent>
            <p>Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
          <CardDescription>Modify your details to update your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <div className="grid gap-4 md:grid-cols-2">
            <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">  
             <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
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
                    <Select onValueChange={field.onChange} value={field.value}>
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

              </div>
              <div className="grid gap-4 md:grid-cols-2">  
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
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Enter your occupation if any</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>

              <FormField
                control={form.control}
                name="medical_history"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical History</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us if you had any previous medical issues"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
             
              <div className="flex justify-end gap-3 mt-6">
        <Button variant="secondary" type="button" disabled={isSubmitting} onClick={() => navigate(-1)} >
          Back
        </Button>
        
          <Button type="submit" className="" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
      </div>
             
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileUpdateForm;