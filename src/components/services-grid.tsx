
import React from 'react';
import ServiceCard from './service-card';

// Example data - in a real app, this would come from your API
const SERVICES = [
  {
    id: 1,
    name: 'Jellyfin',
    description: 'Media server for your movies, TV shows, music, and photos',
    logo: 'https://jellyfin.org/images/logo.svg',
    url: '#',
    status: 'up',
    uptimePercentage: 99.8
  },
  {
    id: 2,
    name: 'Jellyseerr',
    description: 'Request management system for your media server',
    logo: 'https://raw.githubusercontent.com/Fallenbagel/jellyseerr/develop/public/favicon.ico',
    url: '#',
    status: 'up',
    uptimePercentage: 98.2
  },
  {
    id: 3,
    name: 'NYA Radio',
    description: 'Custom radio stations streaming your favorite music',
    logo: 'https://cdn-icons-png.flaticon.com/512/3075/3075935.png',
    url: '#',
    status: 'up',
    uptimePercentage: 100
  },
  {
    id: 4,
    name: 'File Browser',
    description: 'Access and manage files stored on your home server',
    logo: 'https://filebrowser.org/img/logo.svg',
    url: '#',
    status: 'degraded',
    uptimePercentage: 89.5
  },
  {
    id: 5,
    name: 'Home Assistant',
    description: 'Open source home automation system',
    logo: 'https://brands.home-assistant.io/_/homeassistant/logo.png',
    url: '#',
    status: 'up',
    uptimePercentage: 99.9
  },
  {
    id: 6,
    name: 'Nextcloud',
    description: 'Self-hosted productivity platform and file sync',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Nextcloud_Logo.svg/1200px-Nextcloud_Logo.svg.png',
    url: '#',
    status: 'up',
    uptimePercentage: 97.2
  },
];

const ServicesGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
      {SERVICES.map(service => (
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
