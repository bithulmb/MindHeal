import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle,CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Star, Globe, User, CheckCircle, Video, Mic, MessageSquare, Briefcase, BadgeAlert,Clock,Calendar } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/api"
import { Skeleton } from "@/components/ui/skeleton";
import { CLOUDINARY_BASE_URL } from "@/utils/constants/constants"
import calculateAge from "@/utils/util functions/calculateAge"
import NotFound from "./NotFound"
import formatIndianDate from "@/utils/util functions/formatIndianDate"
import { useSelector } from "react-redux"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner"
import Swal from "sweetalert2"


export default function PsychologistDetail() {

  const [psychologist,setPsychologist] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [timeSlots, setTimeSlots] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const user = useSelector((state) => state.auth.user)

  const { id } = useParams()
  
  useEffect(() => {
      const fetchPsychologistData = async (id) => {
        try {
          setLoading(true)
          const [psychologistResponse, timeSlotsResponse] = await Promise.all([
            api.get(`/api/psychologists/${id}/`),
            api.get(`/api/psychologists/${id}/timeslots/`)
          ])
          setPsychologist(psychologistResponse.data)
          setTimeSlots(timeSlotsResponse.data)
          console.log("profile and time slots fetched succesfully")
        }  catch (error) {
          if (error.response?.status === 404) {
            setError(true);
          }
          console.error("Error while fetching:", error?.response?.data || error);
        } finally {
          setLoading(false);
        }
      };
      fetchPsychologistData(id);
  },[id])
   
  const handleBookConsultation = () => {
    
    if (!user) {
      toast.error("You need to login to book a consultation");
      return;
    }
    if (user.role !== "Patient") {
      toast.error("Only patients can book consultations");
      return;
    }
    setDialogOpen(true);
  };

  const bookConsultation = async (slotId) => {
    Swal.fire({
      title: "Confirm Booking",
      text: "Are you sure you want to book this time slot?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28A745",
      cancelButtonColor: "#DC3545",
      confirmButtonText: "Yes, Book it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.post(`/api/consultations/`, { time_slot : slotId});
          setTimeSlots(timeSlots.filter((slot) => slot.id !== slotId)); // Remove booked slot from list
          toast.success("Your Consultation booking is succesful" )
          setDialogOpen(false);
         
        } catch (err) {
          console.log(err?.response?.data || err)
          
          toast.error("Failed to book consultation")
      }
    }});
  }



  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[400px] w-full" />
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <NotFound />
  }


  return (
    <>
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
   
        <Card className=" my-auto">
          <CardContent className="flex flex-col items-center">
            <div className="relative w-80 h-80 p-4 overflow-hidden rounded-md">
              <img src={`${CLOUDINARY_BASE_URL}${psychologist.profile_image}`} alt={psychologist.user.first_name} className="object-cover" />
            </div>
            <h2 className="text-2xl font-bold text-center">{`${psychologist.user.first_name} ${psychologist.user.last_name}`}</h2>
            <p className="text-muted-foreground text-center">Psychologist</p>

            {/* <div className="flex justify-center gap-4 mt-6">
              <Button variant="outline" size="icon" className="rounded-full">
                <Video className="h-5 w-5 text-primary" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Mic className="h-5 w-5 text-primary" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <MessageSquare className="h-5 w-5 text-primary" />
              </Button>
            </div> */}
          </CardContent>
         
        </Card>

        {/* Right Column - Details */}
        <div className="md:col-span-2 space-y-6">
        <div className="container mx-auto py-10">
              <Card className="max-w-4xl mx-auto">
                <CardContent className="pt-6">
                  <div className="grid gap-8 md:grid-cols-2">
                    {/* Left Column */}
                    <div className="space-y-6">

                      <section>
                      
                          <div className="flex gap-4 items-start">
                            <div className="bg-primary/10 p-3 rounded-full">
                              <GraduationCap className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium text-lg">Qualification</h3>
                              <p>{psychologist.qualification}</p>
                            </div>
                          </div>

                        </section>

                        <section>
                          <div className="flex gap-4 items-start">
                            <div className="bg-primary/10 p-3 rounded-full">
                              <Star className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium text-lg">Specialization</h3>
                              <p>{psychologist.specialization}</p>
                            </div>
                          </div>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <section>
                            <div className="flex gap-4 items-start">
                              <div className="bg-primary/10 p-3 rounded-full">
                                <User className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-medium text-lg">Age</h3>
                                <p>{calculateAge(psychologist.date_of_birth)} years</p>
                              </div>
                            </div>
                        </section>

                        <section>
                          <div className="flex gap-4 items-start">
                            <div className="bg-primary/10 p-3 rounded-full">
                              <Briefcase className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium text-lg">Experience</h3>
                              <p>{psychologist.experience} years</p>
                            </div>
                          </div>
                        </section>

                    </div>
                  </div>

                  <div className="space-y-6 mt-6">
                  <section>
                          <div className="flex gap-4 items-start">
                            <div className="bg-primary/10 p-3 rounded-full">
                              <BadgeAlert className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium text-lg">About</h3>
                              <p>{psychologist.about_me}</p>
                            </div>
                          </div>
                        </section>

                        <section className="w-1/3 ">
                          <h3 className="text-lg font-semibold mb-2"> Next Available Slots</h3>
                          <div className="grid gap-2">
                            {
                              timeSlots.length > 0 ? (
                                  timeSlots.slice(0,3).map((slot) => (
                                  
                                    <div key={slot.id} className="p-2 bg-muted rounded-md text-sm">
                                      {`${formatIndianDate(slot.date)} ${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`}
                                    </div>
                                  ))
                              ) : (
                                <p className="text-sm text-gray-500">No available slots.</p>
                              )
                            }
                          </div>
                        </section>
                            <section className="w-1/2  mt-4">
                            <Button onClick={handleBookConsultation}>
                              Book Consultation
                            </Button>
                            </section>
                  </div>
                    
                </CardContent>
              </Card>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center justify-center gap-2">
                          <Clock className="w-6 h-6 text-primary" />
                          Select Time Slot
                        </DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground">
                          Choose an available consultation time
                        </DialogDescription>
                      </DialogHeader>
                      
                      {timeSlots && timeSlots.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                          {timeSlots.map((slot) => (
                            <div 
                              key={slot.id} 
                              className="
                                flex items-center justify-between 
                                p-3 border 
                                bg-background 
                                rounded-lg 
                                shadow-sm 
                                hover:bg-primary/5 
                                transition-colors 
                                cursor-pointer 
                                group
                              "
                              onClick={() => {
                                bookConsultation(slot.id);
                                setDialogOpen(false);
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-primary opacity-70 group-hover:opacity-100 transition-opacity" />
                                <div>
                                  <p className="text-sm font-medium group-hover:text-primary transition-colors">
                                    {formatIndianDate(slot.date)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {`${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`}
                                  </p>
                                </div>
                              </div>
                              <div className="
                                opacity-0 
                                group-hover:opacity-100 
                                text-primary 
                                transition-opacity
                                text-sm
                              ">
                                Book
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
                          <Clock className="w-12 h-12 mb-4 text-primary/50" />
                          <p className="text-center">No available slots at the moment</p>
                          <p className="text-xs text-center mt-2">Please check back later</p>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                  </>
  )
}


