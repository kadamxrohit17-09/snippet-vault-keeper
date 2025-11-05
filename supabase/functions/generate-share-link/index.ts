import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { snippetId, expiresInDays } = await req.json();
    
    // Validate snippet ID format
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!snippetId || !UUID_REGEX.test(snippetId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid snippet ID format' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate expiration days if provided
    if (expiresInDays !== undefined && expiresInDays !== null) {
      if (typeof expiresInDays !== 'number' || expiresInDays < 1 || expiresInDays > 365) {
        return new Response(
          JSON.stringify({ error: 'Expiration must be between 1-365 days' }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify snippet ownership
    const { data: snippet, error: snippetError } = await supabaseClient
      .from('snippets')
      .select('user_id')
      .eq('id', snippetId)
      .single();

    if (snippetError || !snippet) {
      console.error('Snippet lookup error:', snippetError);
      return new Response(
        JSON.stringify({ error: 'Snippet not found' }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (snippet.user_id !== user.id) {
      console.error('Ownership verification failed: user', user.id, 'attempted to share snippet owned by', snippet.user_id);
      return new Response(
        JSON.stringify({ error: 'Forbidden: You do not own this snippet' }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate a unique share token
    const shareToken = crypto.randomUUID();
    
    // Calculate expiration if specified
    let expiresAt = null;
    if (expiresInDays) {
      const expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + expiresInDays);
      expiresAt = expireDate.toISOString();
    }

    // Create share record
    const { data, error } = await supabaseClient
      .from('snippet_shares')
      .insert({
        snippet_id: snippetId,
        share_token: shareToken,
        expires_at: expiresAt
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating share:', error);
      throw error;
    }

    const shareUrl = `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovable.app')}/shared/${shareToken}`;

    return new Response(
      JSON.stringify({ shareUrl, shareToken }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-share-link:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
