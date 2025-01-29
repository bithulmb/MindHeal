import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import LoginModal from './LoginModal'

const ServiceCard = ({title,imagePath,alt}) => {

    return (
        <Card>                   
            <CardContent>
                <img className="object-cover w-full h-full " src={imagePath} alt={alt} />
            </CardContent>
            
                    <div className="text-center">
                     <h3 className='text-lg text-center font-semibold text-foreground mb-3  '>{title}</h3>
                    </div>

            
        </Card>
    )

}
const Section1 = () => {
    
    const services = [
        {
          title: "Depression",
          imagePath: "/img1.avif",
          alt: "Person dealing with depression",
        },
        {
          title: "Anxiety",
          imagePath: "/img4.avif",
          alt: "Person experiencing anxiety",
        },
        {
          title: "Relationship Issues",
          imagePath: "/img3.avif",
          alt: "Couple dealing with relationship issues",
        },
        {
          title: "Stress Management",
          imagePath: "/img2.avif",
          alt: "Person managing stress",
        },
      ];
    
    const navigate = useNavigate()
    
  
    return (
    <section className='py-8 px-4 bg-background '>
        <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-8'>
                Best Online Counselling and Therapy Consultation
                </h2>
                <p  className="text-foreground max-w-3xl mx-auto mb-8">
                MindHeal provides the best online therapy and Counselling consultation in India and
around the globe. Consult Online Psychologists, therapist, counsellors, mental health
experts via chat, phone or video call.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-16">

                    {
                        services.map((service, index) => (
                            <ServiceCard key={index} {...service}/>
                        )

                        )
                    }

                </div>
                <Button onClick={() => navigate("/services")}>See All Services</Button>
            </div>
        </div>
        
    </section>
  )
}

export default Section1
