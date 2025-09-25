import * as React from "react"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, File, X, CheckCircle } from "lucide-react"

interface FileUploadProps {
  onUpload: (files: File[]) => void
  accept?: string
  maxSize?: number
  multiple?: boolean
  className?: string
}

export function FileUpload({
  onUpload,
  accept = "*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
  className,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragActive, setIsDragActive] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploadedFiles(acceptedFiles)
      onUpload(acceptedFiles)
    },
    [onUpload]
  )

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    maxSize,
    multiple,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  })

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    onUpload(newFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={cn("w-full", className)}>
      <Card
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer hover:bg-muted/50",
          isDragActive && !isDragReject && "border-primary bg-primary/5",
          isDragReject && "border-destructive bg-destructive/5",
          uploadedFiles.length > 0 && "border-green-500 bg-green-50 dark:bg-green-950"
        )}
      >
        <CardContent className="p-8">
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-muted p-3">
              {uploadedFiles.length > 0 ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            
            <div className="text-center">
              <p className="text-lg font-medium">
                {uploadedFiles.length > 0
                  ? `${uploadedFiles.length} file${uploadedFiles.length > 1 ? "s" : ""} uploaded`
                  : "Drag & drop files here"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse
              </p>
              {accept !== "*" && (
                <p className="text-xs text-muted-foreground mt-2">
                  Accepted formats: {accept}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Max size: {formatFileSize(maxSize)}
              </p>
            </div>

            {!multiple && uploadedFiles.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setUploadedFiles([])
                  onUpload([])
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <File className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
