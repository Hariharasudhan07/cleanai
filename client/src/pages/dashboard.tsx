import { useEffect, useState } from "react";
import { backend } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Database } from "lucide-react";
import { Link } from "wouter";
import AppShell from "@/components/layout/AppShell";

export default function Dashboard() {
  const [uploads, setUploads] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await backend.listUploads();
        setUploads(res.uploads || []);
      } catch {}
    })();
  }, []);

  return (
    <AppShell>
      <div className="p-8">
      {/* Hero Section */}
      <div className="gradient-hero rounded-2xl p-8 mb-8 text-white">
        <div className="max-w-3xl">
          <h1 className="font-heading text-4xl font-bold mb-4">Welcome to CleanAI</h1>
          <p className="text-lg text-white/90 mb-6">
            Transform your messy data into clean, reliable datasets with our advanced cleansing and deduplication platform.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/app/data-sources">
              <Button 
                className="glass-button text-white font-medium hover:scale-105 transition-transform"
                data-testid="button-start-project"
              >
                Start New Project
              </Button>
            </Link>
            <Link href="/">
              <Button 
                variant="secondary" 
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                data-testid="button-documentation"
              >
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hide fake KPIs */}

      {/* Recent Uploads */}
      <div className="grid grid-cols-1 gap-8">
        <Card className="rounded-2xl glass-card border border-primary/20 shadow-lg hover-elevate transition-all duration-300">
          <CardHeader>
            <CardTitle className="font-heading text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Recent Uploads
            </CardTitle>
          </CardHeader>
          <CardContent>
            {uploads.length ? (
              <div className="space-y-3">
                {uploads.slice(0, 6).map((f) => (
                  <div key={f.file_id} className="flex items-center justify-between p-3 rounded-2xl glass-overlay hover:bg-primary/20 transition-all duration-300">
                    <a href={`/app/results/${encodeURIComponent(f.file_id)}`} className="min-w-0">
                      <div className="font-medium truncate text-foreground hover:text-primary transition-colors">{f.original_name}</div>
                      <div className="text-xs text-muted-foreground">{f.file_id}</div>
                    </a>
                    <div className="flex gap-2">
                      <a className="text-sm text-primary hover:text-purple-400 transition-colors" href={backend.downloadGrouped(f.file_id)} target="_blank" rel="noreferrer">Download Grouped</a>
                      <a className="text-sm text-primary hover:text-purple-400 transition-colors" href={backend.downloadMaster(f.file_id)} target="_blank" rel="noreferrer">Download Master</a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground text-center py-8">
                <Database className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <p>No uploads yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </AppShell>
  );
}
