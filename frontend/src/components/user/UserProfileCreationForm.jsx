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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";


const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


//  Zod Schema for Validation
const profileSchema = z.object({

  date_of_birth: z.date({
    required_error : "Data Of Birth required"
  }).refine((dob) => calculateAge(dob) >= 10, {
    message : "You must be atleast 10 years old",
  }),
  
    gender: z.string({
      required_error: "Please select a gender",
    }),

  occupation: z.string().optional(),
  mobile_number: z
                .string()
                .min(10,"Phone number must be atleast 10 digits")
                .max(12,"Phone number must not exceed 12 digits")
                .regex(/^\+?[1-9]\d{9,11}$/, "Please enter a valid phone number"),
  
  medical_history: z.string().optional(),
 profile_image: z
    .custom()
    .refine((files) => !files || files?.length === 1)
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 2MB")
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
                
});

const UserProfileCreationForm = () => {

  const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
        occupation: "",
        medical_history: "",
        mobile_number: "",
      },
    });

  const onSubmit = async (values) => {
    try {
      
      setIsSubmitting(true)
      const formData = new FormData();
     

      // Append all form fields to FormData
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


     const response = await api.post('api/user/profile/',formData,{
        headers : {
            'Content-Type' : 'multipart/form-data'
        }
     })
     console.log(response.data)
    const formDataObject = Object.fromEntries(formData.entries());
    console.log("Form Data:", formDataObject);
      toast.success("Patient profile created successfully");
    
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to create profile");
      console.log(error)
    } finally {
        setIsSubmitting(false)
    }
  };
  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create Profile</CardTitle>
          <CardDescription>Submit your details to create your profile</CardDescription>
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
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />


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
                    <FormDescription>Upload your profile photo</FormDescription>
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
};

export default UserProfileCreationForm;
