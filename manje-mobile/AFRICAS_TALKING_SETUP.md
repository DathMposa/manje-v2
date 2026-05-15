# Africa's Talking OTP Setup Guide

## ✅ Completed Steps

### Step 2 — Edge Function Created
- Location: `supabase/functions/send-sms/index.ts`
- Deployed to: `https://hdvkzsvnfznrryfmchdv.supabase.co/functions/v1/send-sms`

### Step 3 — JWT Verification Disabled
- Config: `supabase/config.toml` with `verify_jwt = false`

### Step 8 — Client Code Updated
- Added `toE164()` helper in `src/lib/auth.ts` for Malawian number formatting
- Updated `sendPhoneOtp()` to use E.164 formatting

---

## 🔧 Remaining Steps (Manual Configuration Required)

### Step 1 — Africa's Talking Account (If not done)

1. Sign up at https://account.africastalking.com
2. **Sandbox:** Create sandbox app at https://account.africastalking.com/apps/sandbox
3. **Live:** Create Live app, top up balance ($5–10)
4. **Request Sender ID:** Go to SMS → Alphanumerics → Request "Manje" sender ID

---

### Step 4 — Set Environment Variables

Generate a webhook secret:
```bash
openssl rand -base64 32
# Example: xK3mP9vL2nQ8rT5wY7uJ1aB4cD6eF0gH...
```

Set these secrets in Supabase Dashboard → Project Settings → Edge Functions:

| Secret | Value | Example |
|--------|-------|---------|
| `SEND_SMS_HOOK_SECRET` | `v1,whsec_<your-base64>` | `v1,whsec_xK3mP9vL2nQ8...` |
| `AT_USERNAME` | Your AT live username | `manje` |
| `AT_API_KEY` | Your AT live API key | `atsk_...` |
| `AT_SENDER_ID` | Approved sender ID | `Manje` |
| `AT_ENVIRONMENT` | `sandbox` or `production` | `sandbox` (for testing) |
| `AT_SANDBOX_API_KEY` | Your AT sandbox API key | `atsk_sandbox_...` |

---

### Step 5 — Deploy (Already Done ✅)

Function URL: `https://hdvkzsvnfznrryfmchdv.supabase.co/functions/v1/send-sms`

---

### Step 6 — Configure Send SMS Hook

1. Go to **Supabase Dashboard → Authentication → Hooks**
2. Find **"Send SMS"** under Auth Hooks
3. Set:
   - **Hook type:** HTTPS
   - **URL:** `https://hdvkzsvnfznrryfmchdv.supabase.co/functions/v1/send-sms`
   - **Secret:** `v1,whsec_<your-base64-output>` (same as `SEND_SMS_HOOK_SECRET`)
4. Save

---

### Step 7 — Enable Phone Auth

1. **Dashboard → Authentication → Providers → Phone**
2. Toggle **Enable Phone Provider** ON
3. Leave **SMS Provider** fields blank (hook handles it)
4. Configure OTP:
   - OTP expiry: `300` (5 minutes)
   - OTP length: `6`
5. Save

---

### Step 9 — Testing with Sandbox

1. Go to https://simulator.africastalking.com (or use Android app)
2. Sign in with sandbox credentials
3. Add simulated phone: `+265999000001`
4. In your app, call:
   ```typescript
   import { sendPhoneOtp, verifyPhoneOtp } from './src/lib/auth';
   
   // Send OTP
   await sendPhoneOtp('0999000001'); // or +265999000001
   
   // OTP appears in simulator - copy it
   // Then verify
   const session = await verifyPhoneOtp('+265999000001', '123456');
   ```

---

## 📋 Checklist

- [ ] Africa's Talking account created (sandbox + live)
- [ ] "Manje" sender ID requested and approved
- [ ] Live account topped up ($5–10)
- [ ] All 6 secrets set in Supabase Dashboard
- [ ] Send SMS Hook configured in Auth dashboard
- [ ] Phone Auth provider enabled
- [ ] Tested end-to-end via AT Simulator
- [ ] `AT_ENVIRONMENT=production` set for go-live

---

## 🔗 Quick Reference

- **Supabase Project:** https://hdvkzsvnfznrryfmchdv.supabase.co
- **Edge Function URL:** https://hdvkzsvnfznrryfmchdv.supabase.co/functions/v1/send-sms
- **Africa's Talking:** https://account.africastalking.com
- **AT Simulator:** https://simulator.africastalking.com
