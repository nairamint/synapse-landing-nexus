import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TestTube, 
  ClipboardCheck, 
  Users, 
  BarChart3, 
  Download, 
  Play,
  Settings,
  Shield,
  Zap
} from 'lucide-react';

// Import testing components
import TestingHub from '@/components/testing/TestingHub';
import UATChecklist from '@/components/testing/UATChecklist';
import UserTestingSession from '@/components/testing/UserTestingSession';
import TestReportDashboard from '@/components/testing/TestReportDashboard';
import { NexusTestExecutor } from '@/components/testing/NexusTestExecutor';

const Testing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('hub');
  const [testingStatus, setTestingStatus] = useState({
    uatCompleted: false,
    userTestingActive: false,
    reportsGenerated: false,
    complianceValidated: false
  });

  const testingModules = [
    {
      id: 'hub',
      title: 'Testing Hub',
      description: 'Centralized testing management and coordination',
      icon: Settings,
      component: <TestingHub />
    },
    {
      id: 'uat',
      title: 'UAT Checklist',
      description: 'Systematic User Acceptance Testing framework',
      icon: ClipboardCheck,
      component: <UATChecklist />
    },
    {
      id: 'sessions',
      title: 'User Testing Sessions',
      description: 'Live user testing with task management',
      icon: Users,
      component: <UserTestingSession />
    },
    {
      id: 'reports',
      title: 'Test Reports',
      description: 'Comprehensive testing analytics and insights',
      icon: BarChart3,
      component: <TestReportDashboard />
    },
    {
      id: 'nexus',
      title: 'Nexus Test Executor',
      description: 'Real-time SFDR Navigator testing',
      icon: Zap,
      component: <NexusTestExecutor />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TestTube className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Testing Center</h1>
                <p className="text-gray-600 mt-1">
                  Comprehensive testing framework for Synapse GRC Platform
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={testingStatus.uatCompleted ? "default" : "secondary"}>
                UAT {testingStatus.uatCompleted ? "Complete" : "Pending"}
              </Badge>
              <Badge variant={testingStatus.complianceValidated ? "default" : "secondary"}>
                Compliance {testingStatus.complianceValidated ? "Validated" : "In Progress"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Testing Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <ClipboardCheck className="h-5 w-5 text-green-600" />
                <CardTitle className="text-sm">UAT Progress</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">85%</div>
              <p className="text-xs text-gray-600 mt-1">17/20 scenarios completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-sm">Active Sessions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">3</div>
              <p className="text-xs text-gray-600 mt-1">User testing in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-sm">Compliance Score</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">92%</div>
              <p className="text-xs text-gray-600 mt-1">SFDR requirements met</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-sm">Test Coverage</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">94%</div>
              <p className="text-xs text-gray-600 mt-1">Critical paths tested</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>
              Start testing activities or access common testing functions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setActiveTab('uat')}
              >
                <ClipboardCheck className="h-6 w-6" />
                <span>Start UAT Testing</span>
                <span className="text-xs text-gray-500">Systematic validation</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setActiveTab('sessions')}
              >
                <Users className="h-6 w-6" />
                <span>New User Session</span>
                <span className="text-xs text-gray-500">Live user testing</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setActiveTab('reports')}
              >
                <Download className="h-6 w-6" />
                <span>Generate Reports</span>
                <span className="text-xs text-gray-500">Testing analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Testing Modules */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            {testingModules.map((module) => (
              <TabsTrigger 
                key={module.id} 
                value={module.id}
                className="flex items-center space-x-2"
              >
                <module.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{module.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {testingModules.map((module) => (
            <TabsContent key={module.id} value={module.id} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <module.icon className="h-5 w-5" />
                    <span>{module.title}</span>
                  </CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {module.component}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Testing Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Testing Guidelines & Best Practices</CardTitle>
            <CardDescription>
              Follow these guidelines to ensure comprehensive and effective testing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">UAT Testing Process:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Follow the systematic checklist approach</li>
                  <li>• Document all findings and observations</li>
                  <li>• Test both positive and negative scenarios</li>
                  <li>• Validate compliance requirements</li>
                  <li>• Report critical issues immediately</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">User Testing Sessions:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Prepare clear testing scenarios</li>
                  <li>• Record user interactions and feedback</li>
                  <li>• Focus on usability and user experience</li>
                  <li>• Gather qualitative feedback</li>
                  <li>• Analyze user behavior patterns</li>
                </ul>
              </div>
            </div>
            
            <Separator />
            
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Security Note:</strong> All testing data is handled securely and in compliance with data protection regulations. 
                Sensitive information should be properly anonymized in test reports.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Testing;