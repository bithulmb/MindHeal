import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Star,
  Globe,
  User,
  CheckCircle,
  Video,
  Mic,
  MessageSquare,
  Briefcase,
  BadgeAlert,
  Clock,
  Calendar,
  IndianRupee,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { Skeleton } from "@/components/ui/skeleton";
import { CLOUDINARY_BASE_URL } from "@/utils/constants/constants";
import calculateAge from "@/utils/util functions/calculateAge";
import NotFound from "./NotFound";
import formatIndianDate from "@/utils/util functions/formatIndianDate";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function PsychologistDetail() {
  const [psychologist, setPsychologist] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reviews, setReviews] = useState([]);

  const user = useSelector((state) => state.auth.user);
  const userProfile = useSelector((state) => state.patientProfile.profile);

  const { id } = useParams();

  useEffect(() => {
    const fetchPsychologistData = async (id) => {
      try {
        setLoading(true);
        const [psychologistResponse, timeSlotsResponse, reviewsResponse] = await Promise.all([
          api.get(`/api/psychologists/${id}/`),
          api.get(`/api/psychologists/${id}/timeslots/`),
          api.get(`/api/psychologists/${id}/reviews/`),
        ]);
        setPsychologist(psychologistResponse.data);
        setTimeSlots(timeSlotsResponse.data);
        setReviews(reviewsResponse.data); // Set
        console.log("profile, reviews and time slots fetched succesfully");
      } catch (error) {
        if (error.response?.status === 404) {
          setError(true);
        }
        console.error("Error while fetching:", error?.response?.data || error);
      } finally {
        setLoading(false);
      }
    };
    fetchPsychologistData(id);
  }, [id]);

const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

