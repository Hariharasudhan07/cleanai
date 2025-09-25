import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { backend } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Table2, Eye, Settings, FileText, Database } from "lucide-react";
import AppShell from "@/components/layout/AppShell";

export default function Schema() {
  const [fileId, setFileId] = useState("");
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [operation, setOperation] = useState("Group similar names and standardize");
  const [columnFilter, setColumnFilter] = useState("all");
  const [jobId, setJobId] = useState("");
  const [job, setJob] = useState<{ status?: string; progress?: number; message?: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  // Fetch uploaded files
  const { data: uploadsData, isLoading: uploadsLoading } = useQuery({
    queryKey: ["uploads"],
    queryFn: () => backend.listUploads(),
  });

  const fetchSchemaMutation = useMutation({
    mutationFn: async () => backend.getSchema(fileId),
    onSuccess: (data: any) => {
      setColumns(data.columns || []);
    },
  });

  const handleFileSelect = (file: any) => {
    setSelectedFile(file);
    setFileId(file.file_id);
    fetchSchemaMutation.mutate();
  };

  const startProcessMutation = useMutation({
    mutationFn: async () => backend.startProcess({ file_id: fileId, column_name: selectedColumn, operation }),
    onSuccess: (res: any) => setJobId(res.job_id),
  });

  useEffect(() => {
    if (!jobId) return;
    let t: any;
    const poll = async () => {
      const s = await backend.getProcessStatus(jobId);
      setJob({ status: s.status, progress: s.progress, message: s.message });
      if (s.status === "completed" || s.status === "failed") {
        clearInterval(t);
      }
    };
    t = setInterval(poll, 2000);
    poll();
    return () => t && clearInterval(t);
  }, [jobId]);

  const filteredColumns = columns.map((name) => ({
    name,
    type: "string",
    nullable: true,
    unique: "-",
    missing: "-",
    samples: [],
    issueType: "success" as "success" | "warning" | "error",
    issues: "OK",
  })).filter(column => {
    if (columnFilter === "issues") return column.issueType !== "success";
    if (columnFilter === "modified") return false;
    return true;
  });

  return (
    <AppShell>
      <div className="p-8">
      <div className="max-w-7xl">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Schema Inspector
          </h1>
          <p className="text-muted-foreground">Review and modify detected data schema</p>
        </div>

        {/* Uploaded Files Grid */}
        <Card className="rounded-2xl glass-card border border-primary/20 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="font-heading text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Uploaded Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            {uploadsLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-muted rounded-xl"></div>
                  ))}
                </div>
              </div>
            ) : uploadsData?.uploads?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uploadsData.uploads.map((file: any) => (
                  <button
                    key={file.file_id}
                    onClick={() => handleFileSelect(file)}
                    className={`p-4 border rounded-xl text-left transition-all duration-300 ${
                      selectedFile?.file_id === file.file_id
                        ? 'border-primary bg-primary/10 glass-overlay shadow-lg scale-105'
                        : 'border-primary/30 hover:bg-primary/5 hover:border-primary/50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        {file.ext === '.csv' ? (
                          <FileText className="w-4 h-4 text-primary" />
                        ) : file.ext === '.xlsx' ? (
                          <FileText className="w-4 h-4 text-primary" />
                        ) : file.ext === '.parquet' ? (
                          <Database className="w-4 h-4 text-primary" />
                        ) : (
                          <FileText className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{file.original_name}</div>
                        <div className="text-sm text-muted-foreground">{file.ext.toUpperCase()}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No files uploaded</h3>
                <p className="text-muted-foreground mb-4">
                  Upload files to inspect their schema
                </p>
                <Button onClick={() => window.location.href = '/upload'}>
                  Upload Files
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Schema Details - Only show when file is selected */}
        {selectedFile && (
          <>
            {/* Dataset Overview */}
            <Card className="rounded-2xl glass-card border border-primary/20 shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="font-heading text-xl font-bold text-primary">
                  Schema Details - {selectedFile.original_name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">
                      {columns.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Columns</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">
                      {"-"}
                    </div>
                    <div className="text-sm text-muted-foreground">Rows</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                    <div className="text-sm text-muted-foreground">File Size</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">98.3%</div>
                    <div className="text-sm text-muted-foreground">Data Quality</div>
                  </div>
                </div>
              </CardContent>
            </Card>

        {/* Column Inspector */}
        <Card className="rounded-2xl glass-card border border-primary/20 shadow-lg mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading text-xl font-bold text-primary">Column Analysis</CardTitle>
              <div className="flex items-center space-x-2">
                <Button 
                  variant={columnFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setColumnFilter("all")}
                  data-testid="filter-all"
                >
                  All Columns
                </Button>
                <Button 
                  variant={columnFilter === "issues" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setColumnFilter("issues")}
                  data-testid="filter-issues"
                >
                  Issues Only
                </Button>
                <Button 
                  variant={columnFilter === "modified" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setColumnFilter("modified")}
                  data-testid="filter-modified"
                >
                  Modified
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium">Column Name</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Nullable</th>
                    <th className="text-left py-3 px-4 font-medium">Unique Values</th>
                    <th className="text-left py-3 px-4 font-medium">Missing</th>
                    <th className="text-left py-3 px-4 font-medium">Sample Values</th>
                    <th className="text-left py-3 px-4 font-medium">Issues</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredColumns.map((column, index) => (
                    <tr 
                      key={column.name} 
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                      data-testid={`column-row-${column.name}`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{column.name}</span>
                          <Table2 className="w-4 h-4 text-primary" />
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Select defaultValue={column.type}>
                          <SelectTrigger className="w-32" data-testid={`select-type-${column.name}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="integer">Integer</SelectItem>
                            <SelectItem value="float">Float</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-4 px-4">
                        <Checkbox 
                          defaultChecked={column.nullable}
                          data-testid={`checkbox-nullable-${column.name}`}
                        />
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {column.unique}
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {column.missing}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {column.samples.slice(0, 2).map((sample, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {sample}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge 
                          variant={
                            column.issueType === "success" ? "default" :
                            column.issueType === "warning" ? "secondary" : "destructive"
                          }
                          className={cn(
                            "text-xs",
                            column.issueType === "success" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                            column.issueType === "warning" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                            column.issueType === "error" && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          )}
                        >
                          {column.issues}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        </>
        )}
      </div>
      </div>
    </AppShell>
  );
}
