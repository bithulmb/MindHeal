import React from 'react'
import Slide1 from '../../assets/slide1.jpg'

// const BannerImage = () => {
//     return (
//         <div className="relative w-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px] xl:min-h-[600px]">
//           {/* Background Image Container */}
//           <div className="absolute inset-0">
//             <img
//               src={Slide1}
//               alt="Therapy background"
//               className="w-full h-full object-cover"
//             />
//             {/* Gradient overlay for better text readability */}
//             <div className="absolute inset-0 "></div>
//           </div>
          
//           {/* Text Content */}
//           <div className="relative p-5  h-full flex flex-col items-center justify-center text-center text-white p-4 sm:p-6 md:p-8 lg:p-10">
//             {/* Container for better text organization on small screens */}
//             <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
//               <h2 className="pt-12 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-2 sm:mb-3 md:mb-4">
//                 Online Therapy Can Help You
//               </h2>
//               <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6">
//                 HEAL & THRIVE
//               </h1>
//               <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium leading-relaxed">
//                 Unleash Your True Potential With Quality Online Therapy
//               </p>
//             </div>
//           </div>
//         </div>
//       );
// }

// export default BannerImage



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