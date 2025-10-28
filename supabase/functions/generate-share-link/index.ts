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
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

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
