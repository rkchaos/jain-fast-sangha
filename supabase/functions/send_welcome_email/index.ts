import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name }: WelcomeEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Tapasya Tracker <onboarding@resend.dev>",
      to: [email],
      subject: "🙏 Welcome to Tapasya Tracker - Jai Jinendra!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d97706; margin-bottom: 10px;">🙏 Jai Jinendra!</h1>
            <h2 style="color: #374151; margin-bottom: 20px;">Welcome to Tapasya Tracker</h2>
            <p style="color: #d97706; font-weight: bold; margin-bottom: 0;">जिन धर्म: जियो और जीने दो</p>
          </div>
          
          <div style="background-color: #fef3c7; border: 1px solid: #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #92400e; margin-bottom: 15px;">🧪 Important: This is a Trial Version</h3>
            <p style="color: #92400e; margin-bottom: 10px;">
              We're testing this app during Paryushan and Das Lakshan 2025 to understand if our Jain community finds it useful for tracking tapasya.
            </p>
            <p style="color: #92400e; margin-bottom: 10px;">
              <strong>Please expect:</strong>
            </p>
            <ul style="color: #92400e; margin-bottom: 10px;">
              <li>Slower loading times</li>
              <li>Email-based login (no OTP) which can be slow</li>
              <li>Limited features as we're still developing</li>
              <li>Occasional bugs or issues</li>
            </ul>
            <p style="color: #92400e;">
              Your patience and feedback are invaluable as we improve this spiritual tool for our community.
            </p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #374151;">🌟 What is Tapasya Tracker?</h3>
            <p style="color: #6b7280;">
              A simple digital companion to help you track your fasting (vrat) practices, connect with your sangha, and maintain your spiritual discipline.
            </p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #374151;">🔮 Why Tapasya in Jain Dharma?</h3>
            <p style="color: #6b7280;">
              Tapasya purifies the soul, builds self-discipline, and develops compassion for all living beings. 
              Fasting helps us control desires, purify thoughts, and advance on the spiritual path.
            </p>
          </div>
          
          <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #374151; margin-bottom: 15px;">📝 Your Feedback Matters</h3>
            <p style="color: #6b7280; margin-bottom: 15px;">
              As this is a trial, your input is crucial. Please share your thoughts, suggestions, and report any issues:
            </p>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLScA1d2Zj2yLi1VzbqOYoKVea7B4-MmtHsq1pngRQWipsU1RXQ/viewform?usp=sharing&ouid=110568833292812051355" 
               style="background-color: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Share Your Feedback
            </a>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h3 style="color: #374151;">🚀 Getting Started</h3>
            <ol style="color: #6b7280;">
              <li>Choose or create your Sangha</li>
              <li>Start tracking your daily vrat</li>
              <li>View your progress on the leaderboard</li>
              <li>Connect with your spiritual community</li>
            </ol>
          </div>
          
          <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <p style="color: #9ca3af; font-size: 14px;">
              May your spiritual journey be blessed with discipline, compassion, and inner peace.
            </p>
            <p style="color: #d97706; font-weight: bold;">
              🙏 Tapasya Tracker Team
            </p>
          </div>
        </div>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);