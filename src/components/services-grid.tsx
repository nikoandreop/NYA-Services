
import React, { useEffect, useState } from 'react';
import ServiceCard from './service-card';
import { useServiceManager } from '@/contexts/service-manager-context';
import { Loader2 } from 'lucide-react';

const ServicesGrid: React.FC = () => {
  const { services, isLoading } = useServiceManager();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading services...</p>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No services configured. Add services in the Admin Dashboard.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
      {services.map(service => (
        <ServiceCard
          key={service.id}
          name={service.name}
          description={service.description}
          logo={service.logo}
          url={service.url}
          status={service.status as 'up' | 'down' | 'degraded' | 'unknown'}
          uptimePercentage={service.uptimePercentage}
        />
      ))}
    </div>
  );
};

export default ServicesGrid;
