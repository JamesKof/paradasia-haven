import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-paystack-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload = await req.json();
    console.log("Paystack webhook event:", payload.event);

    if (payload.event === "charge.success") {
      const data = payload.data;
      const metadata = data.metadata;
      
      console.log("Processing successful payment:", data.reference);

      // Create booking record
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: metadata.user_id,
          email: data.customer.email,
          first_name: metadata.first_name,
          last_name: metadata.last_name,
          phone: metadata.phone || null,
          room_type: metadata.room_type,
          room_price: metadata.room_price,
          check_in: metadata.check_in,
          check_out: metadata.check_out,
          guests: metadata.guests,
          special_requests: metadata.special_requests || null,
          booking_status: "confirmed",
          payment_status: "paid",
          payment_reference: data.reference,
          total_amount: data.amount / 100, // Convert from pesewas
        })
        .select()
        .single();

      if (bookingError) {
        console.error("Error creating booking:", bookingError);
        throw bookingError;
      }

      console.log("Booking created:", booking.id);

      // Send confirmation email via send-email function
      try {
        const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            type: "booking_confirmation",
            booking: booking,
          }),
        });
        console.log("Confirmation email sent:", await emailResponse.json());
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
