
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // For preview/development environments, allow direct login with admin credentials
      if (window.location.hostname.includes('lovable') && username === 'admin' && password === 'nyaservices2025') {
        setTimeout(() => {
          setIsLoading(false);
          toast({
            title: "Login successful",
            description: "Welcome to the admin dashboard!",
          });
          onLogin(username, password);
        }, 500);
        return;
      }

      // For production environments, attempt API login
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      onLogin(username, password);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password');
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md glass-card animate-fade-in border-none shadow-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl text-center text-gradient">NYA Services</CardTitle>
        <CardDescription className="text-center">
          Sign in to access your home lab services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-white/5"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/5"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-nya-600 hover:bg-nya-700" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-gray-400">
        Local authentication secured by Authentik
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
