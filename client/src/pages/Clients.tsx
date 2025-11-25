import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { getClients, createClient, deleteClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    company: "", 
    phone: "", 
    location: "",
    status: "Lead",
    tags: [] as string[]
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({ title: "Client added successfully" });
      setDialogOpen(false);
      setFormData({ 
        name: "", 
        email: "", 
        company: "", 
        phone: "", 
        location: "",
        status: "Lead",
        tags: []
      });
    },
    onError: () => {
      toast({ title: "Failed to add client", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({ title: "Client deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete client", variant: "destructive" });
    }
  });

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = () => {
    if (!formData.name || !formData.email) {
      toast({ title: "Name and email are required", variant: "destructive" });
      return;
    }
    createMutation.mutate(formData);
  };

  const handleDeleteClient = (id: number) => {
    deleteMutation.mutate(id);
  };

  const getClientColor = (status: string) => {
    const colors: Record<string, string> = {
      "Active": "bg-emerald-500",
      "Lead": "bg-blue-500",
      "Inactive": "bg-gray-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Clients</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage your network and relationships.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-lg shadow-primary/25" data-testid="button-add-client">
              <Plus className="mr-2 h-4 w-4" /> Add Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  data-testid="input-client-name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  data-testid="input-client-email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  placeholder="Company Inc." 
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  data-testid="input-client-company"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  placeholder="+1 (555) 000-0000" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  data-testid="input-client-phone"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  placeholder="New York, NY" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  data-testid="input-client-location"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddClient} data-testid="button-submit-client">
                Create Client
              </Button>
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
            data-testid="input-search-clients"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-muted-foreground">Loading clients...</div>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredClients.map((client) => (
            <motion.div key={client.id} variants={item}>
              <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 border-none shadow-sm bg-card/80 backdrop-blur-sm group" data-testid={`card-client-${client.id}`}>
                <div className={`h-1.5 w-full ${getClientColor(client.status)}`} />
                <CardHeader className="pb-4 flex flex-row items-start justify-between space-y-0">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-4 border-background shadow-sm group-hover:scale-105 transition-transform">
                      <AvatarFallback className={`${getClientColor(client.status)} bg-opacity-10 text-foreground font-bold`}>
                        {getInitials(client.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg font-bold" data-testid={`text-name-${client.id}`}>{client.name}</CardTitle>
                      <p className="text-sm font-medium text-muted-foreground" data-testid={`text-company-${client.id}`}>{client.company}</p>
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
                        data-testid={`button-delete-client-${client.id}`}
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
                      <span className="truncate" data-testid={`text-email-${client.id}`}>{client.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-primary" />
                      <span data-testid={`text-phone-${client.id}`}>{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span data-testid={`text-location-${client.id}`}>{client.location}</span>
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
      )}
    </div>
  );
}
