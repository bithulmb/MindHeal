"use client"

import { useEffect, useState } from "react"
import {
  ChevronDown,
  Info,
  Mic,
  MoreHorizontal,
  PenSquare,
  Phone,
  PlusCircle,
  Send,
  Smile,
  VideoIcon,
} from "lucide-react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ChatList from "@/components/chat/ChatList"
import MessageList from "@/components/chat/MessageList"
import { cn } from "@/lib/utils"
import api from "../api/api"

// Mock data for chats
const chats = [
  {
    id: 1,
    name: "Jane Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Jane: Typing...",
    color: "bg-orange-500",
    lastActive: "2 mins ago",
    messages: [
      {
        id: 1,
        content: "How are you?",
        timestamp: "10:02 AM",
        sender: "them",
      },
      {
        id: 2,
        content: "I am good, you?",
        timestamp: "10:03 AM",
        sender: "me",
      },
    ],
  },
  {
    id: 2,
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "",
    color: "bg-pink-500",
    lastActive: "5 mins ago",
    messages: [],
  },
  {
    id: 3,
    name: "Elizabeth Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "",
    color: "bg-yellow-500",
    lastActive: "10 mins ago",
    messages: [],
  },
  {
    id: 4,
    name: "John Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "",
    color: "bg-green-500",
    lastActive: "15 mins ago",
    messages: [],
  },
]

export default function ChatInterface({threadIdFromURL}) {

  const [threads, setThreads] = useState([])
  const [selectedChat, setSelectedChat] = useState(chats[0])
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([])

  useEffect(() => {
    
    api.get(`/api/chat/threads/`)
      .then((response) => {
        setThreads(response.data)
        console.log(response.data)
        const chatThread = response.data.find(thread => thread.id == threadIdFromURL)
        console.log(chatThread)
        if (chatThread){
          console.log("true")
          setSelectedChat(chatThread)
        } else {
          console.log('false')
          setSelectedChat(response.data[0])
        }
      })
       
      .catch((err) => console.error("error fetchih thread",err))

   
   
  },[threadIdFromURL])

  useEffect(() => {
    if (selectedChat){
      api.get(`/api/chat/messages/${selectedChat.id}/`)
      .then(response => setMessages(response.data))
      .catch(err => console.error("error fetching messages",err))
    
    }
  },[selectedChat])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    // In a real app, you would send this to an API
    console.log("Sending message:", newMessage)

    // Clear the input
    setNewMessage("")
  }

  return (
    <div className="flex h-[600px] flex-col md:flex-row">
      {/* Chat List Sidebar */}
      <div className="w-full border-r md:w-80">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-semibold">
            Chats <span className="text-muted-foreground">({threads.length})</span>
          </h2>
          {/* <div className="flex gap-1">
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <PenSquare className="h-5 w-5" />
            </Button>
          </div> */}
        </div>
        <ChatList chats={threads} selectedChatId={selectedChat.id} onSelectChat={(chat) => setSelectedChat(chat)} />
      </div>

{/* 
            <div className="w-full border-r md:w-80">
        <h2 className="text-xl font-semibold p-4">Chats</h2>
        {threads.map((chat) => (
          <div 
            key={chat.id} 
            className={`p-3 cursor-pointer ${selectedChat?.id === chat.id ? "bg-gray-200" : ""}`} 
            onClick={() => setSelectedChat(chat)}
          >
            {chat.psychologist_name}
          </div>
        ))}
      </div> */}

      {/* Chat Interface */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
            <AvatarImage src={selectedChat.psychologist_image} />
            </Avatar>
            <div>
              <h3 className="font-medium">{selectedChat.psychologist_name}</h3>
              {/* <p className="text-xs text-muted-foreground">Active {selectedChat.lastActive}</p> */}
            </div>
          </div>
   
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <MessageList messages={messages} />
          <div className="flex justify-center mt-4">
            {/* <Button variant="outline" size="sm" className="rounded-full">
              <ChevronDown className="h-4 w-4 mr-1" />
              Scroll to bottom
            </Button> */}
          </div>
        </div>

        {/* Message Input */}
        <div className="border-t p-3">
          <div className="flex items-center gap-2">
            {/* <Button variant="ghost" size="icon" className="rounded-full">
              <PlusCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Mic className="h-5 w-5" />
            </Button> */}
            <div className="relative flex-1">
              <Input
                placeholder="Type a message..."
                className="rounded-full pr-10"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage()
                  }
                }}
              />
              {/* <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full rounded-full">
                <Smile className="h-5 w-5" />
              </Button> */}
            </div>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleSendMessage}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

