
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Link, LogOut, Shield, Ticket, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for admin dashboards
const adminSystems = [
  { name: "Jellyfin Admin", url: "https://jellyfin-admin.example.com", description: "Manage media server" },
  { name: "Authentik Admin", url: "https://authentik-admin.example.com", description: "User authentication management" },
  { name: "Nginx Proxy Manager", url: "https://npm.example.com", description: "Proxy and SSL certificate management" },
  { name: "Portainer", url: "https://portainer.example.com", description: "Docker container management" },
  { name: "Grafana", url: "https://grafana.example.com", description: "System monitoring and analytics" },
];

// Mock data for users
const mockUsers = [
  { id: 1, username: "john_doe", name: "John Doe", email: "john@example.com", status: "Active", externalLinks: ["Jellyfin", "Nextcloud"] },
  { id: 2, username: "jane_smith", name: "Jane Smith", email: "jane@example.com", status: "Active", externalLinks: ["Jellyfin"] },
  { id: 3, username: "bob_johnson", name: "Bob Johnson", email: "bob@example.com", status: "Inactive", externalLinks: [] },
];

// Mock data for support tickets
const mockTickets = [
  { id: "TKT-001", subject: "Jellyfin Buffering Issue", status: "Open", priority: "High", assignedTo: "admin", date: "2025-05-01" },
  { id: "TKT-002", subject: "Radio Station Access", status: "Closed", priority: "Medium", assignedTo: "support", date: "2025-04-25" },
  { id: "TKT-003", subject: "Password Reset Request", status: "In Progress", priority: "Low", assignedTo: "admin", date: "2025-04-30" },
];

interface AdminDashboardProps {
  onLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate('/');
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    }
  };

  const handleAssignTicket = (id: string) => {
    toast({
      title: "Ticket Assigned",
      description: `Ticket ${id} has been assigned to you`,
    });
  };

  const handleResolveTicket = (id: string) => {
    toast({
      title: "Ticket Resolved",
      description: `Ticket ${id} has been marked as resolved`,
    });
  };

  const handleLinkAccount = (userId: number, service: string) => {
    toast({
      title: "Account Linked",
      description: `User ID ${userId} has been linked to ${service}`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400">Manage services, users, and support tickets</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Back to Dashboard
          </Button>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {/* Admin Systems Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Systems
            </CardTitle>
            <CardDescription>Access administration panels for various services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminSystems.map((system) => (
                <Card key={system.name} className="bg-secondary/20">
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg">{system.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm text-gray-400">{system.description}</p>
                  </CardContent>
                  <CardFooter className="pt-2 pb-4">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => window.open(system.url, '_blank')}
                    >
                      Access Panel
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Management and Support Tickets Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid grid-cols-2 w-full md:w-[400px] mb-4">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> User Management
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <Ticket className="h-4 w-4" /> Support Tickets
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage user accounts and external service links</CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Input placeholder="Search users..." className="max-w-sm" />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>External Links</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {user.externalLinks.map((link) => (
                              <Badge key={link} variant="outline" className="mr-1">
                                {link}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 flex items-center gap-1">
                                  <Link className="h-3 w-3" /> Link
                                </Button>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-56">
                                <div className="space-y-2">
                                  <h4 className="text-sm font-semibold">Link External Service</h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleLinkAccount(user.id, "Jellyfin")}
                                      disabled={user.externalLinks.includes("Jellyfin")}
                                    >
                                      Jellyfin
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleLinkAccount(user.id, "Nextcloud")}
                                      disabled={user.externalLinks.includes("Nextcloud")}
                                    >
                                      Nextcloud
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleLinkAccount(user.id, "Immich")}
                                      disabled={user.externalLinks.includes("Immich")}
                                    >
                                      Immich
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleLinkAccount(user.id, "Wireless")}
                                      disabled={user.externalLinks.includes("Wireless")}
                                    >
                                      Wireless
                                    </Button>
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tickets Tab */}
          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>Manage and respond to user support tickets</CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Input placeholder="Search tickets..." className="max-w-sm" />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>{ticket.id}</TableCell>
                        <TableCell>{ticket.subject}</TableCell>
                        <TableCell>
                          <Badge variant={
                            ticket.status === "Open" ? "default" : 
                            ticket.status === "Closed" ? "secondary" : 
                            "outline"
                          }>
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            ticket.priority === "High" ? "destructive" : 
                            ticket.priority === "Medium" ? "default" : 
                            "outline"
                          }>
                            {ticket.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{ticket.assignedTo}</TableCell>
                        <TableCell>{ticket.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {ticket.status !== "Closed" && (
                              <>
                                {ticket.assignedTo !== "admin" && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-8"
                                    onClick={() => handleAssignTicket(ticket.id)}
                                  >
                                    Assign to Me
                                  </Button>
                                )}
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  className="h-8"
                                  onClick={() => handleResolveTicket(ticket.id)}
                                >
                                  Resolve
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
