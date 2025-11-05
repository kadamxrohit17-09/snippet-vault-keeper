# Quick Fix: Edge Function Error

## The Error
"Failed to send a request to the Edge Function"

This means the `analyze-snippet` edge function is not deployed or not accessible.

## Quick Solution (5 minutes)

### Method 1: Using Supabase Dashboard (Easiest)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Open your project

2. **Navigate to Edge Functions**
   - Click "Edge Functions" in the left sidebar
   - If you don't see this option, your project might need to enable Edge Functions first (should be enabled by default)

3. **Create the Function**
   - Click "Create a new function" button
   - Function name: `analyze-snippet` (exactly this name)
   - Click "Deploy function"

4. **Add the Code**
   - Open the file: `supabase/functions/analyze-snippet/index.ts` from your project
   - Copy ALL the code
   - Paste it into the Supabase editor
   - Click "Deploy" or "Save"

5. **Set the API Key Secret**
   - Still in Edge Functions, go to "Settings" tab
   - Or go to: Project Settings → Edge Functions → Secrets
   - Click "Add new secret"
   - Name: `LOVABLE_API_KEY`
   - Value: Get your API key from https://lovable.dev (sign up if needed)
   - Click "Save"

6. **Test**
   - Go back to "Edge Functions"
   - Click on `analyze-snippet`
   - Click "Invoke function"
   - Test with:
     ```json
     {
       "code": "function test() { return 'hello'; }",
       "language": "javascript"
     }
     ```
   - You should see a response with analysis

7. **Try Again**
   - Go back to your app
   - Click "Analyze Code" on any snippet
   - It should work now!

### Method 2: Using Supabase CLI (Advanced)

1. **Install Supabase CLI** (if not installed):
   ```bash
   npm install -g supabase
   ```

2. **Login**:
   ```bash
   supabase login
   ```

3. **Link Project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (Find project ref in Dashboard → Settings → General)

4. **Deploy**:
   ```bash
   supabase functions deploy analyze-snippet
   ```

5. **Set Secret**:
   ```bash
   supabase secrets set LOVABLE_API_KEY=your-api-key-here
   ```

## Get Lovable API Key

1. Go to: https://lovable.dev
2. Sign up or login
3. Go to Workspace Settings → API Keys
4. Create new API key or copy existing one
5. Use this in the secret above

## Alternative: Skip AI Analysis

If you don't want to set up AI analysis right now, the app will work fine without it. The error only appears when you try to use the "Analyze Code" feature.

## Still Not Working?

1. **Check Function Exists**:
   - Dashboard → Edge Functions
   - You should see `analyze-snippet` in the list

2. **Check Function Code**:
   - Click on `analyze-snippet`
   - Verify the code is there

3. **Check Secrets**:
   - Settings → Edge Functions → Secrets
   - Verify `LOVABLE_API_KEY` exists

4. **Check Function Logs**:
   - Dashboard → Edge Functions → `analyze-snippet` → Logs
   - Look for any error messages

5. **Test Function Directly**:
   - Use the "Invoke function" button in Supabase Dashboard
   - This helps isolate if it's a frontend or backend issue

## Common Issues

### "Function not found"
→ Function not deployed. Follow Method 1 above.

### "LOVABLE_API_KEY not configured"
→ Secret not set. Add it in Settings → Edge Functions → Secrets.

### "Network error"
→ Check internet connection or try again in a few seconds.

### "Rate limit exceeded"
→ You've used too many API calls. Wait a few minutes or upgrade plan.

