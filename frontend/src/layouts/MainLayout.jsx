import Footer from '@/components/common/Footer'
import Header from '@/components/common/Header'
import { Toaster } from '@/components/ui/sonner'
import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    // <>
    // <Header/>
    // <Outlet/>
    // <Footer/>
    // </>
  //   <div className="flex min-h-screen w-screen">
  

    
  //   <div className="flex flex-col  min-h-screen w-screen">
  //     {/* Header */}
  //     <div className="w-full flex">
        
  //       <div className='w-full'> <Header /></div>
        
       
  //     </div>

  //     {/* Page Content */}
  //     <div className="flex-1 w-full overflow-auto">
  //       <Outlet />
  //     </div>

  //     {/* Footer */}
  //     <div className="w-full">
  //       <Footer />
  //     </div>
  //   </div>
  // </div>
  <div className="flex flex-col min-h-screen">
      {/* Header (Fixed at the Top) */}
      <header className="">
        <Header />
      </header>

      {/* Main Content (Fills remaining space) */}
      <main className="flex-1 ">
        <Outlet />
        <Toaster/>
      </main>

      {/* Footer (Fixed at the Bottom) */}
      <footer className="">
        <Footer />
      </footer>
    </div>
  )
}

export default MainLayout
// const MainLayout = () => {
//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Header (Fixed at the Top) */}
//       <header className="">
//         <Header />
//       </header>

//       {/* Main Content (Fills Remaining Space) */}
//       <main className="flex-1  flex justify-center items-center">
//         <Outlet />
//       </main>

//       {/* Footer (Fixed at the Bottom) */}
//       <footer className="">
//         <Footer />
//       </footer>
//     </div>
//   );
// };

// export default MainLayout;