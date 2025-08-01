
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
  type: 'ph' | 'oxygen' | 'temperature' | 'flow' | 'lead' | 'mercury' | 'Cyanide' | 'battery';
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
      case 'flow': return <Timer className="h-5 w-5" />;
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
    <div className="metric-card group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
          {getIcon()}
        </div>
        {change !== undefined && change !== 0 && (
          <div className={`flex items-center text-xs font-medium ${getStatusColor(status || 'neutral')}`}>
            {getChangeIcon()}
            <span className="ml-1">{Math.abs(change).toFixed(1)}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="metric-label">{title}</h3>
        <div className="flex items-baseline space-x-2">
          <span className="metric-value">
            {typeof value === 'number' ? value.toFixed(2) : value}
          </span>
          <span className="text-sm text-muted-foreground font-medium">{unit}</span>
        </div>
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};

export default WaterQualityCard;
