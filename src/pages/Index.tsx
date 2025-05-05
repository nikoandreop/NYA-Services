
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/login-form';
import Dashboard from '@/components/dashboard';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  const isPreview = window.location.hostname.includes('lovable.app');
  
  // Check for existing session on component mount
  useEffect(() => {
    const token = localStorage.getItem('nya_auth_token');
    const sessionUser = localStorage.getItem('nya_session_user');
    const sessionRole = localStorage.getItem('nya_session_role');
    
    if (token && sessionUser) {
      setIsLoggedIn(true);
      setUserName(sessionUser);
      setUserRole(sessionRole || '');
      
      // If it's admin, show a welcome back message
      if (sessionRole === 'admin') {
        toast({
          title: "Admin session restored",
          description: "Welcome back to NYA Services Admin",
        });
      }
    }
  }, [toast]);

  const handleLogin = async (username: string, password: string) => {
    try {
      // In preview mode, handle the login directly without API call
      if (isPreview && username === 'admin' && password === 'nyaservices2025') {
        // Mock successful login
        const mockToken = 'preview-token-123';
        const mockUser = {
          username: 'admin',
          role: 'admin'
        };
        
        // Store auth data
        localStorage.setItem('nya_auth_token', mockToken);
        localStorage.setItem('nya_session_user', mockUser.username);
        localStorage.setItem('nya_session_role', mockUser.role);
        
        setUserName(mockUser.username);
        setUserRole(mockUser.role);
        setIsLoggedIn(true);
        
        toast({
          title: "Admin Login successful",
          description: "Welcome to NYA Services Admin",
        });
        return;
      }
      
      // Regular API login for non-preview environments
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      
      // Store auth data
      localStorage.setItem('nya_auth_token', data.token);
      localStorage.setItem('nya_session_user', data.user.username);
      localStorage.setItem('nya_session_role', data.user.role);
      
      setUserName(data.user.username);
      setUserRole(data.user.role);
      setIsLoggedIn(true);
      
      toast({
        title: data.user.role === 'admin' ? "Admin Login successful" : "Login successful",
        description: `Welcome to NYA Services${data.user.role === 'admin' ? ' Admin' : ''}`,
      });
    } catch (error) {
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
    setUserRole('');
    localStorage.removeItem('nya_auth_token');
    localStorage.removeItem('nya_session_user');
    localStorage.removeItem('nya_session_role');
    
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
