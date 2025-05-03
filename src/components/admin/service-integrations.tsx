
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
import { Key, Link, Save, Shield, Server } from 'lucide-react';

const ServiceIntegrations = () => {
  const { toast } = useToast();
  const [uptimeKumaUrl, setUptimeKumaUrl] = useState(localStorage.getItem('nya_uptime_kuma_url') || '');
  const [uptimeKumaApiKey, setUptimeKumaApiKey] = useState(localStorage.getItem('nya_uptime_kuma_key') || '');
  const [authentikUrl, setAuthentikUrl] = useState(localStorage.getItem('nya_authentik_url') || '');
  const [authentikAPIKey, setAuthentikAPIKey] = useState(localStorage.getItem('nya_authentik_key') || '');
  const [autoKumaSync, setAutoKumaSync] = useState(localStorage.getItem('nya_auto_kuma_sync') === 'true');

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
    localStorage.setItem('nya_authentik_url', authentikUrl);
    localStorage.setItem('nya_authentik_key', authentikAPIKey);
    
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
                
                <div className="p-4 bg-muted/50 rounded-md">
                  <p className="text-sm">
                    <span className="font-medium">Implementation Note:</span> In a production environment, 
                    you would configure an OAuth application in Authentik and update your frontend 
                    code to handle the authentication flow.
                  </p>
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
