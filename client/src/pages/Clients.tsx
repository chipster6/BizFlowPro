import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, Mail, Phone, MoreHorizontal, MapPin, Filter, Trash2 } from "lucide-react";
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
import { motion } from "framer-motion";

interface Client {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  lastContact: string;
  location: string;
  avatar: string;
  color: string;
  tags: string[];
}

const initialClients: Client[] = [
  {
    id: 1,
    name: "Alice Smith",
    company: "Acme Corp",
    email: "alice@acme.com",
    phone: "+1 (555) 123-4567",
    status: "Active",
    lastContact: "2 days ago",
    location: "New York, NY",
    avatar: "AS",
    color: "bg-blue-500",
    tags: ["VIP", "Tech"]
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
    avatar: "BJ",
    color: "bg-purple-500",
    tags: ["Startups"]
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", company: "", phone: "" });

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = () => {
    if (!formData.firstName || !formData.email) return;
    
    const name = `${formData.firstName} ${formData.lastName}`;
    const newClient: Client = {
      id: Math.max(...clients.map(c => c.id), 0) + 1,
      name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      status: "Lead",
      lastContact: "Just now",
      location: "New Location",
      avatar: name.split(' ').map(n => n[0]).join(''),
      color: `bg-${["blue", "purple", "pink", "emerald"][Math.random() * 4 | 0]}-500`,
      tags: ["New"]
    };
    
    setClients([...clients, newClient]);
    setFormData({ firstName: "", lastName: "", email: "", company: "", phone: "" });
  };

  const handleDeleteClient = (id: number) => {
    setClients(clients.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Clients</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage your network and relationships.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-lg shadow-primary/25">
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
                  <Input 
                    id="first-name" 
                    placeholder="Max" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input 
                    id="last-name" 
                    placeholder="Robinson" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="max@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  placeholder="Company Inc." 
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  placeholder="+1 (555) 000-0000" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddClient}>Create Client</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 bg-card/50 backdrop-blur-sm p-2 rounded-xl border border-border/50 shadow-sm max-w-2xl">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search clients by name, company, or email..." 
            className="pl-9 border-none shadow-none focus-visible:ring-0 bg-transparent h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {filteredClients.map((client) => (
          <motion.div key={client.id} variants={item}>
            <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 border-none shadow-sm bg-card/80 backdrop-blur-sm group">
              <div className={`h-1.5 w-full ${client.color}`} />
              <CardHeader className="pb-4 flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-4 border-background shadow-sm group-hover:scale-105 transition-transform">
                    <AvatarFallback className={`${client.color} bg-opacity-10 text-foreground font-bold`}>{client.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-bold">{client.name}</CardTitle>
                    <p className="text-sm font-medium text-muted-foreground">{client.company}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDeleteClient(client.id)}
                    >
                      Delete Client
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant={
                    client.status === "Active" ? "default" : 
                    client.status === "Lead" ? "secondary" : "outline"
                  } className="rounded-full px-2.5 font-semibold">
                    {client.status}
                  </Badge>
                  {client.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="rounded-full px-2 text-xs text-muted-foreground border-muted-foreground/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="grid gap-3 text-sm text-muted-foreground mt-2 bg-muted/30 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{client.location}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <Button variant="outline" className="flex-1 h-10 text-xs font-semibold">
                    Message
                  </Button>
                  <Button className="flex-1 h-10 text-xs font-semibold">
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
