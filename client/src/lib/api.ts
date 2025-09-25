import { apiRequest } from "./queryClient";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://cleanai-2.onrender.com";

async function handleJson(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
  return res.json();
}

// Legacy/demo API used by existing pages (returns Response)
export const api = {
  // Data Sources (demo endpoints expected by UI)
  getDataSources: () => 
    apiRequest("GET", "/api/data-sources"),
  
  getDataSource: (id: string) => 
    apiRequest("GET", `/api/data-sources/${id}`),
  
  createDataSource: (data: any) => 
    apiRequest("POST", "/api/data-sources", data),
  
  testDataSource: (id: string) => 
    apiRequest("POST", `/api/data-sources/${id}/test`),

  // Datasets
  getDatasets: () => 
    apiRequest("GET", "/api/datasets"),
  
  getDataset: (id: string) => 
    apiRequest("GET", `/api/datasets/${id}`),
  
  createDataset: (data: any) => 
    apiRequest("POST", "/api/datasets", data),
  
  getDatasetPreview: (id: string) => 
    apiRequest("GET", `/api/datasets/${id}/preview`),

  // Upload (legacy placeholder to avoid breaking existing code)
  uploadFile: (data: any) => 
    apiRequest("POST", "/api/upload", data),

  // Cleansing Rules
  getCleansingRules: () => 
    apiRequest("GET", "/api/cleansing-rules"),
  
  createCleansingRule: (data: any) => 
    apiRequest("POST", "/api/cleansing-rules", data),

  // Deduplication Rules
  getDeduplicationRules: () => 
    apiRequest("GET", "/api/deduplication-rules"),
  
  createDeduplicationRule: (data: any) => 
    apiRequest("POST", "/api/deduplication-rules", data),

  // Jobs
  getJobs: () => 
    apiRequest("GET", "/api/jobs"),
  
  getJob: (id: string) => 
    apiRequest("GET", `/api/jobs/${id}`),
  
  createJob: (data: any) => 
    apiRequest("POST", "/api/jobs", data),
  
  cancelJob: (id: string) => 
    apiRequest("POST", `/api/jobs/${id}/cancel`),

  // Stats
  getStats: () => 
    apiRequest("GET", "/api/stats"),
};

// Real FastAPI backend bindings (return parsed JSON)
export const backend = {
  // Backend health
  health: async () => handleJson(await fetch(`${BASE_URL}/health`)),

  // File upload (multipart)
  uploadFileMultipart: async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${BASE_URL}/upload`, {
      method: "POST",
      body: form,
    });
    return handleJson(res);
  },

  // Schema
  getSchema: async (fileId: string) =>
    handleJson(
      await fetch(`${BASE_URL}/schema?file_id=${encodeURIComponent(fileId)}`),
    ),

  // Processing
  startProcess: async (data: { file_id: string; column_name: string; operation: string }) =>
    handleJson(
      await fetch(`${BASE_URL}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_id: data.file_id,
          column_name: data.column_name,
          operation: data.operation,
        }),
      }),
    ),

  getProcessStatus: async (jobId: string) =>
    handleJson(await fetch(`${BASE_URL}/process/status/${jobId}`)),

  getProcessResult: async (jobId: string) =>
    handleJson(await fetch(`${BASE_URL}/process/result/${jobId}`)),
  getLatestJobByFile: async (fileId: string) =>
    handleJson(await fetch(`${BASE_URL}/process/latest-job?file_id=${encodeURIComponent(fileId)}`)),
  getPreview: async (fileId: string, n = 5) =>
    handleJson(await fetch(`${BASE_URL}/preview?file_id=${encodeURIComponent(fileId)}&n=${n}`)),
  getGrouped: async (fileId: string, n = 1000) =>
    handleJson(await fetch(`${BASE_URL}/grouped?file_id=${encodeURIComponent(fileId)}&n=${n}`)),

  // Uploads listing and downloads
  listUploads: async () => handleJson(await fetch(`${BASE_URL}/uploads`)),
  downloadGrouped: (fileId: string) => `${BASE_URL}/download/grouped/${encodeURIComponent(fileId)}`,
  downloadMaster: (fileId: string) => `${BASE_URL}/download/master/${encodeURIComponent(fileId)}`,
};
