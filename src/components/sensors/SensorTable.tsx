
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SensorSchema, SensorData } from '@/types/sensor';

interface SensorTableProps {
  schema: SensorSchema;
  sensors: SensorData[];
}

const SensorTable: React.FC<SensorTableProps> = ({ schema, sensors }) => {
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '-';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  const formatHeader = (field: string): string => {
    return field
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (!schema.fields || schema.fields.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No schema available
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {schema.fields.map((field) => (
              <TableHead key={field}>
                {formatHeader(field)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sensors.length === 0 ? (
            <TableRow>
              <TableCell 
                colSpan={schema.fields.length} 
                className="text-center py-8 text-muted-foreground"
              >
                No sensor data available
              </TableCell>
            </TableRow>
          ) : (
            sensors.map((sensor, index) => (
              <TableRow key={sensor.id || index}>
                {schema.fields.map((field) => (
                  <TableCell key={field}>
                    {formatValue(sensor[field])}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SensorTable;
