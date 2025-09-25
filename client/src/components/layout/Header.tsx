import { useLocation } from "wouter";
import { User } from "lucide-react";

const pageInfo = {
  "/": { title: "CleanAI", description: "Transform Data Chaos Into AI Success" },
  "/app": { title: "Dashboard", description: "Monitor your data processing pipeline" },
  "/app/dashboard": { title: "Dashboard", description: "Monitor your data processing pipeline" },
  "/app/data-sources": { title: "Data Sources", description: "Manage your data connections" },
  "/app/upload": { title: "File Upload", description: "Import data files for processing" },
  "/app/schema": { title: "Schema Inspector", description: "Review and modify data schemas" },
  "/app/cleanse": { title: "Cleansing Rules", description: "Define data cleaning operations" },
  "/app/dedupe": { title: "Deduplication", description: "Configure duplicate detection" },
  "/app/jobs": { title: "Processing Jobs", description: "Monitor task execution" },
};

export default function Header() {
  const [location] = useLocation();
  
  const currentPage = pageInfo[location as keyof typeof pageInfo] || pageInfo["/"];

  return (
    <header className="glass-card border-b border-primary/20 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            {currentPage.title}
          </h2>
          <p className="text-muted-foreground">
            {currentPage.description}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-foreground">Demo User</p>
              <p className="text-xs text-muted-foreground">demo@CleanAI.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
