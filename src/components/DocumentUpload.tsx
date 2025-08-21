/**
 * Document Upload Component
 * Handles file uploads with OCR processing and SFDR data extraction
 */

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Image, AlertCircle, CheckCircle, Loader2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sfdrApiService } from '@/services/sfdrApiService';
import { logger } from '@/utils/logger';
import type { DocumentUploadResponse, ProcessingStatus, ExtractedSFDRData } from '@/types/nexus';

interface DocumentUploadProps {
  onUploadComplete?: (result: DocumentUploadResponse) => void;
  onProcessingStatus?: (status: ProcessingStatus) => void;
  className?: string;
}

export const DocumentUpload = ({ 
  onUploadComplete, 
  onProcessingStatus,
  className = '' 
}: DocumentUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<DocumentUploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File validation
  const validateFile = (file: File): string | null => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/tiff'
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Please upload PDF, DOC, DOCX, TXT, JPEG, PNG, or TIFF files.';
    }

    if (file.size > maxSize) {
      return 'File too large. Maximum size is 10MB.';
    }

    return null;
  };

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);
    setUploadResult(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Update processing status
      const updateStatus = (status: ProcessingStatus) => {
        setProcessingStatus(status);
        onProcessingStatus?.(status);
      };

      updateStatus({
        stage: 'uploading',
        progress: 0,
        message: 'Uploading document...'
      });

      const result = await sfdrApiService.uploadDocumentWithOCR(file, 'compliance_document', {
        enableOCR: true,
        language: 'eng',
        extractTables: true,
        extractImages: true,
        confidenceThreshold: 0.7
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        setUploadResult(result);
        onUploadComplete?.(result);
        
        updateStatus({
          stage: 'completed',
          progress: 100,
          message: 'Document processed successfully!'
        });

        // Clear status after 3 seconds
        setTimeout(() => {
          setProcessingStatus(null);
        }, 3000);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      logger.error('Document upload error:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
      
      setProcessingStatus({
        stage: 'failed',
        progress: 0,
        message: 'Upload failed'
      });
    } finally {
      setIsUploading(false);
    }
  }, [onUploadComplete, onProcessingStatus]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  // Handle click on upload area
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Reset upload
  const handleReset = useCallback(() => {
    setUploadResult(null);
    setError(null);
    setUploadProgress(0);
    setProcessingStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card className={`transition-all duration-200 ${isDragOver ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload SFDR Compliance Document
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-all duration-200 hover:border-blue-500 hover:bg-blue-50
              ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
              ${isUploading ? 'pointer-events-none opacity-50' : ''}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.tiff"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isUploading}
            />

            <div className="space-y-4">
              <div className="flex justify-center">
                {isUploading ? (
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                ) : (
                  <Upload className="w-12 h-12 text-gray-400" />
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  {isUploading ? 'Uploading...' : 'Drop your document here'}
                </h3>
                <p className="text-sm text-gray-500">
                  {isUploading 
                    ? 'Processing your document with OCR and SFDR data extraction...'
                    : 'or click to browse files'
                  }
                </p>
              </div>

              {/* Progress Bar */}
              {isUploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-gray-600">{uploadProgress}% complete</p>
                </div>
              )}

              {/* Processing Status */}
              {processingStatus && (
                <div className="mt-4">
                  <Badge variant={processingStatus.stage === 'completed' ? 'default' : 'secondary'}>
                    {processingStatus.message}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Supported Formats */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Supported formats: PDF, DOC, DOCX, TXT, JPEG, PNG, TIFF (max 10MB)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Result */}
      <AnimatePresence>
        {uploadResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  Document Processed Successfully
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Extracted Data */}
                {uploadResult.extractedData && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-green-800">Extracted SFDR Data:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Fund Name:</p>
                        <p className="text-sm text-gray-600">{uploadResult.extractedData.fundName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Article Classification:</p>
                        <p className="text-sm text-gray-600">{uploadResult.extractedData.articleClassification}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Investment Objective:</p>
                        <p className="text-sm text-gray-600">{uploadResult.extractedData.investmentObjective}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Taxonomy Alignment:</p>
                        <p className="text-sm text-gray-600">{uploadResult.extractedData.taxonomyAlignment}%</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* OCR Results */}
                {uploadResult.ocrResult?.success && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-green-800">OCR Processing Results:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Text Extracted:</p>
                        <p className="text-sm text-gray-600">{uploadResult.ocrResult.text?.length || 0} characters</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Confidence:</p>
                        <p className="text-sm text-gray-600">{uploadResult.ocrResult.confidence || 0}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Processing Time:</p>
                        <p className="text-sm text-gray-600">{uploadResult.ocrResult.processingTime || 0}ms</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Upload Another
                  </Button>
                  <Button 
                    onClick={() => {
                      // Trigger compliance validation
                      const event = new CustomEvent('sfdr-validate-compliance', {
                        detail: { extractedData: uploadResult.extractedData }
                      });
                      window.dispatchEvent(event);
                    }}
                    size="sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Validate Compliance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentUpload;