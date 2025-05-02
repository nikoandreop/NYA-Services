
import React, { useState } from 'react';
import LoginForm from '@/components/login-form';
import Dashboard from '@/components/dashboard';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const { toast } = useToast();

  const handleLogin = (username: string, password: string) => {
    // Simple test account until Authentik integration
    if (username === 'demo' && password === 'password') {
      setUserName(username);
      setIsLoggedIn(true);
      toast({
        title: "Login successful",
        description: "Welcome to NYA Services",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password. Try demo/password",
        variant: "destructive",
      });
    }
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
