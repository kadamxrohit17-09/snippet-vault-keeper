-- Add sharing functionality
CREATE TABLE public.snippet_shares (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  snippet_id uuid NOT NULL REFERENCES public.snippets(id) ON DELETE CASCADE,
  share_token text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone,
  view_count integer NOT NULL DEFAULT 0
);

ALTER TABLE public.snippet_shares ENABLE ROW LEVEL SECURITY;

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

-- Add storage bucket for snippet attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('snippet-attachments', 'snippet-attachments', false);

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

-- Enable realtime for snippets
ALTER PUBLICATION supabase_realtime ADD TABLE public.snippets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.snippet_shares;