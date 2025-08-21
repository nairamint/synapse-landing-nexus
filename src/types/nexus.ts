/**
 * Nexus Agent Type Definitions
 * Integrated from the Nexus SFDR regulatory compliance agent
 */

// Base SFDR Types
export interface SFDRMetadata {
  entityId: string;
  reportingPeriod: string;
  regulatoryVersion: string;
  submissionType: 'INITIAL' | 'AMENDED' | 'CORRECTION';
  submissionDate?: string;
  preparationDate?: string;
  reportingEntity?: {
    name: string;
    lei?: string;
    jurisdiction: string;
  };
}

export interface FundProfile {
  fundType: 'UCITS' | 'AIF' | 'MMF' | 'PEPP' | 'IORP' | 'OTHER';
  fundName: string;
  isin?: string;
  lei?: string;
  targetArticleClassification: 'Article6' | 'Article8' | 'Article9';
  investmentObjective?: string;
  sustainabilityCharacteristics?: string[];
  investmentStrategy?: string;
  benchmarkInfo?: {
    benchmarkName?: string;
    benchmarkProvider?: string;
    isAligned: boolean;
  };
}

export interface PAIIndicators {
  mandatoryIndicators: string[];
  optionalIndicators?: string[];
  considerationStatement?: string;
  dataQuality?: {
    coveragePercentage: number;
    estimationMethods?: string[];
    dataLag?: number;
  };
}

export interface TaxonomyAlignment {
  environmentalObjectives: Array<
    | 'climate_change_mitigation'
    | 'climate_change_adaptation'
    | 'water_marine_resources'
    | 'circular_economy'
    | 'pollution_prevention'
    | 'biodiversity_ecosystems'
  >;
  alignmentPercentage?: number;
  eligibilityPercentage?: number;
  minSafeguards?: boolean;
  dnshAssessment?: {
    conducted: boolean;
    methodology?: string;
  };
}

export interface RegulatoryFramework {
  version: string;
  effectiveDate: string;
  applicableFrom: string;
  updates?: Array<{
    changeType: 'AMENDMENT' | 'CLARIFICATION' | 'TECHNICAL_STANDARD';
    description: string;
    effectiveDate: string;
  }>;
}

// Classification Request Structure
export interface SFDRClassificationRequest {
  metadata: SFDRMetadata;
  fundProfile: FundProfile;
  paiIndicators?: PAIIndicators;
  taxonomyAlignment?: TaxonomyAlignment;
  regulatoryFramework?: RegulatoryFramework;
  additionalDisclosures?: Record<string, unknown>;
}

// Validation Response Structure
export interface ValidationIssue {
  id: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  field?: string;
  ruleId?: string;
  regulation?: string;
  suggestion?: string;
}

export interface ValidationDetails {
  articleCompliance: boolean;
  paiConsistency: boolean;
  taxonomyAlignment: boolean;
  dataQuality: boolean;
  disclosureCompleteness: boolean;
  documentationSufficiency: boolean;
}

export interface ClassificationResult {
  recommendedArticle: 'Article6' | 'Article8' | 'Article9';
  confidence: number;
  reasoning: string[];
  alternativeClassifications?: Array<{
    article: 'Article6' | 'Article8' | 'Article9';
    confidence: number;
    conditions: string[];
  }>;
}

export interface NexusValidationResponse {
  success?: boolean;
  isValid?: boolean;
  requestId?: string;
  timestamp?: string;
  assessment?: {
    id: string;
    fundName: string;
    targetArticle: string;
    complianceScore: number;
    status: string;
    createdAt: string;
  };
  classification?: ClassificationResult;
  issues?: ValidationIssue[];
  recommendations?: string[];
  sources?: string[];
  validationDetails?: ValidationDetails;
  complianceResults?: {
    overallScore: number;
    checks: Array<{
      category: string;
      passed: boolean;
      message: string;
      severity?: string;
      recommendations?: string[];
    }>;
    issues: Array<{
      category: string;
      message: string;
      severity: string;
    }>;
    recommendations: string[];
    validationDetails: {
      articleCompliance: boolean;
      paiConsistency: boolean;
      taxonomyAlignment: boolean;
      dataQuality: boolean;
      disclosureCompleteness: boolean;
    };
  };
  complianceScore?: number;
  regulatoryReferences?: Array<{
    regulation: string;
    article: string;
    paragraph?: string;
    text: string;
  }>;
  auditTrail?: {
    validatorVersion: string;
    processingTime: number;
    checksPerformed: string[];
  };
  message?: string;
  error?: string;
}

