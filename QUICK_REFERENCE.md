# Quick Reference Card

## 🚀 **Testing URLs**

- **Testing Dashboard**: `http://localhost:5173/testing`
- **Nexus Agent**: `http://localhost:5173/nexus-agent`
- **SFDR Navigator**: `http://localhost:5173/sfdr-navigator`

## 🔧 **Component Status**

| Component            | Status     | Location                     |
| -------------------- | ---------- | ---------------------------- |
| WebSocketTest        | ✅ Ready   | `/testing` → WebSocket tab   |
| EnvironmentValidator | ✅ Ready   | `/testing` → Environment tab |
| TestingPage          | ✅ Ready   | `/testing`                   |
| UAT Test Suite       | ✅ Ready   | `/testing` → UAT Tests tab   |
| System Diagnostics   | ✅ Ready   | `/testing` → Diagnostics tab |
| Edge Functions       | ⏳ Pending | Manual deployment required   |

## 🏗️ **Deployment Commands**

### **Start Development Server**

```bash
npm run dev
```

### **Deploy Edge Functions (After Supabase Login)**

```bash
npx supabase login
npx supabase link --project-ref hnwwykttyzfvflmcswjk
npx supabase functions deploy env-validation
npx supabase functions deploy websocket-server
```

### **Alternative: Manual Deployment**

- Dashboard: `https://app.supabase.com/project/hnwwykttyzfvflmcswjk/functions`
- Copy function code from `supabase/functions/*/index.ts`

## 🔍 **Environment Variables**

| Variable                | Current Value | Status                 |
| ----------------------- | ------------- | ---------------------- |
| `VITE_ENABLE_MOCK_MODE` | `"true"`      | ✅ Enabled for testing |
| `VITE_LOG_LEVEL`        | `"DEBUG"`     | ✅ Verbose logging     |
| `VITE_SUPABASE_URL`     | Configured    | ✅ Ready               |
| `VITE_WEBSOCKET_URL`    | Configured    | ⏳ Function needed     |
| `VITE_OCR_API_KEY`      | Placeholder   | ⚠️ Needs real key      |

## 📊 **Testing Sequence**

1. **Testing Dashboard** → `http://localhost:5173/testing`
2. **WebSocket Tab** → Test connection (expect failure initially)
3. **Environment Tab** → Run validation (partial success expected)
4. **UAT Tests Tab** → Run automated tests
5. **Diagnostics Tab** → Check system information
6. **Nexus Agent** → Test in mock mode

## 🎯 **Expected Results**

### **Should Work ✅**

- All UI components load
- Mock mode responses
- Error handling
- System diagnostics
- UAT automated tests

### **Expected Failures ❌**

- WebSocket connections (no Edge Function)
- Environment API validation (no Edge Function)
- Real API calls

### **Partial Success ⚠️**

- WebSocket URL format validation
- Some environment checks

## 🔧 **Troubleshooting**

| Issue                    | Solution                                 |
| ------------------------ | ---------------------------------------- |
| Page not loading         | Check `npm run dev` is running           |
| Components not rendering | Check browser console, run `npm install` |
| Env vars not working     | Restart dev server after .env changes    |
| Mock mode not working    | Verify `VITE_ENABLE_MOCK_MODE="true"`    |

## 📋 **Quick Checklist**

### **Immediate Testing**

- [ ] Navigate to `/testing`
- [ ] Check all 4 tabs load
- [ ] Test WebSocket component
- [ ] Run environment validation
- [ ] Execute UAT tests
- [ ] Review diagnostics

### **Integration Testing**

- [ ] Test Nexus Agent in mock mode
- [ ] Verify chat functionality
- [ ] Test form validation
- [ ] Check navigation

## 🎉 **Ready to Test!**

**Start here**: `http://localhost:5173/testing`

The development server should be running. If not, run `npm run dev` first.
