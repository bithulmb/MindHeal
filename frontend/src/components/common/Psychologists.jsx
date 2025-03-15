import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import api from "../api/api";
import { CLOUDINARY_BASE_URL } from "@/utils/constants/constants";
import { useNavigate } from "react-router-dom";

export default function PsychologistsPage() {
  const [psychologistData, setPsychologistData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()

  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/psychologists/");
        setPsychologistData(response.data);
        console.log("Fetched psychologists");
      } catch (error) {
        console.log("Error fetching psychologists");
        console.error(error?.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologists();
  }, []);

  const SkeletonCard = () => (
    <Card className="bg-card shadow-lg rounded-2xl overflow-hidden">
      <Skeleton className="w-full h-60" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Our Psychologists</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse our list of highly qualified psychologists and choose the right one for your journey to mental wellness.
        </p>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading || !psychologistData
          ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
          : psychologistData.map((psychologist) => (
              <div
                key={psychologist.id}
               
              >
                <Card className="bg-card shadow-lg rounded-2xl overflow-hidden">
                  <img
                    src={`${CLOUDINARY_BASE_URL}${psychologist.profile_image}`}
                    alt={psychologist.first_name}
                    width={400}
                    height={300}
                    className="w-full h-80 object-cover"
                  />
                  <CardHeader>
                    <CardTitle>{`${psychologist.first_name} ${psychologist.last_name}`}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p><strong>Qualification:</strong> {psychologist.qualification}</p>
                    <p><strong>Specialization:</strong> {psychologist.specialization}</p>
                    <p><strong>Experience:</strong> {psychologist.experience} years</p>
                    <Button variant="" className="w-full" onClick={() => navigate(`${psychologist.id}`)}>View Details</Button>
                  </CardContent>
                </Card>
              </div>
            ))}
      </section>
    </div>
  );
}
