"use client"

import { useState } from "react"
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
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ChatList from "@/components/chat/ChatList"
import MessageList from "@/components/chat/MessageList"
import { cn } from "@/lib/utils"

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

export default function ChatInterface() {


  const [selectedChat, setSelectedChat] = useState(chats[0])
  const [message, setMessage] = useState("")

  const handleSendMessage = () => {
    if (!message.trim()) return

    // In a real app, you would send this to an API
    console.log("Sending message:", message)

    // Clear the input
    setMessage("")
  }

  return (
    <div className="flex h-[600px] flex-col md:flex-row">
      {/* Chat List Sidebar */}
      <div className="w-full border-r md:w-80">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-semibold">
            Chats <span className="text-muted-foreground">(4)</span>
          </h2>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <PenSquare className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <ChatList chats={chats} selectedChatId={selectedChat.id} onSelectChat={(chat) => setSelectedChat(chat)} />
      </div>

      {/* Chat Interface */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b p-3">
          <div className="flex items-center gap-3">
            <Avatar className={cn("h-10 w-10", selectedChat.color)}>
              <div className="text-white">
                {selectedChat.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            </Avatar>
            <div>
              <h3 className="font-medium">{selectedChat.name}</h3>
              <p className="text-xs text-muted-foreground">Active {selectedChat.lastActive}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <VideoIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Info className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <MessageList messages={selectedChat.messages} />
          <div className="flex justify-center mt-4">
            <Button variant="outline" size="sm" className="rounded-full">
              <ChevronDown className="h-4 w-4 mr-1" />
              Scroll to bottom
            </Button>
          </div>
        </div>

        {/* Message Input */}
        <div className="border-t p-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <PlusCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Mic className="h-5 w-5" />
            </Button>
            <div className="relative flex-1">
              <Input
                placeholder="Type a message..."
                className="rounded-full pr-10"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage()
                  }
                }}
              />
              <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full rounded-full">
                <Smile className="h-5 w-5" />
              </Button>
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