// Chat Integration Types
export interface NexusMessage {
  id: string;
  type: 'user' | 'agent' | 'system' | 'validation';
  content: string;
  timestamp: Date;
  data?: SFDRClassificationRequest | NexusValidationResponse;
  isLoading?: boolean;
  metadata?: {
    validationId?: string;
    processingTime?: number;
    tokensUsed?: number;
  };
}

// Agent Capabilities
export interface NexusCapabilities {
  supportedRegulations: string[];
  supportedArticles: string[];
  validationRules: string[];
  languages: string[];
  version: string;
  lastUpdated: string;
}

// Quick Action Types
export type QuickActionType =
  | 'upload-document'
  | 'check-compliance'
  | 'generate-report'
  | 'risk-assessment'
  | 'article-classification'
  | 'pai-analysis'
  | 'taxonomy-check';

export interface QuickAction {
  type: QuickActionType;
  label: string;
  description: string;
  icon: string;
  requiresData: boolean;
}

// ============================================================================
// NEW TYPES FOR ENHANCED API SERVICE
// ============================================================================

// OCR Processing Types
export interface OCRProcessingResult {
  success: boolean;
  text?: string;
  confidence?: number;
  language?: string;
  processingTime?: number;
  error?: string;
  tables?: Array<{
    headers: string[];
    rows: string[][];
  }>;
  images?: Array<{
    url: string;
    alt: string;
  }>;
}

// Document Upload Types
export interface DocumentUploadResponse {
  success: boolean;
  documentId?: string;
  fileUrl?: string;
  ocrResult?: OCRProcessingResult | null;
  extractedData?: {
    fundName: string;
    articleClassification: string;
    sustainabilityCharacteristics: string[];
    investmentObjective: string;
    paiIndicators: string[];
    taxonomyAlignment: number;
  };
  message?: string;
  error?: string;
}

// WebSocket Types
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp?: string;
  userId?: string;
}

export interface WebSocketStatus {
  connected: boolean;
  reconnectAttempts: number;
  lastMessage?: WebSocketMessage;
  error?: string;
}

// ESMA Integration Types
export interface ESMAIntegrationData {
  fundName: string;
  entityId: string;
  disclosures: Array<{
    id: string;
    type: string;
    date: string;
    content: string;
    status: string;
  }>;
  taxonomyAlignment?: {
    percentage: number;
    objectives: string[];
    lastUpdated: string;
  };
  regulatoryUpdates?: Array<{
    id: string;
    title: string;
    description: string;
    effectiveDate: string;
    impact: 'low' | 'medium' | 'high';
  }>;
}

// Compliance Assessment Types
export interface ComplianceAssessment {
  id: string;
  userId: string;
  fundName: string;
  entityId: string;
  targetArticle: string;
  assessmentData: Record<string, any>;
  validationResults: {
    overallScore: number;
    checks: Array<{
      category: string;
      passed: boolean;
      message: string;
      severity: string;
    }>;
    issues: Array<{
      category: string;
      message: string;
      severity: string;
    }>;
    recommendations: string[];
  };
  complianceScore: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

// Historical Data Types
export interface HistoricalComplianceData {
  id: string;
  entityId: string;
  assessmentDate: string;
  complianceScore: number;
  targetArticle: string;
  status: string;
  changes?: Array<{
    field: string;
    oldValue: any;
    newValue: any;
    date: string;
  }>;
}

// Real-time Processing Types
export interface ProcessingStatus {
  stage: 'uploading' | 'ocr_processing' | 'data_extraction' | 'validation' | 'completed' | 'failed';
  progress: number;
  message: string;
  details?: Record<string, any>;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

// Document Processing Types
export interface DocumentProcessingOptions {
  enableOCR?: boolean;
  language?: string;
  extractTables?: boolean;
  extractImages?: boolean;
  confidenceThreshold?: number;
}

// SFDR Data Extraction Types
export interface ExtractedSFDRData {
  fundName: string;
  articleClassification: string;
  sustainabilityCharacteristics: string[];
  investmentObjective: string;
  paiIndicators: string[];
  taxonomyAlignment: number;
  regulatoryReferences?: string[];
  complianceIssues?: string[];
}

// Collaborative Features (Post-MVP)
export interface CollaborationSession {
  id: string;
  assessmentId: string;
  participants: Array<{
    userId: string;
    role: 'owner' | 'reviewer' | 'viewer';
    joinedAt: string;
  }>;
  changes: Array<{
    userId: string;
    field: string;
    oldValue: any;
    newValue: any;
    timestamp: string;
  }>;
  status: 'active' | 'locked' | 'archived';
  createdAt: string;
  updatedAt: string;
}
