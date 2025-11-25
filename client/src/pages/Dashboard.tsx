import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  Activity
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from "recharts";
import { motion } from "framer-motion";

const data = [
  { name: "Jan", income: 4000, expenses: 2400 },
  { name: "Feb", income: 3000, expenses: 1398 },
  { name: "Mar", income: 2000, expenses: 9800 },
  { name: "Apr", income: 2780, expenses: 3908 },
  { name: "May", income: 1890, expenses: 4800 },
  { name: "Jun", income: 2390, expenses: 3800 },
  { name: "Jul", income: 3490, expenses: 4300 },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-lg">Welcome back, Jane. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Button size="lg" className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
            <Calendar className="mr-2 h-4 w-4" /> New Appointment
          </Button>
          <Button variant="outline" size="lg" className="bg-background/50 backdrop-blur-sm border-border hover:bg-background hover:border-primary/50">
            <DollarSign className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { title: "Total Revenue", value: "$45,231.89", change: "+20.1%", icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
          { title: "Active Clients", value: "+2,350", change: "+180.1%", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Pending Invoices", value: "12", change: "-4% from last month", icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
          { title: "Upcoming Tasks", value: "7", change: "3 High Priority", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        ].map((stat, index) => (
          <motion.div key={index} variants={item}>
            <Card className="border-none shadow-sm hover:shadow-md transition-all hover:-translate-y-1 bg-card/50 backdrop-blur-sm border border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <div className={`p-2 rounded-full ${stat.bg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1 font-medium">
                    {stat.change.includes("+") ? (
                      <ArrowUpRight className="h-3 w-3 mr-1 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
                    )}
                    <span className={stat.change.includes("+") ? "text-emerald-600" : "text-muted-foreground"}>
                      {stat.change}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-4"
        >
          <Card className="h-full border-none shadow-sm bg-card/50 backdrop-blur-sm border border-border/50">
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
              <CardDescription>Revenue flow for the current year</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                    <Area 
                      type="monotone" 
                      dataKey="income" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorIncome)" 
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-3"
        >
          <Card className="h-full border-none shadow-sm bg-card/50 backdrop-blur-sm border border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest transactions</CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00", status: "Paid", date: "Just now" },
                  { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00", status: "Pending", date: "2 min ago" },
                  { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00", status: "Paid", date: "1 hour ago" },
                  { name: "William Kim", email: "will@email.com", amount: "+$99.00", status: "Paid", date: "3 hours ago" },
                  { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00", status: "Pending", date: "5 hours ago" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center group p-2 -mx-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm group-hover:border-accent transition-colors">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">{item.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold leading-none text-foreground">{item.name}</p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          item.status === "Paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-orange-500/10 text-orange-600"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">{item.email}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
