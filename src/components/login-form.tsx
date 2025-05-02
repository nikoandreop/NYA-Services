
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      onLogin(username, password);
    }, 500);
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
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username (try 'demo')"
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
              placeholder="Enter your password (try 'password')"
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
