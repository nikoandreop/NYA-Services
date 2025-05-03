
import React, { useEffect, useState } from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

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
      <div className="text-lg font-medium">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        <span className="text-xs text-gray-400 ml-2">
          {time.toLocaleDateString([], { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })}
        </span>
      </div>
    </div>
  );
};

export default Clock;
