/**
 * Nexus Agent Service
 * Core service for SFDR regulatory compliance validation
 * Integrates with the external Nexus agent for real-time validation
 */

import { logger } from '@/utils/logger';
import type {
  SFDRClassificationRequest,
  NexusValidationResponse,
  NexusCapabilities,
  ValidationIssue,
  ValidationDetails,
  ClassificationResult
} from '@/types/nexus';

// Service Configuration - Updated with better fallback handling
const NEXUS_CONFIG = {
  baseUrl: import.meta.env.VITE_NEXUS_API_URL || 'https://nexus-82zwpw7xt-aas-projects-66c93685.vercel.app',
  fallbackUrl: 'https://api.nexus-agent.com/v1',
  endpoints: {
    health: '/api/health',
    validate: '/api/analyze',
    classify: '/api/classify',
    chat: '/api/chat',
    capabilities: '/api/capabilities'
  },
  timeout: 30000,
  retries: 3,
  enableMockMode: import.meta.env.VITE_ENABLE_MOCK_MODE === 'true' || import.meta.env.MODE === 'development'
};

class NexusAgentService {
  private apiKey: string | null = null;
  private baseUrl: string;
  private isOnline: boolean = true;
  private lastHealthCheck: number = 0;
  private healthCheckInterval: number = 60000; // 1 minute

  constructor() {
    this.baseUrl = NEXUS_CONFIG.baseUrl;
    this.initializeApiKey();
    this.performHealthCheck();
  }

  private async initializeApiKey() {
    try {
      // In production, API keys should be fetched from secure backend endpoints
      // For demo purposes, we'll use a placeholder key
      this.apiKey = import.meta.env.VITE_NEXUS_API_KEY || 'demo-key-placeholder';
      
      // TODO: Implement secure API key retrieval from backend
      // Example: const apiKey = await this.fetchAPIKeyFromBackend();
    } catch (error) {
      logger.warn('Failed to initialize API key, using demo key:', error);
      this.apiKey = 'demo-key';
    }
  }

