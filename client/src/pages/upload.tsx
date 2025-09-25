import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { backend } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import AppShell from "@/components/layout/AppShell";

export default function Upload() {
  const [uploadSettings, setUploadSettings] = useState({
    encoding: "utf-8",
    delimiter: "comma",
    hasHeader: true,
    autoDetectSchema: false,
  });
  const { toast } = useToast();

  const [fileId, setFileId] = useState<string>("");
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [operation, setOperation] = useState<string>("Group similar names and standardize");
  const [jobId, setJobId] = useState<string>("");
  const [jobStatus, setJobStatus] = useState<string>("");
  const [jobProgress, setJobProgress] = useState<number>(0);
  const [jobMessage, setJobMessage] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [, navigate] = useLocation();
  const [preview, setPreview] = useState<{ columns: string[]; data: any[][] } | null>(null);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => backend.uploadFileMultipart(file),
    onSuccess: (response: any) => {
      setFileId(response.file_id);
      setAvailableColumns(response.columns || []);
      // fetch preview immediately
      backend.getPreview(response.file_id, 10).then((p) => {
        if (p) setPreview({ columns: p.columns, data: p.data });
      }).catch(() => {});
      toast({ 
        title: "File uploaded successfully",
        description: `Detected ${response.columns?.length || 0} columns`
      });
    },
    onError: (e: any) => {
      toast({ 
        title: "Upload failed",
        description: e?.message || "There was an error processing your file",
        variant: "destructive"
      });
    },
  });

  const handleUpload = (files: File[]) => {
    if (!files?.length) return;
    uploadMutation.mutate(files[0]);
  };

  const startProcessMutation = useMutation({
    mutationFn: () => backend.startProcess({ file_id: fileId, column_name: selectedColumn, operation }),
    onSuccess: (resp: any) => {
      setJobId(resp.job_id);
      setJobStatus(resp.status);
      toast({ title: "Processing started", description: `Job ${resp.job_id}` });
    },
    onError: (e: any) => {
      toast({ title: "Failed to start processing", description: e?.message, variant: "destructive" });
    },
  });

  useEffect(() => {
    if (!jobId) return;
    let timer: any = null;
    const poll = async () => {
      try {
        const status = await backend.getProcessStatus(jobId);
        setJobStatus(status.status);
        setJobProgress(status.progress || 0);
        setJobMessage(status.message || "");
        if (status.status === "completed") {
          const res = await backend.getProcessResult(jobId);
          setResult(res.result);
          clearInterval(timer);
          // Navigate to results page for this file
          navigate(`/app/results/${fileId}`);
        }
      } catch (e) {
        // stop polling on error
        clearInterval(timer);
      }
    };
    timer = setInterval(poll, 2000);
    poll();
    return () => timer && clearInterval(timer);
  }, [jobId]);

  return (
    <AppShell>
      <div className="p-8">
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            File Upload
          </h1>
          <p className="text-muted-foreground">Upload CSV, Excel, or Parquet files for processing</p>
        </div>

        {/* File Upload Component */}
        <div className="mb-8">
          <FileUpload 
            onUpload={handleUpload}
            accept=".csv,.xlsx,.parquet"
            maxSize={500 * 1024 * 1024} // 500MB
            multiple={true}
          />
        </div>

        {/* Upload Settings */}
        <Card className="rounded-2xl glass-card border border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="font-heading text-lg font-bold">Upload Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="encoding" className="block text-sm font-medium mb-3">
                  File Encoding
                </Label>
                <Select 
                  value={uploadSettings.encoding}
                  onValueChange={(value: string) => setUploadSettings((prev) => ({ ...prev, encoding: value }))}
                >
                  <SelectTrigger data-testid="select-encoding">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utf-8">UTF-8</SelectItem>
                    <SelectItem value="utf-16">UTF-16</SelectItem>
                    <SelectItem value="ascii">ASCII</SelectItem>
                    <SelectItem value="iso-8859-1">ISO-8859-1</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="delimiter" className="block text-sm font-medium mb-3">
                  Delimiter
                </Label>
                <Select 
                  value={uploadSettings.delimiter}
                  onValueChange={(value: string) => setUploadSettings((prev) => ({ ...prev, delimiter: value }))}
                >
                  <SelectTrigger data-testid="select-delimiter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comma">Comma (,)</SelectItem>
                    <SelectItem value="semicolon">Semicolon (;)</SelectItem>
                    <SelectItem value="tab">Tab</SelectItem>
                    <SelectItem value="pipe">Pipe (|)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="hasHeader"
                  checked={uploadSettings.hasHeader}
                  onCheckedChange={(checked: boolean | string) => 
                    setUploadSettings((prev) => ({ ...prev, hasHeader: Boolean(checked) }))
                  }
                  data-testid="checkbox-header"
                />
                <Label htmlFor="hasHeader" className="text-sm font-medium">
                  Header row present
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="autoDetectSchema"
                  checked={uploadSettings.autoDetectSchema}
                  onCheckedChange={(checked: boolean | string) => 
                    setUploadSettings((prev) => ({ ...prev, autoDetectSchema: Boolean(checked) }))
                  }
                  data-testid="checkbox-auto-schema"
                />
                <Label htmlFor="autoDetectSchema" className="text-sm font-medium">
                  Auto-detect schema
                </Label>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="font-medium mb-4">Advanced Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="skipRows" className="block text-sm font-medium mb-3">
                    Skip Rows
                  </Label>
                  <Select defaultValue="0">
                    <SelectTrigger data-testid="select-skip-rows">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 rows</SelectItem>
                      <SelectItem value="1">1 row</SelectItem>
                      <SelectItem value="2">2 rows</SelectItem>
                      <SelectItem value="5">5 rows</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="maxRows" className="block text-sm font-medium mb-3">
                    Max Rows (0 = all)
                  </Label>
                  <Select defaultValue="0">
                    <SelectTrigger data-testid="select-max-rows">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All rows</SelectItem>
                      <SelectItem value="1000">1,000 rows</SelectItem>
                      <SelectItem value="10000">10,000 rows</SelectItem>
                      <SelectItem value="100000">100,000 rows</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Data Preview */}
        {preview && (
          <Card className="rounded-2xl border border-border shadow-sm mt-8">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-bold">Data Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[360px] overflow-auto rounded-2xl border border-border">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-background">
                    <tr>
                      {preview.columns.map((c) => (
                        <th key={c} className="text-left py-2 px-3 border-b border-border font-medium">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.data.map((row, ri) => (
                      <tr key={ri} className="border-b border-border">
                        {row.map((v, ci) => (
                          <td key={ci} className="py-2 px-3 whitespace-nowrap">{String(v)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {fileId && (
          <Card className="rounded-2xl border border-border shadow-sm mt-8">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-bold">Start Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => navigate(`/app/process/${fileId}`)}
                  disabled={!fileId}
                  className="flex-1"
                >
                  Continue to Processing
                </Button>
              </div>

              {false && jobId && (
                <div className="mt-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Job:</span>
                    <span className="font-mono">{jobId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium">{jobStatus} ({jobProgress || 0}%)</span>
                  </div>
                  {jobMessage && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Message:</span>
                      <span>{jobMessage}</span>
                    </div>
                  )}
                </div>
              )}

              {result && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Analytics</h4>
                  <div className="text-sm text-muted-foreground">
                    {result.analytics?.result_column && (
                      <div>Result column: <span className="font-medium">{result.analytics.result_column}</span></div>
                    )}
                    {typeof result.rows_processed === "number" && (
                      <div>Rows processed: <span className="font-medium">{result.rows_processed}</span></div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      </div>
    </AppShell>
  );
}
