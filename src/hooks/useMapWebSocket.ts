
import { useEffect, useRef, useState } from 'react';
import { getMapWebSocketUrl } from '../config/django';

export const useMapWebSocket = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [mapData, setMapData] = useState<any[]>([]);

  useEffect(() => {
    const wsUrl = getMapWebSocketUrl();
    console.log('[Map WebSocket] Connecting to:', wsUrl);
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('[Map WebSocket] Connected to maps endpoint');
      setIsConnected(true);
      socket.send(JSON.stringify({ 
        type: 'init', 
        message: 'Hello from frontend (maps)',
        timestamp: new Date().toISOString()
      }));
    };

    socket.onmessage = (event) => {
      console.log('[Map WebSocket] Received from server:', event.data);
      try {
        const data = JSON.parse(event.data);
        setMapData(prev => [...prev, data]);
        // Handle map data update here
      } catch (error) {
        console.error('[Map WebSocket] Error parsing message:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('[Map WebSocket] Error:', error);
      setIsConnected(false);
    };

    socket.onclose = () => {
      console.log('[Map WebSocket] Connection closed');
      setIsConnected(false);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  const sendMessage = (message: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
      console.log('[Map WebSocket] Sent message:', message);
    } else {
      console.warn('[Map WebSocket] Cannot send message - connection not open');
    }
  };

  return {
    isConnected,
    mapData,
    sendMessage,
    socket: socketRef.current
  };
};
