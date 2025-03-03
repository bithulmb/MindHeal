import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle,CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Star, Globe, User, CheckCircle, Video, Mic, MessageSquare, Briefcase, BadgeAlert } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/api"
import { Skeleton } from "@/components/ui/skeleton";
import { CLOUDINARY_BASE_URL } from "@/utils/constants/constants"
import calculateAge from "@/utils/util functions/calculateAge"
import NotFound from "./NotFound"



export default function PsychologistProfile() {

  const [psychologist,setPsychologist] = useState()
  const [loading, setLoading] = useState(true)

  const { id } = useParams()


  useEffect(() => {
      const fetchPsychologistData = async (id) => {
        try{
          setLoading(true)
          const response = await api.get(`/api/psychologists/${id}/`)
          setPsychologist(response.data)
          console.log("profile fetched succesfuly")
    
        } catch(error){
        
          console.error("error while fetching"|| error?.response?.data, error  )
        } finally{
          setLoading(false)
        }
      }
      fetchPsychologistData(id)
  },[])

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

  return (
    <>
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
   
        <Card className=" my-auto">
          <CardContent className="flex flex-col items-center">
            <div className="relative w-80 h-80 p-4 overflow-hidden rounded-md">
              <img src={`${CLOUDINARY_BASE_URL}${psychologist.profile_image}`} alt={psychologist.user.first_name} fill className="object-cover" />
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
                          <h3 className="text-lg font-semibold mb-2">Available Slots</h3>
                          <div className="grid gap-2">
                            {["Mon 10:00-11:00", "Wed 14:00-15:00", "Fri 09:00-10:00"].map((slot, index) => (
                              <div key={index} className="p-2 bg-muted rounded-md text-sm">
                                {slot}
                              </div>
                            ))}
                          </div>
                        </section>
                            <section className="w-1/2  mt-4">
                            <Button >
                              Book Consultation
                            </Button>
                            </section>
                        

                  </div>
                    
                </CardContent>
              </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}