
import { useCallback, useEffect, useState } from 'react';
import { useWebSocketContext } from '@/providers/WebSocketProvider';
import { WaterQualityData } from '@/hooks/useRealTimeData';

export interface DjangoMessage {
  type: 'sensor_data' | 'device_status' | 'alert' | 'command' | 'heartbeat';
  device_id?: string;
  data: any;
  timestamp?: string;
}

export interface TelemetryData {
  device: string;
  fw: string;
  ph: number;
  turbidity: number;
  conductivity: number;
  ise_value: number;
  mercury_ppb: number;
  battery_v: number;
  gps: { lat: number; lon: number };
  location_source: string;
}

export const useDjangoWebSocket = () => {
  const { isConnected, lastMessage, sendMessage, error } = useWebSocketContext();
  const [sensorData, setSensorData] = useState<WaterQualityData[]>([]);
  const [telemetryData, setTelemetryData] = useState<TelemetryData | null>(null);
  const [deviceStatuses, setDeviceStatuses] = useState<Record<string, any>>({});

  // Handle incoming messages from Django
  useEffect(() => {
    if (lastMessage) {
      try {
        // Handle direct telemetry data or wrapped Django message
        let telemetryMessage: TelemetryData;
        const messageData = lastMessage as any;
        
        if (messageData.device && messageData.fw) {
          // Direct telemetry data format
          telemetryMessage = messageData as TelemetryData;
        } else if (messageData.type === 'sensor_data' && messageData.data) {
          // Django wrapped message format
          telemetryMessage = messageData.data as TelemetryData;
        } else {
          // Try to parse as raw telemetry if it has the expected structure
          if (messageData.ph !== undefined || messageData.turbidity !== undefined) {
            telemetryMessage = {
              device: messageData.device || 'river-watcher-23',
              fw: messageData.fw || '1.0.0',
              ph: messageData.ph || 0,
              turbidity: messageData.turbidity || 0,
              conductivity: messageData.conductivity || 0,
              ise_value: messageData.ise_value || 0,
              mercury_ppb: messageData.mercury_ppb || 0,
              battery_v: messageData.battery_v || 0,
              gps: messageData.gps || { lat: 0, lon: 0 },
              location_source: messageData.location_source || 'websocket'
            };
          } else {
            return; // Not telemetry data
          }
        }
        
        // Update telemetry data
        setTelemetryData(telemetryMessage);
        
        // Convert to WaterQualityData format for charts
        const waterQualityData: WaterQualityData = {
          timestamp: new Date().toISOString(),
          pH: telemetryMessage.ph || 0,
          temperature: 0, // Not available in telemetry, could map from other field
          turbidity: telemetryMessage.turbidity || 0,
          dissolvedOxygen: 0, // Not available in telemetry
          stationId: telemetryMessage.device || 'unknown'
        };
        
        setSensorData(prev => {
          const updated = [...prev, waterQualityData];
          return updated.slice(-50); // Keep last 50 readings
        });
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }
  }, [lastMessage]);

  // Send sensor data to Django
  const sendSensorData = useCallback((deviceId: string, data: Partial<WaterQualityData>) => {
    const message: DjangoMessage = {
      type: 'sensor_data',
      device_id: deviceId,
      data: {
        ph: data.pH,
        temperature: data.temperature,
        turbidity: data.turbidity,
        dissolved_oxygen: data.dissolvedOxygen
      }
    };
    
    return sendMessage(message);
  }, [sendMessage]);

  // Send device status to Django
  const sendDeviceStatus = useCallback((deviceId: string, status: any) => {
    const message: DjangoMessage = {
      type: 'device_status',
      device_id: deviceId,
      data: status
    };
    
    return sendMessage(message);
  }, [sendMessage]);

  // Send commands to Django
  const sendCommand = useCallback((deviceId: string, command: any) => {
    const message: DjangoMessage = {
      type: 'command',
      device_id: deviceId,
      data: command
    };
    
    return sendMessage(message);
  }, [sendMessage]);

  // Send heartbeat
  const sendHeartbeat = useCallback(() => {
    const message: DjangoMessage = {
      type: 'heartbeat',
      data: { timestamp: new Date().toISOString() }
    };
    
    return sendMessage(message);
  }, [sendMessage]);

  return {
    isConnected,
    error,
    sensorData,
    telemetryData,
    deviceStatuses,
    sendSensorData,
    sendDeviceStatus,
    sendCommand,
    sendHeartbeat
  };
};
