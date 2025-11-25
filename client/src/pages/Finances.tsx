import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  CreditCard, 
  Briefcase,
  Car,
  Download,
  Filter,
  PieChart,
  TrendingUp
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Pie, Cell } from "recharts";
import { motion } from "framer-motion";

const monthlyData = [
  { name: "Jan", income: 4000, expenses: 2400, travel: 400 },
  { name: "Feb", income: 3000, expenses: 1398, travel: 300 },
  { name: "Mar", income: 2000, expenses: 9800, travel: 200 },
  { name: "Apr", income: 2780, expenses: 3908, travel: 500 },
  { name: "May", income: 1890, expenses: 4800, travel: 250 },
  { name: "Jun", income: 2390, expenses: 3800, travel: 350 },
  { name: "Jul", income: 3490, expenses: 4300, travel: 450 },
];

const transactions = [
  { id: 1, title: "Website Redesign", client: "Acme Corp", date: "Today, 10:42 AM", amount: "+$4,500.00", type: "income" },
  { id: 2, title: "Office Supplies", client: "Staples", date: "Yesterday, 3:15 PM", amount: "-$245.50", type: "expense" },
  { id: 3, title: "Travel Reimbursement", client: "Client Meeting", date: "Oct 24, 2023", amount: "-$85.00", type: "travel" },
  { id: 4, title: "Consulting Fee", client: "TechStart Inc", date: "Oct 23, 2023", amount: "+$1,200.00", type: "income" },
  { id: 5, title: "Software Subscription", client: "Adobe Creative Cloud", date: "Oct 22, 2023", amount: "-$54.99", type: "expense" },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export default function FinancesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Finances</h1>
          <p className="text-muted-foreground mt-2 text-lg">Detailed financial health and reporting.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="lg" className="border-dashed">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
          <Button size="lg" className="shadow-lg shadow-primary/20">
            <DollarSign className="mr-2 h-4 w-4" /> Record Transaction
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Net Income", value: "$12,234.00", change: "+12%", icon: DollarSign, color: "bg-primary text-primary-foreground", subColor: "text-primary-foreground/80" },
          { title: "Total Expenses", value: "$5,231.89", change: "+4%", icon: CreditCard, color: "bg-card text-foreground border", subColor: "text-muted-foreground" },
          { title: "Travel Costs", value: "$842.00", change: "420 miles", icon: Car, color: "bg-card text-foreground border", subColor: "text-muted-foreground" },
          { title: "Pending", value: "$3,400.00", change: "4 outstanding", icon: Briefcase, color: "bg-card text-foreground border", subColor: "text-muted-foreground" }
        ].map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`${card.color} shadow-sm h-full`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium opacity-90`}>{card.title}</CardTitle>
                <div className={`p-2 rounded-full bg-background/10 backdrop-blur-sm`}>
                  <card.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{card.value}</div>
                <p className={`text-xs mt-1 font-medium ${card.subColor}`}>
                  {card.change.includes("+") && <ArrowUpRight className="inline h-3 w-3 mr-1" />}
                  {card.change}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="h-full border-none shadow-sm bg-card/50 backdrop-blur-sm border border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cash Flow</CardTitle>
                  <CardDescription>Income vs Expenses over time</CardDescription>
                </div>
                <Tabs defaultValue="6m" className="w-[200px]">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="6m">6 Months</TabsTrigger>
                    <TabsTrigger value="1y">1 Year</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                      cursor={{fill: 'hsl(var(--muted)/0.4)'}}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="income" name="Income" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={50} />
                    <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--muted-foreground))" radius={[6, 6, 0, 0]} maxBarSize={50} opacity={0.3} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full border-none shadow-sm bg-card/50 backdrop-blur-sm border border-border/50">
            <CardHeader>
              <CardTitle>Breakdown</CardTitle>
              <CardDescription>Expense categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { name: "Equipment", value: 45, color: "bg-primary" },
                  { name: "Travel", value: 25, color: "bg-blue-400" },
                  { name: "Software", value: 20, color: "bg-emerald-500" },
                  { name: "Office", value: 10, color: "bg-orange-400" },
                ].map((item, i) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="text-muted-foreground font-mono">{item.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                        className={`h-full rounded-full ${item.color}`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Expenses</p>
                  <p className="text-2xl font-bold mt-1">$5,231.89</p>
                </div>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                  <PieChart className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm border border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest financial activity</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {transactions.map((t, i) => (
              <motion.div 
                key={t.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (i * 0.05) }}
                className="flex items-center justify-between p-4 rounded-xl bg-card border border-transparent hover:border-border hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 
                    t.type === 'travel' ? 'bg-blue-100 text-blue-600' : 
                    'bg-red-100 text-red-600'
                  }`}>
                    {t.type === 'income' ? <DollarSign className="h-5 w-5" /> : 
                     t.type === 'travel' ? <Car className="h-5 w-5" /> : 
                     <CreditCard className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{t.title}</p>
                    <p className="text-sm text-muted-foreground">{t.client} • {t.date}</p>
                  </div>
                </div>
                <div className={`font-bold font-mono text-base ${
                  t.type === 'income' ? 'text-emerald-600' : 'text-foreground'
                }`}>
                  {t.amount}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
