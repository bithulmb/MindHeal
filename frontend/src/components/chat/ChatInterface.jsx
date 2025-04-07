import { useEffect, useRef, useState } from "react";
import { Send} from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatList from "@/components/chat/ChatList";
import MessageList from "@/components/chat/MessageList";
import api from "../api/api";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { ACCESS_TOKEN, DOMAIN_NAME, WEB_SOCKET_URL } from "@/utils/constants/constants";

export default function ChatInterface({ threadIdFromURL }) {
  const [threads, setThreads] = useState([]);
  const [selectedChat, setSelectedChat] = useState(threads[0] || null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const loggedinUserId = useSelector((state) => state.auth.user.user_id);

  const location = useLocation();
  const isPsychologist = location.pathname.includes("psychologist");

  const ACCESS = localStorage.getItem(ACCESS_TOKEN)

  useEffect(() => {
    api
      .get(`/api/chat/threads/`)
      .then((response) => {
        setThreads(response.data);

        const chatThread = response.data.find(
          (thread) => thread.id == threadIdFromURL
        );

        if (chatThread) {
          setSelectedChat(chatThread);
        } else {
          setSelectedChat(response.data[0]);
        }
      })

      .catch((err) => console.error("error fetchih thread", err));
  }, [threadIdFromURL]);

  useEffect(() => {
    if (selectedChat) {
      const ws = new WebSocket(
        `${WEB_SOCKET_URL}/ws/chat/${selectedChat.id}/?token=${ACCESS}`
      );

      ws.onopen = () => console.info("websocket connected");

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
       

        const isOwnMessage = data.sender === loggedinUserId;

        const senderProfileImage = isOwnMessage
          ? isPsychologist
            ? selectedChat.psychologist_image
            : selectedChat.patient_image
          : isPsychologist
          ? selectedChat.patient_image
          : selectedChat.psychologist_image;

        const updatedMessage = {
          ...data,
          sender_profile_image: senderProfileImage,
        };
        console.log(updatedMessage);
        setMessages((prev) => [...prev, updatedMessage]);
      };
      

      ws.onclose = () => console.info("WebSocket disconnected");

      setSocket(ws);

      return () => ws.close(); // for closing websocket on unmounting
    }
  }, [selectedChat]);

  useEffect(() => {
    if (selectedChat) {
      api
        .get(`/api/chat/messages/${selectedChat.id}/`)
        .then((response) => setMessages(response.data))
        .catch((err) => console.error("error fetching messages", err));
    }
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    const messageData = JSON.stringify({
      message: newMessage,
      sender: loggedinUserId,
    });

    socket.send(messageData);

    setNewMessage("");
  };

  return (
    <div className="flex h-[500px] flex-col md:flex-row overflow-auto">
      {/* Chat List Sidebar */}
      <div className="w-full border-r md:w-60">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-semibold">
            Chats{" "}
            <span className="text-muted-foreground">({threads.length})</span>
          </h2>
        </div>
        <ChatList
          chats={threads}
          isPsychologist={isPsychologist}
          selectedChatId={selectedChat?.id}
          onSelectChat={(chat) => setSelectedChat(chat)}
        />
      </div>

      {/* Chat Interface */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={
                  isPsychologist
                    ? selectedChat?.patient_image
                    : selectedChat?.psychologist_image
                }
              />
            </Avatar>
            <div>
              <h3 className="font-medium">
                {isPsychologist
                  ? selectedChat?.patient_name
                  : selectedChat?.psychologist_name}
              </h3>
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
            <div className="relative flex-1">
              <Input
                placeholder="Type a message..."
                className="rounded-full pr-10"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              {/* <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full rounded-full">
                <Smile className="h-5 w-5" />
              </Button> */}
            </div>
            <Button
              size="icon"
              className="rounded-full"
              onClick={handleSendMessage}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
