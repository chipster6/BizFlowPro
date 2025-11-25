import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, Mail, Phone, MoreHorizontal, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const clients = [
  {
    id: 1,
    name: "Alice Smith",
    company: "Acme Corp",
    email: "alice@acme.com",
    phone: "+1 (555) 123-4567",
    status: "Active",
    lastContact: "2 days ago",
    location: "New York, NY",
    avatar: "AS"
  },
  {
    id: 2,
    name: "Bob Jones",
    company: "TechStart Inc",
    email: "bob@techstart.io",
    phone: "+1 (555) 987-6543",
    status: "Active",
    lastContact: "1 week ago",
    location: "San Francisco, CA",
    avatar: "BJ"
  },
  {
    id: 3,
    name: "Carol Williams",
    company: "Global Designs",
    email: "carol@global.design",
    phone: "+1 (555) 456-7890",
    status: "Inactive",
    lastContact: "1 month ago",
    location: "London, UK",
    avatar: "CW"
  },
  {
    id: 4,
    name: "David Brown",
    company: "Consulting Partners",
    email: "david@consulting.com",
    phone: "+1 (555) 789-0123",
    status: "Lead",
    lastContact: "Yesterday",
    location: "Chicago, IL",
    avatar: "DB"
  },
];

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Clients</h1>
          <p className="text-muted-foreground mt-1">Manage your client relationships and history.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" placeholder="Max" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" placeholder="Robinson" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="max@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Company Inc." />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1 (555) 000-0000" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Client</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-lg border shadow-sm">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Input 
          placeholder="Search clients by name, company, or email..." 
          className="border-none shadow-none focus-visible:ring-0 bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="overflow-hidden transition-all hover:shadow-md group">
            <CardHeader className="pb-4 flex flex-row items-start justify-between space-y-0">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">{client.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base font-semibold">{client.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{client.company}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Edit Details</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Delete Client</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between text-sm">
                <Badge variant={
                  client.status === "Active" ? "default" : 
                  client.status === "Lead" ? "secondary" : "outline"
                }>
                  {client.status}
                </Badge>
                <span className="text-xs text-muted-foreground">Last contact: {client.lastContact}</span>
              </div>
              
              <div className="grid gap-2 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {client.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {client.phone}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {client.location}
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <Button variant="outline" className="w-full h-9 text-xs">
                  Message
                </Button>
                <Button variant="outline" className="w-full h-9 text-xs">
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
