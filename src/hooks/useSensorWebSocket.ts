import { useState, useEffect, useRef } from 'react';
import { SensorReading } from '@/types/sensor';
import { getWebSocketUrl } from '@/config/django';

export const useSensorWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [latestReading, setLatestReading] = useState<SensorReading | null>(null);
  const [allReadings, setAllReadings] = useState<SensorReading[]>([]);
  const [error, setError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = useRef(3000);

  const connect = () => {
    try {
      const wsUrl = getWebSocketUrl();
      console.log('Connecting to WebSocket:', wsUrl);
      ws.current = new WebSocket(wsUrl);
      
      ws.current.onopen = () => {
        console.log('✅ WebSocket connected to sensor stream');
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
        reconnectInterval.current = 3000; // Reset interval
      };
      
      ws.current.onmessage = (event) => {
        try {
          const data: SensorReading = JSON.parse(event.data);
          console.log('📡 Received sensor data:', data);
          
          setLatestReading(data);
          
          // Update or add to readings list
          setAllReadings(prev => {
            const existingIndex = prev.findIndex(reading => reading.id === data.id);
            if (existingIndex >= 0) {
              // Update existing reading
              const updated = [...prev];
              updated[existingIndex] = data;
              return updated;
            } else {
              // Add new reading, keep last 100
              return [...prev, data].slice(-100);
            }
          });
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
          setError('Invalid data received from server');
        }
      };
      
      ws.current.onclose = () => {
        console.log('❌ WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt reconnection with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(`🔄 Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
          
          setTimeout(() => {
            connect();
          }, reconnectInterval.current);
          
          // Exponential backoff
          reconnectInterval.current = Math.min(reconnectInterval.current * 1.5, 30000);
        } else {
          setError('Failed to reconnect to WebSocket after multiple attempts');
        }
      };
      
      ws.current.onerror = (error) => {
        console.error('🔴 WebSocket error:', error);
        setError('WebSocket connection failed');
        setIsConnected(false);
      };
    } catch (err) {
      setError('Failed to create WebSocket connection');
      console.error('WebSocket creation error:', err);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const reconnect = () => {
    reconnectAttempts.current = 0;
    reconnectInterval.current = 3000;
    if (ws.current) {
      ws.current.close();
    }
    connect();
  };

  return {
    isConnected,
    latestReading,
    allReadings,
    error,
    reconnect
  };
};
