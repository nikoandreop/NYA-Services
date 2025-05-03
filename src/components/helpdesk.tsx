
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, MessageCircle, TicketCheck, Edit, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data for requests and tickets for demonstration
const mockRequests = [
  { id: "REQ-001", title: "The Batman 2022", type: "Movie", status: "Approved", date: "2025-04-28" },
  { id: "REQ-002", title: "Stranger Things S4", type: "TV Show", status: "Pending", date: "2025-05-01" },
  { id: "REQ-003", title: "Dune: Part Two", type: "Movie", status: "In Progress", date: "2025-04-30" },
];

// Extended ticket model with more details
const mockTickets = [
  { 
    id: "TKT-001", 
    subject: "Jellyfin Buffering Issue", 
    status: "Open", 
    priority: "High", 
    date: "2025-05-01",
    description: "I'm experiencing constant buffering when watching 4K content on Jellyfin.",
    messages: [
      { sender: "user", text: "The buffering happens every 10-15 seconds.", timestamp: "2025-05-01 10:30" }
    ]
  },
  { 
    id: "TKT-002", 
    subject: "Radio Station Access", 
    status: "Closed", 
    priority: "Medium", 
    date: "2025-04-25",
    description: "I can't access the new Lo-Fi radio station that was recently added.",
    messages: [
      { sender: "user", text: "The station doesn't appear in my list.", timestamp: "2025-04-25 14:22" },
      { sender: "admin", text: "You need to refresh your browser cache. Please try clearing your cookies and cache.", timestamp: "2025-04-25 15:45" }
    ]
  },
  { 
    id: "TKT-003", 
    subject: "Password Reset Request", 
    status: "In Progress", 
    priority: "Low", 
    date: "2025-04-30",
    description: "I forgot my password for the Nextcloud service.",
    messages: [
      { sender: "user", text: "I've tried the 'forgot password' link but didn't receive any email.", timestamp: "2025-04-30 09:15" },
      { sender: "admin", text: "I'll reset it manually for you. What would you like your new password to be?", timestamp: "2025-04-30 10:20" }
    ]
  },
];

const Helpdesk = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newTicket, setNewTicket] = useState({ subject: "", description: "", priority: "Medium" });
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const { toast } = useToast();
  
  const filteredRequests = mockRequests.filter(req => 
    req.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    req.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredTickets = mockTickets.filter(ticket => 
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Support Ticket Created",
      description: `Your ticket "${newTicket.subject}" has been created successfully.`,
    });
    setNewTicket({ subject: "", description: "", priority: "Medium" });
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
      sender: "user",
      text: replyText,
      timestamp: new Date().toLocaleString()
    });
  };

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    toast({
      title: "Ticket Updated",
      description: `Ticket ${ticketId} has been updated to ${newStatus}.`,
    });
    // In a real app, this would update the backend
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" /> Support Tickets
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <TicketCheck className="h-4 w-4" /> Jellyseerr Requests
          </TabsTrigger>
        </TabsList>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests or tickets..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Jellyseerr Requests</CardTitle>
              <CardDescription className="flex justify-between items-center">
                <span>Track your movie and TV show requests</span>
                <Button variant="outline" size="sm" onClick={() => window.open('https://jellyseerr.example.com', '_blank')}>
                  Go to Jellyseerr to make requests
                </Button>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.id}</TableCell>
                        <TableCell>{request.title}</TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell>
                          <Badge variant={
                            request.status === "Approved" ? "default" : 
                            request.status === "Pending" ? "secondary" : 
                            "outline"
                          }>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{request.date}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">No requests found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            <Card className="w-full lg:w-2/3">
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>Track and manage your support tickets</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.length > 0 ? (
                      filteredTickets.map((ticket) => (
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
                          <TableCell>{ticket.date}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    onClick={() => setSelectedTicket(ticket)}
                                    variant="outline" 
                                    size="sm" 
                                    className="flex items-center gap-1"
                                  >
                                    <MessageCircle className="h-3 w-3" />
                                    View
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
                                              <span>{msg.sender === 'user' ? 'You' : 'Support'}</span>
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
                                          <Label htmlFor="reply">Reply</Label>
                                          <div className="flex gap-2">
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              onClick={() => handleStatusChange(selectedTicket?.id, "In Progress")}
                                              disabled={selectedTicket?.status === "In Progress"}
                                            >
                                              Mark In Progress
                                            </Button>
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              onClick={() => handleStatusChange(selectedTicket?.id, "Closed")}
                                            >
                                              Close Ticket
                                            </Button>
                                          </div>
                                        </div>
                                        <Textarea 
                                          id="reply" 
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
                              
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex items-center gap-1"
                                onClick={() => handleStatusChange(ticket.id, ticket.status === "Open" ? "In Progress" : "Open")}
                              >
                                <Edit className="h-3 w-3" />
                                Update
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">No tickets found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="w-full lg:w-1/3">
              <CardHeader>
                <CardTitle>New Support Ticket</CardTitle>
                <CardDescription>Submit a new support request</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      placeholder="Brief description of the issue" 
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select 
                      id="priority"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ticketDescription">Description</Label>
                    <Textarea 
                      id="ticketDescription" 
                      placeholder="Please provide details about your issue" 
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Submit Ticket</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Helpdesk;
