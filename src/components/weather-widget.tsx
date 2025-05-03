
import React, { useEffect, useState } from 'react';
import { CloudSun, Loader2 } from 'lucide-react';

interface WeatherData {
  temp: number;
  condition: string;
  location: string;
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // In a real app, this would fetch from a weather API
  useEffect(() => {
    // Simulating API call with mock data
    const timer = setTimeout(() => {
      setWeather({
        temp: 72,
        condition: 'Partly Cloudy',
        location: 'Local'
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center">
        <Loader2 className="animate-spin text-gray-400 mr-2" size={16} />
        <span>Loading weather...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <CloudSun size={16} className="text-nya-400" />
      <div className="text-sm">
        <span className="font-medium">{weather?.temp}° F</span>
        <span className="text-gray-400 ml-2">
          {weather?.condition} • {weather?.location}
        </span>
      </div>
    </div>
  );
};

export default WeatherWidget;
