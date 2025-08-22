import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wifi, 
  WifiOff, 
  Settings, 
  TestTube, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Database,
  MessageSquare,
  Shield,
  RefreshCw,
  Trash2,
  Terminal
} from 'lucide-react';
import WebSocketTest from '@/components/WebSocketTest';
import EnvironmentValidator from '@/components/EnvironmentValidator';
import { NexusTestExecutor } from '@/components/testing/NexusTestExecutor';

/**
 * Comprehensive Testing Page
 * Provides tools for testing WebSocket connections, environment variables,
 * and other system components
 */
const TestingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <TestTube className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">System Testing & Diagnostics</h1>
                <p className="text-sm text-gray-500">Comprehensive testing tools for development and debugging</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-600 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Testing Environment
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* System Status Overview */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2" />
                System Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Database className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Supabase</p>
                    <p className="text-xs text-green-600">Connected</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">WebSocket</p>
                    <p className="text-xs text-blue-600">Ready to test</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">Environment</p>
                    <p className="text-xs text-purple-600">Validation ready</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <TestTube className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">UAT Tests</p>
                    <p className="text-xs text-orange-600">Available</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testing Tabs */}
        <Tabs defaultValue="websocket" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="websocket" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>WebSocket</span>
            </TabsTrigger>
            <TabsTrigger value="environment" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Environment</span>
            </TabsTrigger>
            <TabsTrigger value="uat" className="flex items-center space-x-2">
              <TestTube className="w-4 h-4" />
              <span>UAT Tests</span>
            </TabsTrigger>
            <TabsTrigger value="diagnostics" className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Diagnostics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="websocket">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  WebSocket Connection Testing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Test WebSocket connections to verify real-time communication capabilities. 
                    Make sure your <code className="bg-gray-100 px-1 rounded">VITE_WEBSOCKET_URL</code> environment variable is configured.
                  </AlertDescription>
                </Alert>
                <WebSocketTest />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="environment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Environment Variables Validation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Validate all environment variables to ensure proper configuration. 
                    This will test connections to Supabase, OCR API, and WebSocket services.
                  </AlertDescription>
                </Alert>
                <EnvironmentValidator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="uat">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TestTube className="w-5 h-5 mr-2" />
                  User Acceptance Testing Suite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Comprehensive testing suite for validating application functionality, 
                    including automated tests and manual test scenarios.
                  </AlertDescription>
                </Alert>
                <NexusTestExecutor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diagnostics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  System Diagnostics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Browser Information */}
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Browser Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>User Agent:</strong></p>
                        <p className="text-gray-600 break-all">{navigator.userAgent}</p>
                      </div>
                      <div>
                        <p><strong>Platform:</strong></p>
                        <p className="text-gray-600">{navigator.platform}</p>
                      </div>
                      <div>
                        <p><strong>Language:</strong></p>
                        <p className="text-gray-600">{navigator.language}</p>
                      </div>
                      <div>
                        <p><strong>Online Status:</strong></p>
                        <p className="text-gray-600">{navigator.onLine ? 'Online' : 'Offline'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Environment Variables Status */}
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Environment Variables Status</h3>
                    <div className="space-y-2">
                      {[
                        { key: 'VITE_SUPABASE_URL', value: import.meta.env.VITE_SUPABASE_URL },
                        { key: 'VITE_SUPABASE_ANON_KEY', value: import.meta.env.VITE_SUPABASE_ANON_KEY ? '***configured***' : undefined },
                        { key: 'VITE_OCR_API_KEY', value: import.meta.env.VITE_OCR_API_KEY ? '***configured***' : undefined },
                        { key: 'VITE_WEBSOCKET_URL', value: import.meta.env.VITE_WEBSOCKET_URL },
                        { key: 'VITE_NEXUS_API_URL', value: import.meta.env.VITE_NEXUS_API_URL },
                        { key: 'VITE_ENABLE_MOCK_MODE', value: import.meta.env.VITE_ENABLE_MOCK_MODE },
                        { key: 'VITE_LOG_LEVEL', value: import.meta.env.VITE_LOG_LEVEL },
                        { key: 'MODE', value: import.meta.env.MODE }
                      ].map(({ key, value }) => (
                        <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-mono text-sm">{key}</span>
                          <span className={`text-sm ${value ? 'text-green-600' : 'text-red-600'}`}>
                            {value || 'Not configured'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <p className="text-2xl font-bold text-blue-600">
                          {performance.now().toFixed(0)}ms
                        </p>
                        <p className="text-sm text-blue-800">Page Load Time</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <p className="text-2xl font-bold text-green-600">
                          {window.innerWidth}x{window.innerHeight}
                        </p>
                        <p className="text-sm text-green-800">Viewport Size</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <p className="text-2xl font-bold text-purple-600">
                          {navigator.hardwareConcurrency || 'Unknown'}
                        </p>
                        <p className="text-sm text-purple-800">CPU Cores</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => window.location.reload()}
                        className="flex items-center space-x-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Reload Page</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => localStorage.clear()}
                        className="flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Clear Local Storage</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => console.clear()}
                        className="flex items-center space-x-2"
                      >
                        <Terminal className="w-4 h-4" />
                        <span>Clear Console</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TestingPage;