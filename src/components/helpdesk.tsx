
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, MessageCircle, TicketCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for requests and tickets for demonstration
const mockRequests = [
  { id: "REQ-001", title: "The Batman 2022", type: "Movie", status: "Approved", date: "2025-04-28" },
  { id: "REQ-002", title: "Stranger Things S4", type: "TV Show", status: "Pending", date: "2025-05-01" },
  { id: "REQ-003", title: "Dune: Part Two", type: "Movie", status: "In Progress", date: "2025-04-30" },
];

const mockTickets = [
  { id: "TKT-001", subject: "Jellyfin Buffering Issue", status: "Open", priority: "High", date: "2025-05-01" },
  { id: "TKT-002", subject: "Radio Station Access", status: "Closed", priority: "Medium", date: "2025-04-25" },
  { id: "TKT-003", subject: "Password Reset Request", status: "In Progress", priority: "Low", date: "2025-04-30" },
];

const Helpdesk = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newRequest, setNewRequest] = useState({ title: "", type: "Movie", description: "" });
  const [newTicket, setNewTicket] = useState({ subject: "", description: "", priority: "Medium" });
  const { toast } = useToast();
  
  const filteredRequests = mockRequests.filter(req => 
    req.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    req.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredTickets = mockTickets.filter(ticket => 
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request Submitted",
      description: `Your request for "${newRequest.title}" has been submitted successfully.`,
    });
    setNewRequest({ title: "", type: "Movie", description: "" });
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Support Ticket Created",
      description: `Your ticket "${newTicket.subject}" has been created successfully.`,
    });
    setNewTicket({ subject: "", description: "", priority: "Medium" });
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <TicketCheck className="h-4 w-4" /> Jellyseerr Requests
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" /> Support Tickets
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
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            <Card className="w-full lg:w-2/3">
              <CardHeader>
                <CardTitle>Jellyseerr Requests</CardTitle>
                <CardDescription>Track your movie and TV show requests</CardDescription>
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

            <Card className="w-full lg:w-1/3">
              <CardHeader>
                <CardTitle>New Request</CardTitle>
                <CardDescription>Submit a new movie or TV show request</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRequestSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      placeholder="Enter movie or show title" 
                      value={newRequest.title}
                      onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <select 
                      id="type"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newRequest.type}
                      onChange={(e) => setNewRequest({...newRequest, type: e.target.value})}
                    >
                      <option>Movie</option>
                      <option>TV Show</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Additional Notes</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Any specific details about your request" 
                      value={newRequest.description}
                      onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                    />
                  </div>
                  <Button type="submit" className="w-full">Submit Request</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            <Card className="w-full lg:w-2/3">
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>Track your support tickets</CardDescription>
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
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">No tickets found</TableCell>
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
