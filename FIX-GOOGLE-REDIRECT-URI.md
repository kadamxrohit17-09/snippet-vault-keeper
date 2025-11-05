# 🚨 FIX: Google OAuth Redirect URI Mismatch

## The Error
**Error 400: redirect_uri_mismatch**

The redirect URI `https://oefoazdbtxvtrauqpkyf.supabase.co/auth/v1/callback` is not registered in your Google Cloud Console.

---

## ✅ STEP-BY-STEP FIX

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Select your project (or create a new one)

### Step 2: Navigate to OAuth Credentials
1. Click **"APIs & Services"** in the left menu
2. Click **"Credentials"**
3. Find your **OAuth 2.0 Client ID** (or create one if it doesn't exist)

### Step 3: Edit OAuth Client
1. **Click on your OAuth 2.0 Client ID** to edit it
2. Scroll down to **"Authorized redirect URIs"**
3. Click **"+ ADD URI"**
4. **Copy and paste EXACTLY this** (no spaces, no quotes):
   ```
   https://oefoazdbtxvtrauqpkyf.supabase.co/auth/v1/callback
   ```
5. Click **"SAVE"** at the bottom

---

## ✅ VERIFY THE URI

Make sure the URI in Google Console matches **EXACTLY**:
```
https://oefoazdbtxvtrauqpkyf.supabase.co/auth/v1/callback
```

### ⚠️ Common Mistakes:
- ❌ Missing `https://`
- ❌ Missing `/auth/v1/callback` at the end
- ❌ Extra spaces before/after
- ❌ Wrong project reference (must be `oefoazdbtxvtrauqpkyf`)
- ❌ Using `http://` instead of `https://`

---

## 🔍 IF YOU DON'T HAVE AN OAUTH CLIENT YET

### Create New OAuth 2.0 Client:

1. **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. If prompted, configure OAuth consent screen first:
   - User Type: **External**
   - App name: Your app name
   - User support email: Your email
   - Developer contact: Your email
   - Click **"SAVE AND CONTINUE"** through all steps

4. **Create OAuth Client ID:**
   - Application type: **Web application**
   - Name: `Supabase OAuth Client` (or any name)
   - **Authorized redirect URIs**: Click **"+ ADD URI"** and add:
     ```
     https://oefoazdbtxvtrauqpkyf.supabase.co/auth/v1/callback
     ```
   - Click **"CREATE"**

5. **Copy Client ID and Client Secret** (you'll need these for Supabase)

---

## 🔗 ADD CREDENTIALS TO SUPABASE

After creating/getting your OAuth credentials:

1. Go to: https://supabase.com/dashboard/project/oefoazdbtxvtrauqpkyf/auth/providers
2. Find **"Google"** provider
3. **Enable** it (toggle ON)
4. Paste your **Client ID** from Google Console
5. Paste your **Client Secret** from Google Console
6. Click **"Save"**

---

## ⏱️ WAIT AND TEST

1. **Wait 2-3 minutes** after saving (Google needs time to update)
2. **Clear browser cache** or use Incognito mode
3. Go to: http://localhost:8080
4. Click **"Continue with Google"**
5. Should redirect to Google login page ✅

---

## 🆘 STILL NOT WORKING?

### Check These:

1. **Verify the redirect URI is saved** in Google Console:
   - Go back to Google Console → Credentials
   - Check your OAuth Client → Authorized redirect URIs
   - Should see: `https://oefoazdbtxvtrauqpkyf.supabase.co/auth/v1/callback`

2. **Check Supabase Google provider is enabled**:
   - Supabase Dashboard → Authentication → Providers
   - Google should be **ON**
   - Client ID and Secret should be filled in

3. **Check OAuth consent screen**:
   - Google Console → APIs & Services → OAuth consent screen
   - Publishing status: **Testing** (for development)
   - Add your test email in "Test users" if in Testing mode

4. **Try in Incognito/Private window** to avoid cache issues

---

## ✅ SUCCESS INDICATORS

When working correctly:
- ✅ Clicking "Continue with Google" redirects to Google login
- ✅ After Google login, redirects back to your app
- ✅ You're logged in to your app

---

## 📝 QUICK CHECKLIST

- [ ] Redirect URI added to Google Console: `https://oefoazdbtxvtrauqpkyf.supabase.co/auth/v1/callback`
- [ ] Google OAuth Client ID and Secret copied
- [ ] Google provider enabled in Supabase
- [ ] Client ID and Secret added to Supabase
- [ ] Waited 2-3 minutes after saving
- [ ] Tried in Incognito/Private window

