# 🚨 CRITICAL: How to Enable Google Login

## The Issue
You got this error: **"provider is not enabled"**

This means Google OAuth provider is **NOT enabled** in your Supabase project.

---

## ✅ FIX: Enable Google Provider

### Step 1: Go to Supabase Dashboard
1. Visit: https://supabase.com/dashboard
2. Select your project: **oefoazdbtxvtrauqpkyf**

### Step 2: Enable Google Provider
1. Click **"Authentication"** in left sidebar
2. Click **"Providers"** tab
3. Find **"Google"** in the list
4. Click the **toggle switch** to enable it

### Step 3: Configure Google OAuth Credentials

**⚠️ You need Google OAuth credentials first!**

**If you DON'T have Google OAuth credentials:**

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** (or select existing)
3. **Enable Google+ API**:
   - APIs & Services → Library
   - Search "Google+ API" and enable it
4. **Create OAuth 2.0 credentials**:
   - APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - **Authorized redirect URIs** (CRITICAL):
     ```
     https://oefoazdbtxvtrauqpkyf.supabase.co/auth/v1/callback
     ```
   - Click "Create"
   - **Copy Client ID and Client Secret**

**Now back to Supabase:**

5. In Supabase → Authentication → Providers → Google
6. Paste your **Client ID** and **Client Secret**
7. Click **"Save"**

---

## ✅ ALTERNATIVE: Disable Google Login Temporarily

If you don't want to set up Google OAuth right now:

Just register with **email/password** for now. Google login button will still be there but won't work until you enable the provider.

---

## 🔍 Verify Setup

After enabling Google:
1. Your dev server is already running (Vite restarted after .env.local change)
2. Refresh browser at http://localhost:8080
3. Click "Continue with Google" button
4. Should redirect to Google login page

---

## ⚠️ Common Issues

**"Invalid redirect URI" error:**
- Make sure the redirect URI in Google Console **exactly** matches:
  ```
  https://oefoazdbtxvtrauqpkyf.supabase.co/auth/v1/callback
  ```

**"Access blocked" error:**
- In Google Cloud Console, add your test user email to:
  - OAuth consent screen → Test users

**Still not working:**
- Check Supabase Dashboard → Authentication → Providers
- Make sure Google toggle is **ON**
- Verify Client ID and Secret are saved

---

## 🎯 Quick Test

1. Open browser console (F12)
2. Go to http://localhost:8080
3. Click "Continue with Google"
4. Check console for any errors

If you see redirect to Google login page → **Success!**
If you see "provider not enabled" → Google is still disabled in Supabase

