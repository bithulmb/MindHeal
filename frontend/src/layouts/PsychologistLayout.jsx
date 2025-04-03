import PsychologistSidebar from '@/components/psychologist/PsychologistSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import useNotifications from '@/hooks/useNotifications';
import React, { createContext, useContext } from 'react'
import { Outlet } from 'react-router-dom';


const NotificationContext = createContext()

export const useNotificationContext = () => useContext(NotificationContext)

const PsychologistLayout = () => {

    const notifications = useNotifications()
    
    
    return (
        <NotificationContext.Provider value={notifications}>
            <div className="flex">
          <PsychologistSidebar/>
          {/* <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main> */}
          <ScrollArea className="flex-1 h-screen">
          <Outlet />
        </ScrollArea>
        </div>

        </NotificationContext.Provider>
      
      );
  
}

export default PsychologistLayout
