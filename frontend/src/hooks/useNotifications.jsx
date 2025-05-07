import { ACCESS_TOKEN, DOMAIN_NAME, WEB_SOCKET_URL } from '@/utils/constants/constants';
import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { toast } from 'sonner';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem(ACCESS_TOKEN);
  const socketUrl = token ? `${WEB_SOCKET_URL}/ws/notifications/?token=${token}` : null;

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log('WebSocket connected'),
    onClose: (event) => console.log('WebSocket closed with code:', event.code, 'reason:', event.reason),
    onError: (error) => console.error('WebSocket error:', error),
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    if (lastJsonMessage !== null) {
      setNotifications((prev) => [...prev, lastJsonMessage]);
      toast.info(lastJsonMessage.message, { position: 'top-right' });
    }
  }, [lastJsonMessage]);

  return notifications;
};

export default useNotifications;


