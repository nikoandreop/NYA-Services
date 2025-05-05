
import React, { useState, useEffect } from 'react';
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Network, Key, Users, ShieldCheck, Route, Database, Save } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for Headscale users
const mockUsers = [
  { id: 1, name: "laptop", ipAddress: "100.64.0.1", lastSeen: "2025-05-05 10:30", status: "Online", tags: ["personal"] },
  { id: 2, name: "desktop", ipAddress: "100.64.0.2", lastSeen: "2025-05-04 22:15", status: "Offline", tags: ["home"] },
  { id: 3, name: "phone", ipAddress: "100.64.0.3", lastSeen: "2025-05-05 09:45", status: "Online", tags: ["mobile"] },
  { id: 4, name: "server", ipAddress: "100.64.0.4", lastSeen: "2025-05-05 08:00", status: "Online", tags: ["infrastructure"] }
];

// Mock data for Headscale namespaces
const mockNamespaces = [
  { id: 1, name: "personal", userCount: 2 },
  { id: 2, name: "work", userCount: 0 },
  { id: 3, name: "infrastructure", userCount: 1 }
];

// Mock data for routes
const mockRoutes = [
  { id: 1, prefix: "192.168.1.0/24", via: "100.64.0.1", enabled: true },
  { id: 2, prefix: "10.0.0.0/16", via: "100.64.0.4", enabled: true }
];

const HeadscaleManager = () => {
  const { toast } = useToast();
  const [headscaleUrl, setHeadscaleUrl] = useState(localStorage.getItem('nya_headscale_url') || '');
  const [headscaleApiKey, setHeadscaleApiKey] = useState(localStorage.getItem('nya_headscale_api_key') || '');
  const [autoSync, setAutoSync] = useState(localStorage.getItem('nya_headscale_auto_sync') === 'true');
  const [showPreauth, setShowPreauth] = useState(false);
  const [preauthKey, setPreauthKey] = useState('');
  const [expiryHours, setExpiryHours] = useState('24');
  const [selectedNamespace, setSelectedNamespace] = useState('personal');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

  // Filter users based on search query
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.ipAddress.includes(searchQuery) ||
    user.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSaveConfig = async () => {
    setIsSaving(true);
    
    try {
      // In a real implementation, you would validate and save to your backend
      localStorage.setItem('nya_headscale_url', headscaleUrl);
      localStorage.setItem('nya_headscale_api_key', headscaleApiKey);
      localStorage.setItem('nya_headscale_auto_sync', autoSync.toString());
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Headscale settings saved",
        description: "Your Headscale integration settings have been updated",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your Headscale settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneratePreauth = async () => {
    if (!selectedNamespace) {
      toast({
        title: "Namespace required",
        description: "Please select a namespace for the pre-authentication key",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingKey(true);
    
    try {
      // In a real implementation, this would call the Headscale API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock key
      const mockKey = `hskey-${Math.random().toString(36).substring(2, 10)}`;
      setPreauthKey(mockKey);
      setShowPreauth(true);
      
      toast({
        title: "Pre-authentication key generated",
        description: `Key created for namespace: ${selectedNamespace}`,
      });
    } catch (error) {
      toast({
        title: "Error generating key",
        description: "There was a problem generating the pre-authentication key",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "The key has been copied to your clipboard",
        });
      },
      () => {
        toast({
          title: "Failed to copy",
          description: "Could not copy the key to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  const handleToggleRoute = (routeId: number) => {
    // In a real implementation, this would update the route status via API
    toast({
      title: "Route status updated",
      description: `Route ID ${routeId} status has been toggled`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Headscale VPN Manager
        </CardTitle>
        <CardDescription>
          Manage your Headscale VPN server, devices, and routes
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="devices">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="devices" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Devices
            </TabsTrigger>
            <TabsTrigger value="routes" className="flex items-center gap-2">
              <Route className="h-4 w-4" /> Routes
            </TabsTrigger>
            <TabsTrigger value="keys" className="flex items-center gap-2">
              <Key className="h-4 w-4" /> Auth Keys
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Database className="h-4 w-4" /> Configuration
            </TabsTrigger>
          </TabsList>
          
          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-4">
            <div className="flex items-center justify-between">
              <Input 
                className="max-w-sm" 
                placeholder="Search devices..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline">Refresh</Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.ipAddress}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === "Online" ? "success" : "secondary"}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastSeen}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {user.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          {/* Routes Tab */}
          <TabsContent value="routes" className="space-y-4">
            <div className="flex justify-end">
              <Button>Add Route</Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prefix</TableHead>
                  <TableHead>Via Device</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRoutes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell className="font-medium">{route.prefix}</TableCell>
                    <TableCell>{route.via}</TableCell>
                    <TableCell>
                      <Switch 
                        checked={route.enabled} 
                        onCheckedChange={() => handleToggleRoute(route.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          {/* Auth Keys Tab */}
          <TabsContent value="keys" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Generate Pre-authentication Key</Label>
                <div className="flex items-end gap-4">
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="namespace">Namespace</Label>
                    <select 
                      id="namespace"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={selectedNamespace}
                      onChange={(e) => setSelectedNamespace(e.target.value)}
                    >
                      {mockNamespaces.map((ns) => (
                        <option key={ns.id} value={ns.name}>
                          {ns.name} ({ns.userCount} users)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="expiry">Expiry (hours)</Label>
                    <Input 
                      id="expiry"
                      type="number"
                      value={expiryHours}
                      onChange={(e) => setExpiryHours(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleGeneratePreauth}
                    disabled={isGeneratingKey}
                  >
                    {isGeneratingKey ? "Generating..." : "Generate Key"}
                  </Button>
                </div>
              </div>
              
              {showPreauth && (
                <div className="bg-secondary/20 p-4 rounded-lg space-y-2 border border-muted">
                  <Label>Your Pre-authentication Key:</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={preauthKey} 
                      readOnly 
                      className="font-mono text-xs"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => copyToClipboard(preauthKey)}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">This key can only be used once and will expire in {expiryHours} hours.</p>
                </div>
              )}
            </div>
            
            <div className="rounded-md bg-muted/50 p-4">
              <div className="flex items-start space-x-4">
                <ShieldCheck className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Joining instructions</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    To connect a device to your Headscale network:
                  </p>
                  <pre className="mt-2 rounded-md bg-muted p-4 overflow-auto text-xs">
                    tailscale up --login-server={headscaleUrl || "https://headscale.example.com"} --authkey=YOUR_PREAUTH_KEY
                  </pre>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="headscale-url">Headscale Server URL</Label>
                <Input 
                  id="headscale-url" 
                  placeholder="https://headscale.example.com" 
                  value={headscaleUrl}
                  onChange={(e) => setHeadscaleUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The base URL of your Headscale server
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input 
                  id="api-key" 
                  type="password" 
                  placeholder="Enter your Headscale API key"
                  value={headscaleApiKey}
                  onChange={(e) => setHeadscaleApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Required for managing devices and routes
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="auto-sync" 
                  checked={autoSync}
                  onCheckedChange={setAutoSync}
                />
                <Label htmlFor="auto-sync">Automatically sync devices and routes</Label>
              </div>
            </div>
            
            <Button 
              onClick={handleSaveConfig}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Configuration"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HeadscaleManager;
