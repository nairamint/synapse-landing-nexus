# Step-by-Step Testing Guide

## 🎯 **Current Status**

✅ **Environment Configured** - All environment variables set up  
✅ **Components Integrated** - WebSocket and Environment testing components added  
✅ **Development Server Running** - Available at `http://localhost:5173`  
⏳ **Edge Functions** - Pending deployment (optional for initial testing)  
⏳ **Testing Phase** - Ready to begin comprehensive testing

## 🚀 **Step 3: Test All Components**

### **Access the Testing Dashboard**

1. **Open your browser** and navigate to:

   ```
   http://localhost:5173/testing
   ```

2. **You should see** the System Testing & Diagnostics page with four tabs:
   - **WebSocket** - WebSocket connection testing
   - **Environment** - Environment variable validation
   - **UAT Tests** - User acceptance testing suite
   - **Diagnostics** - System diagnostics and metrics

### **Test 1: System Status Overview**

✅ **What to check:**

- System Status Overview card should show four status indicators
- Supabase: Connected (green)
- WebSocket: Ready to test (blue)
- Environment: Validation ready (purple)
- UAT Tests: Available (orange)

### **Test 2: WebSocket Tab Testing**

1. **Click on the "WebSocket" tab**

2. **Initial State Check:**
   - Status should show "🔴 Disconnected"
   - WebSocket URL should display: `wss://hnwwykttyzfvflmcswjk.supabase.co/functions/v1/websocket-server`
   - Connect button should be visible

3. **Test Connection (Expected Behavior in Mock Mode):**
   - Click "Connect" button
   - You should see an error message: "VITE_WEBSOCKET_URL environment variable is not defined" or connection failure
   - This is expected since the Edge Function is not deployed yet

4. **What This Tests:**
   - WebSocket component loads correctly
   - Environment variable reading works
   - Error handling functions properly
   - UI updates based on connection status

### **Test 3: Environment Tab Testing**

1. **Click on the "Environment" tab**

2. **Run Validation:**
   - Click "Validate Environment" button
   - You should see "Validating..." state

3. **Expected Results:**
   - **Supabase Connection**: Should fail (Edge Function not deployed)
   - **OCR API Key**: Should fail (placeholder key)
   - **WebSocket URL**: Should pass (valid URL format)
   - **Overall Status**: ⚠️ Some environment variables need attention

4. **What This Tests:**
   - Environment validator component loads
   - API calls are attempted
   - Error handling works correctly
   - Visual feedback is provided

### **Test 4: UAT Tests Tab**

1. **Click on the "UAT Tests" tab**

2. **Test Overview Check:**
   - Should show automated test counts
   - Should display functional, security, and integration test categories

3. **Run Automated Tests:**
   - Tests should execute and show results
   - Chat initialization test
   - Quick actions test
   - Responsive design test

4. **Try Manual Tests:**
   - Click "Test Chat" button
   - Click "Test Quick Actions" button
   - Click "Test Form Mode" button

### **Test 5: Diagnostics Tab**

1. **Click on the "Diagnostics" tab**

2. **Check Browser Information:**
   - User Agent should be displayed
   - Platform information should be shown
   - Language and online status should be visible

3. **Environment Variables Status:**
   - All configured variables should show as "configured" or their values
   - Missing variables should show as "Not configured"

4. **Performance Metrics:**
   - Page load time should be displayed
   - Viewport size should be shown
   - CPU cores should be detected

5. **Quick Actions:**
   - Try "Reload Page" button
   - Try "Clear Local Storage" button
   - Try "Clear Console" button

## 🔧 **Test 6: Main Application Integration**

### **Test Nexus Agent Page**

1. **Navigate to:**

   ```
   http://localhost:5173/nexus-agent
   ```

2. **Check Connection Status:**
   - Header should show connection status indicator
   - Should display "Mock Mode" since VITE_ENABLE_MOCK_MODE is true
   - Chat interface should load normally

3. **Test Chat Functionality:**
   - Type a message in the chat
   - Should receive mock responses
   - Quick actions should work

### **Test Form Mode:**

- Switch to Form Mode
- Fill in the SFDR validation form
- Submit and verify mock validation works

## 📊 **Expected Test Results Summary**

### **✅ Should Work (Green Status):**

