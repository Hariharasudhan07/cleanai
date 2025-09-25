import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { backend } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AppShell from "@/components/layout/AppShell";

export default function Processing() {
  const [, params] = useRoute("/app/process/:fileId");
  const fileId = params?.fileId || "";
  const [, navigate] = useLocation();
  const [preview, setPreview] = useState<{ columns: string[]; data: any[][] } | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [operation, setOperation] = useState<string>("Group similar names and standardize");
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    (async () => {
      if (!fileId) return;
      try {
        const p = await backend.getPreview(fileId, 20).catch(() => null);
        if (p) setPreview({ columns: p.columns, data: p.data });
        const s = await backend.getSchema(fileId).catch(() => null);
        if (s?.columns) setColumns(s.columns);
      } catch {}
    })();
  }, [fileId]);

  const start = async () => {
    if (!fileId || !selectedColumn) return;
    setIsStarting(true);
    try {
      await backend.startProcess({ file_id: fileId, column_name: selectedColumn, operation });
      navigate(`/app/results/${fileId}`);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <AppShell>
      <div className="p-8">
      <div className="max-w-6xl">
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Start Processing
          </h1>
          <div className="text-muted-foreground text-sm break-all">file_id: {fileId}</div>
        </div>

        {/* Data Preview */}
        {preview && (
          <Card className="rounded-2xl border border-border shadow-sm mb-8">
            <CardHeader>
              <CardTitle className="font-heading text-xl font-bold">Data Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[420px] overflow-auto rounded-2xl border border-border">
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

        {/* Column + Operation */}
        <Card className="rounded-2xl border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-xl font-bold">Configure Operation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-2">Column</label>
                <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a column" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Operation</label>
                <Input
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                  placeholder="Describe the transformation to apply"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={start} disabled={!selectedColumn || isStarting}>
                {isStarting ? "Starting..." : "Start Processing"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </AppShell>
  );
}


