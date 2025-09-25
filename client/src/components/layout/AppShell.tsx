import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(270_100%_20%)] via-background to-[hsl(220_100%_50%)] opacity-30"></div>
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-float"></div>
        <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-purple-400/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-primary/15 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-purple-400/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 flex w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
