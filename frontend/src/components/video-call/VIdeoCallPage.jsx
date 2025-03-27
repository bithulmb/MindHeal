import React, { useEffect, useState } from "react";
import VideoCall from "./VideoCall";
import { useLocation, useParams } from "react-router-dom";
import api from "../api/api";

function VideoCallPage() {
  const { consultation_id } = useParams();
  const [userId, setUserId] = useState(null);
  const [psychologistId, setPsychologistId] = useState(null);
  const [channelName, setChannelName] = useState(null);
  const [isCallStarted, setIsCallStarted] = useState(false); // New state to control video call start

  const location = useLocation();
  const isPsychologist = location.pathname.includes("psychologist");

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
  }, [consultation_id]);

  // Function to handle button click and start the video call
  const handleStartCall = () => {
    setIsCallStarted(true);
  };

  return (
    <div className="text-center">
      <h1 className="font-extrabold text-center text-2xl">Therapy Video Session</h1>
      {channelName ? (
        <>
          {!isCallStarted ? (
            <button
              onClick={handleStartCall}
              className="bg-blue-600 text-white px-6 py-3 m-6 rounded-lg shadow-md hover:bg-blue-700 transition-all"
            >
              Start Video Call
            </button>
          ) : (
            <VideoCall
              userId={userId}
              psychologistId={psychologistId}
              channelName={channelName}
              isPsychologist={isPsychologist}
            />
          )}
        </>
      ) : (
        <p>Loading video call setup...</p>
      )}
    </div>
  );
}

export default VideoCallPage;