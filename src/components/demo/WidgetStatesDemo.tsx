
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EnhancedWidget } from '../widgets/EnhancedWidget';
import { AgentInteractionFlow } from '../agents/AgentInteractionFlow';
import { EnhancedComplianceStatusWidget } from '../widgets/EnhancedComplianceStatusWidget';

export const WidgetStatesDemo: React.FC = () => {
  const [currentState, setCurrentState] = useState<'idle' | 'loading' | 'empty' | 'error'>('idle');
  const [showAgentFlow, setShowAgentFlow] = useState(false);

  // Mock agents data with required onClick handlers
  const mockAgents = [
    {
      id: 'aml-agent',
      name: 'AML Compliance Agent',
      description: 'Specialized in Anti-Money Laundering regulations and suspicious activity monitoring.',
      category: 'Financial Crime',
      onClick: () => {
        console.log('Clicking AML agent');
        setShowAgentFlow(true);
      }
    },
    {
      id: 'esg-agent',
      name: 'ESG Reporting Agent',
      description: 'Environmental, Social, and Governance compliance and reporting assistance.',
      category: 'Sustainability',
      onClick: () => {
        console.log('Clicking ESG agent');
        setShowAgentFlow(true);
      }
    }
  ];

  const handleStateChange = (state: 'idle' | 'loading' | 'empty' | 'error') => {
    setCurrentState(state);
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Widget States Demo</h1>
        <p className="text-gray-600 mb-8">
          Interactive demonstration of widget states including idle, loading, empty, and error states.
        </p>

        {/* State Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Widget State Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={() => handleStateChange('idle')}
                variant={currentState === 'idle' ? 'default' : 'outline'}
              >
                Idle State
              </Button>
              <Button 
                onClick={() => handleStateChange('loading')}
                variant={currentState === 'loading' ? 'default' : 'outline'}
              >
                Loading State
              </Button>
              <Button 
                onClick={() => handleStateChange('empty')}
                variant={currentState === 'empty' ? 'default' : 'outline'}
              >
                Empty State
              </Button>
              <Button 
                onClick={() => handleStateChange('error')}
                variant={currentState === 'error' ? 'default' : 'outline'}
              >
                Error State
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Widget Demonstrations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Enhanced Compliance Widget */}
          <EnhancedComplianceStatusWidget 
            forceState={currentState}
          />

          {/* Enhanced Generic Widget */}
          <EnhancedWidget
            title="Regulatory Calendar"
            initialState={currentState}
            emptyMessage="No upcoming regulatory deadlines"
            emptyIllustration={
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                📅
              </div>
            }
            className="h-80"
          >
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900">GDPR Annual Review</h4>
                <p className="text-sm text-blue-700">Due: March 15, 2024</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="font-medium text-amber-900">MiFID II Reporting</h4>
                <p className="text-sm text-amber-700">Due: March 30, 2024</p>
              </div>
            </div>
          </EnhancedWidget>
        </div>

        {/* Agent Interaction Flow Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Interaction Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowAgentFlow(true)}
              className="mb-4"
            >
              Launch Agent Interaction Demo
            </Button>
            {showAgentFlow && (
              <AgentInteractionFlow
                agents={mockAgents}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
