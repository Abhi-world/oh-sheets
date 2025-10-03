import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';
import jwt from 'https://esm.sh/jsonwebtoken@9.0.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GoogleSheetsCredentials {
  access_token: string;
  refresh_token: string;
  expiry_date?: string;
}

async function refreshGoogleToken(refreshToken: string, clientId: string, clientSecret: string): Promise<string> {
  console.log('🔄 Refreshing Google access token...');
  
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!tokenResponse.ok) {
    const errorData = await tokenResponse.json();
    console.error('❌ Error refreshing token:', errorData);
    throw new Error(`Failed to refresh token: ${errorData.error_description || tokenResponse.statusText}`);
  }

  const tokenData = await tokenResponse.json();
  console.log('✅ Token refreshed successfully');
  return tokenData.access_token;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📋 [list-google-spreadsheets] Starting...');
    
    let monday_user_id: string;
    
    // Check if request is from Monday.com automation (JWT in Authorization header)
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      console.log('🔐 JWT authentication detected');
      const signingSecret = Deno.env.get('MONDAY_SIGNING_SECRET');
      if (!signingSecret) {
        throw new Error('MONDAY_SIGNING_SECRET not configured');
      }
      
      try {
        const decoded: any = jwt.verify(authHeader.replace('Bearer ', ''), signingSecret);
        monday_user_id = String(decoded.userId || decoded.user_id || decoded.sub);
        console.log('✅ JWT verified, user ID:', monday_user_id);
      } catch (jwtError) {
        console.error('❌ JWT verification failed:', jwtError);
        throw new Error('Invalid authentication token');
      }
    } else {
      // Fallback to body parameter for direct calls
      const body = await req.json();
      monday_user_id = body.monday_user_id;
      console.log('👤 Monday User ID from body:', monday_user_id);
    }

    if (!monday_user_id) {
      throw new Error('monday_user_id is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch Google Sheets credentials for this Monday user
    console.log('🔍 Fetching credentials from profiles table...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('google_sheets_credentials')
      .eq('monday_user_id', String(monday_user_id))
      .single();

    if (profileError || !profile?.google_sheets_credentials) {
      console.error('❌ No credentials found:', profileError);
      throw new Error('Google Sheets not connected. Please connect your Google account first.');
    }

    const credentials = profile.google_sheets_credentials as GoogleSheetsCredentials;
    console.log('✅ Credentials found');

    // Get or refresh access token
    let accessToken = credentials.access_token;
    
    // Check if token might be expired
    if (credentials.expiry_date) {
      const expiryDate = new Date(credentials.expiry_date);
      const now = new Date();
      if (expiryDate <= now) {
        console.log('🔄 Token expired, refreshing...');
        const clientId = Deno.env.get('GOOGLE_CLIENT_ID')!;
        const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')!;
        accessToken = await refreshGoogleToken(credentials.refresh_token, clientId, clientSecret);
        
        // Update the credentials with new access token
        const newExpiryDate = new Date(Date.now() + 3600 * 1000); // 1 hour from now
        await supabase
          .from('profiles')
          .update({
            google_sheets_credentials: {
              ...credentials,
              access_token: accessToken,
              expiry_date: newExpiryDate.toISOString(),
            },
          })
          .eq('monday_user_id', String(monday_user_id));
      }
    }

    // Fetch spreadsheets from Google Drive API
    console.log('📊 Fetching spreadsheets from Google Drive...');
    const response = await fetch(
      'https://www.googleapis.com/drive/v3/files?q=mimeType=\'application/vnd.google-apps.spreadsheet\'&pageSize=100',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Google API error:', errorData);
      
      // If unauthorized, try refreshing token
      if (response.status === 401) {
        console.log('🔄 Token invalid, refreshing...');
        const clientId = Deno.env.get('GOOGLE_CLIENT_ID')!;
        const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')!;
        accessToken = await refreshGoogleToken(credentials.refresh_token, clientId, clientSecret);
        
        // Try again with fresh token
        const retryResponse = await fetch(
          'https://www.googleapis.com/drive/v3/files?q=mimeType=\'application/vnd.google-apps.spreadsheet\'&pageSize=100',
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json',
            },
          }
        );
        
        if (!retryResponse.ok) {
          throw new Error(`Failed to fetch spreadsheets after token refresh: ${retryResponse.statusText}`);
        }
        
        const data = await retryResponse.json();
        const spreadsheets = data.files.map((file: any) => ({
          id: file.id,
          name: file.name,
        }));
        
        console.log(`✅ Found ${spreadsheets.length} spreadsheets`);
        
        return new Response(JSON.stringify({ spreadsheets }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`Failed to fetch spreadsheets: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Format for Monday.com recipes (options array) or regular response
    const spreadsheets = data.files.map((file: any) => ({
      id: file.id,
      name: file.name,
      title: file.name,  // Monday.com expects 'title'
      value: file.id,     // Monday.com expects 'value'
    }));

    console.log(`✅ Found ${spreadsheets.length} spreadsheets`);

    // Return format compatible with both Monday recipes and direct calls
    return new Response(JSON.stringify({ 
      spreadsheets,
      options: spreadsheets  // Monday.com recipes expect 'options' array
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('💥 Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
