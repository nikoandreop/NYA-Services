
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link as LinkIcon, LogOut, Shield, Ticket, Users, Edit, Contact } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

// Mock data for admin systems
const adminSystems = [
  { name: "Jellyfin Admin", url: "https://jellyfin-admin.example.com", description: "Manage media server" },
  { name: "Authentik Admin", url: "https://authentik-admin.example.com", description: "User authentication management" },
  { name: "Nginx Proxy Manager", url: "https://npm.example.com", description: "Proxy and SSL certificate management" },
  { name: "Portainer", url: "https://portainer.example.com", description: "Docker container management" },
  { name: "Grafana", url: "https://grafana.example.com", description: "System monitoring and analytics" },
];

// Mock data for users with contact information
const mockUsers = [
  { 
    id: 1, 
    username: "john_doe", 
    name: "John Doe", 
    email: "john@example.com", 
    status: "Active", 
    externalLinks: ["Jellyfin", "Nextcloud"],
    phone: "555-123-4567",
    address: "123 Main St, Anytown, CA"
  },
  { 
    id: 2, 
    username: "jane_smith", 
    name: "Jane Smith", 
    email: "jane@example.com", 
    status: "Active", 
    externalLinks: ["Jellyfin"],
    phone: "555-234-5678",
    address: "456 Oak Ave, Somecity, NY" 
  },
  { 
    id: 3, 
    username: "bob_johnson", 
    name: "Bob Johnson", 
    email: "bob@example.com", 
    status: "Inactive", 
    externalLinks: [],
    phone: "555-345-6789",
    address: "789 Pine Blvd, Othertown, TX"
  },
];

// Mock data for support tickets
const mockTickets = [
  { 
    id: "TKT-001", 
    subject: "Jellyfin Buffering Issue", 
    status: "Open", 
    priority: "High", 
    assignedTo: "admin", 
    date: "2025-05-01",
    description: "I'm experiencing constant buffering when watching 4K content on Jellyfin.",
    messages: [
      { sender: "user", text: "The buffering happens every 10-15 seconds.", timestamp: "2025-05-01 10:30" }
    ],
    userId: 1
  },
  { 
    id: "TKT-002", 
    subject: "Radio Station Access", 
    status: "Closed", 
    priority: "Medium", 
    assignedTo: "support", 
    date: "2025-04-25",
    description: "I can't access the new Lo-Fi radio station that was recently added.",
    messages: [
      { sender: "user", text: "The station doesn't appear in my list.", timestamp: "2025-04-25 14:22" },
      { sender: "admin", text: "You need to refresh your browser cache. Please try clearing your cookies and cache.", timestamp: "2025-04-25 15:45" }
    ],
    userId: 2
  },
  { 
    id: "TKT-003", 
    subject: "Password Reset Request", 
    status: "In Progress", 
    priority: "Low", 
    assignedTo: "admin", 
    date: "2025-04-30",
    description: "I forgot my password for the Nextcloud service.",
    messages: [
      { sender: "user", text: "I've tried the 'forgot password' link but didn't receive any email.", timestamp: "2025-04-30 09:15" },
      { sender: "admin", text: "I'll reset it manually for you. What would you like your new password to be?", timestamp: "2025-04-30 10:20" }
    ],
    userId: 3
  },
];

interface AdminDashboardProps {
  onLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [searchTicketQuery, setSearchTicketQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editedUser, setEditedUser] = useState<any>(null);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState("");

