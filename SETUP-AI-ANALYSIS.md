# AI Code Analysis Setup Guide

## Overview
The AI Code Analysis feature uses Supabase Edge Functions with the Lovable AI Gateway to provide code quality insights.

## Prerequisites
1. A Supabase project (already set up)
2. Lovable AI Gateway API key

## Step 1: Get Lovable API Key

1. **Sign up for Lovable** (if you don't have an account):
   - Visit: https://lovable.dev
   - Sign up for a free account
   - Navigate to your workspace settings

2. **Get your API Key**:
   - Go to API Keys section
   - Create a new API key or copy your existing one
   - Save this key - you'll need it in the next step

## Step 2: Deploy Edge Function

### Option A: Using Supabase CLI (Recommended)

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (You can find your project ref in Supabase Dashboard → Settings → General)

4. **Deploy the function**:
   ```bash
   supabase functions deploy analyze-snippet
   ```

5. **Set the API key secret**:
   ```bash
   supabase secrets set LOVABLE_API_KEY=your-api-key-here
   ```

### Option B: Using Supabase Dashboard (Manual)

1. **Go to Edge Functions**:
   - Open Supabase Dashboard
   - Navigate to "Edge Functions" in the left sidebar
   - Click "Create a new function"

2. **Create Function**:
   - Function name: `analyze-snippet`
   - Copy the code from `supabase/functions/analyze-snippet/index.ts`
   - Paste it into the editor
   - Click "Deploy"

3. **Set Environment Variables**:
   - Go to "Settings" → "Edge Functions"
   - Click "Add new secret"
   - Name: `LOVABLE_API_KEY`
   - Value: Your Lovable API key
   - Click "Save"

## Step 3: Verify Setup

1. **Test the function**:
   - Go to Edge Functions in Supabase Dashboard
   - Click on `analyze-snippet`
   - Click "Invoke function"
   - Test with:
     ```json
     {
       "code": "function hello() { console.log('Hello'); }",
       "language": "javascript"
     }
     ```

2. **Check the response**:
   - You should see a JSON response with an `analysis` field
   - If you get an error about `LOVABLE_API_KEY`, the secret is not set correctly

## Troubleshooting

### Error: "Function not found"
- **Solution**: Deploy the edge function using one of the methods above

### Error: "LOVABLE_API_KEY is not configured"
- **Solution**: Set the `LOVABLE_API_KEY` secret in Supabase Dashboard or via CLI

### Error: "Rate limit exceeded"
- **Solution**: You've hit the API rate limit. Wait a few minutes and try again, or upgrade your Lovable plan

### Error: "Payment required"
- **Solution**: Add credits to your Lovable workspace

### Error: "Failed to analyze code"
- **Solution**: 
  1. Check browser console for detailed error
  2. Verify the edge function is deployed
  3. Check Supabase Edge Function logs (Dashboard → Edge Functions → analyze-snippet → Logs)

## Alternative: Use OpenAI (Optional)

If you prefer to use OpenAI instead of Lovable, you can modify the edge function:

1. **Get OpenAI API Key**:
   - Sign up at https://platform.openai.com
   - Get your API key from settings

2. **Modify the function** (`supabase/functions/analyze-snippet/index.ts`):
   - Replace `LOVABLE_API_KEY` with `OPENAI_API_KEY`
   - Change the API endpoint to: `https://api.openai.com/v1/chat/completions`
   - Change the model to: `"gpt-3.5-turbo"` or `"gpt-4"`

3. **Redeploy** the function

## Cost Considerations

- **Lovable AI Gateway**: Free tier available, then pay-as-you-go
- **OpenAI**: Pay-per-use based on tokens
- Check current pricing on their respective websites

## Need Help?

If you continue to have issues:
1. Check Supabase Edge Function logs
2. Verify your API key is correct
3. Test the function directly in Supabase Dashboard
4. Check browser console for frontend errors

