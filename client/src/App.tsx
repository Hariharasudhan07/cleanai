import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import AppShell from "@/components/layout/AppShell";
import LandingPage from "@/pages/landingpage";
import Dashboard from "@/pages/dashboard";
import DataSources from "@/pages/data-sources";
import Upload from "@/pages/upload";
import Schema from "@/pages/schema";
import Results from "@/pages/results";
import Processing from "@/pages/processing";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/app" component={Dashboard} />
      <Route path="/app/dashboard" component={Dashboard} />
      <Route path="/app/data-sources" component={DataSources} />
      <Route path="/app/upload" component={Upload} />
      <Route path="/app/schema" component={Schema} />
      <Route path="/app/results/:fileId" component={Results} />
      <Route path="/app/process/:fileId" component={Processing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="CleanAI-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
