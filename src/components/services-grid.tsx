
import React, { useEffect } from 'react';
import ServiceCard from './service-card';
import { useServiceManager } from '@/contexts/service-manager-context';

const ServicesGrid: React.FC = () => {
  const { services, refreshServiceStatus, isLoading } = useServiceManager();

  // Fetch services on mount
  useEffect(() => {
    refreshServiceStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
      {services.length === 0 ? (
        <div className="col-span-full text-center py-8 glass-card rounded-xl opacity-80">
          <p>No services configured yet.</p>
        </div>
      ) : (
        services.map((service) => (
          <ServiceCard
            key={service.id}
            name={service.name}
            description={service.description}
            logo={service.logo}
            url={service.url}
            status={service.status}
            uptimePercentage={service.uptimePercentage}
            info={service.info}
          />
        ))
      )}
    </div>
  );
};

export default ServicesGrid;
