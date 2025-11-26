import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
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
  TrendingUp,
  Plus,
  Trash2
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { getTransactions, createTransaction, deleteTransaction } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const monthlyData = [
  { name: "Jan", income: 4000, expenses: 2400, travel: 400 },
  { name: "Feb", income: 3000, expenses: 1398, travel: 300 },
  { name: "Mar", income: 2000, expenses: 9800, travel: 200 },
  { name: "Apr", income: 2780, expenses: 3908, travel: 500 },
  { name: "May", income: 1890, expenses: 4800, travel: 250 },
  { name: "Jun", income: 2390, expenses: 3800, travel: 350 },
  { name: "Jul", income: 3490, expenses: 4300, travel: 450 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export default function FinancesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    title: "", 
    amount: "", 
    type: "income", 
    client: "" 
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast({ title: "Transaction recorded successfully" });
      setIsOpen(false);
      setFormData({ title: "", amount: "", type: "income", client: "" });
    },
    onError: () => {
      toast({ title: "Failed to record transaction", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast({ title: "Transaction deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete transaction", variant: "destructive" });
    }
  });

  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalTravel = transactions.filter(t => t.type === "travel").reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const netIncome = totalIncome - totalExpenses - totalTravel;

  const handleAddTransaction = () => {
    if (!formData.title || !formData.amount) {
      toast({ title: "Title and amount are required", variant: "destructive" });
      return;
    }

    createMutation.mutate(formData);
  };

  const handleDeleteTransaction = (id: number) => {
    deleteMutation.mutate(id);
  };

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
          <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-lg shadow-primary/20" data-testid="button-record-transaction">
                <Plus className="mr-2 h-4 w-4" /> Record Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Transaction</DialogTitle>
                <DialogDescription className="sr-only">Record a new transaction by filling out the form below</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Tabs value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="income" data-testid="tab-income">Income</TabsTrigger>
                      <TabsTrigger value="expense" data-testid="tab-expense">Expense</TabsTrigger>
                      <TabsTrigger value="travel" data-testid="tab-travel">Travel</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="grid gap-2">
                  <Label>Title</Label>
                  <Input 
                    placeholder="Transaction name" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    data-testid="input-transaction-title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Amount</Label>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    data-testid="input-transaction-amount"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Client/Category</Label>
                  <Input 
                    placeholder="Client or category name" 
                    value={formData.client}
                    onChange={(e) => setFormData({...formData, client: e.target.value})}
                    data-testid="input-transaction-client"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddTransaction} data-testid="button-submit-transaction">Record</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Net Income", value: `$${netIncome.toFixed(2)}`, change: "+12%", icon: DollarSign, color: "bg-primary text-primary-foreground", subColor: "text-primary-foreground/80" },
          { title: "Total Expenses", value: `$${totalExpenses.toFixed(2)}`, change: "+4%", icon: CreditCard, color: "bg-card text-foreground border", subColor: "text-muted-foreground" },
          { title: "Travel Costs", value: `$${totalTravel.toFixed(2)}`, change: "420 miles", icon: Car, color: "bg-card text-foreground border", subColor: "text-muted-foreground" },
          { title: "Total Income", value: `$${totalIncome.toFixed(2)}`, change: "Year to date", icon: Briefcase, color: "bg-card text-foreground border", subColor: "text-muted-foreground" }
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
              <CardTitle>Cash Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{fill: 'hsl(var(--muted)/0.4)'}}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
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
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm border border-border/50">
        <CardHeader>
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest financial activity</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading transactions...</div>
          ) : (
            <div className="space-y-2">
              {transactions.map((t, i) => (
                <motion.div 
                  key={t.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.05) }}
                  className="flex items-center justify-between p-4 rounded-xl bg-card border border-transparent hover:border-border hover:shadow-sm transition-all group"
                  data-testid={`card-transaction-${t.id}`}
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
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors" data-testid={`text-title-${t.id}`}>{t.title}</p>
                      <p className="text-sm text-muted-foreground">{t.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`font-bold font-mono text-base ${
                      t.type === 'income' ? 'text-emerald-600' : 'text-foreground'
                    }`} data-testid={`text-amount-${t.id}`}>
                      {t.type === 'income' ? '+' : '-'}${parseFloat(t.amount).toFixed(2)}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteTransaction(t.id)}
                      data-testid={`button-delete-${t.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
