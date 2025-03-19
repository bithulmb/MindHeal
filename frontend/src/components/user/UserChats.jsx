import React from 'react'
import Chat from '../chat/Chat'
import ChatInterface from '../chat/ChatInterface'
import { useSearchParams } from 'react-router-dom';

const UserChats = () => {

  const [searchParams] = useSearchParams();
  const threadIdFromURL = searchParams.get("thread_id"); 

  return (
       <main className="flex  flex-col items-center justify-center">
         <div className="w-full max-w-6xl rounded-xl border shadow-sm">
           <ChatInterface threadIdFromURL={threadIdFromURL}/>
         </div>
       </main>
     )
  
}

export default UserChats
