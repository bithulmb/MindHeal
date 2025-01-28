import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'

const Section2 = () => {

    const psychologists = [
        {
          name: "Parvathy K P",
          experience: "3+ years",
          image: "/psychologist4.jpeg"
        },
        {
          name: "Dr. Anoop Chandran",
          experience: "6+ years",
          image: "/psychologist3.jpeg"
        },
        {
          name: "Dr. Hema Malini",
          experience: "10+ years",
          image: "/psychologist2.jpeg"
        },
        {
          name: "Alex T H",
          experience: "18+ years",
          image: "/psychologist1.jpeg"
        }
      ];
    
    const navigate = useNavigate()
  return (
    
      <section className='pt-8 px-4 bg-background '>
              <div className="container max-w-6xl mx-auto">
                  <div className="text-center mb-12">
                      <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-8'>
                      Connect with Top Pyschologists in India
                      </h2>
                      <p  className="text-foreground max-w-5xl mx-auto mb-8">
                      Meet our team of skilled psychologists and RCI-licensed clinical psychologists for expert and compassionate care. We are dedicated to supporting your mental health and well-being with empathy and professionalism.
                      </p>
                      <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {psychologists.map((psych, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="rounded-full overflow-hidden w-48 h-48 mb-4 border-4 border-blue-200 hover:border-blue-400 transition-colors duration-300">
              <img 
                src={psych.image} 
                alt={psych.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold text-lg text-center">{psych.name}</h3>
            <p className="text-sm text-muted-foreground">{psych.experience}</p>
          </div>
        ))}
      </div>
    </div>

                      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-16">
      
                          {
                              services.map((service, index) => (
                                  <ServiceCard key={index} {...service}/>
                              )
      
                              )
                          }
      
                      </div> */}
                      <Button onClick={() => navigate("/psychologists")}>See All Psychologists</Button>
                  </div>
              </div>
              
          </section>
    
  )
}

export default Section2
