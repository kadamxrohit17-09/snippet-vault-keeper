-- =====================================================
-- Complete Database Setup for Snippet Vault Keeper
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- Step 1: Create snippets table with proper security
CREATE TABLE IF NOT EXISTS public.snippets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running script)
DROP POLICY IF EXISTS "Users can view their own snippets" ON public.snippets;
DROP POLICY IF EXISTS "Users can create their own snippets" ON public.snippets;
DROP POLICY IF EXISTS "Users can update their own snippets" ON public.snippets;
DROP POLICY IF EXISTS "Users can delete their own snippets" ON public.snippets;

-- RLS Policies: Users can only access their own snippets
CREATE POLICY "Users can view their own snippets"
  ON public.snippets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own snippets"
  ON public.snippets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own snippets"
  ON public.snippets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own snippets"
  ON public.snippets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop trigger if exists (for re-running script)
DROP TRIGGER IF EXISTS update_snippets_updated_at ON public.snippets;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_snippets_updated_at
  BEFORE UPDATE ON public.snippets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Step 2: Add sharing functionality
CREATE TABLE IF NOT EXISTS public.snippet_shares (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  snippet_id uuid NOT NULL REFERENCES public.snippets(id) ON DELETE CASCADE,
  share_token text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone,
  view_count integer NOT NULL DEFAULT 0
);

ALTER TABLE public.snippet_shares ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running script)
DROP POLICY IF EXISTS "Users can create shares for own snippets" ON public.snippet_shares;
DROP POLICY IF EXISTS "Users can view their own shares" ON public.snippet_shares;
DROP POLICY IF EXISTS "Users can delete their own shares" ON public.snippet_shares;
DROP POLICY IF EXISTS "Anyone can view public shares" ON public.snippet_shares;

-- Users can create shares for their own snippets
CREATE POLICY "Users can create shares for own snippets"
ON public.snippet_shares
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.snippets
    WHERE snippets.id = snippet_shares.snippet_id
    AND snippets.user_id = auth.uid()
  )
);

-- Users can view their own shares
CREATE POLICY "Users can view their own shares"
ON public.snippet_shares
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.snippets
    WHERE snippets.id = snippet_shares.snippet_id
    AND snippets.user_id = auth.uid()
  )
);

-- Allow anonymous users to view shares by token (for public sharing)
CREATE POLICY "Anyone can view public shares"
ON public.snippet_shares
FOR SELECT
TO anon, authenticated
USING (true);

-- Users can delete their own shares
CREATE POLICY "Users can delete their own shares"
ON public.snippet_shares
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.snippets
    WHERE snippets.id = snippet_shares.snippet_id
    AND snippets.user_id = auth.uid()
  )
);

-- Step 3: Add storage bucket for snippet attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('snippet-attachments', 'snippet-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist (for re-running script)
DROP POLICY IF EXISTS "Users can upload their own attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own attachments" ON storage.objects;

-- Storage policies for attachments
CREATE POLICY "Users can upload their own attachments"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'snippet-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own attachments"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'snippet-attachments'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own attachments"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'snippet-attachments'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Step 4: Enable realtime for snippets (if publication exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.snippets;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.snippet_shares;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Ignore if realtime publication doesn't exist
    NULL;
END $$;

-- Step 5: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_snippets_user_id ON public.snippets(user_id);
CREATE INDEX IF NOT EXISTS idx_snippets_created_at ON public.snippets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_snippet_shares_token ON public.snippet_shares(share_token);
CREATE INDEX IF NOT EXISTS idx_snippet_shares_snippet_id ON public.snippet_shares(snippet_id);

-- =====================================================
-- Setup Complete!
-- =====================================================
-- Tables created:
--   ✓ public.snippets - Main snippets table
--   ✓ public.snippet_shares - Sharing functionality
--   ✓ storage.buckets (snippet-attachments) - File storage
--
-- Security:
--   ✓ Row Level Security (RLS) enabled
--   ✓ Policies configured for authenticated users
--   ✓ Storage policies configured
--
-- Features:
--   ✓ Automatic timestamp updates
--   ✓ Realtime subscriptions enabled
--   ✓ Performance indexes created
-- =====================================================

