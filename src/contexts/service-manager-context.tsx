
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Service {
  id: string | number;
  name: string;
  description: string;
  logo: string;
  url: string;
  status: 'up' | 'down' | 'degraded' | 'unknown';
  uptimePercentage: number;
  isActive?: boolean;
  // New fields for Uptime Kuma integration
  monitorId?: string | number;
  isMonitored?: boolean;
}

interface ServiceManagerContextType {
  services: Service[];
  allServices: Service[];
  isLoading: boolean;
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string | number, data: Partial<Service>) => void;
  deleteService: (id: string | number) => void;
  toggleService: (id: string | number) => void;
  refreshServiceStatus: (id?: string | number) => Promise<void>;
  syncWithUptimeKuma: () => Promise<boolean>;
}

// Default services as a fallback
const DEFAULT_SERVICES: Service[] = [
  {
    id: 1,
    name: 'Jellyfin',
    description: 'Media server for your movies, TV shows, music, and photos',
    logo: 'https://jellyfin.org/images/logo.svg',
    url: '#',
    status: 'up',
    uptimePercentage: 99.8,
    isActive: true
  },
  {
    id: 2,
    name: 'Jellyseerr',
    description: 'Request management system for your media server',
    logo: 'https://raw.githubusercontent.com/Fallenbagel/jellyseerr/develop/public/favicon.ico',
    url: '#',
    status: 'up',
    uptimePercentage: 98.2,
    isActive: true
  },
  {
    id: 3,
    name: 'NYA Radio',
    description: 'Custom radio stations streaming your favorite music',
    logo: 'https://cdn-icons-png.flaticon.com/512/3075/3075935.png',
    url: '#',
    status: 'up',
    uptimePercentage: 100,
    isActive: true
  },
  {
    id: 4,
    name: 'File Browser',
    description: 'Access and manage files stored on your home server',
    logo: 'https://filebrowser.org/img/logo.svg',
    url: '#',
    status: 'degraded',
    uptimePercentage: 89.5,
    isActive: true
  },
  {
    id: 5,
    name: 'Home Assistant',
    description: 'Open source home automation system',
    logo: 'https://brands.home-assistant.io/_/homeassistant/logo.png',
    url: '#',
    status: 'up',
    uptimePercentage: 99.9,
    isActive: true
  },
  {
    id: 6,
    name: 'Nextcloud',
    description: 'Self-hosted productivity platform and file sync',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Nextcloud_Logo.svg/1200px-Nextcloud_Logo.svg.png',
    url: '#',
    status: 'up',
    uptimePercentage: 97.2,
    isActive: true
  }
];

const ServiceManagerContext = createContext<ServiceManagerContextType | undefined>(undefined);

export const useServiceManager = (): ServiceManagerContextType => {
  const context = useContext(ServiceManagerContext);
  if (!context) {
    throw new Error('useServiceManager must be used within a ServiceManagerProvider');
  }
  return context;
};

interface ServiceManagerProviderProps {
  children: ReactNode;
}

