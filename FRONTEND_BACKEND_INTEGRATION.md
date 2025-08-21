# SFDR Navigator - Frontend-Backend Integration

## Overview

This document outlines the comprehensive frontend-backend integration for the SFDR Navigator, implementing a robust architecture with fallback mechanisms, OCR processing, real-time updates, and external API integrations.

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Service    │    │   Backend       │
│   (React)       │◄──►│   Layer          │◄──►│   (Supabase)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   WebSocket     │    │   External APIs  │    │   Edge Functions│
│   Real-time     │    │   (Fallback)     │    │   (OCR, etc.)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Key Features Implemented

### 1. **Fallback API Architecture**
- **Primary**: Supabase Edge Functions
- **Secondary**: External Nexus API
- **Tertiary**: Mock data generation
- **Purpose**: Ensures service availability even when external APIs are down

### 2. **OCR Document Processing**
- **Supported Formats**: PDF, DOC, DOCX, TXT, JPEG, PNG, TIFF
- **Features**: Text extraction, table detection, SFDR data extraction
- **Integration**: OCR.space API with confidence scoring

### 3. **Real-time WebSocket Updates**
- **Connection**: WebSocket server for live updates
- **Events**: Document processing, compliance validation, status updates
- **Fallback**: Automatic reconnection with exponential backoff

### 4. **ESMA Database Integration**
- **Data Source**: European Securities and Markets Authority
- **Features**: SFDR disclosures, taxonomy alignment, regulatory updates
- **Purpose**: Real-time regulatory data for compliance validation

### 5. **Historical Data Management**
- **Storage**: Supabase database with time-series data
- **Features**: Compliance history, change tracking, audit trails
- **Purpose**: Track compliance evolution over time

## Implementation Details

### API Service Layer (`src/services/sfdrApiService.ts`)

The core service that orchestrates all backend interactions:

```typescript
class SFDRApiService {
  // WebSocket management
  private wsConnection: WebSocket | null = null;
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  // Document upload with OCR
  async uploadDocumentWithOCR(file: File, options: DocumentProcessingOptions)

  // SFDR compliance validation with fallback
  async validateSFDRCompliance(request: SFDRClassificationRequest)

  // ESMA data integration
  async fetchESMAData(query: ESMAQuery)

  // Historical data retrieval
  async getHistoricalComplianceData(entityId: string, dateRange?: DateRange)
}
```

### WebSocket Server (`supabase/functions/websocket-server/index.ts`)

Real-time communication server:

```typescript
// Handles WebSocket connections and message broadcasting
function handleWebSocketUpgrade(req: Request): Response
function broadcastToAll(message: any): void
function sendToUser(userId: string, message: any): void
```

### Document Upload Component (`src/components/DocumentUpload.tsx`)

Enhanced file upload with drag-and-drop and OCR processing:

```typescript
export const DocumentUpload = ({ 
  onUploadComplete, 
  onProcessingStatus 
}: DocumentUploadProps) => {
  // File validation and processing
  // Real-time progress updates
  // OCR result display
  // SFDR data extraction
}
```

## Environment Configuration

### Required Environment Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# External API Keys
VITE_NEXUS_API_KEY=your_nexus_api_key
VITE_OCR_API_KEY=your_ocr_space_api_key

# WebSocket Configuration
VITE_WEBSOCKET_URL=wss://your-project.supabase.co/functions/v1/websocket-server

# Feature Flags
VITE_ENABLE_OCR=true
VITE_ENABLE_WEBSOCKET=true
VITE_ENABLE_ESMA_INTEGRATION=true
VITE_ENABLE_EXTERNAL_API_FALLBACK=true
```

## Database Schema

### Core Tables

```sql
-- Compliance assessments
CREATE TABLE compliance_assessments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  fund_name TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  target_article TEXT NOT NULL,
  assessment_data JSONB,
  validation_results JSONB,
  compliance_score INTEGER,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents with OCR results
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  filename TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  storage_path TEXT,
  ocr_result JSONB,
  extracted_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints

### Supabase Edge Functions

1. **`/functions/v1/check-compliance`**
   - Validates SFDR compliance
   - Returns detailed assessment results

