import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';


const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  date_of_birth: z.string().optional(),
  gender: z.enum(["Male", "Female", "Unspecified"]),
  mobile_number: z.string().optional(),
});

const UserProfileForm = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:8000/api/patient/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          setIsEditMode(true);
          reset(response.data); // Pre-fill form for editing
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          toast.error("Failed to fetch profile");
        }
      }
    };
    fetchProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('access_token');
      const url = 'http://localhost:8000/api/patient/profile/';
      const method = isEditMode ? 'put' : 'post';

      const response = await axios({
        method,
        url,
        data,
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(isEditMode ? "Profile updated successfully" : "Profile created successfully");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{isEditMode ? "Edit Profile" : "Create Profile"}</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* First Name */}
        <div className="mb-4">
          <Label>First Name</Label>
          <Input type="text" {...register('first_name')} />
          {errors.first_name && <p className="text-red-500">{errors.first_name.message}</p>}
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <Label>Last Name</Label>
          <Input type="text" {...register('last_name')} />
          {errors.last_name && <p className="text-red-500">{errors.last_name.message}</p>}
        </div>

        {/* Date of Birth */}
        <div className="mb-4">
          <Label>Date of Birth</Label>
          <Input type="date" {...register('date_of_birth')} />
        </div>

        {/* Gender */}
        <div className="mb-4">
          <Label>Gender</Label>
          <select {...register('gender')} className="w-full p-2 border rounded">
            <option value="Unspecified">Unspecified</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Mobile Number */}
        <div className="mb-4">
          <Label>Mobile Number</Label>
          <Input type="text" {...register('mobile_number')} />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isEditMode ? "Update Profile" : "Create Profile"}
        </Button>
      </form>
    </div>
  );
};

export default UserProfileForm;
