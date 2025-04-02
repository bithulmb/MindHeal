import { ACCESS_TOKEN, DOMAIN_NAME } from "@/utils/constants/constants";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const useNotifications = () => {

    const [notifications, setNotifications] = useState([]);
    const [ws, setWs] = useState(null);

    useEffect(()=> {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if(!token) return
        const websocket = new WebSocket(`ws://${DOMAIN_NAME}/ws/notifications/?token=${token}`)

        websocket.onopen = () => {
            console.log("WebSocket connected");
          };

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            setNotifications((prev) => [...prev, data])
            toast.info(data.message,
              {position : "top-right"})

        }

        websocket.onclose = () => {
            console.log("WebSocket disconnected");
          };

        websocket.onerror = (error) => {
            console.error("Failed to connect WebSocket error:", error);
            // toast.error("Failed to connect to notifications.");
          };

          setWs(websocket);

          return () => {
            websocket.close()
          }
    },[])

    
    return notifications

}

export default useNotifications