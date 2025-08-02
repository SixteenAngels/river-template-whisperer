
import React from 'react';
import { 
  Droplets, 
  ThermometerIcon, 
  Activity, 
  Timer, 
  TestTube, 
  FlaskRound,
  Battery
} from 'lucide-react';

interface WaterQualityCardProps {
  title: string;
  value: string | number;
  unit: string;
  change?: number;
  status?: 'positive' | 'negative' | 'neutral';
  type: 'ph' | 'oxygen' | 'temperature' | 'flow' | 'lead' | 'mercury' | 'Cyanide' | 'battery' | 'turbidity' | 'conductivity' | 'ise';
}

const WaterQualityCard: React.FC<WaterQualityCardProps> = ({
  title,
  value,
  unit,
  change = 0,
  status = 'neutral',
  type
}) => {
  const getIcon = () => {
    switch (type) {
      case 'ph': return <Droplets className="h-5 w-5" />;
      case 'oxygen': return <Activity className="h-5 w-5" />;
      case 'temperature': return <ThermometerIcon className="h-5 w-5" />;
      case 'turbidity': return <ThermometerIcon className="h-5 w-5" />;
      case 'flow': return <Timer className="h-5 w-5" />;
      case 'conductivity': return <Timer className="h-5 w-5" />;
      case 'ise': return <TestTube className="h-5 w-5" />;
      case 'lead': return <TestTube className="h-5 w-5" />;
      case 'mercury': return <FlaskRound className="h-5 w-5" />;
      case 'battery': return <Battery className="h-5 w-5" />;
      case 'Cyanide': return <TestTube className="h-5 w-5" />;
      default: return <Droplets className="h-5 w-5" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };
  
  const getChangeIcon = () => {
    if (change === undefined || change === 0) return null;
    return change > 0 ? 
      <span className="text-xs">↗</span> : 
      <span className="text-xs">↘</span>;
  };
  
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="text-muted-foreground">
          {getIcon()}
        </div>
        {change !== undefined && change !== 0 && (
          <div className={`flex items-center text-xs font-medium ${getStatusColor(status || 'neutral')}`}>
            {getChangeIcon()}
            <span className="ml-1">{Math.abs(change).toFixed(1)}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold">
            {typeof value === 'number' ? value.toFixed(2) : value || '--'}
          </span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default WaterQualityCard;
