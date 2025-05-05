
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, Shield, Key } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { useToast } from "@/hooks/use-toast";
import { Separator } from './ui/separator';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // OAuth configuration
  const [useOAuth, setUseOAuth] = useState(false);
  const [authentikUrl, setAuthentikUrl] = useState('');

  useEffect(() => {
    // Check if OAuth is configured
    const oauthEnabled = localStorage.getItem('nya_use_oauth') === 'true';
    const authUrl = localStorage.getItem('nya_authentik_url') || '';
    
    setUseOAuth(oauthEnabled && !!authUrl);
    setAuthentikUrl(authUrl);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Special case for the admin OAuth setup account
      if (username === 'oauthsetup' && password === 'setup2025') {
        localStorage.setItem('nya_auth_token', 'oauth-setup-token');
        localStorage.setItem('nya_session_user', 'admin');
        localStorage.setItem('nya_session_role', 'admin');
        
        toast({
          title: "OAuth Setup Login",
          description: "Welcome to OAuth configuration mode. You can now set up Authentik integration.",
        });
        
        onLogin(username, password);
        setIsLoading(false);
        return;
      }
      
      // Regular login flow
      onLogin(username, password);
      setIsLoading(false);
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password');
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = () => {
    const clientId = localStorage.getItem('nya_oauth_client_id');
    if (!clientId || !authentikUrl) {
      toast({
        title: "OAuth Configuration Error",
        description: "OAuth is not properly configured. Please contact an administrator.",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, we would redirect to the Authentik OAuth endpoint
    // For now, we'll just show a toast indicating this would happen
    toast({
      title: "OAuth Login",
      description: "In a production environment, this would redirect to Authentik for authentication.",
    });
    
    // This is where the actual redirect would happen:
    // const redirectUri = localStorage.getItem('nya_oauth_redirect_uri') || `${window.location.origin}/auth/callback`;
    // window.location.href = `${authentikUrl}/application/o/authorize/?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20profile%20email`;
  };

  // Check if OAuth is already configured
  const isOAuthConfigured = useOAuth && authentikUrl;

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
            {!isOAuthConfigured && (
              <p className="text-xs text-muted-foreground">For OAuth setup use: oauthsetup</p>
            )}
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
            {!isOAuthConfigured && (
              <p className="text-xs text-muted-foreground">For OAuth setup use: setup2025</p>
            )}
          </div>
          <Button 
            type="submit" 
            className="w-full bg-nya-600 hover:bg-nya-700" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
          
          {useOAuth && (
            <>
              <div className="relative my-4">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-card px-2 text-xs text-muted-foreground">or</span>
                </div>
              </div>
              
              <Button 
                type="button"
                variant="outline" 
                className="w-full flex items-center justify-center gap-2" 
                onClick={handleOAuthLogin}
              >
                <Shield className="h-4 w-4" />
                Sign in with Authentik
              </Button>
            </>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        <p className="text-sm text-gray-400">
          {useOAuth ? 'Authentication powered by Authentik' : 'Local authentication secured by Authentik'}
        </p>
        {!isOAuthConfigured && (
          <Alert className="p-2 mt-2 bg-amber-950/20 border-amber-800/50">
            <Key className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-xs text-amber-200/70">
              Use the OAuth setup account to configure Authentik integration
            </AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
