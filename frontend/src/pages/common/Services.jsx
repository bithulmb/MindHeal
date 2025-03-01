import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";



const services = [
  {
    title: "Individual Therapy",
    description: "One-on-one sessions tailored to your unique needs. Our licensed therapists provide a safe space for you to explore your thoughts, feelings, and challenges.",
    image: "/pic1.avif",
  },
  {
    title: "Couples Therapy",
    description: "Strengthen your relationship with guided support. Our couples therapy helps you improve communication, resolve conflicts, and rediscover connection.",
    image: "/pic2.avif",
  },
  {
    title: "Teen Therapy",
    description: "Support for teenagers navigating life's challenges. Our specialized therapists help teens build resilience, manage emotions, and develop healthy coping skills.",
    image: "/pic3.avif",
  },
];

const reviews = [
  {
    name: "John Doe",
    review: "MindHeal has completely transformed my life. Highly recommended!",
  },
  {
    name: "Jane Smith",
    review: "The therapists are so kind and understanding. Excellent service!",
  },
  {
    name: "Michael Johnson",
    review: "Great platform for online therapy. Easy to use and very effective!",
  },
];

export default function Services() {

  const navigate = useNavigate()

  return (
    <div className="container mx-auto p-6 space-y-12">
      <section className="text-center">
        {/* <h1 className="text-4xl font-bold mb-4">Our Services</h1> */}
        <h1 className="text-4xl  font-bold mb-4 ">Our Services</h1>
          {/* <p className="text-xl  font-light  mb-4">
            Discover the path to a calmer you
          </p> */}
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            We offer a variety of services to support your mindfulness journey. Choose what best suits your needs.
          </p>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.div key={index} className="m-auto" whileHover={{ scale: 1.05 }}>
            <Card className="overflow-hidden  shadow-lg rounded-2xl w-80">
              <img src={service.image} alt={service.title} className="w-full h-80 object-cover" />
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>{service.description}</CardContent>
            </Card>
          </motion.div>
        ))}
      </section>


      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">Our Process</h2>
        <div className="w-5/6 m-auto">
        <Accordion type="single" collapsible>
          <AccordionItem value="step1">
            <AccordionTrigger>Browse Therapists</AccordionTrigger>
            <AccordionContent> Explore our diverse network of licensed therapists. Each profile includes their specialties, approach, and availability, helping you find the perfect match for your needs.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="step2">
            <AccordionTrigger>Select your Therapist and Book Sessions</AccordionTrigger>
            <AccordionContent>Once you've found your ideal therapist, booking is simple. Choose a time that works for you using our easy calendar system.
Flexible payment options make the process smooth and hassle-free.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="step3">
            <AccordionTrigger>Start Your Journey</AccordionTrigger>
            <AccordionContent>Connect with your therapist via our secure video platform or in-person sessions. Your therapy space is private, confidential, and designed for your comfort.</AccordionContent>
          </AccordionItem>
        </Accordion>
        </div>
       
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">What Our Clients Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <Card key={index} className="p-2 text-center shadow-lg rounded-2xl">
              <Avatar className="mx-auto mb-4">
                <AvatarImage src={`https://via.placeholder.com/100`} alt={review.name} />
                <AvatarFallback>{review.name[0]}</AvatarFallback>
              </Avatar>
              <CardContent>
                <p className="text-lg italic">"{review.review}"</p>
                <h3 className="mt-4 font-bold">{review.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Healing Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Take the first step toward a more mindful, balanced life. 
            Our therapists are ready to support you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="" size="lg" onClick={() => navigate("/psychologists")} >
              Browse Psychologists
            </Button>
          </div>
        </div>
      </section>


    </div>
  );
}