- Page loading and navigation
- Component rendering
- WebSocket component UI (but connection will fail)
- Environment validator UI (but validation will partially fail)
- UAT automated tests
- System diagnostics
- Nexus Agent with mock mode
- Form validation with mock responses

### **❌ Expected Failures (Orange Status):**

- WebSocket connection (Edge Function not deployed)
- Environment validation API calls (Edge Function not deployed)
- Real API connectivity tests

### **⚠️ Partial Success (Yellow Status):**

- Environment validation will pass for URL format checking
- Some diagnostics will work, others may not

## 🎯 **Step 4: Manual Edge Function Deployment**

Since automatic deployment requires authentication, here are manual deployment options:

### **Option A: Using Supabase Dashboard**

1. **Go to Supabase Dashboard:**

   ```
   https://app.supabase.com/project/hnwwykttyzfvflmcswjk/functions
   ```

2. **Create New Function:**
   - Click "Create a new function"
   - Name: `env-validation`
   - Copy content from `supabase/functions/env-validation/index.ts`
   - Deploy

3. **Repeat for WebSocket:**
   - Create another function named `websocket-server`
   - Copy content from `supabase/functions/websocket-server/index.ts`
   - Deploy

### **Option B: Using Supabase CLI (After Login)**

1. **Login to Supabase:**

   ```bash
   npx supabase login
   ```

2. **Link Project:**

   ```bash
   npx supabase link --project-ref hnwwykttyzfvflmcswjk
   ```

3. **Deploy Functions:**
   ```bash
   npx supabase functions deploy env-validation
   npx supabase functions deploy websocket-server
   ```

## 🔄 **Step 5: Post-Deployment Testing**

After deploying the Edge Functions:

1. **Update Environment:**

   ```bash
   # In .env file, change:
   VITE_ENABLE_MOCK_MODE="false"
   ```

2. **Restart Development Server:**

   ```bash
   npm run dev
   ```

3. **Re-test All Components:**
   - WebSocket connections should now work
   - Environment validation should pass
   - Real-time functionality should be active

## 🎉 **Success Criteria**

### **Immediate Testing (Current State):**

- [ ] Testing page loads at `/testing`
- [ ] All 4 tabs are accessible
- [ ] WebSocket component shows proper error handling
- [ ] Environment validator attempts validation
- [ ] UAT tests execute
- [ ] Diagnostics show system information
- [ ] Nexus Agent works in mock mode

### **Post-Deployment Testing:**

- [ ] WebSocket connections establish successfully
- [ ] Environment validation passes all checks
- [ ] Real-time message exchange works
- [ ] All APIs respond correctly
- [ ] End-to-end functionality complete

## 🔍 **Troubleshooting**

### **Common Issues and Solutions:**

1. **Page Not Loading:**
   - Check if dev server is running: `npm run dev`
   - Verify URL: `http://localhost:5173/testing`

2. **Components Not Rendering:**
   - Check browser console for errors
   - Verify all dependencies are installed: `npm install`

3. **Environment Variables Not Working:**
   - Restart development server after .env changes
   - Check .env file syntax (no spaces around =)

4. **Mock Mode Not Working:**
   - Verify `VITE_ENABLE_MOCK_MODE="true"` in .env
   - Check browser console for mock responses

## 📝 **Testing Checklist**

Copy this checklist and check off items as you test:

### **Initial Setup Testing:**

- [ ] Environment variables configured
- [ ] Development server running
- [ ] Testing page accessible

### **Component Testing:**

- [ ] WebSocket tab loads and shows connection status
- [ ] Environment tab loads and attempts validation
- [ ] UAT tab loads and runs automated tests
- [ ] Diagnostics tab shows system information

### **Integration Testing:**

- [ ] Nexus Agent page works in mock mode
- [ ] Chat functionality responds with mock data
- [ ] Form validation works with mock responses
- [ ] Navigation between pages works

### **Error Handling Testing:**

- [ ] WebSocket connection errors are handled gracefully
- [ ] Environment validation errors are displayed clearly
- [ ] Missing configuration is reported properly
- [ ] User feedback is clear and helpful

---

## 🎯 **Next Steps After Testing**

1. **Report Test Results** - Document what works and what doesn't
2. **Deploy Edge Functions** - Use one of the deployment methods above
3. **Final Testing** - Test with real API connections
4. **Production Setup** - Configure for production deployment

**Ready to begin testing!** 🚀

Navigate to `http://localhost:5173/testing` and start with the System Status Overview.
