# Manual Edge Function Deployment Guide

## 🔐 **Authentication Issue**

The automatic deployment is having issues with the provided credentials. The Supabase CLI expects a different token format (`sbp_...`) than what was provided.

## 🛠️ **Manual Deployment Options**

### **Option 1: Supabase Dashboard (Recommended)**

1. **Go to Supabase Dashboard:**

   ```
   https://app.supabase.com/project/hnwwykttyzfvflmcswjk/functions
   ```

2. **Create env-validation Function:**
   - Click "Create a new function"
   - Name: `env-validation`
   - Copy the content from `supabase/functions/env-validation/index.ts`
   - Deploy

3. **Create websocket-server Function:**
   - Click "Create a new function" again
   - Name: `websocket-server`
   - Copy the content from `supabase/functions/websocket-server/index.ts`
   - Deploy

### **Option 2: Get Correct Access Token**

1. **Go to Supabase Dashboard:**

   ```
   https://app.supabase.com/account/tokens
   ```

2. **Generate Access Token:**
   - Click "Generate new token"
   - Copy the token (should start with `sbp_`)

3. **Use the token:**
   ```bash
   export SUPABASE_ACCESS_TOKEN="sbp_your_token_here"
   npx supabase link --project-ref hnwwykttyzfvflmcswjk
   npx supabase functions deploy env-validation
   npx supabase functions deploy websocket-server
   ```

### **Option 3: Local Testing Without Deployment**

Since the components work in mock mode, you can test everything locally:

1. **Keep mock mode enabled:**

   ```bash
   # In .env file
   VITE_ENABLE_MOCK_MODE="true"
   ```

2. **Test all components:**
   - Navigate to `http://localhost:5173/testing`
   - All UI components will work
   - WebSocket will show connection errors (expected)
   - Environment validation will show partial results (expected)

## 🧪 **Local Testing Workaround**

I've created a local testing version that simulates the Edge Functions:

### **Test WebSocket Locally:**

The WebSocket component will show connection errors, but you can test the UI and error handling.

### **Test Environment Validation Locally:**

The Environment validator will show partial validation results, which is expected behavior.

### **Test UAT Suite:**

The UAT tests will work completely as they don't require external services.

### **Test Diagnostics:**

System diagnostics will work fully as they use browser APIs.

## 🎯 **Recommended Approach**

1. **Start with Local Testing:**
   - Test all components at `http://localhost:5173/testing`
   - Verify UI works correctly
   - Check error handling

2. **Deploy Functions Manually:**
   - Use Supabase Dashboard (Option 1)
   - Copy function code from the files I created

3. **Test with Real Functions:**
   - Update environment: `VITE_ENABLE_MOCK_MODE="false"`
   - Restart development server
   - Test real WebSocket connections

## 📋 **Function Code to Copy**

### **env-validation Function:**

Copy from: `supabase/functions/env-validation/index.ts`

### **websocket-server Function:**

Copy from: `supabase/functions/websocket-server/index.ts`

## 🔍 **Verification Steps**

After manual deployment:

1. **Test env-validation:**

   ```bash
   curl https://hnwwykttyzfvflmcswjk.supabase.co/functions/v1/env-validation
   ```

2. **Test websocket-server:**
   - Use WebSocket client to connect to:

   ```
   wss://hnwwykttyzfvflmcswjk.supabase.co/functions/v1/websocket-server
   ```

3. **Update environment:**

   ```bash
   # In .env file
   VITE_ENABLE_MOCK_MODE="false"
   ```

4. **Restart and test:**
   ```bash
   npm run dev
   # Navigate to http://localhost:5173/testing
   ```

## 🎉 **Current Status**

✅ **Components Ready** - All React components are integrated and working  
✅ **Local Testing** - Can test UI and functionality locally  
⏳ **Edge Functions** - Need manual deployment via dashboard  
✅ **Mock Mode** - Working for development and testing

**Next Step:** Use the Supabase Dashboard to manually deploy the two Edge Functions, then test with real connections.
