import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import api from "../api/api"; 

const VideoCall = ({ userId, psychologistId, channelName, isPsychologist }) => {
  const requestedUserName = useSelector((state) => state.auth.user.name);
  const APP_ID = parseInt(import.meta.env.VITE_ZEGO_APP_ID); 
  const roomID = channelName;
  const requestedUserId = (isPsychologist ? psychologistId : userId).toString();
  const [token, setToken] = useState(""); 
  
  // Fetch token from backend 
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await api.post("/api/video-call/generate-zego-token/", {
          user_id: requestedUserId,
          room_id: roomID,
          is_psychologist : isPsychologist,
        });
        setToken(response.data.token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, [requestedUserId, roomID]); 

  // Function to start the video call
  const startCall = (element) => {
    if (!token || !element) return; // Wait for token and element to be ready

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
      APP_ID,
      token,
      roomID,
      requestedUserId,
      requestedUserName
   );
    const zp = ZegoUIKitPrebuilt.create(kitToken); 
    zp.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall, 
      },
      showScreenSharingButton: false,
      showPreJoinView: false,
    });
  };

  return (
    <div
      className="myCallContainer m-4"
      ref={startCall}
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};

export default VideoCall;