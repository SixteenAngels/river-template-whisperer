
export interface SensorSchema {
  model: string;
  fields: string[];
}

export interface SensorData {
  [key: string]: any;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
