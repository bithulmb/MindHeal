import React, { useEffect, useState } from "react";
import VideoCall from "./VideoCall";
import { useLocation, useParams } from "react-router-dom";
import api from "../api/api";

function VideoCallPage() {
  const { consultation_id } = useParams();
  const [userId, setUserId] = useState(null);
  const [psychologistId, setPsychologistId] = useState(null);
  const [channelName, setChannelName] = useState(null);

 
  const location = useLocation()
  const isPsychologist = location.pathname.includes("psychologist")


  // Create a channel id using consultation id
  useEffect(() => {
    const createChannel = async () => {
      try {
        const response = await api.post("/api/video-call/create-channel/", {
          consultation_id: consultation_id,
        });
        const data = response.data;
        setChannelName(data.channel_name);
        setUserId(data.user);
        setPsychologistId(data.psychologist);
      } catch (error) {
        console.error("Error creating channel:", error);
      }
    };

    createChannel();
  }, []);

  return (
    <div className="">
      <h1>{isPsychologist ? "Psychologist-User Video Call" : "User-Psychologist Video Call"}</h1>
      {channelName ? (
        <VideoCall
          userId={userId}
          psychologistId={psychologistId}
          channelName={channelName}
         
        />
      ) : (
        <p>Loading video call setup...</p>
      )}
    </div>
  );
}

export default VideoCallPage;
