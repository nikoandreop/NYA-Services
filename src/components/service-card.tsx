
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface ServiceCardProps {
  name: string;
  description: string;
  logo: string;
  url: string;
  status: 'up' | 'down' | 'degraded' | 'unknown';
  uptimePercentage?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  name,
  description,
  logo,
  url,
  status,
  uptimePercentage = 0,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'up': return 'bg-green-500';
      case 'down': return 'bg-red-500';
      case 'degraded': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'up': return 'Online';
      case 'down': return 'Offline';
      case 'degraded': return 'Degraded';
      default: return 'Unknown';
    }
  };

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="glass-card rounded-xl p-4 transition-all hover:bg-white/10 hover:scale-[1.02] animate-fade-in"
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 shrink-0 rounded-md overflow-hidden bg-white/10 p-1">
          <img src={logo} alt={name} className="h-full w-full object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg truncate">{name}</h3>
            <ExternalLink size={16} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-400 line-clamp-2">{description}</p>
        </div>
      </div>
      
      <div className="mt-3 flex items-center gap-2">
        <div className={`h-2 flex-1 rounded-full bg-gray-800 overflow-hidden`}>
          <div 
            className={`h-full ${getStatusColor()} transition-all duration-1000`}
            style={{ width: `${uptimePercentage}%` }}
          />
        </div>
        <div className="flex items-center text-xs gap-1.5">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          <span>{getStatusText()}</span>
          {uptimePercentage > 0 && (
            <span className="text-gray-400">{uptimePercentage}%</span>
          )}
        </div>
      </div>
    </a>
  );
};

export default ServiceCard;
