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
  Clock ,
  Upload,
  Star,
  GraduationCap,
  DollarSign,
  Info,
  IndianRupee,
  
} from 'lucide-react';
import api from '../api/api';
import { ACCEPTED_IMAGE_TYPES, CLOUDINARY_BASE_URL, MAX_FILE_SIZE } from '@/utils/constants/constants';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import useImageCropper from '@/hooks/UseImageCropper';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useDispatch, useSelector } from 'react-redux';
import { setPatientProfile } from '@/redux/slices/patientProfileSlice';
import { setPsychologistProfile } from '@/redux/slices/psychologistProfileSlice';



const PsychologistProfile = () => {
 
  const profileData = useSelector((state) => state.psychologistProfile?.profile)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    selectedImage,
    crop,
    setCrop,
    croppedImage,
    isCropModalOpen,
    setIsCropModalOpen,
    imageRef,
    setImageRef,
    uploading,
    setUploading,
    handleImageSelect,
    onCropComplete,
    resetCropper,
  } = useImageCropper();

  

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
        
  //       const response = await api.get("/api/user/profile/")
        
  //       setUserData(response.data)
  //       console.log("user profile fetched")
  //     } catch (error) {
  //       console.error('Error fetching user data:', error.response?.data);  
  //     } finally {
  //       setLoading(false)
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  // Handle profile picture upload
  // const handleProfilePicChange = async (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;


  //   if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
  //     toast.error("Only .jpg, .jpeg, .png, and .webp formats are supported");
  //     return;
  //   }
  //   if (file.size > MAX_FILE_SIZE) {
  //     toast.error("Max file size is 2MB");
  //     return;
  //   }

  const handleProfilePicUpload = async () => {
    if (!croppedImage) {
      toast.error("Please crop the image first");
      return;
    }

    const formData = new FormData();
    formData.append('profile_image', croppedImage, 'profile_image.jpg');

    try {
      setUploading(true);
      const response = await api.patch("/api/psychologist/profile/", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // setUserData(response.data); 
      dispatch(setPsychologistProfile(response.data))
      toast.success("Profile picture updated successfully");
      resetCropper();
    } catch (error) {
      console.error(error)
      console.error('Error uploading profile picture:', error.response?.data);
      toast.error("Failed to update profile picture");
    } finally {
      setUploading(false);
    }
  };

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }

  if (!profileData) {
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
<Card className="shadow-xl border-2 bg-primary-foreground">
  <CardHeader className="border-b">
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <div className="relative">
        <Avatar className="w-40 h-40 ring-4 ring-primary/20">
          <AvatarImage 
            src={`${CLOUDINARY_BASE_URL}${profileData.profile_image}`} 
            alt={`${profileData.first_name} ${profileData.last_name}`} 
          />
          <AvatarFallback className="text-4xl bg-primary/10">
            {profileData.first_name[0]}
          </AvatarFallback>
        </Avatar>
        <label htmlFor="profile-pic-upload" className="absolute bottom-0 right-0">
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
            disabled={uploading}
            asChild
          >
            <span>
              {uploading ? (
                <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full" />
              ) : (
                <Upload className="h-5 w-5" />
              )}
            </span>
          </Button>
        </label>
        <input
          id="profile-pic-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleImageSelect}
        />
      </div>
      <div className="text-center sm:text-left my-auto">
        <CardTitle className="text-3xl font-bold text-primary">
          {profileData.first_name} {profileData.last_name}
        </CardTitle>
        <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
          <Badge variant="secondary">Psychologist</Badge>
          {profileData.is_admin_approved && (
            <Badge variant="success" className="bg-green-100 text-green-800">
              Approved
            </Badge>
          )}
        </div>
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
            <p className="font-medium">{profileData.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-gray-600">Mobile</p>
            <p className="font-medium">
              {profileData.mobile_number || 'Not provided'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <GraduationCap className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-gray-600">Qualification</p>
            <p className="font-medium">
              {profileData.qualification}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Briefcase className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-gray-600">Experience</p>
            <p className="font-medium">
              {profileData.experience} years
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
              {profileData.gender.toLowerCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-gray-600">Date of Birth</p>
            <p className="font-medium capitalize">
              {formatDate(profileData.date_of_birth)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <IndianRupee className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-gray-600">Fees</p>
            <p className="font-medium">
              Rs. {profileData.fees}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Star className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-gray-600">Specialization</p>
            <p className="font-medium">
              {profileData.specialization}
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Additional Sections */}
    <div className="mt-6 pt-6 border-t">
      <div className="flex items-center gap-3 mb-3">
        <Info className="w-5 h-5 text-primary" />
        <h3 className="text-md font-semibold text-gray-600">About Me</h3>
      </div>
      <p className="rounded-lg shadow-sm">
        {profileData.about_me}
      </p>
    </div>

    <div className="mt-6 flex justify-end gap-3">
      <Button onClick={() => navigate("update", {state: { profile: profileData}})}>
        Edit Profile
      </Button>
    </div>
  </CardContent>
</Card>
      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crop Your Profile Picture</DialogTitle>
            <DialogDescription>
            Adjust the crop area to fit your profile picture. Click "Save" when you're done.
          </DialogDescription>
          </DialogHeader>
          {selectedImage && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={onCropComplete}
              aspect={1 / 1}
             
            >
              <img
                src={selectedImage}
                onLoad={(e) => setImageRef(e.currentTarget)}
                alt="Crop preview"
              />
            </ReactCrop>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCropModalOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button onClick={handleProfilePicUpload} disabled={uploading}>
              {uploading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full mr-2" />
                  Uploading...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default PsychologistProfile;
