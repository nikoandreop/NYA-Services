
import React, { createContext, useState, useContext, useEffect } from 'react';

export interface Service {
  id: string;
  name: string;
  description: string;
  logo: string;
  url: string;
  status: string;
  uptimePercentage: number;
  adminPanel?: string;
}

interface ServiceManagerContextType {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  refreshServices: () => Promise<void>;
}

const ServiceManagerContext = createContext<ServiceManagerContextType | undefined>(undefined);

export const ServiceManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  
  const getAuthToken = () => {
    return localStorage.getItem('nya_auth_token');
  };

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${apiUrl}/services`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.status}`);
      }
      
      const data = await response.json();
      setServices(data);
    } catch (err: any) {
      console.error('Error fetching services:', err);
      setError(err.message || 'Failed to load services');
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    // Refresh services every 5 minutes
    const intervalId = setInterval(fetchServices, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const addService = async (service: Omit<Service, 'id'>) => {
    try {
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${apiUrl}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(service),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add service: ${response.status}`);
      }
      
      await fetchServices();
    } catch (err: any) {
      console.error('Error adding service:', err);
      setError(err.message || 'Failed to add service');
      throw err;
    }
  };

  const updateService = async (id: string, serviceUpdate: Partial<Service>) => {
    try {
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${apiUrl}/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(serviceUpdate),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update service: ${response.status}`);
      }
      
      await fetchServices();
    } catch (err: any) {
      console.error('Error updating service:', err);
      setError(err.message || 'Failed to update service');
      throw err;
    }
  };

  const deleteService = async (id: string) => {
    try {
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${apiUrl}/services/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete service: ${response.status}`);
      }
      
      await fetchServices();
    } catch (err: any) {
      console.error('Error deleting service:', err);
      setError(err.message || 'Failed to delete service');
      throw err;
    }
  };

  const refreshServices = async () => {
    try {
      await fetchServices();
    } catch (err: any) {
      console.error('Error refreshing services:', err);
      setError(err.message || 'Failed to refresh services');
    }
  };

  return (
    <ServiceManagerContext.Provider
      value={{
        services,
        isLoading,
        error,
        addService,
        updateService,
        deleteService,
        refreshServices,
      }}
    >
      {children}
    </ServiceManagerContext.Provider>
  );
};

export const useServiceManager = () => {
  const context = useContext(ServiceManagerContext);
  if (context === undefined) {
    throw new Error('useServiceManager must be used within a ServiceManagerProvider');
  }
  return context;
};
