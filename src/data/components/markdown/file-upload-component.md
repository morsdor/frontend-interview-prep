# File Upload Component Design - Senior UI Developer Interview

## Component Overview

A production-ready file upload component that supports drag & drop, multiple file selection, progress tracking, chunked uploads, and comprehensive error handling. This component demonstrates advanced React patterns, performance optimization, and robust API integration.

## High-Level Architecture

```
FileUploadContainer
├── DropZone
├── FileList
│   ├── FileItem
│   │   ├── FilePreview
│   │   ├── ProgressBar
│   │   └── FileActions
├── UploadQueue
└── ErrorBoundary
```

## Core Component Implementation

### 1. Main Container Component

```typescript
interface FileUploadProps {
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  acceptedTypes?: string[];
  chunkSize?: number;
  onUploadComplete?: (files: UploadedFile[]) => void;
  onUploadError?: (error: UploadError) => void;
  apiEndpoint: string;
  headers?: Record<string, string>;
}

interface FileState {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'completed' | 'error' | 'cancelled';
  progress: number;
  uploadedChunks: number;
  totalChunks: number;
  error?: string;
  preview?: string;
  retryCount: number;
}

const FileUploadContainer: React.FC<FileUploadProps> = ({
  maxFiles = 10,
  maxFileSize = 100 * 1024 * 1024, // 100MB
  acceptedTypes = ['image/*', 'application/pdf', 'text/*'],
  chunkSize = 1024 * 1024, // 1MB chunks
  onUploadComplete,
  onUploadError,
  apiEndpoint,
  headers = {}
}) => {
  const [files, setFiles] = useState<FileState[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<string[]>([]);
  const uploadRefs = useRef<Map<string, AbortController>>(new Map());
  
  // Implementation details...
};
```

### 2. Upload Service Layer

