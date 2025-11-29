import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  email: string;
  amount: number;
  firstName: string;
  lastName: string;
  phone?: string;
  roomType: "presidential" | "standard";
  roomPrice: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests?: string;
  userId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      throw new Error("PAYSTACK_SECRET_KEY not configured");
    }

    const payload: PaymentRequest = await req.json();
    console.log("Processing payment for:", payload.email);

    // Initialize Paystack transaction
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: payload.email,
        amount: payload.amount * 100, // Paystack uses pesewas/kobo
        currency: "GHS",
        callback_url: `${req.headers.get("origin") || "https://paradasia.lovable.app"}/profile`,
        metadata: {
          custom_fields: [
            { display_name: "Guest Name", variable_name: "guest_name", value: `${payload.firstName} ${payload.lastName}` },
            { display_name: "Room Type", variable_name: "room_type", value: payload.roomType },
            { display_name: "Check-in", variable_name: "check_in", value: payload.checkIn },
            { display_name: "Check-out", variable_name: "check_out", value: payload.checkOut },
          ],
          user_id: payload.userId,
          room_type: payload.roomType,
          room_price: payload.roomPrice,
          check_in: payload.checkIn,
          check_out: payload.checkOut,
          guests: payload.guests,
          special_requests: payload.specialRequests,
          first_name: payload.firstName,
          last_name: payload.lastName,
          phone: payload.phone,
        },
      }),
    });

    const paystackData = await paystackResponse.json();
    console.log("Paystack response:", paystackData);

    if (!paystackData.status) {
      throw new Error(paystackData.message || "Failed to initialize payment");
    }

    return new Response(JSON.stringify({
      success: true,
      authorization_url: paystackData.data.authorization_url,
      access_code: paystackData.data.access_code,
      reference: paystackData.data.reference,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Payment initialization error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
