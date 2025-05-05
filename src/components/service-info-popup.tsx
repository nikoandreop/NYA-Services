
import React from 'react';
import { Info } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";

interface ServiceInfoProps {
  info?: {
    description?: string;
    adminPanel?: string;
    documentation?: string;
    version?: string;
    maintainer?: string;
    notes?: string;
  };
}

const ServiceInfoPopup: React.FC<ServiceInfoProps> = ({ info }) => {
  if (!info) return null;
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-gray-400 hover:text-primary transition-colors focus:outline-none" aria-label="More information">
          <Info className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-3">
          <h3 className="font-medium">Service Information</h3>
          
          {info.description && (
            <div>
              <p className="text-sm text-muted-foreground">{info.description}</p>
            </div>
          )}
          
          <div className="grid gap-2">
            {info.version && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Version:</span>
                <span className="text-xs">{info.version}</span>
              </div>
            )}
            
            {info.maintainer && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Maintainer:</span>
                <span className="text-xs">{info.maintainer}</span>
              </div>
            )}
            
            {info.adminPanel && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Admin Panel:</span>
                <a 
                  href={info.adminPanel} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline"
                >
                  Access
                </a>
              </div>
            )}
            
            {info.documentation && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Documentation:</span>
                <a 
                  href={info.documentation} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline"
                >
                  View
                </a>
              </div>
            )}
          </div>
          
          {info.notes && (
            <div className="pt-2 border-t">
              <p className="text-xs font-medium mb-1">Notes:</p>
              <p className="text-xs text-muted-foreground">{info.notes}</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ServiceInfoPopup;
