import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import { AgoraRTCProvider } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import api from "../api/api";
import { useLocation } from "react-router-dom";
import { Video, Mic, MicOff, VideoOff, PhoneOff } from "lucide-react";

const VideoCall = ({ userId, psychologistId, channelName }) => {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  return (
    <AgoraRTCProvider client={client}>
      <VideoCallComponent userId={userId} psychologistId={psychologistId} channelName={channelName} />
    </AgoraRTCProvider>
  );
};

const VideoCallComponent = ({ userId, psychologistId, channelName }) => {
  const [calling, setCalling] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const isConnected = useIsConnected();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  // const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  const remoteUsers = useRemoteUsers();
  const { localCameraTrack, error: cameraError } = useLocalCameraTrack(cameraOn);
  
  
  const location = useLocation();
  const isPsychologist = location.pathname.includes("psychologist");


  useEffect(() => {
    console.log("Local Camera Track:", localCameraTrack?.isPlaying ? "Playing" : "Not Playing", localCameraTrack);
    console.log("Remote Users:", remoteUsers);
    remoteUsers.forEach((user) => {
      console.log(`Remote UID ${user.uid} Video Track:`, user.videoTrack?.isPlaying ? "Playing" : "Not Playing", user.videoTrack);
    });
  }, [localCameraTrack, remoteUsers]);

 
useEffect(() => {
  if (cameraError) {
    console.error("Camera track error:", cameraError);
  }
}, [cameraError]);

useEffect(() => {
  if (localCameraTrack) {
    console.log("Local camera track is available");
  } else {
    console.log("Local camera track is not available");
  }
}, [localCameraTrack]);

useEffect(() => {
  remoteUsers.forEach((user) => {
    console.log(`Remote user ${user.uid}:`, user);
    if (user.videoTrack) {
      console.log(`Remote user ${user.uid} has video track`);
    } else {
      console.log(`Remote user ${user.uid} does not have video track`);
    }
  });
}, [remoteUsers]);

  // Fetch token from backend
  const fetchToken = async () => {
    try {
      const response = await api.post("/api/video-call/generate-token/", {
        uid: isPsychologist ? psychologistId : userId,
        channel_name: channelName,
      });
      setTokenData(response.data);
      setCalling(true);
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  // Join the channel when token data is available
  useJoin(
    {
      appid: tokenData?.app_id,
      channel: tokenData?.channel_name,
      token: tokenData?.token,
      uid: tokenData?.uid,
    },
    calling
  );

  // Publish local tracks
  usePublish([localMicrophoneTrack, localCameraTrack]);

console.log("Joining channel:", channelName, "with UID:", isPsychologist ? psychologistId : userId);
console.log("Remote users detected:", remoteUsers);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 p-6">
      {!isConnected ? (
        <button
          onClick={fetchToken}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          Start Video Call
        </button>
      ) : (
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800 dark:text-white">
            Video Call
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Local User (You) */}
            <div className="relative w-full h-64 bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden">
              <LocalUser
                audioTrack={localMicrophoneTrack}
                videoTrack={localCameraTrack}
                cameraOn={cameraOn}
                micOn={micOn}
                playAudio={false}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                You
              </div>
            </div>

            {/* Remote User (Psychologist) */}
            {remoteUsers.length > 0 ? (
              remoteUsers.map((user) => (
                <div key={user.uid} className="relative w-full h-64 bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <RemoteUser user={user} className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                    {isPsychologist ? "User" : "Psychologist"}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center w-full h-64 bg-gray-300 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400">Waiting for the other user...</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setMic((prev) => !prev)}
              className={`p-3 rounded-full shadow-md transition-all ${
                micOn ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              {micOn ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>

            <button
              onClick={() => setCamera((prev) => !prev)}
              className={`p-3 rounded-full shadow-md transition-all ${
                cameraOn ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              {cameraOn ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </button>

            <button
              onClick={() => setCalling(false)}
              className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition-all"
            >
              <PhoneOff className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
