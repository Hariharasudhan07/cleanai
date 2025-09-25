import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Database, 
  Upload, 
  Table2, 
  Wand2, 
  Copy, 
  Briefcase, 
  Settings,
  Zap
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/app/dashboard", icon: BarChart3 },
  { name: "Data Sources", href: "/app/data-sources", icon: Database },
  { name: "File Upload", href: "/app/upload", icon: Upload },
  { name: "Schema Inspector", href: "/app/schema", icon: Table2 },
  // Removed per requirements: Cleansing, Deduplication, Jobs
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 glass-card-dark border-r border-primary/20 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-primary/20">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-2xl gradient-hero flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-xl text-foreground">CleanAI</h1>
            <p className="text-muted-foreground text-sm">Data Cleansing Platform</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href || (item.href === "/app/dashboard" && location === "/app");
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-2xl font-medium transition-all duration-300",
                    isActive
                      ? "bg-gradient-to-r from-primary/20 to-purple-400/20 text-primary border border-primary/30 shadow-lg"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-foreground hover:shadow-md"
                  )}
                  data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Settings */}
      <div className="p-4 border-t border-primary/20">
        <Link 
          href="/app/settings" 
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-muted-foreground hover:bg-primary/10 hover:text-foreground transition-all duration-300"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