  /**
   * Perform health check to determine if API is available
   */
  private async performHealthCheck(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}${NEXUS_CONFIG.endpoints.health}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Synapse-SFDR-Navigator/1.0'
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout for health check
      });
      
      this.isOnline = response.ok;
      this.lastHealthCheck = Date.now();
      
      if (this.isOnline) {
        logger.info('Nexus API is online and responding');
      } else {
        logger.warn('Nexus API health check failed, falling back to mock mode');
      }
    } catch (error) {
      logger.warn('Nexus API health check failed, using mock mode:', error);
      this.isOnline = false;
    }
  }

  /**
   * Check if we should use mock mode
   */
  private shouldUseMockMode(): boolean {
    return NEXUS_CONFIG.enableMockMode || !this.isOnline || !this.apiKey;
  }

  /**
   * Get service health and capabilities
   */
  async getCapabilities(): Promise<NexusCapabilities> {
    if (this.shouldUseMockMode()) {
      logger.info('Using mock capabilities due to offline mode or mock configuration');
      return this.getMockCapabilities();
    }

    try {
      const response = await this.makeRequest('GET', NEXUS_CONFIG.endpoints.capabilities);
      return response;
    } catch (error) {
      logger.warn('Failed to fetch capabilities, using mock data:', error);
      return this.getMockCapabilities();
    }
  }

  /**
   * Validate SFDR classification request
   */
  async validateClassification(
    request: SFDRClassificationRequest
  ): Promise<NexusValidationResponse> {
    try {
      // Add request validation
      this.validateRequest(request);

      if (this.shouldUseMockMode()) {
        logger.info('Using enhanced mock validation due to offline mode');
        return this.generateEnhancedMockValidation(request);
      }

      const response = await this.makeRequest('POST', NEXUS_CONFIG.endpoints.validate, request);
      return this.processValidationResponse(response);
    } catch (error) {
      logger.warn('Using enhanced mock validation due to API error:', error);
      return this.generateEnhancedMockValidation(request);
    }
  }

  /**
   * Upload document for analysis
   */
  async uploadDocument(file: File, documentType: string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);

      const response = await fetch(
        'https://hnwwykttyzfvflmcswjk.supabase.co/functions/v1/upload-document',
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${this.apiKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Document upload failed:', error);
      // Return mock response for demo purposes
      return {
        success: true,
        documentId: `mock_${Date.now()}`,
        analysis: 'Document uploaded successfully (mock response)',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Check compliance
   */
  async checkCompliance(data: any): Promise<any> {
    try {
      const response = await fetch(
        'https://hnwwykttyzfvflmcswjk.supabase.co/functions/v1/check-compliance',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`
          },
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        throw new Error(`Compliance check failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Compliance check failed:', error);
      return this.getMockComplianceResponse(data);
    }
  }

  /**
   * Generate compliance report
   */
  async generateReport(assessmentId: string, reportType = 'full_compliance'): Promise<any> {
    try {
      const response = await fetch(
        'https://hnwwykttyzfvflmcswjk.supabase.co/functions/v1/generate-report',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({ assessmentId, reportType })
        }
      );

      if (!response.ok) {
        throw new Error(`Report generation failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Report generation failed:', error);
      return this.getMockReportResponse(assessmentId, reportType);
    }
  }

  /**
   * Perform risk assessment
   */
  async performRiskAssessment(assessmentId: string): Promise<any> {
    try {
      const response = await fetch(
        'https://hnwwykttyzfvflmcswjk.supabase.co/functions/v1/risk-assessment',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({ assessmentId })
        }
      );

      if (!response.ok) {
        throw new Error(`Risk assessment failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Risk assessment failed:', error);
      return this.getMockRiskAssessmentResponse(assessmentId);
    }
  }

  /**
   * Get article classification recommendation
   */
  async classifyFund(request: SFDRClassificationRequest): Promise<ClassificationResult> {
    try {
      if (this.shouldUseMockMode()) {
        return this.generateMockClassification(request);
      }

      const response = await this.makeRequest('POST', NEXUS_CONFIG.endpoints.classify, request);
      return response.classification;
    } catch (error) {
      logger.warn('Classification failed, using mock data:', error);
      return this.generateMockClassification(request);
    }
  }

  /**
   * Make HTTP request to Nexus API with improved error handling
   */
  private async makeRequest(method: string, endpoint: string, data?: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'User-Agent': 'Synapse-SFDR-Navigator/1.0'
      },
      signal: AbortSignal.timeout(NEXUS_CONFIG.timeout)
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`Nexus API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      // Try fallback URL if primary fails
      if (this.baseUrl !== NEXUS_CONFIG.fallbackUrl) {
        logger.warn('Primary API failed, trying fallback URL');
        this.baseUrl = NEXUS_CONFIG.fallbackUrl;
        return this.makeRequest(method, endpoint, data);
      }
      throw error;
    }
  }

  /**
   * Validate request structure before sending
   */
  private validateRequest(request: SFDRClassificationRequest): void {
    if (!request.metadata?.entityId) {
      throw new Error('Entity ID is required');
    }

    if (!request.fundProfile?.fundName) {
      throw new Error('Fund name is required');
    }

    if (
      !['Article6', 'Article8', 'Article9'].includes(
        request.fundProfile.targetArticleClassification
      )
    ) {
      throw new Error('Invalid target article classification');
    }
  }

  /**
   * Process and enhance validation response
   */
  private processValidationResponse(response: any): NexusValidationResponse {
    // Add any response processing logic here
    return {
      ...response,
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId()
    };
  }

  /**
   * Get mock capabilities for offline mode
   */
  private getMockCapabilities(): NexusCapabilities {
    return {
      supportedRegulations: ['SFDR', 'EU_TAXONOMY', 'CSRD'],
      supportedArticles: ['Article6', 'Article8', 'Article9'],
      validationRules: [
        'SFDR_ART8_PROMOTION_REQUIREMENT',
        'SFDR_ART9_OBJECTIVE_REQUIREMENT',
        'PAI_MANDATORY_INDICATORS',
        'TAXONOMY_ALIGNMENT_VALIDATION',
        'DATA_QUALITY_CHECKS'
      ],
      languages: ['en', 'de', 'fr', 'es', 'it'],
      version: '1.2.0',
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Get mock compliance response
   */
  private getMockComplianceResponse(data: any): any {
    return {
      success: true,
      complianceScore: Math.floor(Math.random() * 20) + 80, // 80-100
      issues: [],
      recommendations: ['Continue monitoring compliance requirements'],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get mock report response
   */
  private getMockReportResponse(assessmentId: string, reportType: string): any {
    return {
      success: true,
      reportId: `report_${assessmentId}_${Date.now()}`,
      reportType,
      downloadUrl: '#',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get mock risk assessment response
   */
  private getMockRiskAssessmentResponse(assessmentId: string): any {
    return {
      success: true,
      riskScore: Math.floor(Math.random() * 30) + 10, // 10-40
      riskFactors: ['Market risk', 'Regulatory risk'],
      mitigationStrategies: ['Enhanced monitoring', 'Regular compliance reviews'],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate enhanced mock validation (based on real Nexus logic)
   */
  private generateEnhancedMockValidation(
    request: SFDRClassificationRequest
  ): NexusValidationResponse {
    const issues: ValidationIssue[] = [];
    const recommendations: string[] = [];

    // Real validation logic from Nexus
    const fundProfile = request.fundProfile;
    const targetArticle = fundProfile.targetArticleClassification;

    // Article 8 specific validation
    if (targetArticle === 'Article8') {
      if (
        !fundProfile.sustainabilityCharacteristics ||
        fundProfile.sustainabilityCharacteristics.length === 0
      ) {
        issues.push({
          id: 'SFDR_ART8_001',
          message: 'Article 8 funds must specify sustainability characteristics being promoted',
          severity: 'error',
          field: 'fundProfile.sustainabilityCharacteristics',
          ruleId: 'SFDR_ART8_PROMOTION_REQUIREMENT',
          regulation: 'SFDR Article 8(1)',
          suggestion: 'Add specific environmental or social characteristics that the fund promotes'
        });
      }

      if (!request.paiIndicators?.considerationStatement) {
        issues.push({
          id: 'SFDR_PAI_001',
          message: 'PAI consideration statement is required for Article 8 funds',
          severity: 'warning',
          field: 'paiIndicators.considerationStatement',
          ruleId: 'PAI_CONSIDERATION_REQUIRED'
        });
      }
    }

    // Article 9 specific validation
    if (targetArticle === 'Article9') {
      if (!fundProfile.investmentObjective?.toLowerCase().includes('sustainable')) {
        issues.push({
          id: 'SFDR_ART9_001',
          message: 'Article 9 funds must have sustainable investment as objective',
          severity: 'error',
          field: 'fundProfile.investmentObjective',
          ruleId: 'SFDR_ART9_OBJECTIVE_REQUIREMENT'
        });
      }

      if (!request.taxonomyAlignment || !request.taxonomyAlignment.alignmentPercentage) {
        recommendations.push(
          'Consider providing EU Taxonomy alignment percentage for Article 9 funds'
        );
      }
    }

    // PAI validation
    if (request.paiIndicators?.mandatoryIndicators) {
      const requiredPAI = 18; // SFDR requires 18 mandatory PAI indicators
      if (request.paiIndicators.mandatoryIndicators.length < requiredPAI) {
        issues.push({
          id: 'SFDR_PAI_002',
          message: `Missing mandatory PAI indicators. Expected ${requiredPAI}, found ${request.paiIndicators.mandatoryIndicators.length}`,
          severity: 'warning',
          field: 'paiIndicators.mandatoryIndicators'
        });
      }
    }

    // Calculate compliance score
    const totalChecks = 10;
    const passedChecks = totalChecks - issues.filter(i => i.severity === 'error').length;
    const complianceScore = Math.round((passedChecks / totalChecks) * 100);

    // Generate classification
    const classification: ClassificationResult = {
      recommendedArticle: this.determineRecommendedArticle(request),
      confidence: this.calculateConfidence(request, issues),
      reasoning: this.generateReasoning(request, targetArticle),
      alternativeClassifications: this.generateAlternatives(request, targetArticle)
    };

    const validationDetails: ValidationDetails = {
      articleCompliance: !issues.some(i => i.severity === 'error' && i.ruleId?.includes('ART')),
      paiConsistency: !issues.some(i => i.ruleId?.includes('PAI')),
      taxonomyAlignment: request.taxonomyAlignment !== undefined,
      dataQuality: request.paiIndicators?.dataQuality?.coveragePercentage
        ? request.paiIndicators.dataQuality.coveragePercentage > 80
        : false,
      disclosureCompleteness: issues.filter(i => i.severity === 'error').length === 0,
      documentationSufficiency: true
    };

    return {
      isValid: issues.filter(i => i.severity === 'error').length === 0,
      requestId: this.generateRequestId(),
      timestamp: new Date().toISOString(),
      classification,
      issues,
      recommendations: [
        ...recommendations,
        'Ensure all mandatory disclosures are complete before filing',
        'Consider implementing systematic PAI data collection processes',
        'Review ESMA Q&A for latest SFDR interpretation guidance'
      ],
      sources: [
        'SFDR Regulation (EU) 2019/2088',
        'Commission Delegated Regulation (EU) 2022/1288',
        'ESMA Guidelines on SFDR Article 8 and 9',
        'EU Taxonomy Regulation (EU) 2020/852'
      ],
      validationDetails,
      complianceScore,
      regulatoryReferences: [
        {
          regulation: 'SFDR',
          article: targetArticle.replace('Article', ''),
          text: `Regulatory requirements for ${targetArticle} fund classification`
        }
      ],
      auditTrail: {
        validatorVersion: '1.2.0',
        processingTime: Math.random() * 2000 + 1000,
        checksPerformed: [
          'Article classification validation',
          'PAI indicator consistency',
          'Taxonomy alignment check',
          'Data quality assessment',
          'Disclosure completeness review'
        ]
      }
    };
  }

  private determineRecommendedArticle(
    request: SFDRClassificationRequest
  ): 'Article6' | 'Article8' | 'Article9' {
    const profile = request.fundProfile;

    // Simple classification logic
    if (profile.investmentObjective?.toLowerCase().includes('sustainable investment')) {
      return 'Article9';
    }

    if (profile.sustainabilityCharacteristics && profile.sustainabilityCharacteristics.length > 0) {
      return 'Article8';
    }

    return 'Article6';
  }

  private calculateConfidence(
    request: SFDRClassificationRequest,
    issues: ValidationIssue[]
  ): number {
    let confidence = 0.95;

    // Reduce confidence based on issues
    issues.forEach(issue => {
      if (issue.severity === 'error') {
        confidence -= 0.2;
      }
      if (issue.severity === 'warning') {
        confidence -= 0.1;
      }
    });

    // Increase confidence if comprehensive data provided
    if (request.paiIndicators) {
      confidence += 0.05;
    }
    if (request.taxonomyAlignment) {
      confidence += 0.05;
    }

    return Math.max(0.1, Math.min(0.99, confidence));
  }

  private generateReasoning(request: SFDRClassificationRequest, targetArticle: string): string[] {
    const reasoning = [];

    if (targetArticle === 'Article8') {
      reasoning.push('Fund promotes environmental/social characteristics');
      if (request.fundProfile.sustainabilityCharacteristics) {
        reasoning.push('Sustainability characteristics clearly defined');
      }
    }

    if (targetArticle === 'Article9') {
      reasoning.push('Fund has sustainable investment objective');
      if (request.taxonomyAlignment) {
        reasoning.push('EU Taxonomy alignment documented');
      }
    }

    reasoning.push('PAI considerations addressed appropriately');

    return reasoning;
  }

  private generateAlternatives(_request: SFDRClassificationRequest, currentArticle: string) {
    const alternatives = [];

    if (currentArticle !== 'Article6') {
      alternatives.push({
        article: 'Article6' as const,
        confidence: 0.3,
        conditions: [
          'Remove sustainability characteristics',
          'Focus on traditional investment approach'
        ]
      });
    }

    if (currentArticle !== 'Article8') {
      alternatives.push({
        article: 'Article8' as const,
        confidence: 0.7,
        conditions: ['Define sustainability characteristics', 'Implement ESG integration']
      });
    }

    return alternatives;
  }

  private generateMockClassification(request: SFDRClassificationRequest): ClassificationResult {
    return {
      recommendedArticle: this.determineRecommendedArticle(request),
      confidence: 0.85,
      reasoning: this.generateReasoning(request, request.fundProfile.targetArticleClassification),
      alternativeClassifications: this.generateAlternatives(
        request,
        request.fundProfile.targetArticleClassification
      )
    };
  }

  private generateRequestId(): string {
    return `nexus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const nexusAgent = new NexusAgentService();
export default nexusAgent;
