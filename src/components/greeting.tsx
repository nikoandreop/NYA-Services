
import React, { useEffect, useState } from 'react';

interface GreetingProps {
  userName?: string;
}

const Greeting: React.FC<GreetingProps> = ({ userName = 'Guest' }) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      
      if (hour < 12) {
        return 'Good morning';
      } else if (hour < 18) {
        return 'Good afternoon';
      } else {
        return 'Good evening';
      }
    };

    setGreeting(getGreeting());
    
    // Update greeting every minute to handle time changes
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl md:text-4xl font-bold text-gradient">
        {greeting}, <span className="text-nya-400">{userName}</span>
      </h1>
      <p className="text-sm md:text-base text-gray-400 mt-1">Welcome to NYA Services</p>
    </div>
  );
};

export default Greeting;
