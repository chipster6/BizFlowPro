import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, MapPin, User, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const appointments = [
  {
    id: 1,
    title: "Consultation with Acme Corp",
    client: "Alice Smith",
    date: new Date(),
    time: "10:00 AM",
    duration: "1h",
    location: "Zoom Meeting",
    type: "Consultation",
    status: "Confirmed"
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
    status: "Pending"
  },
  {
    id: 3,
    title: "Quarterly Planning",
    client: "Carol Williams",
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    time: "11:00 AM",
    duration: "2h",
    location: "Office",
    type: "Internal",
    status: "Confirmed"
  }
];

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedType, setSelectedType] = useState("");

  const filteredAppointments = appointments.filter(apt => 
    date && apt.date.toDateString() === date.toDateString()
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Calendar</h1>
          <p className="text-muted-foreground mt-1">Manage your schedule and appointments.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
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
                <Input id="title" placeholder="Meeting title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client">Client</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alice">Alice Smith</SelectItem>
                    <SelectItem value="bob">Bob Jones</SelectItem>
                    <SelectItem value="carol">Carol Williams</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select onValueChange={setSelectedType}>
                   <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Additional details..." />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Schedule Appointment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 xl:col-span-3">
          <Card className="h-full border-none shadow-none bg-transparent lg:bg-card lg:border-border lg:border lg:shadow-sm">
            <CardContent className="p-0 lg:p-4">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border bg-card shadow-sm w-full flex justify-center"
              />
              
              <div className="mt-6 hidden lg:block">
                <h3 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">Upcoming</h3>
                <div className="space-y-3">
                  {appointments.slice(0, 2).map(apt => (
                    <div key={apt.id} className="text-sm p-3 rounded-md bg-muted/50 border border-border/50">
                      <div className="font-medium">{apt.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {format(apt.date, "MMM d")} • {apt.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            {date ? format(date, "EEEE, MMMM do, yyyy") : "Select a date"}
          </h2>

          {filteredAppointments.length === 0 ? (
            <Card className="bg-muted/20 border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <CalendarIcon className="h-10 w-10 mb-2 opacity-20" />
                <p>No appointments scheduled for this day.</p>
                <Button variant="link" className="mt-2 text-primary">Schedule one now</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((apt) => (
                <Card key={apt.id} className="overflow-hidden transition-all hover:shadow-md border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{apt.title}</h3>
                          <Badge variant={apt.status === "Confirmed" ? "default" : "secondary"} className="text-xs">
                            {apt.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {apt.time} ({apt.duration})
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {apt.location}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 pt-4 md:pt-0 border-t md:border-t-0">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <User className="h-4 w-4" />
                          </div>
                          {apt.client}
                        </div>
                        <Button variant="outline" size="sm">Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
