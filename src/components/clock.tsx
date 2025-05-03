
import React, { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="text-center flex items-center">
      <div className={`${isMobile ? 'text-sm' : 'text-lg'} font-medium`}>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        {!isMobile && (
          <span className="text-xs text-gray-400 ml-2">
            {time.toLocaleDateString([], { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        )}
      </div>
    </div>
  );
};

export default Clock;
