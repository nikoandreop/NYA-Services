
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
import { Network, Key, Users, ShieldCheck, Route, Database, Save, UserPlus, User } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

// Mock data for Authentik users
const mockAuthentikUsers = [
  { id: 1, username: "john_doe", name: "John Doe", email: "john@example.com", status: "Active", hasHeadscaleAccount: true },
  { id: 2, username: "jane_smith", name: "Jane Smith", email: "jane@example.com", status: "Active", hasHeadscaleAccount: false },
  { id: 3, username: "bob_johnson", name: "Bob Johnson", email: "bob@example.com", status: "Inactive", hasHeadscaleAccount: false },
];

const HeadscaleManager = () => {
  const { toast } = useToast();
  const [headscaleUrl, setHeadscaleUrl] = useState(localStorage.getItem('nya_headscale_url') || '');
  const [headscaleApiKey, setHeadscaleApiKey] = useState(localStorage.getItem('nya_headscale_api_key') || '');
  const [autoSync, setAutoSync] = useState(localStorage.getItem('nya_headscale_auto_sync') === 'true');
  const [authentikUrl, setAuthentikUrl] = useState(localStorage.getItem('nya_authentik_url') || '');
  const [authentikApiKey, setAuthentikApiKey] = useState(localStorage.getItem('nya_authentik_api_key') || '');
  
  const [showPreauth, setShowPreauth] = useState(false);
  const [preauthKey, setPreauthKey] = useState('');
  const [expiryHours, setExpiryHours] = useState('24');
  const [selectedNamespace, setSelectedNamespace] = useState('personal');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [authentikUsers, setAuthentikUsers] = useState(mockAuthentikUsers);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Filter users based on search query
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.ipAddress.includes(searchQuery) ||
    user.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredAuthentikUsers = authentikUsers.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveConfig = async () => {
    setIsSaving(true);
    
    try {
      // In a real implementation, you would validate and save to your backend
      localStorage.setItem('nya_headscale_url', headscaleUrl);
      localStorage.setItem('nya_headscale_api_key', headscaleApiKey);
      localStorage.setItem('nya_headscale_auto_sync', autoSync.toString());
      localStorage.setItem('nya_authentik_url', authentikUrl);
      localStorage.setItem('nya_authentik_api_key', authentikApiKey);
      
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

  const handleCreateHeadscaleAccount = async () => {
    if (!selectedUser) {
      toast({
        title: "User required",
        description: "Please select a user to create a Headscale account",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingAccount(true);
    
    try {
      // In a real implementation, this would call both Authentik and Headscale APIs
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the user in our mock state
      setAuthentikUsers(prev => 
        prev.map(user => 
          user.id === selectedUser.id 
            ? { ...user, hasHeadscaleAccount: true } 
            : user
        )
      );
      
      toast({
        title: "Headscale account created",
        description: `Account created for ${selectedUser.name} and linked to their Authentik identity`,
      });
      
      setSelectedUser(null);
    } catch (error) {
      toast({
        title: "Error creating account",
        description: "There was a problem creating the Headscale account",
        variant: "destructive",
      });
    } finally {
      setIsCreatingAccount(false);
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="devices" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Devices
            </TabsTrigger>
            <TabsTrigger value="routes" className="flex items-center gap-2">
              <Route className="h-4 w-4" /> Routes
            </TabsTrigger>
            <TabsTrigger value="keys" className="flex items-center gap-2">
              <Key className="h-4 w-4" /> Auth Keys
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <User className="h-4 w-4" /> User Accounts
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
          
          {/* User Accounts Tab (New) */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex items-center justify-between">
              <Input 
                className="max-w-sm" 
                placeholder="Search users..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Headscale Account</DialogTitle>
                    <DialogDescription>
                      Link an Authentik user to a new Headscale account
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="user">Select Authentik User</Label>
                      <select 
                        id="user"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        onChange={(e) => {
                          const userId = parseInt(e.target.value);
                          setSelectedUser(authentikUsers.find(u => u.id === userId) || null);
                        }}
                        value={selectedUser?.id || ""}
                      >
                        <option value="" disabled>Select a user</option>
                        {authentikUsers.filter(u => !u.hasHeadscaleAccount).map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name} ({user.username})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="namespace">Namespace</Label>
                      <select 
                        id="account-namespace"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={selectedNamespace}
                        onChange={(e) => setSelectedNamespace(e.target.value)}
                      >
                        {mockNamespaces.map((ns) => (
                          <option key={ns.id} value={ns.name}>
                            {ns.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleCreateHeadscaleAccount}
                      disabled={isCreatingAccount || !selectedUser}
                    >
                      {isCreatingAccount ? "Creating..." : "Create Account"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Account Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAuthentikUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.hasHeadscaleAccount ? "success" : "outline"}>
                        {user.hasHeadscaleAccount ? "Created" : "Not Created"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.hasHeadscaleAccount ? (
                        <Button variant="outline" size="sm">
                          Reset Password
                        </Button>
                      ) : (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            document.getElementById('user-create-dialog')?.click();
                          }}
                        >
                          Create Account
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                <Label htmlFor="api-key">Headscale API Key</Label>
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
              
              <div className="grid gap-2">
                <Label htmlFor="authentik-url">Authentik Server URL</Label>
                <Input 
                  id="authentik-url" 
                  placeholder="https://authentik.example.com" 
                  value={authentikUrl}
                  onChange={(e) => setAuthentikUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The base URL of your Authentik server for user integration
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="authentik-api-key">Authentik API Key</Label>
                <Input 
                  id="authentik-api-key" 
                  type="password" 
                  placeholder="Enter your Authentik API key"
                  value={authentikApiKey}
                  onChange={(e) => setAuthentikApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Required for accessing Authentik user data
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
