# Nexus Agent - SFDR Navigator

## Overview

The Nexus Agent is an AI-powered regulatory compliance assistant specifically designed for SFDR (Sustainable Finance Disclosure Regulation) compliance. It provides real-time guidance, validation, and reporting capabilities for financial institutions managing ESG funds.

## Features

### 🤖 **AI-Powered Chat Interface**
- **Sophia**: Your dedicated SFDR compliance assistant
- **Contextual Responses**: Tailored guidance based on your specific queries
- **Real-time Processing**: Instant responses with intelligent processing stages
- **Voice Input Support**: Speak your questions for hands-free operation

### 📋 **Quick Actions**
- **Upload Document**: Analyze compliance documents
- **Check Compliance**: Validate SFDR classification
- **Article Classification**: Determine Article 6/8/9 classification
- **PAI Analysis**: Principal Adverse Impact validation
- **Taxonomy Check**: EU Taxonomy alignment verification
- **Generate Report**: Create compliance reports
- **Risk Assessment**: Identify compliance risks

### 📊 **Compliance Overview**
- **Real-time Metrics**: Industry compliance scores and benchmarks
- **System Health**: API response times and uptime monitoring
- **Recent Activity**: Track your compliance activities
- **Status Indicators**: Visual feedback on compliance status

### 🧪 **UAT Testing Suite**
- **Automated Tests**: Built-in testing for core functionality
- **Manual Testing**: Interactive test scenarios
- **Performance Monitoring**: Response time and reliability metrics
- **Comprehensive Coverage**: Functional, integration, and security tests

## Technical Architecture

### Frontend Components
- **React 18** with TypeScript
- **Framer Motion** for smooth animations
- **Tailwind CSS** for responsive design
- **Radix UI** for accessible components
- **React Router** for navigation

### Backend Integration
- **Supabase** for data persistence and authentication
- **Nexus API** for SFDR validation and analysis
- **Mock Mode** for offline development and testing
- **Health Checks** for API availability monitoring

### Security Features
- **Input Sanitization**: XSS prevention
- **API Key Management**: Secure credential handling
- **CSRF Protection**: Cross-site request forgery prevention
- **Encrypted Storage**: Secure local data storage

## Setup Instructions

### 1. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env.local

# Configure your environment variables
VITE_NEXUS_API_URL=https://your-nexus-api-url.com
VITE_NEXUS_API_KEY=your-api-key
VITE_ENABLE_MOCK_MODE=false
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access the Application
Navigate to `http://localhost:5173/nexus-agent` or `http://localhost:5173/sfdr-navigator`

## Usage Guide

### Getting Started
1. **Welcome Message**: Sophia will greet you with an overview of her capabilities
2. **Quick Actions**: Use the sidebar buttons for common tasks
3. **Chat Interface**: Ask questions about SFDR compliance
4. **Form Mode**: Switch to structured form for detailed validation

### Chat Commands
- **"What is SFDR?"** - Get an overview of the regulation
- **"Help me classify my fund"** - Guidance on Article 6/8/9 classification
- **"Upload a document"** - Start document analysis process
- **"Generate a compliance report"** - Create detailed reports
- **"Check PAI indicators"** - Validate Principal Adverse Impact data

### Form Validation
1. **Entity ID**: Enter your fund's unique identifier (UUID format)
2. **Fund Name**: Provide the official fund name
3. **Fund Type**: Select UCITS, AIF, or other fund type
4. **Target Article**: Choose Article 6, 8, or 9 classification
5. **Investment Objective**: Describe your fund's ESG approach
6. **Submit**: Get comprehensive validation results

## API Integration

### Nexus API Endpoints
- `GET /api/health` - Service health check
- `GET /api/capabilities` - Available features and regulations
- `POST /api/analyze` - SFDR validation and analysis
- `POST /api/classify` - Fund classification recommendations
- `POST /api/chat` - Interactive chat responses

### Supabase Functions
- `upload-document` - Document analysis and processing
- `check-compliance` - Compliance validation
- `generate-report` - Report generation
- `risk-assessment` - Risk analysis

## Error Handling

### Connection Status
- **Live API**: Connected to real Nexus API
- **Mock Mode**: Using simulated responses for development
- **Checking**: Verifying connection status

### Common Issues
1. **API Connection Failed**: System automatically falls back to mock mode
2. **Validation Errors**: Clear error messages with specific guidance
3. **Network Issues**: Graceful degradation with offline capabilities
4. **Form Validation**: Real-time feedback on required fields

## Testing

### Automated Tests
```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Coverage report
npm run test:coverage
```

### Manual Testing
1. **Chat Functionality**: Test message processing and responses
2. **Quick Actions**: Verify all action buttons work correctly
3. **Form Validation**: Test form submission and validation
4. **Responsive Design**: Test on different screen sizes
5. **Accessibility**: Verify keyboard navigation and screen reader support

## Performance Optimization

### Loading States
- **Skeleton Screens**: Smooth loading animations
- **Progressive Loading**: Content loads in stages
- **Caching**: Intelligent response caching
- **Lazy Loading**: Components load on demand

### Response Times
- **Simple Queries**: < 1 second
- **Complex Analysis**: < 3 seconds
- **Document Processing**: < 5 seconds
- **Report Generation**: < 10 seconds

## Security Considerations

### Data Protection
- **No Sensitive Data Storage**: Client-side data is encrypted
- **API Key Security**: Keys are never exposed in client code
- **Input Validation**: All user inputs are sanitized
- **HTTPS Only**: Secure communication protocols

### Compliance
- **GDPR Compliance**: Data handling follows privacy regulations
- **Audit Trail**: All interactions are logged for compliance
- **Data Retention**: Configurable data retention policies
- **Access Control**: Role-based access to sensitive features

## Troubleshooting

### Common Problems

#### 1. Page Not Loading
```bash
# Check if development server is running
npm run dev

# Verify port availability
lsof -i :5173
```

#### 2. API Connection Issues
```bash
# Check environment variables
echo $VITE_NEXUS_API_URL

# Verify API key
echo $VITE_NEXUS_API_KEY
```

#### 3. Mock Mode Not Working
```bash
# Enable mock mode
VITE_ENABLE_MOCK_MODE=true npm run dev
```

#### 4. Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Debug Mode
```bash
# Enable debug logging
VITE_LOG_LEVEL=DEBUG npm run dev
```

## Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

## Support

### Documentation
- **API Documentation**: `/docs/api`
- **Component Library**: `/docs/components`
- **Testing Guide**: `/docs/testing`

### Contact
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: support@synapse.com

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Note**: This is a demonstration application. For production use, ensure all security measures are properly configured and tested.