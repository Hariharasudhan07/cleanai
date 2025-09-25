import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Database, Plus, Settings, Play } from "lucide-react";
import excelLogo from "@/pages/assets/excel.svg";
import csvLogo from "@/pages/assets/csv.png";
import ibmdbLogo from "@/pages/assets/IBMdb.png";
import oracleLogo from "@/pages/assets/oracle.png";
import AppShell from "@/components/layout/AppShell";

const dataSourceTypes = [
  { value: "mysql", label: "MySQL", image: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg" },
  { value: "postgresql", label: "PostgreSQL", image: "https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" },
  { value: "mongodb", label: "MongoDB", image: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg" },
  { value: "sqlite", label: "SQLite", image: "https://raw.githubusercontent.com/devicons/devicon/master/icons/sqlite/sqlite-original.svg" },
  { value: "ibmdb2", label: "IBM DB2", image: ibmdbLogo },
  { value: "oracle", label: "Oracle", image: oracleLogo },
];

export default function DataSources() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
  });
  const { toast } = useToast();

  const { data: dataSources, isLoading } = useQuery({
    queryKey: ["/api/data-sources"],
    queryFn: () => api.getDataSources().then(res => res.json()),
  });

  const createSourceMutation = useMutation({
    mutationFn: (data: any) => api.createDataSource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-sources"] });
      setIsDialogOpen(false);
      setFormData({ name: "", type: "" });
      toast({ title: "Data source created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create data source", variant: "destructive" });
    },
  });

  const testConnectionMutation = useMutation({
    mutationFn: (id: string) => api.testDataSource(id),
    onSuccess: () => {
      toast({ title: "Connection test successful" });
    },
    onError: () => {
      toast({ title: "Connection test failed", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSourceMutation.mutate({
      name: formData.name,
      type: formData.type,
      connectionConfig: {},
    });
  };

  const handleSelectSource = (type: string) => {
    if (["excel", "csv", "parquet"].includes(type)) {
      window.location.href = "/app/upload";
      return;
    }
    toast({ title: "Database sources will be supported next." });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-muted rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Data Sources
          </h1>
          <p className="text-muted-foreground">Connect and manage your data sources</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-button text-white font-medium hover:scale-105 transition-transform shadow-lg" data-testid="button-add-source">
              <Plus className="mr-2 h-4 w-4" />
              Add Source
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl glass-card border border-primary/20">
            <DialogHeader>
              <DialogTitle className="font-heading text-primary">Choose a data source</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* File-based first */}
              {[
                { value: "excel", label: "Excel", image: excelLogo },
                { value: "csv", label: "CSV", image: csvLogo },
                { value: "parquet", label: "Parquet", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Apache_Parquet_logo.svg/1920px-Apache_Parquet_logo.svg.png?20210417030530" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelectSource(opt.value)}
                  className="border border-primary/30 rounded-xl p-4 hover:bg-primary/5 hover:border-primary/50 hover:shadow-md transition-all duration-300 text-left flex flex-col items-center justify-center gap-3"
                >
                  {opt.image ? (
                    <img src={opt.image} alt={opt.label} className="h-10" />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-sm font-medium">CSV</div>
                  )}
                  <span className="font-medium">{opt.label}</span>
                </button>
              ))}

              {/* Database options with official logos */}
              {dataSourceTypes.map((type) => (
                <div key={type.value} className="relative">
                  <button
                    onClick={() => handleSelectSource(type.value)}
                    className="border border-primary/30 rounded-xl p-4 hover:bg-primary/5 hover:border-primary/50 hover:shadow-md transition-all duration-300 text-left flex flex-col items-center justify-center gap-3 w-full"
                  >
                    <img src={type.image} alt={type.label} className="h-10" />
                    <span className="font-medium">{type.label}</span>
                  </button>
                  {/* Black glass overlay to indicate not enabled */}
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                    <span className="text-xs font-medium text-white bg-black/50 px-2 py-1 rounded">
                      Coming Soon
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                data-testid="button-cancel"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataSources?.map((source: any) => {
          const sourceType = dataSourceTypes.find(t => t.value === source.type);
          return (
            <Card key={source.id} className="rounded-2xl glass-card border border-primary/20 shadow-lg" data-testid={`source-card-${source.id}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {sourceType?.image ? (
                      <img src={sourceType.image} alt={sourceType.label} className="w-10 h-10" />
                    ) : (
                      <div className="w-10 h-10 rounded-2xl gradient-hero flex items-center justify-center text-lg">
                        <Database className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{source.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{sourceType?.label || source.type}</p>
                    </div>
                  </div>
                  <Badge variant={source.isActive ? "default" : "secondary"}>
                    {source.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {source.connectionConfig.host && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Host:</span>
                      <span>{source.connectionConfig.host}</span>
                    </div>
                  )}
                  {source.connectionConfig.database && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Database:</span>
                      <span>{source.connectionConfig.database}</span>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => testConnectionMutation.mutate(source.id)}
                      disabled={testConnectionMutation.isPending}
                      data-testid={`button-test-${source.id}`}
                    >
                      <Play className="mr-2 h-3 w-3" />
                      {testConnectionMutation.isPending ? "Testing..." : "Test"}
                    </Button>
                    <Button variant="outline" size="sm" data-testid={`button-configure-${source.id}`}>
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {!dataSources?.length && (
          <div className="col-span-full text-center py-12">
            <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No data sources configured</h3>
            <p className="text-muted-foreground mb-4">
              Connect your first data source to start processing data
            </p>
            <Button 
              onClick={() => setIsDialogOpen(true)} 
              className="gradient-button text-white"
            >
              Add Your First Source
            </Button>
          </div>
        )}
      </div>
      </div>
    </AppShell>
  );
}
