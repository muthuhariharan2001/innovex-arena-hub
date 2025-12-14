import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ApplicationNotificationRequest {
  type: "internship" | "career";
  applicantName: string;
  applicantEmail: string;
  position: string;
  college: string;
  phone: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, applicantName, applicantEmail, position, college, phone }: ApplicationNotificationRequest = await req.json();

    console.log(`Processing ${type} application notification for: ${applicantName}`);

    // Send notification to admin
    const adminEmail = "innovexarena@gmail.com";
    
    const adminEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Innovex Arena <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `New ${type === "internship" ? "Internship" : "Career"} Application: ${applicantName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #6366f1;">New ${type === "internship" ? "Internship" : "Career"} Application</h1>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #334155;">Applicant Details</h2>
              <p><strong>Name:</strong> ${applicantName}</p>
              <p><strong>Email:</strong> ${applicantEmail}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Position:</strong> ${position}</p>
              <p><strong>College:</strong> ${college}</p>
            </div>
            
            <p style="color: #64748b;">
              Login to your admin dashboard to review this application.
            </p>
            
            <p style="color: #94a3b8; font-size: 12px; margin-top: 30px;">
              This is an automated notification from Innovex Arena.
            </p>
          </div>
        `,
      }),
    });

    const adminEmailData = await adminEmailRes.json();
    console.log("Admin notification sent:", adminEmailData);

    // Send confirmation to applicant
    const applicantEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Innovex Arena <onboarding@resend.dev>",
        to: [applicantEmail],
        subject: `Application Received - ${position} at Innovex Arena`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #6366f1;">Thank You for Applying!</h1>
            
            <p>Dear ${applicantName},</p>
            
            <p>We have received your ${type === "internship" ? "internship" : "career"} application for the <strong>${position}</strong> position at Innovex Arena.</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #334155;">What's Next?</h3>
              <ul style="color: #475569;">
                <li>Our team will review your application carefully</li>
                <li>If shortlisted, we'll contact you within 7-10 business days</li>
                <li>Keep an eye on your email for updates</li>
              </ul>
            </div>
            
            <p>If you have any questions, feel free to reach out to us at innovexarena@gmail.com</p>
            
            <p>Best regards,<br><strong>Innovex Arena Team</strong></p>
            
            <p style="color: #94a3b8; font-size: 12px; margin-top: 30px;">
              Fueling the future of Creators | www.innovexarena.com
            </p>
          </div>
        `,
      }),
    });

    const applicantEmailData = await applicantEmailRes.json();
    console.log("Applicant confirmation sent:", applicantEmailData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmail: adminEmailData,
        applicantEmail: applicantEmailData 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in notify-application function:", error);
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
