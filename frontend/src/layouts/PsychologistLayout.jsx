import PsychologistSidebar from '@/components/psychologist/PsychologistSidebar';
import React from 'react'
import { Outlet } from 'react-router-dom';

const PsychologistLayout = () => {
    return (
        <div className="flex">
          <PsychologistSidebar />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      );
  
}

export default PsychologistLayout
