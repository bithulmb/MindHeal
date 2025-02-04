import React from 'react'
import Slide1 from '../../assets/slide1.jpg'

const BannerImage = () => {
  return (
    <div className="relative w-full h-screen">
      
      <div className="absolute inset-0">
        <img
          src={Slide1}
          alt="Therapy background"
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0"></div>
      </div>
      
      
      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-8">
          Online Therapy Can Help You
        </h2>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
          HEAL & THRIVE
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl font-medium max-w-2xl">
          Unleash Your True Potential With Quality Online Therapy
        </p>
      </div>
    </div>
  );
};

export default BannerImage;