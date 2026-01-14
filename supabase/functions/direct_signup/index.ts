import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, phone, email } = await req.json();

    if (!name || !phone || !email) {
      return new Response(
        JSON.stringify({ error: "Name, phone, and email are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if user already exists by phone or email
    const { data: existingProfileByPhone } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();

    if (existingProfileByPhone) {
      return new Response(
        JSON.stringify({ 
          error: "User with this phone number already exists", 
          type: "phone_exists",
          redirectToLogin: true 
        }),
        { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { data: existingProfileByEmail } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (existingProfileByEmail) {
      return new Response(
        JSON.stringify({ 
          error: "User with this email already exists", 
          type: "email_exists",
          redirectToLogin: true 
        }),
        { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create auth user with email (passwordless)
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name: name,
        phone: phone
      }
    });

    if (authError) {
      console.error("Error creating auth user:", authError);
      
      // Handle specific auth errors
      if (authError.message?.includes("already been registered") || authError.code === "email_exists") {
        return new Response(
          JSON.stringify({ error: "An account with this email already exists" }),
          { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `Failed to create account: ${authError.message}` }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!authUser.user) {
      return new Response(
        JSON.stringify({ error: "Failed to create user account" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authUser.user.id,
        name: name,
        phone: phone,
        email: email,
        otp_verified: true, // Since we're not using OTP
      });

    if (profileError) {
      console.error("Error creating profile:", profileError);
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authUser.user.id);
      return new Response(
        JSON.stringify({ error: "Failed to create user profile" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate magic link for instant auto-login - use production URL
    const productionUrl = 'https://jain-fast-sangha.lovable.app';
    const { data: magicLinkData, error: magicLinkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: productionUrl
      }
    });

    if (magicLinkError) {
      console.error("Error generating magic link:", magicLinkError);
      // Don't fail signup if magic link fails - user can login manually later
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: authUser.user.id,
          email: email,
          name: name,
          phone: phone,
        },
        login_url: magicLinkData?.properties?.action_link || null,
        message: "Account created successfully! You'll be logged in automatically."
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error) {
    console.error("Error in direct_signup function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});