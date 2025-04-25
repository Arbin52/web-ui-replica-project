
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Create a Supabase client with the Deno runtime
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://kcdwbytjiklqpdqlehei.supabase.co"
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    
    if (!supabaseServiceKey) {
      throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY")
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Send email using Supabase's built-in email service
    const { error: emailError } = await supabase.auth.admin.sendRawEmail({
      email,
      subject: "New Login to WiFi Security Auditing",
      body: `
        <h2>New Login Detected</h2>
        <p>Hi there,</p>
        <p>A new login to your WiFi Security Auditing account was just detected.</p>
        <p>Time: ${new Date().toUTCString()}</p>
        <p>If this was you, no action is needed. If you did not login, please reset your password immediately.</p>
        <p>Best regards,<br>WiFi Security Auditing Team</p>
      `
    })

    if (emailError) {
      throw emailError
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error sending notification email:", error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
