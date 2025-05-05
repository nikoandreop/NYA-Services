
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Key, Link, Save, Shield, Server, RotateCw } from 'lucide-react';

const ServiceIntegrations = () => {
  const { toast } = useToast();
  // Uptime Kuma state
  const [uptimeKumaUrl, setUptimeKumaUrl] = useState(localStorage.getItem('nya_uptime_kuma_url') || '');
  const [uptimeKumaApiKey, setUptimeKumaApiKey] = useState(localStorage.getItem('nya_uptime_kuma_key') || '');
  const [autoKumaSync, setAutoKumaSync] = useState(localStorage.getItem('nya_auto_kuma_sync') === 'true');
  
  // Authentik state
  const [authentikUrl, setAuthentikUrl] = useState(localStorage.getItem('nya_authentik_url') || '');
  const [authentikAPIKey, setAuthentikAPIKey] = useState(localStorage.getItem('nya_authentik_key') || '');
  
  // OAuth configuration
  const [useOAuth, setUseOAuth] = useState(localStorage.getItem('nya_use_oauth') === 'true');
  const [oauthClientId, setOauthClientId] = useState(localStorage.getItem('nya_oauth_client_id') || '');
  const [oauthClientSecret, setOauthClientSecret] = useState(localStorage.getItem('nya_oauth_client_secret') || '');
  const [oauthRedirectUri, setOauthRedirectUri] = useState(
    localStorage.getItem('nya_oauth_redirect_uri') || window.location.origin + '/auth/callback'
  );

  const handleSaveUptimeKuma = () => {
    localStorage.setItem('nya_uptime_kuma_url', uptimeKumaUrl);
    localStorage.setItem('nya_uptime_kuma_key', uptimeKumaApiKey);
    localStorage.setItem('nya_auto_kuma_sync', autoKumaSync.toString());
    
    toast({
      title: "Uptime Kuma Settings Saved",
      description: "Your Uptime Kuma integration settings have been saved.",
    });
  };

  const handleSaveAuthentik = () => {
    // Save basic Authentik settings
    localStorage.setItem('nya_authentik_url', authentikUrl);
    localStorage.setItem('nya_authentik_key', authentikAPIKey);
    
    // Save OAuth settings
    localStorage.setItem('nya_use_oauth', useOAuth.toString());
    localStorage.setItem('nya_oauth_client_id', oauthClientId);
    localStorage.setItem('nya_oauth_client_secret', oauthClientSecret);
    localStorage.setItem('nya_oauth_redirect_uri', oauthRedirectUri);
    
    toast({
      title: "Authentik Settings Saved",
      description: "Your Authentik integration settings have been saved.",
    });
  };

  const handleTestUptimeKuma = () => {
    // In a real implementation, this would test the connection
    toast({
      title: "Testing Uptime Kuma Connection",
      description: "This would test the connection in a real implementation.",
    });
  };

  const handleTestAuthentik = () => {
    // In a real implementation, this would test the connection
    toast({
      title: "Testing Authentik Connection",
      description: "This would test the connection in a real implementation.",
    });
  };

  const generateRedirectUri = () => {
    const baseUrl = window.location.origin;
    setOauthRedirectUri(`${baseUrl}/auth/callback`);
    
    toast({
      title: "Redirect URI Generated",
      description: "Use this URI when configuring your Authentik OAuth application.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Service Integrations
        </CardTitle>
        <CardDescription>
          Connect your NYA Services dashboard with external services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="uptime-kuma">
          <TabsList className="grid grid-cols-2 w-full md:w-[600px] mb-4">
            <TabsTrigger value="uptime-kuma" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Uptime Kuma
            </TabsTrigger>
            <TabsTrigger value="authentik" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Authentik
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="uptime-kuma">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Uptime Kuma Integration</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect to your Uptime Kuma instance to show real service status information
                </p>
              </div>
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="uptime-kuma-url">Uptime Kuma URL</Label>
                  <Input 
                    id="uptime-kuma-url" 
                    placeholder="https://status.nikoa.dev"
                    value={uptimeKumaUrl}
                    onChange={(e) => setUptimeKumaUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    The base URL of your Uptime Kuma instance (example: https://status.nikoa.dev)
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="uptime-kuma-api-key">API Key</Label>
                  <Input 
                    id="uptime-kuma-api-key" 
                    type="password"
                    placeholder="Enter your Uptime Kuma API key"
                    value={uptimeKumaApiKey}
                    onChange={(e) => setUptimeKumaApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Generate an API key in Uptime Kuma settings
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="auto-sync" 
                    checked={autoKumaSync}
                    onCheckedChange={setAutoKumaSync}
                  />
                  <Label htmlFor="auto-sync">Automatically sync service status from Uptime Kuma</Label>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSaveUptimeKuma} className="flex items-center gap-1">
                  <Save className="h-4 w-4" />
                  Save Settings
                </Button>
                <Button variant="outline" onClick={handleTestUptimeKuma}>
                  Test Connection
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="authentik">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Authentik Integration</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect to your Authentik instance for user authentication
                </p>
              </div>
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="authentik-url">Authentik URL</Label>
                  <Input 
                    id="authentik-url" 
                    placeholder="https://auth.nikoa.dev"
                    value={authentikUrl}
                    onChange={(e) => setAuthentikUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    The base URL of your Authentik instance (example: https://auth.nikoa.dev)
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="authentik-api-key">API Key <Badge variant="outline">Optional</Badge></Label>
                  <Input 
                    id="authentik-api-key" 
                    type="password"
                    placeholder="Enter your Authentik API key"
                    value={authentikAPIKey}
                    onChange={(e) => setAuthentikAPIKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Used for advanced integrations and user management
                  </p>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Switch 
                      id="use-oauth" 
                      checked={useOAuth}
                      onCheckedChange={setUseOAuth}
                    />
                    <Label htmlFor="use-oauth">Enable OAuth Authentication</Label>
                  </div>
                  
                  {useOAuth && (
                    <div className="grid gap-4 pl-6 border-l-2 border-border">
                      <div className="grid gap-2">
                        <Label htmlFor="oauth-client-id">OAuth Client ID</Label>
                        <Input 
                          id="oauth-client-id" 
                          placeholder="Enter your OAuth Client ID"
                          value={oauthClientId}
                          onChange={(e) => setOauthClientId(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="oauth-client-secret">OAuth Client Secret</Label>
                        <Input 
                          id="oauth-client-secret" 
                          type="password"
                          placeholder="Enter your OAuth Client Secret"
                          value={oauthClientSecret}
                          onChange={(e) => setOauthClientSecret(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <Label htmlFor="oauth-redirect-uri">Redirect URI</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={generateRedirectUri}
                            className="text-xs flex items-center gap-1 h-6"
                          >
                            <RotateCw className="h-3 w-3" />
                            Generate
                          </Button>
                        </div>
                        <Input 
                          id="oauth-redirect-uri" 
                          placeholder="https://yourdomain.com/auth/callback"
                          value={oauthRedirectUri}
                          onChange={(e) => setOauthRedirectUri(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          This URL must be configured in your Authentik OAuth application settings
                        </p>
                      </div>
                      
                      <div className="p-4 bg-muted/50 rounded-md">
                        <p className="text-sm">
                          <span className="font-medium">Configuration Steps:</span>
                          <ol className="list-decimal ml-5 mt-2 space-y-1">
                            <li>Create an OAuth2 Provider in Authentik</li>
                            <li>Set the redirect URI to the value above</li>
                            <li>Copy the Client ID and Client Secret to these fields</li>
                            <li>Save these settings and restart the application</li>
                          </ol>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSaveAuthentik} className="flex items-center gap-1">
                  <Save className="h-4 w-4" />
                  Save Settings
                </Button>
                <Button variant="outline" onClick={handleTestAuthentik}>
                  Test Connection
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ServiceIntegrations;
