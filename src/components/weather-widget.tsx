
import React, { useEffect, useState } from 'react';
import { Cloud, CloudSun, Loader2 } from 'lucide-react';

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
      <div className="glass-card rounded-xl p-4 h-full flex items-center justify-center animate-fade-in">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-4 flex items-center justify-center animate-fade-in">
      <div className="flex items-center gap-3">
        <CloudSun size={28} className="text-nya-400" />
        <div>
          <div className="text-lg md:text-xl font-semibold">{weather?.temp}° F</div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <span>{weather?.condition}</span> • <span>{weather?.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
