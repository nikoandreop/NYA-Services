
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
      // Let the parent component handle all login logic
      onLogin(username, password);
      setIsLoading(false);
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password');
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
