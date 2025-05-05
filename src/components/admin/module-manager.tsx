import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Settings, Ticket, Server, Activity, Globe, Network } from "lucide-react";

interface Module {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
}

const ModuleManager = () => {
  const [modules, setModules] = useState<Module[]>([
    {
      id: 'support_tickets',
      name: 'Support Tickets',
      description: 'Enable users to submit and track support tickets',
      enabled: true,
      icon: <Ticket className="h-5 w-5" />,
    },
    {
      id: 'headscale',
      name: 'Headscale',
      description: 'Manage Headscale VPN access and user accounts with Authentik integration',
      enabled: false,
      icon: <Network className="h-5 w-5" />,
    },
    {
      id: 'services',
      name: 'Services',
      description: 'Display and manage service cards on the dashboard',
      enabled: true,
      icon: <Server className="h-5 w-5" />,
    },
    {
      id: 'uptime_kuma',
      name: 'Uptime Kuma',
      description: 'Monitor service uptime and status',
      enabled: true,
      icon: <Activity className="h-5 w-5" />,
    },
    {
      id: 'admin_tools',
      name: 'Admin Tools',
      description: 'Advanced administration tools',
      enabled: true,
      icon: <Settings className="h-5 w-5" />,
    },
    {
      id: 'public_site',
      name: 'Public Site',
      description: 'Allow public access to the home page',
      enabled: false,
      icon: <Globe className="h-5 w-5" />,
    },
  ]);

  const [isSaving, setIsSaving] = useState(false);

  // Load module states from localStorage on component mount
  useEffect(() => {
    const savedModules = localStorage.getItem('nya_active_modules');
    
    if (savedModules) {
      const activeModuleIds = JSON.parse(savedModules) as string[];
      
      setModules(prevModules => 
        prevModules.map(module => ({
          ...module,
          enabled: activeModuleIds.includes(module.id)
        }))
      );
    }
  }, []);

  const handleToggleModule = (id: string) => {
    setModules(modules.map(module => 
      module.id === id ? { ...module, enabled: !module.enabled } : module
    ));
  };

  const saveModuleSettings = async () => {
    setIsSaving(true);
    
    try {
      // Get the IDs of enabled modules
      const activeModuleIds = modules
        .filter(module => module.enabled)
        .map(module => module.id);
      
      // Save to localStorage for persistence
      localStorage.setItem('nya_active_modules', JSON.stringify(activeModuleIds));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: "Module settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your module settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Module Manager</CardTitle>
        <CardDescription>
          Enable or disable specific modules and features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {modules.map((module) => (
            <div key={module.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-secondary/20 p-2 rounded-md">
                  {module.icon}
                </div>
                <div>
                  <h3 className="font-medium">{module.name}</h3>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
              </div>
              <Switch
                checked={module.enabled}
                onCheckedChange={() => handleToggleModule(module.id)}
              />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={saveModuleSettings} 
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ModuleManager;
