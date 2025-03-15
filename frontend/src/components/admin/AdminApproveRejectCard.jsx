import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useNavigate, useParams } from "react-router-dom"
import React, { useEffect, useState } from 'react'
import api from '../api/api'
import calculateAge from '@/utils/util functions/calculateAge'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { CLOUDINARY_BASE_URL } from '@/utils/constants/constants';
import Swal from "sweetalert2"
import { toast } from "sonner"



export default function AdminApproveRejectCard() {
    
    const { id } = useParams()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try{
            const response = await api.get(`/api/admin/psychologist-profiles/${id}/`)
            setProfile(response.data)
        } catch(error){
            console.error("error fetching profile of psychologist", error)
        } finally{
            setLoading(false)
        }
       
    }

    useEffect(() => {
        fetchProfile()
    },[id])

    if (loading) return <div className="text-center p-6">Loading...</div>;

    if (!profile) return <div className="text-center p-6">Psychologist not found.</div>;

    if (profile?.approval_status !== "Pending")return <div className="text-center p-6">This profile has already been {profile.approval_status}</div>;
    
  
  
    const handleApprove = async () => {
   try{
    const response = await api.put(`/api/admin/psychologist-profiles/${id}/`,{
        'action' : "approve"
    })
    if (response.status === 200){
        console.log(response.data)
        navigate("/admin/approvals")
        toast.success("Psychologist Approval succesful")
        }
   } catch(error){
    console.error("Approval request failed", error)
   }
  }

  const handleReject = async () => {
    try{
        const response = await api.put(`/api/admin/psychologist-profiles/${id}/`,{
            'action' : "reject"
        })
        if (response.status === 200){
        console.log(response.data)
        navigate("/admin/approvals")
        toast.success("Psychologist Rejected")
        }
       } catch(error){
        console.error("Approval request failed", error)
       }
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Psychologist Profile Details</h2>
          <Button variant="outline" onClick={() => navigate("/admin/approvals")} >
            Back
          </Button>
        </div>

        <div className="grid gap-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={`${CLOUDINARY_BASE_URL}${profile.profile_image}`}
                alt={`${profile.first_name} ${profile.last_name}`}
              />
              <AvatarFallback>{profile.first_name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{`${profile.first_name} ${profile.last_name}`}</h2>
              <p className="text-muted-foreground">{profile.email}</p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4">
            <div>
              <h3 className="font-semibold mb-2">Personal Information</h3>
              <div className="grid gap-2">
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <span>{new Date(profile.date_of_birth).toLocaleDateString()}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Age :</span>
                  <span>{calculateAge(profile.date_of_birth)}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Gender:</span>
                  <span>{profile.gender}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Mobile:</span>
                  <span>{profile.mobile_number}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Professional Information</h3>
              <div className="grid gap-2">
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Qualification:</span>
                  <span>{profile.qualification}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Experience:</span>
                  <span>{profile.experience} years</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Specialization:</span>
                  <span>{profile.specialization}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Fees:</span>
                  <span> Rs. {profile.fees}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p>{profile.about_me}</p>
            </div>

       
            <div>
              <h3 className="font-semibold mb-2">Documents</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium">ID Card</p>
                  <img
                    src={`${CLOUDINARY_BASE_URL}${profile.id_card}` || "/placeholder.svg"}
                    alt="ID Card"
                    className="rounded-lg border w-full max-w-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Education Certificate</p>
                  <img
                    src={`${CLOUDINARY_BASE_URL}${profile.education_certificate}` || "/placeholder.svg"}
                    alt="Education Certificate"
                    className="rounded-lg border w-full max-w-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Experience Certificate</p>
                  <img
                    src={`${CLOUDINARY_BASE_URL}${profile.experience_certificate}` || "/placeholder.svg"}
                    alt="Experience Certificate"
                    className="rounded-lg border w-full max-w-2xl"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-center gap-4">
            <Button size="lg" variant="destructive" onClick={() => handleReject()}>
              Reject
            </Button>
            <Button size="lg" onClick={() => handleApprove()}>Approve</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