2. **`/functions/v1/upload-document`**
   - Handles file uploads
   - Integrates with OCR processing

3. **`/functions/v1/websocket-server`**
   - Real-time communication
   - Status updates and notifications

### External API Integration

1. **OCR.space API**
   - Document text extraction
   - Table and image detection

2. **ESMA Database**
   - Regulatory data retrieval
   - Taxonomy alignment information

3. **Nexus External API**
   - Fallback compliance validation
   - Additional processing capabilities

## Real-time Features

### WebSocket Events

```typescript
// Document processing events
'document_processed': {
  documentId: string,
  status: 'completed' | 'failed',
  extractedData: ExtractedSFDRData
}

// Compliance validation events
'compliance_validated': {
  assessmentId: string,
  status: 'completed',
  score: number
}

// Processing status events
'processing_status': {
  stage: 'uploading' | 'ocr_processing' | 'validation',
  progress: number,
  message: string
}
```

### Event Handling

```typescript
// Subscribe to real-time updates
sfdrApiService.subscribeToUpdates('document_processed', (data) => {
  // Handle document processing completion
});

sfdrApiService.subscribeToUpdates('compliance_validated', (data) => {
  // Handle compliance validation completion
});
```

## Error Handling & Fallback Strategy

### Multi-level Fallback

1. **Primary**: Supabase Edge Functions
2. **Secondary**: External Nexus API
3. **Tertiary**: Mock data generation
4. **Graceful Degradation**: Feature flags for optional services

### Error Recovery

```typescript
// Automatic retry with exponential backoff
const retryWithBackoff = async (fn: Function, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
};
```

## Performance Optimizations

### Caching Strategy

- **API Responses**: React Query for caching
- **OCR Results**: Local storage for processed documents
- **ESMA Data**: Time-based caching for regulatory data

### Lazy Loading

- **Components**: React.lazy for code splitting
- **Images**: Progressive loading for document previews
- **Data**: Pagination for large datasets

## Security Considerations

### Authentication

- **JWT Tokens**: Supabase authentication
- **API Keys**: Environment variable protection
- **CORS**: Configured for specific origins

### Data Protection

- **Input Sanitization**: XSS prevention
- **File Validation**: Type and size restrictions
- **Encryption**: HTTPS for all communications

## Testing Strategy

### Unit Tests

```typescript
// API service tests
describe('SFDRApiService', () => {
  test('should handle fallback when primary API fails', async () => {
    // Test fallback mechanism
  });
  
  test('should process documents with OCR', async () => {
    // Test OCR integration
  });
});
```

### Integration Tests

```typescript
// End-to-end tests
describe('Document Upload Flow', () => {
  test('should upload document and extract SFDR data', async () => {
    // Test complete upload flow
  });
});
```

## Deployment Considerations

### Environment Setup

1. **Supabase Project**: Configure Edge Functions
2. **Environment Variables**: Set all required keys
3. **CORS Configuration**: Allow necessary origins
4. **Storage Buckets**: Configure for document uploads

### Monitoring

- **Error Tracking**: Log all API failures
- **Performance Monitoring**: Track response times
- **Usage Analytics**: Monitor feature usage

## Future Enhancements

### Post-MVP Features

1. **Collaborative Features**
   - Multi-user assessment editing
   - Real-time collaboration
   - Change tracking and versioning

2. **Advanced OCR**
   - Table structure recognition
   - Form field extraction
   - Signature detection

3. **AI-Powered Analysis**
   - Natural language processing
   - Compliance prediction
   - Risk assessment automation

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failures**
   - Check CORS configuration
   - Verify WebSocket URL
   - Monitor connection limits

2. **OCR Processing Errors**
   - Validate API key
   - Check file format support
   - Monitor rate limits

3. **External API Failures**
   - Verify API keys
   - Check service status
   - Review fallback logs

### Debug Mode

```typescript
// Enable debug logging
VITE_LOG_LEVEL=debug
VITE_DEV_MODE=true
```

## Conclusion

This implementation provides a robust, scalable foundation for the SFDR Navigator with comprehensive fallback mechanisms, real-time updates, and advanced document processing capabilities. The architecture ensures high availability and user experience even when external services are unavailable.