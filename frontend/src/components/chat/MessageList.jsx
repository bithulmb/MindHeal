import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import {format} from 'date-fns'
import { useEffect, useRef } from "react";

export default function MessageList({ messages }) {
  
  const loggedinUserId = useSelector((state) => state.auth.user.user_id);

  const messagesEndRef = useRef(null)
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">
          No messages yet. Start a conversation!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 ">
      {messages.map((message,index) => (
        <div key={message.id || index}>
          {message.sender === loggedinUserId ? (
            <div className="flex gap-3 flex-row-reverse">
              <Avatar className="h-10 w-10 bg-gray-600">
                {message.sender_profile_image ? (
                  <img
                    src={message.sender_profile_image}
                    alt="Sender Profile"
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <div className="text-white text-xs m-auto bg-gray-500 flex items-center justify-center h-full w-full rounded-full">
                    {message.sender_name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </Avatar>
              <div className="max-w-[70%]">
                <div
                  className={cn(
                    "rounded-lg p-3",
                    message.sender === loggedinUserId
                      ? "bg-foreground text-background"
                      : "bg-muted"
                  )}
                >
                  {message.message}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {format(new Date(message.timestamp), "dd/MM/yyyy hh:mm a")}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 bg-gray-600">
                {message.sender_profile_image ? (
                  <img
                    src={message.sender_profile_image}
                    alt="Sender Profile"
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <div className="text-white text-xs m-auto bg-gray-500 flex items-center justify-center h-full w-full rounded-full">
                    {message.sender_name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </Avatar>
              <div className="max-w-[70%]">
                <div
                  className={cn(
                    "rounded-lg p-3",
                    message.sender === loggedinUserId
                      ? "bg-black text-white"
                      : "bg-muted"
                  )}
                >
                  {message.message}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {format(new Date(message.timestamp), "dd/MM/yyyy hh:mm a")}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
       <div ref={messagesEndRef} /> 
    </div>
  );
}
