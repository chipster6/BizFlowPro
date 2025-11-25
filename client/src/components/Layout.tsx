import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Receipt, 
  FileText, 
  Menu,
  Bell,
  Search,
  Settings,
  ChevronRight,
  Command
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Finances", href: "/finances", icon: Receipt },
    { name: "Invoices", href: "/invoices", icon: FileText },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">ProManage</h1>
            <p className="text-xs text-sidebar-foreground/60">Business Suite</p>
          </div>
        </div>

        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
                onClick={() => setIsMobileOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"}`} />
                  {item.name}
                </div>
                {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-sidebar-border/50 bg-sidebar-accent/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-sidebar-primary/20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold truncate">Jane Doe</span>
            <span className="text-xs text-sidebar-foreground/60 truncate">jane@promanage.com</span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto text-sidebar-foreground/50 hover:text-sidebar-foreground">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50 bg-sidebar shadow-xl border-r border-sidebar-border">
        <NavContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:pl-72 transition-all duration-300">
        {/* Header */}
        <header className="h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4 md:hidden">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 border-r bg-sidebar text-sidebar-foreground">
                <NavContent />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-bold text-foreground md:hidden">ProManage</h1>
          </div>

          <div className="hidden md:flex items-center text-sm text-muted-foreground">
            <span className="opacity-50">Overview</span>
            <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
            <span className="font-medium text-foreground">
              {navigation.find(n => n.href === location)?.name || "Dashboard"}
            </span>
          </div>

          <div className="flex flex-1 items-center justify-end gap-4">
            <div className="hidden md:flex w-full max-w-sm items-center relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 bg-muted/50 border-transparent focus:bg-background focus:border-primary/20 focus:ring-2 focus:ring-primary/20 transition-all rounded-full"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>

            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto max-w-7xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={location}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
