
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash, Save, RefreshCw, Link, Database, Server, Image, Monitor } from "lucide-react";
import { useServiceManager, Service } from '@/contexts/service-manager-context';

const ServiceManager: React.FC = () => {
  const { allServices, addService, updateService, deleteService, toggleService, refreshServiceStatus, isLoading } = useServiceManager();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredServices = allServices.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewService = () => {
    setEditingService({
      name: '',
      description: '',
      logo: '',
      url: '',
      uptimePercentage: 100,
      status: 'unknown',
    });
    setIsDialogOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService({ ...service });
    setIsDialogOpen(true);
  };

  const handleSaveService = () => {
    if (!editingService?.name || !editingService?.url) {
      toast({
        title: "Validation Error",
        description: "Name and URL are required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      if ('id' in editingService && editingService.id) {
        // Update existing service
        updateService(editingService.id, editingService);
        toast({
          title: "Service Updated",
          description: `${editingService.name} has been updated successfully.`
        });
      } else {
        // Add new service
        addService(editingService as Omit<Service, 'id'>);
        toast({
          title: "Service Added",
          description: `${editingService.name} has been added successfully.`
        });
      }
      setIsDialogOpen(false);
      setEditingService(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save service. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteService = (id: string | number) => {
    try {
      deleteService(id);
      toast({
        title: "Service Deleted",
        description: "The service has been removed successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleToggleService = (id: string | number, name: string, isActive?: boolean) => {
    try {
      toggleService(id);
      toast({
        title: isActive ? "Service Hidden" : "Service Activated",
        description: `${name} is now ${isActive ? "hidden from" : "visible on"} the dashboard.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update service status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRefreshStatus = async () => {
    try {
      await refreshServiceStatus();
      toast({
        title: "Services Status Updated",
        description: "All service statuses have been refreshed."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh service status. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Service Manager
            </CardTitle>
            <CardDescription>
              Configure and manage the services displayed on your dashboard
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleRefreshStatus}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Refresh Status
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleNewService}
            >
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </div>
        </div>
        
        <div className="pt-4">
          <Input 
            placeholder="Search services..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Visible</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "No services match your search" : "No services configured. Add your first service!"}
                </TableCell>
              </TableRow>
            ) : (
              filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-white/10 p-1 flex-shrink-0 overflow-hidden">
                        <img 
                          src={service.logo || '/placeholder.svg'} 
                          alt={`${service.name} logo`} 
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{service.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    <a 
                      href={service.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      {service.url}
                      <Link className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      service.status === "up" ? "default" : 
                      service.status === "down" ? "destructive" : 
                      service.status === "degraded" ? "secondary" : 
                      "outline"
                    }>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={service.isActive !== false} 
                      onCheckedChange={() => handleToggleService(service.id, service.name, service.isActive)}
                      aria-label={`Toggle ${service.name} visibility`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8"
                        onClick={() => handleEditService(service)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">
          {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} configured
        </p>
        <div>
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => {
              localStorage.removeItem('nya_services');
              window.location.reload();
            }}
          >
            Reset to Default Services
          </Button>
        </div>
      </CardFooter>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingService?.id ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            <DialogDescription>
              {editingService?.id ? 
                'Update the details for this service.' : 
                'Configure a new service to display on your dashboard.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-name" className="text-right">Name</Label>
              <Input
                id="service-name"
                value={editingService?.name || ''}
                onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-description" className="text-right">Description</Label>
              <Textarea
                id="service-description"
                value={editingService?.description || ''}
                onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                className="col-span-3 resize-none"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-url" className="text-right">
                URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="service-url"
                value={editingService?.url || ''}
                onChange={(e) => setEditingService({...editingService, url: e.target.value})}
                placeholder="https://service.nikoa.dev"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-logo" className="text-right">Logo URL</Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="service-logo"
                  value={editingService?.logo || ''}
                  onChange={(e) => setEditingService({...editingService, logo: e.target.value})}
                  placeholder="https://example.com/logo.png"
                  className="flex-grow"
                />
                <div className="flex-shrink-0 h-10 w-10 rounded bg-background border flex items-center justify-center overflow-hidden">
                  {editingService?.logo ? (
                    <img 
                      src={editingService.logo} 
                      alt="Logo preview" 
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <Image className="h-5 w-5 opacity-30" />
                  )}
                </div>
              </div>
            </div>
            
            {/* New: Uptime Kuma Integration Options */}
            {localStorage.getItem('nya_uptime_kuma_url') && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service-monitored" className="text-right">Uptime Kuma</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Switch
                    id="service-monitored"
                    checked={editingService?.isMonitored || false}
                    onCheckedChange={(checked) => setEditingService({
                      ...editingService,
                      isMonitored: checked
                    })}
                  />
                  <Label htmlFor="service-monitored" className="cursor-pointer">
                    Monitor with Uptime Kuma
                  </Label>
                  <div className="ml-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Monitor className="h-3 w-3" />
                      Status Integration
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveService} className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              Save Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ServiceManager;