```typescript
class UploadService {
  private static instance: UploadService;
  private activeUploads = new Map<string, AbortController>();
  
  static getInstance(): UploadService {
    if (!UploadService.instance) {
      UploadService.instance = new UploadService();
    }
    return UploadService.instance;
  }

  async uploadFileChunked(
    file: File,
    options: {
      endpoint: string;
      chunkSize: number;
      headers: Record<string, string>;
      onProgress: (progress: number) => void;
      onChunkComplete: (chunkIndex: number) => void;
    }
  ): Promise<UploadResult> {
    const { endpoint, chunkSize, headers, onProgress, onChunkComplete } = options;
    const fileId = this.generateFileId(file);
    const totalChunks = Math.ceil(file.size / chunkSize);
    
    const abortController = new AbortController();
    this.activeUploads.set(fileId, abortController);

    try {
      // Initialize upload session
      const uploadSession = await this.initializeUpload(file, endpoint, headers);
      
      // Upload chunks sequentially or in parallel
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        if (abortController.signal.aborted) {
          throw new Error('Upload cancelled');
        }

        const chunk = this.getFileChunk(file, chunkIndex, chunkSize);
        await this.uploadChunk(uploadSession.id, chunk, chunkIndex, headers);
        
        onChunkComplete(chunkIndex);
        onProgress(((chunkIndex + 1) / totalChunks) * 100);
      }

      // Finalize upload
      return await this.finalizeUpload(uploadSession.id, headers);
    } finally {
      this.activeUploads.delete(fileId);
    }
  }

  cancelUpload(fileId: string): void {
    const controller = this.activeUploads.get(fileId);
    if (controller) {
      controller.abort();
      this.activeUploads.delete(fileId);
    }
  }

  private async initializeUpload(
    file: File, 
    endpoint: string, 
    headers: Record<string, string>
  ): Promise<{id: string; uploadUrl: string}> {
    const response = await fetch(`${endpoint}/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify({
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to initialize upload: ${response.statusText}`);
    }

    return response.json();
  }

  private getFileChunk(file: File, chunkIndex: number, chunkSize: number): Blob {
    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    return file.slice(start, end);
  }
}
```

### 3. Custom Hooks

```typescript
// File validation hook
const useFileValidation = (acceptedTypes: string[], maxFileSize: number) => {
  return useCallback((file: File): ValidationResult => {
    const errors: string[] = [];

    // Size validation
    if (file.size > maxFileSize) {
      errors.push(`File size exceeds ${formatFileSize(maxFileSize)}`);
    }

    // Type validation
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      errors.push(`File type ${file.type} is not supported`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [acceptedTypes, maxFileSize]);
};

// Upload queue management hook
const useUploadQueue = () => {
  const [queue, setQueue] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addToQueue = useCallback((fileId: string) => {
    setQueue(prev => [...prev, fileId]);
  }, []);

  const removeFromQueue = useCallback((fileId: string) => {
    setQueue(prev => prev.filter(id => id !== fileId));
  }, []);

  const processQueue = useCallback(async (
    files: FileState[],
    uploadFunction: (file: FileState) => Promise<void>
  ) => {
    if (isProcessing || queue.length === 0) return;

    setIsProcessing(true);
    
    try {
      // Process uploads with concurrency limit
      const concurrencyLimit = 3;
      const batches = [];
      
      for (let i = 0; i < queue.length; i += concurrencyLimit) {
        batches.push(queue.slice(i, i + concurrencyLimit));
      }

      for (const batch of batches) {
        await Promise.all(
          batch.map(async (fileId) => {
            const file = files.find(f => f.id === fileId);
            if (file && file.status === 'pending') {
              await uploadFunction(file);
            }
          })
        );
      }
    } finally {
      setIsProcessing(false);
    }
  }, [queue, isProcessing]);

  return { queue, addToQueue, removeFromQueue, processQueue, isProcessing };
};
```

### 4. UI Components

```typescript
// Drag & Drop Zone
const DropZone: React.FC<DropZoneProps> = ({ 
  onFilesSelected, 
  isDragOver, 
  onDragOver, 
  onDragLeave 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || []);
    onFilesSelected(files);
    onDragLeave();
  }, [onFilesSelected, onDragLeave]);

  return (
    <div 
      className={`dropzone ${isDragOver ? 'drag-over' : ''}`}
      onDrop={handleDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => onFilesSelected(Array.from(e.target.files || []))}
      />
      <div className="dropzone-content">
        <CloudUploadIcon size={48} />
        <p>Drop files here or click to select</p>
      </div>
    </div>
  );
};

// File Item Component
const FileItem: React.FC<FileItemProps> = ({ file, onCancel, onRetry, onRemove }) => {
  const getStatusIcon = () => {
    switch (file.status) {
      case 'uploading': return <LoadingIcon className="animate-spin" />;
      case 'completed': return <CheckIcon className="text-green-500" />;
      case 'error': return <XIcon className="text-red-500" />;
      default: return <FileIcon />;
    }
  };

  return (
    <div className="file-item">
      <div className="file-info">
        {file.preview && (
          <img src={file.preview} alt={file.file.name} className="file-preview" />
        )}
        <div className="file-details">
          <span className="file-name">{file.file.name}</span>
          <span className="file-size">{formatFileSize(file.file.size)}</span>
          {file.error && <span className="error-message">{file.error}</span>}
        </div>
      </div>
      
      <div className="file-progress">
        {file.status === 'uploading' && (
          <ProgressBar progress={file.progress} />
        )}
      </div>
      
      <div className="file-actions">
        {getStatusIcon()}
        {file.status === 'uploading' && (
          <button onClick={() => onCancel(file.id)} className="btn-cancel">
            Cancel
          </button>
        )}
        {file.status === 'error' && (
          <button onClick={() => onRetry(file.id)} className="btn-retry">
            Retry
          </button>
        )}
        {['completed', 'error', 'cancelled'].includes(file.status) && (
          <button onClick={() => onRemove(file.id)} className="btn-remove">
            Remove
          </button>
        )}
      </div>
    </div>
  );
};
```

## API Design

### Upload Endpoints

```typescript
// Initialize chunked upload
POST /api/upload/init
Request: {
  fileName: string;
  fileSize: number;
  mimeType: string;
  metadata?: Record<string, any>;
}
Response: {
  uploadId: string;
  uploadUrl: string;
  chunkSize: number;
  expiresAt: string;
}

// Upload chunk
PUT /api/upload/{uploadId}/chunk/{chunkIndex}
Request: Binary chunk data
Headers: {
  'Content-Range': 'bytes start-end/total'
}
Response: {
  chunkIndex: number;
  received: boolean;
  nextChunkIndex?: number;
}

// Finalize upload
POST /api/upload/{uploadId}/finalize
Request: {
  totalChunks: number;
  checksum?: string;
}
Response: {
  fileId: string;
  url: string;
  metadata: FileMetadata;
}

// Cancel upload
DELETE /api/upload/{uploadId}
Response: 204 No Content
```

## Performance Optimizations

### 1. Memory Management
- Use `createObjectURL` for previews and cleanup with `revokeObjectURL`
- Implement virtual scrolling for large file lists
- Lazy load file previews

### 2. Upload Optimization
- Implement adaptive chunk sizing based on network speed
- Use HTTP/2 multiplexing for parallel chunk uploads
- Implement exponential backoff for retries

### 3. State Management
- Use `useReducer` for complex state transitions
- Implement optimistic updates for better UX
- Debounce progress updates to reduce re-renders

```typescript
const fileUploadReducer = (state: FileUploadState, action: FileUploadAction): FileUploadState => {
  switch (action.type) {
    case 'ADD_FILES':
      return {
        ...state,
        files: [...state.files, ...action.payload.map(createFileState)]
      };
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        files: state.files.map(file =>
          file.id === action.payload.id
            ? { ...file, progress: action.payload.progress }
            : file
        )
      };
    case 'SET_STATUS':
      return {
        ...state,
        files: state.files.map(file =>
          file.id === action.payload.id
            ? { ...file, status: action.payload.status, error: action.payload.error }
            : file
        )
      };
    default:
      return state;
  }
};
```

---

## Interview Questions & Answers

### Q1: How would you handle uploading very large files (>1GB) efficiently?

**Answer:** 
For large files, I'd implement several strategies:

1. **Chunked Upload**: Break files into smaller chunks (1-5MB) and upload them sequentially or in parallel
2. **Resumable Uploads**: Store chunk metadata on the server so uploads can resume if interrupted
3. **Adaptive Chunk Size**: Start with smaller chunks and increase size based on network performance
4. **Background Processing**: Use Web Workers for file processing to avoid blocking the main thread
5. **Progress Streaming**: Use Server-Sent Events or WebSockets for real-time progress updates
6. **Compression**: Implement client-side compression for compressible files

```typescript
// Example resumable upload implementation
const resumeUpload = async (file: File, uploadId: string) => {
  const response = await fetch(`/api/upload/${uploadId}/status`);
  const { uploadedChunks } = await response.json();
  
  // Resume from the last unuploaded chunk
  const startChunk = uploadedChunks.length;
  return uploadFileChunked(file, { startChunk, uploadId });
};
```

### Q2: How would you implement real-time progress updates for multiple concurrent uploads?

**Answer:**
I'd use a combination of techniques:

1. **WebSocket Connection**: Establish a WebSocket connection for real-time updates
2. **Upload Session Management**: Track each upload session with unique IDs
3. **Throttled Updates**: Debounce progress updates to avoid overwhelming the UI
4. **Batch Progress Updates**: Send multiple progress updates in a single message

```typescript
class ProgressManager {
  private ws: WebSocket;
  private progressMap = new Map<string, number>();
  private updateQueue = new Map<string, number>();
  
  constructor(wsUrl: string) {
    this.ws = new WebSocket(wsUrl);
    this.startProgressBatching();
  }
  
  private startProgressBatching() {
    setInterval(() => {
      if (this.updateQueue.size > 0) {
        this.ws.send(JSON.stringify({
          type: 'progress_batch',
          updates: Array.from(this.updateQueue.entries())
        }));
        this.updateQueue.clear();
      }
    }, 100); // Batch every 100ms
  }
  
  updateProgress(uploadId: string, progress: number) {
    this.updateQueue.set(uploadId, progress);
  }
}
```

### Q3: How would you implement retry logic with exponential backoff?

**Answer:**
I'd implement a robust retry mechanism with exponential backoff:

```typescript
class RetryManager {
  private maxRetries = 3;
  private baseDelay = 1000; // 1 second
  
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: { uploadId: string; chunkIndex?: number }
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === this.maxRetries) {
          throw lastError;
        }
        
        // Exponential backoff with jitter
        const delay = this.baseDelay * Math.pow(2, attempt);
        const jitter = Math.random() * 0.1 * delay;
        
        await this.sleep(delay + jitter);
      }
    }
    
    throw lastError!;
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Q4: How would you optimize the component for mobile devices?

**Answer:**
Mobile optimization would include:

1. **Touch-Friendly Interface**: Larger touch targets, appropriate spacing
2. **Responsive Design**: Adapt layout for different screen sizes
3. **Performance Optimization**: Reduce chunk size on slower connections
4. **Battery Conservation**: Pause uploads when device is low on battery
5. **Offline Support**: Queue uploads when offline, process when online
6. **Camera Integration**: Direct camera access for photo uploads

```typescript
const useMobileOptimizations = () => {
  const [connectionSpeed, setConnectionSpeed] = useState<'slow' | 'fast'>('fast');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    // Detect connection speed
    const connection = (navigator as any).connection;
    if (connection) {
      const updateConnectionSpeed = () => {
        setConnectionSpeed(connection.effectiveType.includes('2g') ? 'slow' : 'fast');
      };
      
      connection.addEventListener('change', updateConnectionSpeed);
      return () => connection.removeEventListener('change', updateConnectionSpeed);
    }
  }, []);
  
  return {
    chunkSize: connectionSpeed === 'slow' ? 512 * 1024 : 2 * 1024 * 1024,
    maxConcurrentUploads: connectionSpeed === 'slow' ? 1 : 3,
    isOnline
  };
};
```

### Q5: How would you implement file type validation and preview generation?

**Answer:**
I'd implement comprehensive file validation and preview generation:

```typescript
class FileProcessor {
  private static readonly PREVIEW_SIZE = 200;
  private static readonly SUPPORTED_PREVIEW_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp'
  ];
  
  async validateFile(file: File, rules: ValidationRules): Promise<ValidationResult> {
    const errors: string[] = [];
    
    // Size validation
    if (file.size > rules.maxSize) {
      errors.push(`File size exceeds ${formatFileSize(rules.maxSize)}`);
    }
    
    // Type validation
    if (!this.isValidType(file.type, rules.acceptedTypes)) {
      errors.push(`File type ${file.type} is not supported`);
    }
    
    // Content validation (for images)
    if (file.type.startsWith('image/')) {
      try {
        await this.validateImageFile(file);
      } catch (error) {
        errors.push('Invalid image file');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  async generatePreview(file: File): Promise<string | null> {
    if (!FileProcessor.SUPPORTED_PREVIEW_TYPES.includes(file.type)) {
      return null;
    }
    
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate dimensions maintaining aspect ratio
        const { width, height } = this.calculatePreviewDimensions(
          img.width, 
          img.height, 
          FileProcessor.PREVIEW_SIZE
        );
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      
      img.onerror = () => resolve(null);
      img.src = URL.createObjectURL(file);
    });
  }
  
  private validateImageFile(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve();
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Invalid image'));
      };
      img.src = URL.createObjectURL(file);
    });
  }
}
```

### Q6: How would you handle error scenarios and provide good user feedback?

**Answer:**
I'd implement comprehensive error handling:

```typescript
enum UploadErrorType {
  NETWORK_ERROR = 'network_error',
  SERVER_ERROR = 'server_error',
  VALIDATION_ERROR = 'validation_error',
  QUOTA_EXCEEDED = 'quota_exceeded',
  TIMEOUT = 'timeout',
  CANCELLED = 'cancelled'
}

