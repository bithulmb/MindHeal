import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import calculateAge from "@/utils/util functions/calculateAge";
import { CLOUDINARY_BASE_URL } from "@/utils/constants/constants";

const AdminApproveRequests = () => {
  const navigate = useNavigate();
  const [profiles,setProfiles] = useState([])


  
  useEffect( () => {

    const fetchProfiles = async () => {
        try {
          const response = await api.get("api/admin/psychologist-profiles/")
          setProfiles(response.data)
        } catch (error) {
          console.error("error fetching profiles of psychologist", error)
        }
      }
    
      fetchProfiles()
  }, [])
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-semibold text-center mb-6">Approval Requests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {profiles && profiles.length >0 ? (
         profiles.map((profile) => (
          <Card key={profile.id} className="shadow-lg border rounded-2xl p-4">
            <div className="flex justify-between items-start">
              {/* Left Side: Name, Age, Specialization, Experience */}
              <div className="flex-1">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{`${profile.user.first_name} ${profile.user.last_name}`}</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <p><strong>Age:</strong> {calculateAge(profile.date_of_birth)}</p>
                  <p><strong>Specialization:</strong> {profile.specialization}</p>
                  <p><strong>Experience:</strong> {profile.experience}</p>
                  <Button className="mt-4 w-full" onClick={() => navigate(`/admin/approvals/${profile.id}`)}>
                    View
                  </Button>
                </CardContent>
              </div>
  
              {/* Right Side: Profile Image */}
              <div className="ml-4 mt-5">
                {profile.profile_image ? (
                  <img
                    src={`${CLOUDINARY_BASE_URL}${profile.profile_image}`}
                    alt={`${profile.user.first_name} ${profile.user.last_name}`}
                    className="w-28 h-28 rounded-lg my-auto object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))
        ) : (
          <div>No Approval Requests Pending</div>
        )
      }
      </div>
    </div>
  );
  
  // return (
  //   <div className="min-h-screen bg-background- p-6">
  //     <h1 className="text-2xl font-semibold text-center mb-6">Approval Requests</h1>
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
  //       {profiles.map((profile) => (
  //         <Card key={profile.id} className="shadow-lg border rounded-2xl p-4">
  //           <CardHeader>
  //             <CardTitle className="text-lg font-semibold">{`${profile.user.first_name} ${profile.user.last_name}`}</CardTitle>
  //           </CardHeader>
  //           <CardContent className="text-gray-600">
  //             <p><strong>Age:</strong> {calculateAge(profile.date_of_birth)}</p>
  //             <p><strong>Specialization:</strong> {profile.specialization}</p>
  //             <p><strong>Experience:</strong> {profile.experience}</p>
  //             <Button className="mt-4 w-full" onClick={() => navigate(`/admin/approvals/${profile.id}`)}>
  //               View
  //             </Button>
  //           </CardContent>
  //         </Card>
  //       ))}
  //     </div>
  //   </div>
  // );
};

export default AdminApproveRequests;
