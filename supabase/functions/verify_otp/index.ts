import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, otp_code, name, email } = await req.json();

    if (!phone || !otp_code) {
      return new Response(
        JSON.stringify({ error: 'Phone number and OTP code are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if OTP exists and is valid
    const { data: otpData, error: otpError } = await supabase
      .from('otp')
      .select('*')
      .eq('phone', phone)
      .eq('otp_code', otp_code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (otpError || !otpData) {
      console.error('Invalid or expired OTP:', otpError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired OTP' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark OTP as used
    const { error: updateOtpError } = await supabase
      .from('otp')
      .update({ used: true })
      .eq('id', otpData.id);

    if (updateOtpError) {
      console.error('Error updating OTP:', updateOtpError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify OTP' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user profile already exists
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone', phone)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error checking profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let userId = profile?.id;
    let isNewUser = false;

    // If profile doesn't exist and we have name (signup), create new user
    if (!profile && name) {
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        phone,
        email,
        user_metadata: { name },
        email_confirm: true,
        phone_confirm: true
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        return new Response(
          JSON.stringify({ error: 'Failed to create user account' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      userId = authData.user.id;

      // Create profile
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          name,
          phone,
          email,
          otp_verified: true
        });

      if (createProfileError) {
        console.error('Error creating profile:', createProfileError);
        return new Response(
          JSON.stringify({ error: 'Failed to create user profile' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      isNewUser = true;
    } else if (profile) {
      // Update existing profile to mark as verified
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ otp_verified: true })
        .eq('id', profile.id);

      if (updateProfileError) {
        console.error('Error updating profile:', updateProfileError);
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'User not found. Please sign up first.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate session token for the user
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email || `${phone}@temp.jain-sangha.com`,
      options: {
        redirectTo: `${req.headers.get('origin') || 'http://localhost:3000'}/`
      }
    });

    if (sessionError) {
      console.error('Error generating session:', sessionError);
      return new Response(
        JSON.stringify({ error: 'Failed to create session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('OTP verified successfully:', { phone, userId, isNewUser });

    return new Response(
      JSON.stringify({ 
        message: 'OTP verified successfully',
        user_id: userId,
        is_new_user: isNewUser,
        session_url: sessionData.properties?.action_link
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in verify_otp function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});