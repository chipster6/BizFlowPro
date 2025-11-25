import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  FileText, 
  MoreVertical, 
  Send, 
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  ArrowUpRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const invoices = [
  { 
    id: "INV-001", 
    client: "Acme Corp", 
    date: "Oct 24, 2023", 
    dueDate: "Nov 24, 2023", 
    amount: "$4,500.00", 
    status: "Paid",
    items: 3 
  },
  { 
    id: "INV-002", 
    client: "TechStart Inc", 
    date: "Oct 23, 2023", 
    dueDate: "Nov 07, 2023", 
    amount: "$1,200.00", 
    status: "Pending",
    items: 1 
  },
  { 
    id: "INV-003", 
    client: "Global Designs", 
    date: "Oct 20, 2023", 
    dueDate: "Oct 22, 2023", 
    amount: "$850.00", 
    status: "Overdue",
    items: 2 
  },
  { 
    id: "INV-004", 
    client: "Consulting Partners", 
    date: "Oct 18, 2023", 
    dueDate: "Nov 18, 2023", 
    amount: "$2,300.00", 
    status: "Paid",
    items: 4 
  },
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
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

export default function InvoicesPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-emerald-500/10 text-emerald-600 border-emerald-200 ring-emerald-500/20";
      case "Pending": return "bg-blue-500/10 text-blue-600 border-blue-200 ring-blue-500/20";
      case "Overdue": return "bg-red-500/10 text-red-600 border-red-200 ring-red-500/20";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid": return <CheckCircle className="w-3.5 h-3.5 mr-1.5" />;
      case "Pending": return <Clock className="w-3.5 h-3.5 mr-1.5" />;
      case "Overdue": return <AlertCircle className="w-3.5 h-3.5 mr-1.5" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Invoices</h1>
          <p className="text-muted-foreground mt-2 text-lg">Track payments and manage billing.</p>
        </div>
        <Button size="lg" className="shadow-lg shadow-primary/25">
          <Plus className="mr-2 h-4 w-4" /> Create Invoice
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { title: "Total Paid", value: "$24,500.00", desc: "12 invoices this month", color: "text-emerald-600", bg: "bg-emerald-500/5", border: "border-emerald-100" },
          { title: "Outstanding", value: "$4,600.00", desc: "3 invoices pending", color: "text-blue-600", bg: "bg-blue-500/5", border: "border-blue-100" },
          { title: "Overdue", value: "$850.00", desc: "Action required", color: "text-red-600", bg: "bg-red-500/5", border: "border-red-100" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`${stat.bg} ${stat.border} border shadow-sm`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${stat.color} flex items-center justify-between`}>
                  {stat.title}
                  <ArrowUpRight className="h-4 w-4 opacity-50" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className={`text-xs mt-1 font-medium opacity-80 ${stat.color}`}>{stat.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm border border-border/50">
        <CardHeader>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by client, ID, or amount..."
                  className="pl-10 bg-background border-border/50"
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <Tabs defaultValue="all" className="w-full lg:w-auto">
              <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {invoices.map((invoice) => (
              <motion.div key={invoice.id} variants={item}>
                <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border/50 bg-card hover:bg-accent/30 hover:border-primary/20 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center gap-5 mb-4 sm:mb-0">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center text-foreground shadow-inner">
                      <FileText className="h-5 w-5 opacity-70" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-foreground text-base">{invoice.id}</p>
                        <Badge variant="outline" className={`font-medium border ${getStatusColor(invoice.status)}`}>
                          {getStatusIcon(invoice.status)}
                          {invoice.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground/80">{invoice.client}</span>
                        <span>•</span>
                        <span>{invoice.items} items</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:gap-8">
                    <div className="text-right mr-4 sm:mr-0">
                      <p className="text-lg font-bold text-foreground tracking-tight">{invoice.amount}</p>
                      <p className="text-xs font-medium text-muted-foreground mt-0.5">Due {invoice.dueDate}</p>
                    </div>
                    
                    <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" title="Send Invoice">
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" title="Download PDF">
                        <Download className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Invoice</DropdownMenuItem>
                          <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete Invoice</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
        <CardFooter className="border-t border-border/50 bg-muted/20 px-6 py-4 rounded-b-xl">
          <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
            <p>Showing 4 of 4 invoices</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled className="h-8">Previous</Button>
              <Button variant="outline" size="sm" disabled className="h-8">Next</Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
