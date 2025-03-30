
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create temp-uploads bucket if it doesn't exist
    const { data: buckets, error: listError } = await supabaseClient
      .storage
      .listBuckets()
    
    if (listError) throw listError
    
    const tempBucketExists = buckets.some(bucket => bucket.name === 'temp-uploads')
    
    if (!tempBucketExists) {
      const { error } = await supabaseClient
        .storage
        .createBucket('temp-uploads', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
        })
      
      if (error) throw error
      
      console.log('Created temp-uploads bucket')
    }

    return new Response(
      JSON.stringify({ success: true, message: "Storage bucket setup completed" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
