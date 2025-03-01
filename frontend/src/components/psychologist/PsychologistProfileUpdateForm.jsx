import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '../api/api';
import calculateAge from '@/utils/util functions/calculateAge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPsychologistProfile } from '@/redux/slices/psychologistProfileSlice'; // Assuming you have this slice

const profileSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: "First name should contain minimum 2 characters" })
    .regex(/^[A-Za-z]+(\s[A-Za-z]+)*$/, { message: "First name should contain only alphabets" })
    .optional(),

  last_name: z
    .string()
    .min(2, { message: "Last name should contain minimum 2 characters" })
    .regex(/^[A-Za-z]+(\s[A-Za-z]+)*$/, { message: "Last name should contain only alphabets" })
    .optional(),

  date_of_birth: z
    .date()
    .refine((dob) => calculateAge(dob) >= 21, { 
      message: "You must be at least 21 years old",
    })
    .optional(),

  gender: z.string().optional(),

  mobile_number: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number must not exceed 12 digits")
    .regex(/^\+?[1-9]\d{9,11}$/, "Please enter a valid phone number")
    .optional(),

  
about_me: z
    .string()
    .min(50, "About me must be at least 50 characters")
    .max(800, "About me must not exceed 800 characters"),

  qualification: z
  .string()
  .min(2, "Qualification is required")
  .max(100, "Qualification must not exceed 100 characters")
  .optional(),

  experience: z
    .number()
    .min(0, "Experience cannot be negative")
    .max(30, "Experience seems unusually high")
    .optional(),

  specialization: z
    .string()
    .min(2, "Qualification is required")
    .max(100, "Qualification must not exceed 100 characters")
    .optional(),

  fees: z
    .number()
    .min(0, "Fees cannot be negative")
    .max(10000, "Fees seems too high")
    .optional(),

});

const PsychologistProfileUpdateForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const profileData = location?.state?.profile;
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profileData?.user?.first_name || "",
      last_name: profileData?.user?.last_name || "",
      date_of_birth: profileData?.date_of_birth ? new Date(profileData.date_of_birth) : undefined,
      gender: profileData?.gender || "",
      mobile_number: profileData?.mobile_number || "",
      about_me: profileData?.about_me || "",
      qualification: profileData?.qualification || "",
      experience: profileData?.experience || 0,
      specialization: profileData?.specialization || "",
      fees: parseFloat(profileData?.fees) || 0,
    },
  });

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Append only changed/non-empty fields to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (value instanceof File) {
            formData.append(key, value);
          } else if (value instanceof Date) {
            const formattedDate = format(value, "yyyy-MM-dd");
            formData.append(key, formattedDate);
          }else if (key === "fees" && typeof value === "number") {
            console.log(typeof value)
            formData.append(key, parseFloat(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const response = await api.patch("api/psychologist/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(setPsychologistProfile(response.data));
      navigate("/psychologist/profile");
      toast.success("Psychologist profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to update profile");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Update Psychologist Profile</CardTitle>
          <CardDescription>Modify your details to update your psychologist profile</CardDescription>
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
                        <Input {...field} />
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
                        <Input {...field} />
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
                    <FormItem>
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
                        <Input placeholder="Enter your mobile number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualification</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your qualification" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience (Years)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter years of experience" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
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
                      <FormLabel>Fees ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="Enter your fees" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your specialization" {...field} />
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
                        placeholder="Tell us about yourself"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

           
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="secondary" type="button" disabled={isSubmitting} onClick={() => navigate(-1)}>
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
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

export default PsychologistProfileUpdateForm;