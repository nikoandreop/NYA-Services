
import React from 'react';
import { ExternalLink, Info } from 'lucide-react';
import ServiceInfoPopup from './service-info-popup';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ServiceCardProps {
  name: string;
  description: string;
  logo: string;
  url: string;
  status: 'up' | 'down' | 'degraded' | 'unknown';
  uptimePercentage?: number;
  info?: {
    description?: string;
    adminPanel?: string;
    documentation?: string;
    version?: string;
    maintainer?: string;
    notes?: string;
  };
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  name,
  description,
  logo,
  url,
  status,
  uptimePercentage = 0,
  info,
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
    <div className="glass-card rounded-xl p-4 transition-all hover:bg-white/10 hover:scale-[1.02] animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 shrink-0 rounded-md overflow-hidden bg-white/10 p-1">
          <img 
            src={logo} 
            alt={name} 
            className="h-full w-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg truncate">{name}</h3>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full p-0 text-gray-400 hover:text-primary transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <Info size={14} />
                      <span className="sr-only">Service Information</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View service information</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {info && <ServiceInfoPopup info={info} />}
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            </div>
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
    </div>
  );
};

export default ServiceCard;
