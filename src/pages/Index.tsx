
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/login-form';
import Dashboard from '@/components/dashboard';
import { useToast } from "@/hooks/use-toast";

// Secure hardcoded admin credentials - in a production environment, these should be stored securely
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "nyaservices2025";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check for existing session on component mount
  useEffect(() => {
    const sessionUser = localStorage.getItem('nya_session_user');
    if (sessionUser) {
      setIsLoggedIn(true);
      setUserName(sessionUser);
      
      // If it's admin, show a welcome back message
      if (sessionUser === ADMIN_USERNAME) {
        toast({
          title: "Admin session restored",
          description: "Welcome back to NYA Services Admin",
        });
      }
    }
  }, [toast]);

  const handleLogin = (username: string, password: string) => {
    // Check for secure admin credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setUserName(username);
      setIsLoggedIn(true);
      localStorage.setItem('nya_session_user', username);
      
      toast({
        title: "Admin Login successful",
        description: "Welcome to NYA Services Admin",
      });
      return;
    }
    
    // Demo account for testing
    if (username === 'demo' && password === 'password') {
      setUserName(username);
      setIsLoggedIn(true);
      localStorage.setItem('nya_session_user', username);
      
      toast({
        title: "Login successful",
        description: "Welcome to NYA Services",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    localStorage.removeItem('nya_session_user');
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <div className="min-h-screen w-full">
      {!isLoggedIn ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <LoginForm onLogin={handleLogin} />
        </div>
      ) : (
        <Dashboard userName={userName} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Index;
