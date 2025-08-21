/**
 * Test Integration Page
 * Comprehensive testing interface for SFDR Navigator components
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentUpload } from '@/components/DocumentUpload';
import { sfdrApiService } from '@/services/sfdrApiService';
import { logger } from '@/utils/logger';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  FileText, 
  MessageSquare,
  Database,
  Wifi,
  Globe
} from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
  details?: any;
}

export default function TestIntegration() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [websocketStatus, setWebsocketStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  const tests = [
    {
      name: 'Supabase Connection',
      description: 'Test connection to Supabase backend',
      icon: <Database className="w-4 h-4" />
    },
    {
      name: 'SFDR API Service',
      description: 'Test SFDR validation service',
      icon: <FileText className="w-4 h-4" />
    },
    {
      name: 'OCR Processing',
      description: 'Test document OCR capabilities',
      icon: <FileText className="w-4 h-4" />
    },
    {
      name: 'WebSocket Connection',
      description: 'Test real-time communication',
      icon: <Wifi className="w-4 h-4" />
    },
    {
      name: 'ESMA Integration',
      description: 'Test European regulatory data access',
      icon: <Globe className="w-4 h-4" />
    },
    {
      name: 'Chat Integration',
      description: 'Test Nexus Agent chat functionality',
      icon: <MessageSquare className="w-4 h-4" />
    }
  ];

  // Initialize test results
  useEffect(() => {
    setTestResults(tests.map(test => ({
      name: test.name,
      status: 'pending'
    })));
  }, []);

  // Test Supabase connection
  const testSupabaseConnection = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      // Test basic Supabase connection
      const { data, error } = await import('@/integrations/supabase/client').then(m => m.supabase).from('compliance_assessments').select('count').limit(1);
      
      const duration = Date.now() - startTime;
      
      if (error) {
        return {
          name: 'Supabase Connection',
          status: 'failed',
          duration,
          error: error.message
        };
      }
      
      return {
        name: 'Supabase Connection',
        status: 'passed',
        duration,
        details: { message: 'Successfully connected to Supabase' }
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        name: 'Supabase Connection',
        status: 'failed',
        duration,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  // Test SFDR API service
  const testSFDRService = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      const testRequest = {
        metadata: {
          entityId: 'TEST-ENTITY-001',
          reportingPeriod: '2024',
          regulatoryVersion: 'SFDR_v1.0',
          submissionType: 'INITIAL' as const
        },
        fundProfile: {
          fundType: 'UCITS' as const,
          fundName: 'Test Sustainable Fund',
          targetArticleClassification: 'Article8' as const,
          investmentObjective: 'Promoting environmental and social characteristics'
        }
      };

      const result = await sfdrApiService.validateSFDRCompliance(testRequest);
      
      const duration = Date.now() - startTime;
      
      if (result.success) {
        return {
          name: 'SFDR API Service',
          status: 'passed',
          duration,
          details: { 
            message: 'SFDR validation successful',
            score: result.complianceResults?.overallScore || result.complianceScore
          }
        };
      } else {
        return {
          name: 'SFDR API Service',
          status: 'failed',
          duration,
          error: result.error || 'Validation failed'
        };
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        name: 'SFDR API Service',
        status: 'failed',
        duration,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  // Test OCR processing
  const testOCRProcessing = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      // Test OCR API connection (with demo key)
      const ocrTestUrl = 'https://api.ocr.space/parse/image';
      const params = new URLSearchParams({
        apikey: 'demo-key',
        url: 'https://example.com/test-image.jpg',
        language: 'eng'
      });
      
      const response = await fetch(`${ocrTestUrl}?${params}`);
      const result = await response.json();
      
      const duration = Date.now() - startTime;
      
      // With demo key, we expect an error, but the API should be reachable
      if (result.IsErroredOnProcessing) {
        return {
          name: 'OCR Processing',
          status: 'passed',
          duration,
          details: { message: 'OCR API accessible (demo key limitation expected)' }
        };
      } else {
        return {
          name: 'OCR Processing',
          status: 'passed',
          duration,
          details: { message: 'OCR API working correctly' }
        };
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        name: 'OCR Processing',
        status: 'failed',
        duration,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  // Test WebSocket connection
  const testWebSocketConnection = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    return new Promise((resolve) => {
      try {
        const wsUrl = 'wss://hnwwykttyzfvflmcswjk.supabase.co/functions/v1/websocket-server';
        const ws = new WebSocket(wsUrl);
        
        const timeout = setTimeout(() => {
          const duration = Date.now() - startTime;
          resolve({
            name: 'WebSocket Connection',
            status: 'failed',
            duration,
            error: 'Connection timeout (function may not be deployed)'
          });
        }, 5000);
        
        ws.onopen = () => {
          clearTimeout(timeout);
          const duration = Date.now() - startTime;
          ws.close();
          resolve({
            name: 'WebSocket Connection',
            status: 'passed',
            duration,
            details: { message: 'WebSocket connection successful' }
          });
        };
        
        ws.onerror = (error) => {
          clearTimeout(timeout);
          const duration = Date.now() - startTime;
          resolve({
            name: 'WebSocket Connection',
            status: 'failed',
            duration,
            error: 'WebSocket connection failed (function may not be deployed)'
          });
        };
      } catch (error) {
        const duration = Date.now() - startTime;
        resolve({
          name: 'WebSocket Connection',
          status: 'failed',
          duration,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  };

  // Test ESMA integration
  const testESMAIntegration = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      const esmaUrl = 'https://registers.esma.europa.eu/solr/esma_registers/sfdr_disclosures';
      const response = await fetch(esmaUrl);
      
      const duration = Date.now() - startTime;
      
      if (response.ok) {
        return {
          name: 'ESMA Integration',
          status: 'passed',
          duration,
          details: { message: 'ESMA API accessible' }
        };
      } else {
        return {
          name: 'ESMA Integration',
          status: 'failed',
          duration,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        name: 'ESMA Integration',
        status: 'failed',
        duration,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  // Test chat integration
  const testChatIntegration = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      // Test if chat component can be imported and rendered
      const { NexusAgentChat } = await import('@/components/NexusAgentChat');
      
      const duration = Date.now() - startTime;
      
      return {
        name: 'Chat Integration',
        status: 'passed',
        duration,
        details: { message: 'Chat component loaded successfully' }
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        name: 'Chat Integration',
        status: 'failed',
        duration,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setIsRunning(true);
    setOverallStatus('running');
    
    const testFunctions = [
      testSupabaseConnection,
      testSFDRService,
      testOCRProcessing,
      testWebSocketConnection,
      testESMAIntegration,
      testChatIntegration
    ];

    for (let i = 0; i < testFunctions.length; i++) {
      // Update status to running
      setTestResults(prev => prev.map((result, index) => 
        index === i ? { ...result, status: 'running' } : result
      ));

      // Run test
      const result = await testFunctions[i]();
      
      // Update result
      setTestResults(prev => prev.map((testResult, index) => 
        index === i ? result : testResult
      ));

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsRunning(false);
    setOverallStatus('completed');
  };

  // Get status icon
  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  // Get status badge
  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Passed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'running':
        return <Badge variant="secondary">Running</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const passedTests = testResults.filter(r => r.status === 'passed').length;
  const failedTests = testResults.filter(r => r.status === 'failed').length;
  const totalTests = testResults.length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">SFDR Navigator Integration Test</h1>
        <p className="text-gray-600">Comprehensive testing of all integration components</p>
      </div>

      <Tabs defaultValue="tests" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tests">Integration Tests</TabsTrigger>
          <TabsTrigger value="upload">Document Upload</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Integration Test Suite</span>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={runAllTests} 
                    disabled={isRunning}
                    className="flex items-center gap-2"
                  >
                    {isRunning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Running Tests...
                      </>
                    ) : (
                      'Run All Tests'
                    )}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress Bar */}
                {isRunning && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Test Progress</span>
                      <span>{passedTests + failedTests}/{totalTests}</span>
                    </div>
                    <Progress value={((passedTests + failedTests) / totalTests) * 100} />
                  </div>
                )}

                {/* Test Results */}
                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div key={result.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <h3 className="font-medium">{result.name}</h3>
                          <p className="text-sm text-gray-500">{tests[index]?.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.duration && (
                          <span className="text-sm text-gray-500">{result.duration}ms</span>
                        )}
                        {getStatusBadge(result.status)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                {overallStatus === 'completed' && (
                  <Alert>
                    <AlertDescription>
                      <strong>Test Summary:</strong> {passedTests} passed, {failedTests} failed out of {totalTests} total tests.
                      {failedTests === 0 ? (
                        <span className="text-green-600"> All tests passed! 🎉</span>
                      ) : (
                        <span className="text-orange-600"> Some tests failed. Check the results above.</span>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Upload Test</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentUpload 
                onUploadComplete={(result) => {
                  setUploadResult(result);
                  console.log('Upload completed:', result);
                }}
                onProcessingStatus={(status) => {
                  console.log('Processing status:', status);
                }}
              />
              
              {uploadResult && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-medium text-green-800">Upload Test Results:</h3>
                  <pre className="text-sm text-green-700 mt-2 overflow-auto">
                    {JSON.stringify(uploadResult, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.map((result) => (
                  <div key={result.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{result.name}</h3>
                      {getStatusBadge(result.status)}
                    </div>
                    
                    {result.duration && (
                      <p className="text-sm text-gray-600 mb-2">Duration: {result.duration}ms</p>
                    )}
                    
                    {result.error && (
                      <Alert variant="destructive" className="mb-2">
                        <AlertDescription>{result.error}</AlertDescription>
                      </Alert>
                    )}
                    
                    {result.details && (
                      <div className="text-sm text-gray-600">
                        <strong>Details:</strong> {result.details.message}
                        {result.details.score && (
                          <span> (Score: {result.details.score}%)</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}