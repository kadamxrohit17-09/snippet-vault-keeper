-- Migration: Add favorites and copy_count features
-- Run this in Supabase SQL Editor

-- Add is_favorite column to snippets table
ALTER TABLE public.snippets 
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;

-- Add copy_count column to snippets table
ALTER TABLE public.snippets 
ADD COLUMN IF NOT EXISTS copy_count INTEGER DEFAULT 0;

-- Create index for faster favorite queries
CREATE INDEX IF NOT EXISTS idx_snippets_favorite 
ON public.snippets(user_id, is_favorite) 
WHERE is_favorite = TRUE;

-- Create index for copy_count queries
CREATE INDEX IF NOT EXISTS idx_snippets_copy_count 
ON public.snippets(user_id, copy_count DESC);

-- Update RLS policies (they should already allow updates, but ensure they do)
-- The existing policies should work, but we'll verify they allow updating is_favorite and copy_count

-- Grant necessary permissions (should already exist)
-- No additional grants needed as authenticated users can already update their snippets

