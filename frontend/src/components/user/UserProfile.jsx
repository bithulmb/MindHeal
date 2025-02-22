// import React from 'react'

// const UserProfile = () => {
//   return (
    //  <div>
    //     <div className="flex-1 p-8">
    //     <div className="bg-card p-6 rounded-lg shadow-md border border-border">
    //       User Profile
    //     </div>
    //   </div>
    // </div>
//   )
// }

// export default UserProfile
// components/UserProfile.jsx
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Mail, 
  Phone, 
  User, 
  Briefcase,
  ClipboardList,
  Clock 
} from 'lucide-react';
import api from '../api/api';
import UserProfileNotCreated from './UserProfileNotCreated';
import { CLOUDINARY_BASE_URL } from '@/utils/constants/constants';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        
        const response = await api.get("/api/user/profile/")
        
        setUserData(response.data)
        console.log("user profile fetched")
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data);  
      } finally {
        setLoading(false)
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userData) {
    return <UserProfileNotCreated/>;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };



  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* <div>
        <h1>My Profile</h1>
        </div>
       */}
      <Card className="shadow-xl border-2 bg-primary-foreground">
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="w-40 h-40 ring-4 ring-primary/20">
              <AvatarImage 
                src={`${CLOUDINARY_BASE_URL}${userData.profile_image}`} 
                alt={`${userData.user.first_name} ${userData.user.last_name}`} 
              />
              <AvatarFallback className="text-4xl bg-primary/10">
                {userData.user.first_name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left my-auto">
              <CardTitle className="text-3xl font-bold text-primary">
                {userData.user.first_name} {userData.user.last_name}
              </CardTitle>
              {/* <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge variant="secondary" className="capitalize">
                  {userData.role.toLowerCase()}
                </Badge>
                {userData.is_email_verified && (
                  <Badge variant="success" className="bg-green-100 text-green-800">
                    Verified
                  </Badge>
                )}
              </div> */}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{userData.user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Mobile</p>
                  <p className="font-medium">
                    {userData.mobile_number || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Date of Birth</p>
                  <p className="font-medium">
                     {userData.date_of_birth 
                      ? formatDate(userData.date_of_birth) 
                      : 'Not provided'} 
                    
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="font-medium capitalize">
                    {userData.gender.toLowerCase()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Occupation</p>
                  <p className="font-medium">
                    {userData.occupation || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium">
                    {formatDate(userData.user.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Medical History Section */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center gap-3 mb-3">
              <ClipboardList className="w-5 h-5 text-primary" />
              <h3 className="text-md font-semibold text-gray-600">Medical History</h3>
            </div>
            <p className=" rounded-lg shadow-sm">
              {userData.medical_history || 'No medical history provided'}
            </p>
          </div>

         
          <div className="mt-6 flex justify-end gap-3">
            {/* <Button variant="outline">Edit Profile</Button> */}
            <Button>Edit Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
