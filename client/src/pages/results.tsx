import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { backend } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AppShell from "@/components/layout/AppShell";

export default function Results() {
  const [, params] = useRoute("/app/results/:fileId");
  const fileId = params?.fileId || "";
  const [jobId, setJobId] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [originalName, setOriginalName] = useState<string>(fileId);
  const [preview, setPreview] = useState<{ columns: string[]; data: any[][] } | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [resultColumns, setResultColumns] = useState<string[]>([]);
  const [operationColumn, setOperationColumn] = useState<string>("");
  const [operationText, setOperationText] = useState<string>("");
  const [grouped, setGrouped] = useState<{ columns: string[]; rows: any[][]; total: number } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const list = await backend.listUploads();
        const found = (list.uploads || []).find((u: any) => u.file_id === fileId);
        if (found) setOriginalName(found.original_name || fileId);
        // fetch last job
        const latest = await backend.getLatestJobByFile(fileId).catch(() => null);
        if (latest?.job_id) {
          setJobId(latest.job_id);
          setStatus(latest.status);
          setProgress(latest.progress || 0);
          setMessage(latest.message || "");
        }
        // preview (all rows, virtualized by table component height)
        const p = await backend.getPreview(fileId, 0).catch(() => null);
        if (p) setPreview({ columns: p.columns, data: p.data });
        // if we already have a completed job, fetch analytics/result meta
        if (latest?.job_id && latest.status === "completed") {
          const r = await backend.getProcessResult(latest.job_id);
          setAnalytics(r?.result?.analytics || null);
          setResultColumns(r?.result?.result_columns || []);
          setOperationColumn(r?.result?.column || "");
          setOperationText(r?.result?.operation || "");
          const g = await backend.getGrouped(fileId).catch(() => null);
          if (g) setGrouped(g);
        }
      } catch {}
    })();
  }, [fileId]);

  useEffect(() => {
    if (!jobId) return;
    let t: any;
    const poll = async () => {
      const s = await backend.getProcessStatus(jobId);
      setStatus(s.status);
      setProgress(s.progress || 0);
      setMessage(s.message || "");
      if (s.status === "completed") {
        const r = await backend.getProcessResult(jobId);
        setAnalytics(r?.result?.analytics || null);
        setResultColumns(r?.result?.result_columns || []);
        setOperationColumn(r?.result?.column || "");
        setOperationText(r?.result?.operation || "");
        const g = await backend.getGrouped(fileId).catch(() => null);
        if (g) setGrouped(g);
      }
    };
    t = setInterval(poll, 2000);
    poll();
    return () => t && clearInterval(t);
  }, [jobId]);

  return (
    <AppShell>
      <div className="p-8">
      <div className="max-w-5xl">
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Results: {originalName}
          </h1>
          <div className="text-muted-foreground text-sm break-all">file_id: {fileId}</div>
        </div>

        {/* Processing Status */}
        <Card className="rounded-2xl border border-border shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="font-heading text-xl font-bold">Processing Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="font-medium">{status || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Progress</div>
                <div className="font-medium">{progress}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Message</div>
                <div className="font-medium truncate" title={message}>{message || "-"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis */}
        { (analytics || operationText || operationColumn) && (
        <Card className="rounded-2xl border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-xl font-bold">Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Operation</div>
                <div className="font-medium break-all">{operationText || "-"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Operation Column</div>
                <div className="font-medium">{operationColumn || analytics?.result_column || (resultColumns[0] || "-")}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Unique Values</div>
                <div className="font-medium">{analytics?.unique_values ?? "-"}</div>
              </div>
            </div>
            {analytics?.top_values?.length ? (
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-2">Top Values (Top 5)</div>
                <div className="text-sm">
                  {analytics.top_values.slice(0,5).map((t: any, i: number) => (
                    <div key={i} className="flex justify-between gap-4">
                      <span className="truncate max-w-[240px]" title={t.value}>{t.value}</span>
                      <span className="text-muted-foreground">{t.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
        )}

        {/* Downloads */}
        <Card className="rounded-2xl border border-border shadow-sm mt-8">
          <CardHeader>
            <CardTitle className="font-heading text-xl font-bold">Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <a href={backend.downloadGrouped(fileId)} target="_blank" rel="noreferrer">
                <Button variant="outline">Download Grouped CSV</Button>
              </a>
              <a href={backend.downloadMaster(fileId)} target="_blank" rel="noreferrer">
                <Button variant="outline">Download Updated Master CSV</Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Grouped Output */}
        {grouped && (
          <Card className="rounded-2xl border border-border shadow-sm mt-8">
            <CardHeader>
              <CardTitle className="font-heading text-xl font-bold">Grouped Output ({grouped.total} rows)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[480px] overflow-auto rounded-2xl border border-border">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-background">
                    <tr>
                      {grouped.columns.map((c) => (
                        <th key={c} className="text-left py-2 px-3 border-b border-border font-medium">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {grouped.rows.map((row, ri) => (
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

        {/* Data Preview */}
        {preview && (
          <Card className="rounded-2xl border border-border shadow-sm mt-8">
            <CardHeader>
              <CardTitle className="font-heading text-xl font-bold">Data Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[480px] overflow-auto rounded-2xl border border-border">
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
      </div>
      </div>
    </AppShell>
  );
}


