import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, MapPin, User, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Video, X, Trash2 } from "lucide-react";
import { format, addDays } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

interface Appointment {
  id: number;
  title: string;
  client: string;
  date: Date;
  time: string;
  duration: string;
  location: string;
  type: string;
  status: string;
  avatar: string;
  color: string;
}

const initialAppointments: Appointment[] = [
  {
    id: 1,
    title: "Consultation with Acme Corp",
    client: "Alice Smith",
    date: new Date(),
    time: "10:00 AM",
    duration: "1h",
    location: "Zoom Meeting",
    type: "Consultation",
    status: "Confirmed",
    avatar: "AS",
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "Project Review",
    client: "Bob Jones",
    date: new Date(),
    time: "2:00 PM",
    duration: "1h 30m",
    location: "123 Business Rd, Tech City",
    type: "On-site",
    status: "Pending",
    avatar: "BJ",
    color: "bg-purple-500"
  },
];

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [formData, setFormData] = useState({ title: "", client: "", date: "", time: "", type: "consultation", notes: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  const filteredAppointments = appointments.filter(apt => 
    date && apt.date.toDateString() === date.toDateString()
  );

  const handleAddAppointment = () => {
    if (!formData.title || !formData.client || !formData.date || !formData.time) return;
    
    const newDate = new Date(formData.date);
    const newApt: Appointment = {
      id: Math.max(...appointments.map(a => a.id), 0) + 1,
      title: formData.title,
      client: formData.client,
      date: newDate,
      time: formData.time,
      duration: "1h",
      location: formData.type === "onsite" ? "Office" : "Zoom Meeting",
      type: formData.type,
      status: "Pending",
      avatar: formData.client.split(' ').map(n => n[0]).join(''),
      color: `bg-${["blue", "purple", "pink", "emerald"][Math.random() * 4 | 0]}-500`
    };
    
    setAppointments([...appointments, newApt]);
    setFormData({ title: "", client: "", date: "", time: "", type: "consultation", notes: "" });
  };

  const handleDeleteAppointment = (id: number) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Calendar</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage your schedule effectively.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-lg shadow-primary/25">
              <Plus className="mr-2 h-4 w-4" /> Add Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>New Appointment</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Meeting title" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input 
                    id="time" 
                    type="time" 
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client">Client Name</Label>
                <Input 
                  id="client" 
                  placeholder="Client name" 
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddAppointment}>Schedule Appointment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        <div className="lg:col-span-4 xl:col-span-3">
          <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm border border-border/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-lg border shadow-sm w-full flex justify-center bg-background"
                />
              </div>
              
              <div className="p-6 bg-muted/30 border-t">
                <h3 className="font-semibold mb-4 text-sm text-foreground uppercase tracking-wider">Upcoming Events</h3>
                <div className="space-y-4">
                  {appointments.slice(0, 2).map((apt, i) => (
                    <motion.div 
                      key={apt.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 group cursor-pointer"
                    >
                      <div className="flex flex-col items-center bg-card rounded-lg border shadow-sm px-2 py-1 min-w-[50px]">
                        <span className="text-xs font-bold text-primary uppercase">{format(apt.date, "MMM")}</span>
                        <span className="text-lg font-bold text-foreground">{format(apt.date, "d")}</span>
                      </div>
                      <div>
                        <div className="font-medium text-sm group-hover:text-primary transition-colors">{apt.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {apt.time}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 xl:col-span-9 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {date ? format(date, "EEEE, MMMM do") : "Select a date"}
            </h2>
          </div>

          {filteredAppointments.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/5 flex flex-col items-center justify-center text-muted-foreground p-12"
            >
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <CalendarIcon className="h-8 w-8 opacity-50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No appointments scheduled</h3>
              <p className="max-w-sm text-center mt-2">You have a free day! Click 'Add Appointment' to schedule something.</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((apt, i) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all group">
                    <div className={`h-1 w-full ${apt.color}`} />
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex gap-4">
                          <div className="flex flex-col text-center min-w-[80px] border-r pr-4">
                            <span className="text-muted-foreground text-sm font-medium">{apt.time}</span>
                            <span className="text-xs text-muted-foreground/60 mt-1">{apt.duration}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{apt.title}</h3>
                              <Badge variant={apt.status === "Confirmed" ? "default" : "secondary"} className="rounded-full px-2.5 text-[10px] font-bold uppercase tracking-wide">
                                {apt.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                              <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                                <User className="h-3.5 w-3.5" />
                                {apt.client}
                              </div>
                              <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                                {apt.location.includes("Zoom") ? <Video className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
                                {apt.location}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-full text-destructive hover:text-destructive"
                            onClick={() => handleDeleteAppointment(apt.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="rounded-full">Join Meeting</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