const checkExistingConsultation = async (psychologistId)=> {
  try {
    const response = await api.get(
      `api/consultations/check/`, {
        params: {
          userId: userProfile.id,
          psychologistId: psychologistId,
        }
      }
    
    );
   

    if (response.data.already_scheduled) {
      const confirmBooking = await Swal.fire({
        title: "Session Already Booked",
        text: "You have already booked a session with this psychologist. Do you want to book again?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Book Again",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#28A745",
        cancelButtonColor: "#DC3545",
      });

      return confirmBooking.isConfirmed; // Returns true if user clicks "Yes"
    }

    return true; // If no session booked, allow booking
  } catch (error) {
    console.error("Error checking consultation:", error);
    return false;
  }
};

  const handleBookConsultation = async () => {
    if (!user) {
      toast.error("You need to login to book a consultation");
      return;
    }
    if (user.role !== "Patient") {
      toast.error("Only patients can book consultations");
      return;
    }
    if (!userProfile) {
      toast.error("Please create your profile to book a consultation");
      return;
    }

    const duplicateBooking = await checkExistingConsultation(id)
    if (!duplicateBooking){
      
      return
    }
    setDialogOpen(true);
  };

  const initiatePayment = async (slotId, fees) => {
    try {
      const { data } = await api.post("/api/razorpay/create-order/", {
        amount: fees,
      });
      console.log("data", data);

      if (!window.Razorpay) {
        console.error("Razorpay script not loaded");
        toast.error("Payment failed: Razorpay script not loaded");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.order_id,
        name: "MindHeal Consultation",
        description: "Psychologist Consultation",
        handler: async function (response) {
          try {
            console.log(
              response,
              response.razorpay_order_id,
              response.razorpay_payment_id
            );

            await api.post(`/api/consultations/book/`, {
              time_slot: slotId,
              payment_id: data.payment_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
            });

            toast.success("Payment Successful & Consultation Booked");
            setTimeSlots(timeSlots.filter((slot) => slot.id !== slotId));
            setDialogOpen(false);
          } catch (error) {
            console.log("booking failed", error);
            toast.error("Payment Successful but Booking Failed");
          }
        },
        theme: {
          color: "#28A745",
        },
      };
      console.log("Razorpay options:", options);
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error(err);
      toast.error("Failed to initiate payment");
    }
  };

  const bookConsultation = async (slotId, fees) => {
    
    Swal.fire({
      title: "Confirm Booking",
      text: "Proceed to Payment?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28A745",
      cancelButtonColor: "#DC3545",
      confirmButtonText: "Proceed",
    }).then(async (result) => {
      if (result.isConfirmed) {
        initiatePayment(slotId, fees);
      }
    });
  };

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
    return <NotFound />;
  }

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}

          <Card className=" my-auto">
            <CardContent className="flex flex-col items-center">
              <div className="relative w-80 h-80 p-4 overflow-hidden rounded-md">
                <img
                  src={`${CLOUDINARY_BASE_URL}${psychologist.profile_image}`}
                  alt={psychologist.first_name}
                  className="object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-center">{`${psychologist.first_name} ${psychologist.last_name}`}</h2>
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
                            <h3 className="font-medium text-lg">
                              Qualification
                            </h3>
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
                            <h3 className="font-medium text-lg">
                              Specialization
                            </h3>
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
                            <p>
                              {calculateAge(psychologist.date_of_birth)} years
                            </p>
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

                    <div className="space-y-6">
                      <div className="flex gap-4 items-start">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <IndianRupee className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">Fees</h3>
                          <p> ₹ {psychologist.fees} </p>
                        </div>
                      </div>
                    </div>

                    <section className="w-1/3 ">
                      <h3 className="text-lg font-semibold mb-2">
                        {" "}
                        Next Available Slots
                      </h3>
                      <div className="grid gap-2">
                        {timeSlots.length > 0 ? (
                          timeSlots.slice(0, 3).map((slot) => (
                            <div
                              key={slot.id}
                              className="p-2 bg-muted rounded-md text-sm"
                            >
                              {`${formatIndianDate(
                                slot.date
                              )} ${slot.start_time.slice(
                                0,
                                5
                              )} - ${slot.end_time.slice(0, 5)}`}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">
                            No available slots.
                          </p>
                        )}
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
                      {timeSlots.slice(0,6).map((slot) => (
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
                            bookConsultation(slot.id, psychologist.fees);
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
                                {`${slot.start_time.slice(
                                  0,
                                  5
                                )} - ${slot.end_time.slice(0, 5)}`}
                              </p>
                            </div>
                          </div>
                          <div
                            className="
                                opacity-0 
                                group-hover:opacity-100 
                                text-primary 
                                transition-opacity
                                text-sm
                              "
                          >
                            Book
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
                      <Clock className="w-12 h-12 mb-4 text-primary/50" />
                      <p className="text-center">
                        No available slots at the moment
                      </p>
                      <p className="text-xs text-center mt-2">
                        Please check back later
                      </p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
                  {/* Separate Reviews Card */}
            <Card className="shadow-xl bg-background border border-gray-100">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500" fill="currentColor" />
                Reviews
                <Badge className="ml-2 bg-primary/10 text-primary">{reviews.length} Reviews</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{averageRating ? `Average Rating: ${averageRating}/5` : `Average Rating : N/A`}</p>
            </CardHeader>
            <CardContent>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.slice(0, 3).map((review) => (
                    <div
                      key={review.id}
                      className="p-4 bg-muted rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < review.rating ? "text-yellow-500" : "text-gray-300"
                            }`}
                            fill={i < review.rating ? "currentColor" : "none"}
                          />
                        ))}
                        <span className="text-sm font-semibold text-gray-400">({review.rating}/5)</span>
                      </div>
                      <p className="text-gray-400">{review.comment || "No comment provided."}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        By <span className="font-medium">{review.user_name}</span> on{" "}
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {reviews.length > 3 && (
                    <p className="text-sm text-primary cursor-pointer hover:underline">
                      Show {reviews.length - 3} more reviews
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No reviews yet. Be the first to review!</p>
              )}
            </CardContent>
          </Card>
      </div>
      
    </>
  );
}
