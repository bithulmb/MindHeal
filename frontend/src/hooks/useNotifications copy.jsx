import { ACCESS_TOKEN, DOMAIN_NAME } from "@/utils/constants/constants";
import { toast } from "sonner";
import { useState, useEffect, useRef } from 'react';

// const useNotifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const wsRef = useRef(null); // Using ref instead of state

//   useEffect(() => {
//     const token = localStorage.getItem(ACCESS_TOKEN);
//     if (!token) return;

//     // Close existing connection if any
//     if (wsRef.current && wsRef.current.readyState=== WebSocket.OPEN) {
//       wsRef.current.close();
//     }

//     const websocket = new WebSocket(
//       `wss://${DOMAIN_NAME}/ws/notifications/?token=${token}`
//     );

//     websocket.onopen = () => {
//       console.log("WebSocket connected");
//     };

//     websocket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       setNotifications((prev) => [...prev, data]);
//       toast.info(data.message, { position: "top-right" });
//     };

//     websocket.onclose = (event) => {
//       console.log(
//         "WebSocket closed with code:",
//         event.code,
//         "reason:",
//         event.reason
//       );
//     };

//     websocket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     wsRef.current = websocket; // Store in ref

//     return () => {
//       if (websocket.readyState === WebSocket.OPEN) {
//         websocket.close();
//       }
//     };
//   }, []); // Empty dependency array

//   return notifications;
// };


// export default useNotifications;

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) return;
    const websocket = new WebSocket(
      `ws://${DOMAIN_NAME}/ws/notifications/?token=${token}`
    );

    websocket.onopen = () => {
      console.log("WebSocket connected");
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications((prev) => [...prev, data]);
      toast.info(data.message, { position: "top-right" });
    };
    websocket.onclose = (event) => {
      console.log(
        "WebSocket closed with code:",
        event.code,
        "reason:",
        event.reason
      );
    };

    websocket.onerror = (error) => {
      console.error("Failed to connect WebSocket error:", error);

    };
    setWs(websocket);
    return () => {
      websocket.close()
      // if (websocket.readyState === WebSocket.OPEN) {
      //   websocket.close();
      // }
    };
  }, []);

  return notifications;
};

export default useNotifications;

// const useNotifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [ws, setWs] = useState(null);

//   const connectWebSocket = () => {
//     const token = localStorage.getItem(ACCESS_TOKEN);
//     if (!token) {
//       console.log("No token found");
//       return;
//     }

//     const websocket = new WebSocket(
//       `ws://${DOMAIN_NAME}/ws/notifications/?token=${token}`
//     );

//     websocket.onopen = () => {
//       console.log("WebSocket connected");
//       setWs(websocket);
//     };

//     websocket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       setNotifications((prev) => [...prev, data]);
//       toast.info(data.message, { position: "top-right" });
//     };

//     websocket.onclose = () => {
//       console.log("WebSocket disconnected");
//       setTimeout(connectWebSocket, 2000); // Retry after 1 second
//     };

//     websocket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//       toast.error("Failed to connect to notifications.");
//       websocket.close(); 
//     };

//     return websocket;
//   };

//   useEffect(() => {
//     const websocket = connectWebSocket();
//     return () => {
//       if (websocket.readyState === WebSocket.OPEN) {
//         websocket.close();
//       }
//     };
//   }, []);

//   return notifications;
// };

// export default useNotifications;