  const filteredUsers = mockUsers.filter(user => 
    user.username.toLowerCase().includes(searchUserQuery.toLowerCase()) || 
    user.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchUserQuery.toLowerCase())
  );

  const filteredTickets = mockTickets.filter(ticket => 
    ticket.id.toLowerCase().includes(searchTicketQuery.toLowerCase()) || 
    ticket.subject.toLowerCase().includes(searchTicketQuery.toLowerCase())
  );

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

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditedUser({ ...user });
  };

  const handleSaveUserChanges = () => {
    if (!editedUser) return;

    // In a real app, this would update the backend
    const userIndex = mockUsers.findIndex(u => u.id === editedUser.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...editedUser };
    }

    toast({
      title: "User Updated",
      description: `User ${editedUser.name}'s information has been updated.`,
    });
    
    setSelectedUser(null);
  };

  const handleTicketReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    
    toast({
      title: "Reply Sent",
      description: `Your reply to ticket ${selectedTicket.id} has been sent.`,
    });
    
    // In a real app, this would update the backend
    setReplyText("");
    // Adding the reply to the selected ticket's messages
    selectedTicket.messages.push({
      sender: "admin",
      text: replyText,
      timestamp: new Date().toLocaleString()
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
                <CardDescription>View and manage user accounts, contact information, and external service links</CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Input 
                    placeholder="Search users..." 
                    className="max-w-sm" 
                    value={searchUserQuery}
                    onChange={(e) => setSearchUserQuery(e.target.value)}
                  />
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
                    {filteredUsers.map((user) => (
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
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 flex items-center gap-1"
                                  onClick={() => handleEditUser(user)}
                                >
                                  <Contact className="h-3 w-3" /> Edit Info
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Edit User Information</DialogTitle>
                                  <DialogDescription>
                                    Update contact information for {editedUser?.name}
                                  </DialogDescription>
                                </DialogHeader>
                                {editedUser && (
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="name">Name</Label>
                                      <Input
                                        id="name"
                                        value={editedUser.name}
                                        onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="email">Email</Label>
                                      <Input
                                        id="email"
                                        type="email"
                                        value={editedUser.email}
                                        onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="phone">Phone</Label>
                                      <Input
                                        id="phone"
                                        value={editedUser.phone}
                                        onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="address">Address</Label>
                                      <Input
                                        id="address"
                                        value={editedUser.address}
                                        onChange={(e) => setEditedUser({...editedUser, address: e.target.value})}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="status">Status</Label>
                                      <select 
                                        id="status"
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={editedUser.status}
                                        onChange={(e) => setEditedUser({...editedUser, status: e.target.value})}
                                      >
                                        <option>Active</option>
                                        <option>Inactive</option>
                                      </select>
                                    </div>
                                  </div>
                                )}
                                <DialogFooter>
                                  <Button type="button" variant="secondary" onClick={() => setSelectedUser(null)}>
                                    Cancel
                                  </Button>
                                  <Button type="button" onClick={handleSaveUserChanges}>
                                    Save Changes
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 flex items-center gap-1">
                                  <LinkIcon className="h-3 w-3" /> Link
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
                  <Input 
                    placeholder="Search tickets..." 
                    className="max-w-sm" 
                    value={searchTicketQuery}
                    onChange={(e) => setSearchTicketQuery(e.target.value)}
                  />
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
                    {filteredTickets.map((ticket) => (
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
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-8 flex items-center gap-1"
                                  onClick={() => setSelectedTicket(ticket)}
                                >
                                  <Edit className="h-3 w-3" />
                                  Reply
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center justify-between">
                                    <span>{selectedTicket?.subject}</span>
                                    <Badge variant={
                                      selectedTicket?.status === "Open" ? "default" : 
                                      selectedTicket?.status === "Closed" ? "secondary" : 
                                      "outline"
                                    }>
                                      {selectedTicket?.status}
                                    </Badge>
                                  </DialogTitle>
                                  <DialogDescription className="flex justify-between">
                                    <span>Ticket ID: {selectedTicket?.id}</span>
                                    <span>Priority: {selectedTicket?.priority}</span>
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 my-6">
                                  <div className="bg-muted p-4 rounded-md">
                                    <h4 className="font-medium mb-2">Description</h4>
                                    <p>{selectedTicket?.description}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Conversation</h4>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                      {selectedTicket?.messages.map((msg: any, idx: number) => (
                                        <div 
                                          key={idx} 
                                          className={`p-3 rounded-lg ${
                                            msg.sender === 'user' ? 'bg-secondary/20 ml-8' : 'bg-primary/10 mr-8'
                                          }`}
                                        >
                                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                            <span>{msg.sender === 'user' ? 'User' : 'Admin'}</span>
                                            <span>{msg.timestamp}</span>
                                          </div>
                                          <p>{msg.text}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  {selectedTicket?.status !== "Closed" && (
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <Label htmlFor="admin-reply">Reply</Label>
                                        <div className="flex gap-2">
                                          {ticket.assignedTo !== "admin" && (
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              onClick={() => handleAssignTicket(selectedTicket?.id)}
                                            >
                                              Assign to Me
                                            </Button>
                                          )}
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleResolveTicket(selectedTicket?.id)}
                                          >
                                            Resolve Ticket
                                          </Button>
                                        </div>
                                      </div>
                                      <Textarea 
                                        id="admin-reply" 
                                        placeholder="Type your reply here..." 
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                      />
                                      <Button onClick={handleTicketReply} className="w-full">
                                        Send Reply
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                            
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
