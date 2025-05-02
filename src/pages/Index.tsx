
import React, { useState } from 'react';
import LoginForm from '@/components/login-form';
import Dashboard from '@/components/dashboard';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const handleLogin = (username: string, password: string) => {
    // In a real app, you would validate with Authelia or another auth provider
    // This is just a simulation for the demo
    setUserName(username);
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen w-full">
      {!isLoggedIn ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <LoginForm onLogin={handleLogin} />
        </div>
      ) : (
        <Dashboard userName={userName} />
      )}
    </div>
  );
};

export default Index;
