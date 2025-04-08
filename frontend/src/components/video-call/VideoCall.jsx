import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import api from "../api/api";
import { useParams } from "react-router-dom";
import { ZEGO_APP_ID } from "@/utils/constants/constants";

const VideoCall = ({ userId, psychologistId, channelName, isPsychologist }) => {
  const requestedUserName = useSelector((state) => state.auth.user.name);
  const APP_ID = parseInt(ZEGO_APP_ID);
  const roomID = channelName;
  const requestedUserId = (isPsychologist ? psychologistId : userId).toString();
  const [token, setToken] = useState("");
  const { consultation_id } = useParams();
  const videoCallRef = useRef(null); 

  // Fetch token from backend
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await api.post("/api/video-call/generate-zego-token/", {
          user_id: requestedUserId,
          room_id: roomID,
          is_psychologist: isPsychologist,
        });
        setToken(response.data.token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    fetchToken();
  }, [requestedUserId, roomID, isPsychologist]);

  // Update consultation status after leaving
  const updateConsultationStatus = async () => {
    try {
      await api.patch(`/api/consultations/${consultation_id}/complete/`, {
        status: "Completed",
      });
      console.log("Consultation status updated successfully");
    } catch (error) {
      console.error("Error updating consultation status:", error);
    }
  };

  // Start the video call
  useEffect(() => {
    if (!token || !videoCallRef.current) return;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
      APP_ID,
      token,
      roomID,
      requestedUserId,
      requestedUserName
    );
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: videoCallRef.current,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: false,
      showPreJoinView: false,
      onLeaveRoom: () => {
        console.log("User left the room");
        updateConsultationStatus();
      },
    });
  }, [token]); 

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div
        ref={videoCallRef}
        className="w-full max-w-4xl h-[500px] rounded-lg shadow-lg bg-white overflow-hidden"
      />
    </div>
  );
};

export default VideoCall;