class ErrorManager {
  static getErrorMessage(error: UploadError): string {
    switch (error.type) {
      case UploadErrorType.NETWORK_ERROR:
        return 'Network connection failed. Please check your internet connection.';
      case UploadErrorType.SERVER_ERROR:
        return `Server error (${error.code}). Please try again later.`;
      case UploadErrorType.VALIDATION_ERROR:
        return error.message || 'File validation failed.';
      case UploadErrorType.QUOTA_EXCEEDED:
        return 'Upload quota exceeded. Please try again later.';
      case UploadErrorType.TIMEOUT:
        return 'Upload timed out. Please try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
  
  static isRetryable(error: UploadError): boolean {
    return [
      UploadErrorType.NETWORK_ERROR,
      UploadErrorType.SERVER_ERROR,
      UploadErrorType.TIMEOUT
    ].includes(error.type);
  }
}

// Error boundary component
class UploadErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Upload component error:', error, errorInfo);
    // Send error to monitoring service
    this.props.onError?.(error);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h3>Something went wrong</h3>
          <p>The upload component encountered an error.</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### Q7: How would you test this component comprehensively?

**Answer:**
I'd implement multiple testing strategies:

```typescript
// Unit tests
describe('FileUploadComponent', () => {
  it('should validate file types correctly', () => {
    const validator = new FileValidator(['image/*'], 5 * 1024 * 1024);
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    
    expect(validator.validate(file)).toEqual({
      isValid: true,
      errors: []
    });
  });
  
  it('should handle upload progress updates', async () => {
    const onProgress = jest.fn();
    const uploader = new FileUploader({ onProgress });
    
    await uploader.uploadFile(mockFile);
    
    expect(onProgress).toHaveBeenCalledWith(expect.objectContaining({
      progress: expect.any(Number)
    }));
  });
});

// Integration tests
describe('FileUpload Integration', () => {
  it('should complete full upload flow', async () => {
    // Mock API responses
    fetchMock.mockResponses(
      [JSON.stringify({ uploadId: '123', uploadUrl: 'test' }), { status: 200 }],
      ['', { status: 200 }], // chunk upload
      [JSON.stringify({ fileId: '456', url: 'result' }), { status: 200 }] // finalize
    );
    
    const { getByTestId } = render(<FileUploadComponent />);
    const fileInput = getByTestId('file-input');
    
    fireEvent.change(fileInput, { target: { files: [mockFile] } });
    
    await waitFor(() => {
      expect(getByTestId('upload-success')).toBeInTheDocument();
    });
  });
});

// E2E tests with Cypress
describe('File Upload E2E', () => {
  it('should upload file via drag and drop', () => {
    cy.visit('/upload');
    
    cy.fixture('test-image.jpg').then(fileContent => {
      cy.get('[data-testid="drop-zone"]').selectFile({
        contents: fileContent,
        fileName: 'test-image.jpg'
      }, { action: 'drag-drop' });
    });
    
    cy.get('[data-testid="upload-progress"]').should('be.visible');
    cy.get('[data-testid="upload-success"]').should('be.visible');
  });
});
```

### Q8: How would you scale this component for enterprise use?

**Answer:**
For enterprise scaling, I'd implement:

1. **Microservice Architecture**: Separate upload service from main application
2. **CDN Integration**: Direct uploads to CDN with signed URLs
3. **Queue Management**: Redis-based queue for handling high volume
4. **Monitoring**: Comprehensive metrics and alerting
5. **Multi-region Support**: Regional upload endpoints for global users

```typescript
// Enterprise configuration
interface EnterpriseUploadConfig {
  uploadService: {
    baseUrl: string;
    apiKey: string;
    timeout: number;
    retryConfig: RetryConfig;
  };
  cdn: {
    provider: 'aws' | 'azure' | 'gcp';
    bucketName: string;
    region: string;
  };
  monitoring: {
    metricsEndpoint: string;
    errorReporting: boolean;
  };
  features: {
    virusScanning: boolean;
    thumbnailGeneration: boolean;
    contentModeration: boolean;
  };
}

class EnterpriseUploadService extends UploadService {
  private metrics: MetricsCollector;
  private virusScanner: VirusScanner;
  
  constructor(config: EnterpriseUploadConfig) {
    super(config.uploadService);
    this.metrics = new MetricsCollector(config.monitoring);
    this.virusScanner = new VirusScanner(config.features);
  }
  
  async uploadFile(file: File): Promise<UploadResult> {
    const startTime = Date.now();
    
    try {
      // Pre-upload virus scan
      if (this.config.features.virusScanning) {
        await this.virusScanner.scan(file);
      }
      
      const result = await super.uploadFile(file);
      
      // Collect success metrics
      this.metrics.recordUploadSuccess(file.size, Date.now() - startTime);
      
      return result;
    } catch (error) {
      this.metrics.recordUploadError(error, file.size);
      throw error;
    }
  }
}
```

This comprehensive design demonstrates production-ready React patterns, performance optimization, error handling, and enterprise scalability considerations that would be expected in a senior UI developer interview at top tech companies.