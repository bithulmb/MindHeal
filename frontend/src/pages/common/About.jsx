import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Heart, Shield, Lightbulb, Award, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";



const values = [
  {
    title: "Compassion",
    icon: <Heart className="h-8 w-8 text-primary" />,
    description: "We approach every individual with genuine care and understanding, creating a space where vulnerability is met with kindness."
  },
  {
    title: "Safety",
    icon: <Shield className="h-8 w-8 text-primary" />,
    description: "Your privacy and emotional wellbeing are our priorities. We maintain strict confidentiality and create secure spaces for healing."
  },
  {
    title: "Innovation",
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    description: "We continuously evolve our therapeutic approaches by integrating evidence-based practices with emerging research."
  },
  {
    title: "Excellence",
    icon: <Award className="h-8 w-8 text-primary" />,
    description: "Our team maintains the highest standards of professional practice, ongoing education, and ethical responsibility."
  }
];
export default function About() {

  const navigate = useNavigate()
  return (
    <div className="container mx-auto p-6 space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg text-muted-foreground max-w-6xl mx-auto">
          At MindHeal, we believe in the transformative power of mental wellness. Our mission is to provide accessible, high-quality online counseling services to support your journey towards emotional well-being.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
        <p className="text-center text-lg text-muted-foreground max-w-6xl mx-auto">
          Our mission is to create a safe, inclusive, and supportive space where everyone can access mental health care without stigma. We are committed to empowering individuals to live healthier, more balanced lives.
        </p>
      </section>

      <section className="">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Our Values</h2>
          <p className="text-center text-lg text-muted-foreground max-w-6xl mx-auto">
            These core principles guide everything we do at MindHeal, from how we develop our platform to how we support our clients.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border border-border bg-card h-full mt-4">
                <CardHeader className="pb-2 flex flex-col items-center text-center">
                  <div className="mb-4 bg-secondary/20 p-4 rounded-full">
                    {value.icon}
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className=" px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-muted-foreground mb-6">
            Learn more about how Mindheal can support you or someone you care about.
          </p>
          <Button size="lg" onClick={() => navigate("/contact")} >Contact Us</Button>
        </div>
      </section>

    
    </div>
  );
}
