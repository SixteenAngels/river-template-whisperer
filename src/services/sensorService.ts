
import { SensorSchema, SensorData, ApiResponse } from '@/types/sensor';

const API_BASE_URL = 'http://localhost:8000/api';

export class SensorService {
  static async fetchSchema(): Promise<ApiResponse<SensorSchema>> {
    try {
      const response = await fetch(`${API_BASE_URL}/sensors/schema/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Failed to fetch sensor schema:', error);
      return { 
        data: { model: '', fields: [] }, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async fetchSensors(): Promise<ApiResponse<SensorData[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/sensors/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('Failed to fetch sensors:', error);
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}
