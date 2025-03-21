import React, { useState, useEffect, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import axios from 'axios';
import api from '../api/api';

const VideoCall = ({ userId, psychologistId, isUser, consultationId }) => {
    console.log(userId,psychologistId)
    const [appId, setAppId] = useState('');
  const [token, setToken] = useState('');
  const [channelName, setChannelName] = useState('');
  const [inCall, setInCall] = useState(false);
  
  // References to maintain client and tracks
  const clientRef = useRef(null);
  const localAudioTrackRef = useRef(null);
  const localVideoTrackRef = useRef(null);
  const remoteUsersRef = useRef({});
  const [remoteUsers, setRemoteUsers] = useState({});
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);

  
  useEffect(() => {
    const setupCall = async () => {
      if (isUser) {
        console.log("hiiiii1")
        // User creates the channel
        try {
          const response = await api.post('/api/video-call/create-channel/', {
            user_id: userId,
            psychologist_id: psychologistId,
            consultation_id : consultationId,
          });
          setChannelName(response.data.channel_name);
        } catch (error) {
          console.error("Error creating channel:", error);
        }
      } else {
        // Psychologist gets existing channel
        try {
          const response = await api.get(`/api/get-channel/${psychologistId}`);
          setChannelName(response.data.name);
        } catch (error) {
          console.error("Error getting channel:", error);
        }
      }
    };

    if (userId && psychologistId) {
      setupCall();
    }
  }, [userId, psychologistId, isUser]);

  useEffect(() => {
    const getToken = async () => {
      if (channelName) {
        try {
          const response = await api.post('/api/video-call/generate-token/', {
            channel_name: channelName,
            uid: isUser ? userId : psychologistId
          });
          setAppId(response.data.app_id);
          setToken(response.data.token);
        } catch (error) {
          console.error("Error generating token:", error);
        }
      }
    };

    if (channelName) {
      getToken();
    }
  }, [channelName, userId, psychologistId, isUser]);

  // Setup Agora client when joining a call
  useEffect(() => {
    if (inCall && appId && token && channelName) {
      // Create Agora client
      clientRef.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      
      // Setup event handlers
      clientRef.current.on("user-published", async (user, mediaType) => {
        await clientRef.current.subscribe(user, mediaType);
        
        if (mediaType === "video") {
          remoteUsersRef.current[user.uid] = user;
          setRemoteUsers({...remoteUsersRef.current});
        }
        
        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });

      clientRef.current.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "audio") {
          if (user.audioTrack) user.audioTrack.stop();
        }
        
        if (mediaType === "video") {
          delete remoteUsersRef.current[user.uid];
          setRemoteUsers({...remoteUsersRef.current});
        }
      });

      clientRef.current.on("user-left", (user) => {
        delete remoteUsersRef.current[user.uid];
        setRemoteUsers({...remoteUsersRef.current});
      });

      // Initialize and join the channel
      const init = async () => {
        try {
          await clientRef.current.join(appId, channelName, token, null);
          
          // Create and publish local tracks
          localAudioTrackRef.current = await AgoraRTC.createMicrophoneAudioTrack();
          localVideoTrackRef.current = await AgoraRTC.createCameraVideoTrack();
          
          await clientRef.current.publish([
            localAudioTrackRef.current,
            localVideoTrackRef.current
          ]);
          
          // Play local video track
          localVideoTrackRef.current.play("local-video");
          
        } catch (error) {
          console.error("Error initializing video call:", error);
        }
      };
      
      init();

      // Cleanup when component unmounts or when leaving call
      return () => {
        if (localAudioTrackRef.current) {
          localAudioTrackRef.current.close();
          localAudioTrackRef.current = null;
        }
        
        if (localVideoTrackRef.current) {
          localVideoTrackRef.current.close();
          localVideoTrackRef.current = null;
        }
        
        if (clientRef.current) {
          clientRef.current.leave().then(() => {
            console.log("Left channel successfully");
          }).catch(err => {
            console.error("Error leaving channel:", err);
          });
        }
      };
    }
  }, [inCall, appId, token, channelName]);

  const toggleMic = () => {
    if (localAudioTrackRef.current) {
      localAudioTrackRef.current.setEnabled(!localAudioTrackRef.current.enabled);
    }
  };

  const toggleCamera = () => {
    if (localVideoTrackRef.current) {
      localVideoTrackRef.current.setEnabled(!localVideoTrackRef.current.enabled);
    }
  };

  const endCall = () => {
    if (localAudioTrackRef.current) {
      localAudioTrackRef.current.close();
      localAudioTrackRef.current = null;
    }
    
    if (localVideoTrackRef.current) {
      localVideoTrackRef.current.close();
      localVideoTrackRef.current = null;
    }
    
    if (clientRef.current) {
      clientRef.current.leave().then(() => {
        console.log("Left channel successfully");
        setInCall(false);
      }).catch(err => {
        console.error("Error leaving channel:", err);
      });
    }
  };

  return (
    <div className="w-full h-full min-h-[500px]">
      {appId && token && channelName ? (
        inCall ? (
          <div className="flex flex-col h-full">
            <div className="relative w-1/3 min-w-[200px] h-[200px] z-10 m-2 self-end border-2 border-blue-500 rounded-lg overflow-hidden">
              <div id="local-video" className="w-full h-full bg-gray-100"></div>
              <div className="flex justify-around p-2 bg-black bg-opacity-50 rounded-b-lg absolute bottom-0 left-0 w-full">
                <button 
                  onClick={toggleMic}
                  className={`px-3 py-2 rounded-full border-none ${isMicEnabled ? 'bg-blue-500' : 'bg-red-500'} text-white cursor-pointer transition-colors duration-200 hover:bg-opacity-90`}
                >
                  {isMicEnabled ? "Mute Mic" : "Unmute Mic"}
                </button>
                <button 
                  onClick={toggleCamera}
                  className={`px-3 py-2 rounded-full border-none ${isCameraEnabled ? 'bg-blue-500' : 'bg-red-500'} text-white cursor-pointer transition-colors duration-200 hover:bg-opacity-90`}
                >
                  {isCameraEnabled ? "Turn Off Camera" : "Turn On Camera"}
                </button>
                <button 
                  onClick={endCall}
                  className="px-3 py-2 rounded-full border-none bg-red-600 text-white cursor-pointer transition-colors duration-200 hover:bg-red-700"
                >
                  End Call
                </button>
              </div>
            </div>
            <div className="relative w-full h-[calc(100%-220px)] bg-gray-100 flex justify-center items-center">
              {Object.values(remoteUsers).length > 0 ? (
                Object.values(remoteUsers).map((user) => (
                  <div key={user.uid} className="w-full h-full">
                    <div 
                      id={`remote-video-${user.uid}`} 
                      className="w-full h-full bg-gray-100"
                      ref={(element) => {
                        if (element && user.videoTrack) {
                          user.videoTrack.play(element);
                        }
                      }}
                    ></div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <p className="text-lg">Waiting for other participant to join...</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ready to start your session?</h2>
            <button 
              onClick={() => setInCall(true)}
              className="px-6 py-3 text-lg bg-green-600 text-white border-none rounded-md cursor-pointer mt-4 transition-colors duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Join Call
            </button>
          </div>
        )
      ) : (
        <div className="flex justify-center items-center h-full">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-lg text-gray-600">Setting up video call...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;