export const ServiceManagerProvider: React.FC<ServiceManagerProviderProps> = ({ children }) => {
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load services from localStorage on initial load
  useEffect(() => {
    const loadServices = async () => {
      try {
        const savedServices = localStorage.getItem('nya_services');
        if (savedServices) {
          setAllServices(JSON.parse(savedServices));
        } else {
          // Use default services if none are saved
          setAllServices(DEFAULT_SERVICES);
        }
      } catch (error) {
        console.error('Error loading services:', error);
        setAllServices(DEFAULT_SERVICES);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

  // Save to localStorage whenever services change
  useEffect(() => {
    if (allServices.length > 0) {
      localStorage.setItem('nya_services', JSON.stringify(allServices));
    }
  }, [allServices]);

  // Check if auto-sync is enabled and uptime kuma URL is set
  useEffect(() => {
    const autoSync = localStorage.getItem('nya_auto_kuma_sync') === 'true';
    if (autoSync) {
      // Auto-sync every 5 minutes
      const interval = setInterval(() => {
        syncWithUptimeKuma().catch(console.error);
      }, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, []);

  // Get only active services for display in the main dashboard
  const services = allServices.filter(service => service.isActive !== false);

  const addService = (service: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...service,
      id: Date.now(), // Use timestamp as a simple unique ID
      status: 'unknown',
      uptimePercentage: 0,
      isActive: true,
      isMonitored: false
    };
    
    setAllServices(prev => [...prev, newService]);
  };

  const updateService = (id: string | number, data: Partial<Service>) => {
    setAllServices(prev => 
      prev.map(service => 
        service.id === id ? { ...service, ...data } : service
      )
    );
  };

  const deleteService = (id: string | number) => {
    setAllServices(prev => prev.filter(service => service.id !== id));
  };

  const toggleService = (id: string | number) => {
    setAllServices(prev => 
      prev.map(service => 
        service.id === id ? { ...service, isActive: !service.isActive } : service
      )
    );
  };

  // Function to sync with Uptime Kuma
  const syncWithUptimeKuma = async (): Promise<boolean> => {
    const uptimeKumaUrl = localStorage.getItem('nya_uptime_kuma_url');
    const uptimeKumaKey = localStorage.getItem('nya_uptime_kuma_key');
    
    if (!uptimeKumaUrl || !uptimeKumaKey) {
      console.log("Uptime Kuma integration not configured");
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would make an API call to Uptime Kuma
      // For now, we'll simulate it with random statuses
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This is where you would fetch real status data from Uptime Kuma
      // const response = await fetch(`${uptimeKumaUrl}/api/v1/monitors`, {
      //   headers: { Authorization: `Bearer ${uptimeKumaKey}` }
      // });
      // const monitors = await response.json();
      
      // For now, we'll update services with "monitored" flag to simulate integration
      setAllServices(prev => 
        prev.map(service => {
          if (service.isMonitored) {
            // This is where you would match service URLs with monitor URLs
            // For now, random statuses again
            const statusOptions = ['up', 'degraded', 'down'] as const;
            const randomIndex = Math.floor(Math.random() * 10);
            // 70% chance of up, 20% chance of degraded, 10% chance of down
            const newStatus = randomIndex < 7 ? 'up' : randomIndex < 9 ? 'degraded' : 'down';
            
            // Calculate a realistic uptime percentage
            let uptimePercentage = service.uptimePercentage;
            if (newStatus === 'up') {
              // Slight improvement if service is up
              uptimePercentage = Math.min(100, uptimePercentage + (Math.random() * 0.5));
            } else if (newStatus === 'degraded') {
              // Slight decrease if service is degraded
              uptimePercentage = Math.max(85, uptimePercentage - (Math.random() * 1));
            } else {
              // Larger decrease if service is down
              uptimePercentage = Math.max(70, uptimePercentage - (Math.random() * 5));
            }
            
            return {
              ...service,
              status: newStatus,
              uptimePercentage: parseFloat(uptimePercentage.toFixed(1))
            };
          }
          return service;
        })
      );
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Error syncing with Uptime Kuma:", error);
      setIsLoading(false);
      return false;
    }
  };

  // Simulate checking status of services
  const refreshServiceStatus = async (id?: string | number) => {
    // Try to use Uptime Kuma if configured
    if (localStorage.getItem('nya_uptime_kuma_url') && localStorage.getItem('nya_uptime_kuma_key')) {
      const success = await syncWithUptimeKuma();
      if (success) return; // If successful, don't do the random status generation
    }
    
    // Fallback to random status generation
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setAllServices(prev => 
      prev.map(service => {
        if (id && service.id !== id) return service;
        
        // This is where you would integrate with an actual status API
        // For now, simulate random statuses
        const statusOptions = ['up', 'degraded', 'down'] as const;
        const randomIndex = Math.floor(Math.random() * 10);
        // 70% chance of up, 20% chance of degraded, 10% chance of down
        const newStatus = randomIndex < 7 ? 'up' : randomIndex < 9 ? 'degraded' : 'down';
        
        // Calculate a realistic uptime percentage
        let uptimePercentage = service.uptimePercentage;
        if (newStatus === 'up') {
          // Slight improvement if service is up
          uptimePercentage = Math.min(100, uptimePercentage + (Math.random() * 0.5));
        } else if (newStatus === 'degraded') {
          // Slight decrease if service is degraded
          uptimePercentage = Math.max(85, uptimePercentage - (Math.random() * 1));
        } else {
          // Larger decrease if service is down
          uptimePercentage = Math.max(70, uptimePercentage - (Math.random() * 5));
        }
        
        return {
          ...service,
          status: newStatus as 'up' | 'down' | 'degraded',
          uptimePercentage: parseFloat(uptimePercentage.toFixed(1))
        };
      })
    );
    
    setIsLoading(false);
  };

  const value = {
    services,
    allServices,
    isLoading,
    addService,
    updateService,
    deleteService,
    toggleService,
    refreshServiceStatus,
    syncWithUptimeKuma
  };

  return (
    <ServiceManagerContext.Provider value={value}>
      {children}
    </ServiceManagerContext.Provider>
  );
};
