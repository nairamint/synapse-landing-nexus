# Testing Components Setup Guide

## Overview

This guide will help you set up and configure the WebSocket Test and Environment Validator components in your React application. These components provide comprehensive testing capabilities for your development and debugging needs.

## 🚀 Quick Start

### 1. Environment Configuration

First, copy the example environment file and configure your variables:

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit the file with your actual values
nano .env.local
```

### 2. Required Environment Variables

Add these variables to your `.env.local` file:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# WebSocket Configuration
VITE_WEBSOCKET_URL=wss://your-project.supabase.co/functions/v1/websocket-server

# OCR API Configuration
VITE_OCR_API_KEY=your-ocr-api-key

# Nexus API Configuration
VITE_NEXUS_API_URL=https://nexus-82zwpw7xt-aas-projects-66c93685.vercel.app
VITE_NEXUS_API_KEY=your-nexus-api-key

# Development Settings
VITE_ENABLE_MOCK_MODE=false
VITE_LOG_LEVEL=INFO
```

### 3. Deploy Supabase Edge Functions

Deploy the required Edge Functions to your Supabase project:

```bash
# Navigate to your Supabase functions directory
cd supabase/functions

# Deploy the environment validation function
supabase functions deploy env-validation

# Deploy the WebSocket server function
supabase functions deploy websocket-server
```

### 4. Access the Testing Page

Navigate to the testing page in your application:

```
http://localhost:5173/testing
```

## 🔧 Component Details

### WebSocket Test Component

The WebSocket Test component allows you to:

- **Connect/Disconnect** to WebSocket servers
- **Send Messages** and receive responses
- **View Real-time** message history
- **Test Connection** stability and error handling

#### Features:
- ✅ Real-time connection status
- ✅ Message history with timestamps
- ✅ JSON message support
- ✅ Error handling and display
- ✅ Automatic reconnection logic

#### Usage:
1. Click "Connect" to establish WebSocket connection
2. Type a message and click "Send" or press Enter
3. View incoming messages in the message history
4. Click "Disconnect" to close the connection

### Environment Validator Component

The Environment Validator component validates:

- **Supabase Connection** - Tests database connectivity
- **OCR API Key** - Validates OCR service access
- **WebSocket URL** - Checks WebSocket server availability
- **All Variables** - Comprehensive environment check

#### Features:
- ✅ Real-time validation results
- ✅ Detailed error messages
- ✅ Connection testing
- ✅ API key validation
- ✅ Visual status indicators

#### Usage:
1. Click "Validate Environment" to start validation
2. Review results for each service
3. Check detailed error messages if validation fails
4. Verify all environment variables are properly configured

## 🛠️ Advanced Configuration

### Custom WebSocket Server

If you want to use a custom WebSocket server:

1. **Update the WebSocket URL** in your environment variables:
```bash
VITE_WEBSOCKET_URL=wss://your-custom-server.com/ws
```

2. **Ensure your server supports**:
   - WebSocket protocol upgrade
   - JSON message format
   - CORS headers
   - Connection management

### Custom Environment Validation

To add custom validation rules:

1. **Modify the Edge Function** (`supabase/functions/env-validation/index.ts`)
2. **Add new validation checks** for your services
3. **Update the response interface** to include new results
4. **Redeploy the function**:
```bash
supabase functions deploy env-validation
```

### Testing Page Integration

The testing page includes:

- **System Status Overview** - Quick health check
- **WebSocket Testing** - Real-time communication testing
- **Environment Validation** - Configuration verification
- **UAT Test Suite** - User acceptance testing
- **System Diagnostics** - Browser and performance metrics

## 🔍 Troubleshooting

### Common Issues

#### 1. WebSocket Connection Fails

**Symptoms**: Connection error or timeout
**Solutions**:
- Check `VITE_WEBSOCKET_URL` is correct
- Verify the WebSocket server is running
- Check network connectivity
- Ensure CORS is properly configured

#### 2. Environment Validation Fails

**Symptoms**: Validation errors for specific services
**Solutions**:
- Verify API keys are correct
- Check service endpoints are accessible
- Ensure Edge Functions are deployed
- Review network connectivity

#### 3. Supabase Connection Issues

**Symptoms**: Database connection errors
**Solutions**:
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Check Supabase project is active
- Ensure RLS policies allow access
- Verify table exists (`compliance_assessments`)

#### 4. OCR API Validation Fails

**Symptoms**: OCR service validation errors
**Solutions**:
- Verify `VITE_OCR_API_KEY` is valid
- Check OCR.space service status
- Ensure API key has sufficient credits
- Review API usage limits

### Debug Mode

Enable debug logging for detailed troubleshooting:

```bash
# Set debug log level
VITE_LOG_LEVEL=DEBUG npm run dev

# Check browser console for detailed logs
# Check network tab for API requests
# Check WebSocket frames for connection issues
```

### Manual Testing

Test components individually:

```bash
# Test WebSocket only
# Navigate to /testing and use WebSocket tab

# Test Environment validation only
# Navigate to /testing and use Environment tab

# Test UAT suite only
# Navigate to /testing and use UAT Tests tab
```

## 📊 Monitoring & Analytics

### Performance Metrics

The testing page provides:

- **Page Load Time** - Performance measurement
- **Viewport Size** - Responsive design testing
- **CPU Cores** - System capability assessment
- **Connection Status** - Real-time monitoring

### Error Tracking

Monitor errors through:

- **Browser Console** - JavaScript errors
- **Network Tab** - API request failures
- **WebSocket Frames** - Connection issues
- **Validation Results** - Environment issues

## 🔒 Security Considerations

### API Key Management

- **Never commit** API keys to version control
- **Use environment variables** for all sensitive data
- **Rotate keys regularly** for security
- **Monitor usage** to detect unauthorized access

### WebSocket Security

- **Use WSS** (secure WebSocket) in production
- **Implement authentication** for WebSocket connections
- **Validate messages** on both client and server
- **Rate limit** connections to prevent abuse

### Environment Variables

- **Validate all inputs** before use
- **Sanitize data** to prevent injection attacks
- **Use HTTPS** for all API communications
- **Implement proper CORS** policies

## 🚀 Production Deployment

### Pre-deployment Checklist

- [ ] All environment variables configured
- [ ] Edge Functions deployed and tested
- [ ] WebSocket server accessible
- [ ] API keys validated and working
- [ ] Error handling tested
- [ ] Performance optimized
- [ ] Security measures implemented

### Deployment Commands

```bash
# Build for production
npm run build

# Deploy to your hosting platform
# (Vercel, Netlify, etc.)

# Deploy Supabase functions
supabase functions deploy env-validation
supabase functions deploy websocket-server

# Verify deployment
curl https://your-project.supabase.co/functions/v1/env-validation
```

### Post-deployment Verification

1. **Test all components** in production environment
2. **Verify environment variables** are properly set
3. **Check WebSocket connections** work in production
4. **Monitor error logs** for any issues
5. **Validate API endpoints** are accessible

## 📚 Additional Resources

### Documentation

- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [React Testing Best Practices](https://reactjs.org/docs/testing.html)

### Support

- **GitHub Issues** - Report bugs and request features
- **Documentation** - Comprehensive guides and examples
- **Community** - Get help from other developers
- **Email Support** - Direct support for critical issues

---

## 🎯 Next Steps

1. **Configure your environment** using the guide above
2. **Deploy the Edge Functions** to your Supabase project
3. **Test all components** to ensure they work correctly
4. **Integrate into your workflow** for ongoing testing
5. **Monitor and maintain** the testing infrastructure

The testing components are now ready to help you develop and debug your application with confidence!