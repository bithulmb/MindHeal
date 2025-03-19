import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api/api";

const Chat = ({ userId, psychologistId }) => {
    const [threadId, setThreadId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        api.get(`/api/chat/thread/${psychologistId}/`)
            .then(response => {
                setThreadId(response.data.thread_id);
            });
    }, [psychologistId]);

    useEffect(() => {
        if (threadId) {
            api.get(`/api/chat/messages/${threadId}/`)
                .then(response => setMessages(response.data));
            
            const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${threadId}/`);
            ws.onmessage = (event) => {
                setMessages(prev => [...prev, JSON.parse(event.data)]);
            };
            setSocket(ws);

            return () => ws.close();
        }
    }, [threadId]);

    const sendMessage = () => {
        if (socket && newMessage.trim() !== "") {
            socket.send(JSON.stringify({
                message: newMessage,
                sender: userId
            }));
            setNewMessage("");
        }
    };

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender === userId ? "sent" : "received"}>
                        <p>{msg.message}</p>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;

