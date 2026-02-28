import { useState, useRef, useCallback } from 'react'
import { ArrowUpTrayIcon, XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { supabase } from '../../../lib/supabase'

interface BillUploadProps {
  householdId: string
  onExtracted?: () => void
}

type UploadStatus = 'idle' | 'uploading' | 'extracting' | 'done' | 'error'

interface FileEntry {
  file: File
  status: UploadStatus
  result?: {
    is_bill: boolean
    provider?: string
    amount?: number
    category?: string
    confidence?: number
    status?: string
  }
  error?: string
}

const ACCEPTED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]
const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB

function fileExtLabel(name: string): string {
  const ext = name.split('.').pop()?.toUpperCase() || 'FILE'
  return ext
}

export default function BillUpload({ householdId, onExtracted }: BillUploadProps) {
  const [files, setFiles] = useState<FileEntry[]>([])
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((fileList: FileList | File[]) => {
    const newFiles: FileEntry[] = []
    for (const file of Array.from(fileList)) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        newFiles.push({ file, status: 'error', error: 'Unsupported file type' })
        continue
      }
      if (file.size > MAX_FILE_SIZE) {
        newFiles.push({ file, status: 'error', error: 'File exceeds 20MB limit' })
        continue
      }
      newFiles.push({ file, status: 'idle' })
    }
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  function removeFile(index: number) {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  async function processFile(index: number) {
    const entry = files[index]
    if (!entry || entry.status !== 'idle') return

    // Update to uploading
    setFiles(prev => prev.map((f, i) =>
      i === index ? { ...f, status: 'uploading' as UploadStatus } : f
    ))

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      // Upload to Supabase Storage
      const timestamp = Date.now()
      const safeName = entry.file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const storagePath = `${householdId}/${timestamp}-${safeName}`

      const { error: uploadErr } = await supabase.storage
        .from('bills')
        .upload(storagePath, entry.file, {
          contentType: entry.file.type,
          upsert: false,
        })

      if (uploadErr) throw new Error(uploadErr.message)

      // Update to extracting
      setFiles(prev => prev.map((f, i) =>
        i === index ? { ...f, status: 'extracting' as UploadStatus } : f
      ))

      // Call extraction Edge Function
      const response = await supabase.functions.invoke('extract-bill', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          storage_path: storagePath,
          original_filename: entry.file.name,
        },
      })

      if (response.error) throw new Error(response.error.message)

      setFiles(prev => prev.map((f, i) =>
        i === index ? { ...f, status: 'done' as UploadStatus, result: response.data } : f
      ))

      onExtracted?.()
    } catch (err) {
      setFiles(prev => prev.map((f, i) =>
        i === index
          ? { ...f, status: 'error' as UploadStatus, error: err instanceof Error ? err.message : 'Upload failed' }
          : f
      ))
    }
  }

  async function processAll() {
    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'idle') {
        await processFile(i)
      }
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files)
    }
  }

  const idleCount = files.filter(f => f.status === 'idle').length

  return (
    <div className="la-upload-section">
      {/* Drop zone */}
      <div
        className={`la-upload-zone ${dragActive ? 'la-upload-zone-active' : ''}`}
        onDragEnter={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragActive(false)
        }}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload bill"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
      >
        <ArrowUpTrayIcon className="la-upload-icon" aria-hidden="true" />
        <span className="la-upload-label">
          {dragActive ? 'Drop to upload' : 'Drop a bill or click to browse'}
        </span>
        <span className="la-upload-hint">PDF, JPEG, PNG, WebP up to 20MB</span>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp,.gif"
          multiple
          onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = '' }}
          className="la-upload-input"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="la-upload-files">
          {files.map((entry, i) => (
            <div key={`${entry.file.name}-${i}`} className="la-upload-chip">
              <span className="la-upload-chip-ext">{fileExtLabel(entry.file.name)}</span>
              <div className="la-upload-chip-info">
                <span className="la-upload-chip-name">{entry.file.name}</span>
                <span className="la-upload-chip-status">
                  {entry.status === 'idle' && 'Ready'}
                  {entry.status === 'uploading' && 'Uploading\u2026'}
                  {entry.status === 'extracting' && 'Extracting\u2026'}
                  {entry.status === 'done' && entry.result?.is_bill && (
                    <span className="la-upload-result">
                      <CheckCircleIcon className="la-upload-result-icon la-upload-ok" aria-hidden="true" />
                      {entry.result.provider} \u00b7 {entry.result.amount != null
                        ? new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(entry.result.amount)
                        : 'No amount'}
                    </span>
                  )}
                  {entry.status === 'done' && !entry.result?.is_bill && (
                    <span className="la-upload-result">Not a bill</span>
                  )}
                  {entry.status === 'error' && (
                    <span className="la-upload-result">
                      <ExclamationTriangleIcon className="la-upload-result-icon la-upload-err" aria-hidden="true" />
                      {entry.error}
                    </span>
                  )}
                </span>
              </div>
              {(entry.status === 'idle' || entry.status === 'error') && (
                <button
                  className="la-upload-chip-remove"
                  onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                  aria-label={`Remove ${entry.file.name}`}
                >
                  <XMarkIcon aria-hidden="true" />
                </button>
              )}
            </div>
          ))}

          {idleCount > 0 && (
            <button className="la-upload-submit" onClick={processAll}>
              <DocumentTextIcon className="la-upload-submit-icon" aria-hidden="true" />
              <span>Extract {idleCount === 1 ? 'bill' : `${idleCount} bills`}</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
