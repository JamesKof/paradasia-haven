import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const sendEmail = async (to: string[], subject: string, html: string, from: string = "Paradasia Hideway <bookings@resend.dev>") => {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from, to, subject, html }),
  });
  return res.json();
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Booking {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  room_type: string;
  room_price: number;
  check_in: string;
  check_out: string;
  guests: number;
  total_amount: number;
  special_requests?: string;
  payment_reference?: string;
}

interface EmailRequest {
  type: "booking_confirmation" | "booking_cancellation" | "inquiry_received";
  booking?: Booking;
  inquiry?: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getRoomName = (roomType: string) => {
  return roomType === "presidential" ? "Presidential Suite" : "Standard Room";
};

const getConfirmationEmail = (booking: Booking) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Georgia', serif; background: #0a1628; color: #ffffff; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #132033; }
    .header { background: linear-gradient(135deg, #1e4a6d, #0a1628); padding: 40px; text-align: center; }
    .header h1 { color: #f5a623; margin: 0; font-size: 32px; }
    .content { padding: 40px; }
    .booking-details { background: #0a1628; border-radius: 12px; padding: 24px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #1e4a6d; }
    .detail-label { color: #7db4d8; }
    .detail-value { color: #ffffff; font-weight: bold; }
    .total { font-size: 24px; color: #f5a623; text-align: center; margin: 20px 0; }
    .footer { background: #0a1628; padding: 30px; text-align: center; }
    .footer p { color: #7db4d8; margin: 5px 0; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌴 Paradasia Hideway</h1>
      <p style="color: #7db4d8; margin-top: 10px;">Your Booking is Confirmed!</p>
    </div>
    <div class="content">
      <p>Dear ${booking.first_name},</p>
      <p>Thank you for choosing Paradasia Hideway. We're thrilled to confirm your reservation!</p>
      
      <div class="booking-details">
        <div class="detail-row">
          <span class="detail-label">Room</span>
          <span class="detail-value">${getRoomName(booking.room_type)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Check-in</span>
          <span class="detail-value">${formatDate(booking.check_in)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Check-out</span>
          <span class="detail-value">${formatDate(booking.check_out)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Guests</span>
          <span class="detail-value">${booking.guests}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Reference</span>
          <span class="detail-value">${booking.payment_reference || booking.id}</span>
        </div>
      </div>
      
      <div class="total">
        Total: GH₵${booking.total_amount.toLocaleString()}
      </div>
      
      ${booking.special_requests ? `<p style="color: #7db4d8;"><strong>Special Requests:</strong> ${booking.special_requests}</p>` : ''}
      
      <p>We look forward to welcoming you to our paradise island getaway!</p>
      <p>Warm regards,<br>The Paradasia Hideway Team</p>
    </div>
    <div class="footer">
      <p>Big Ada Island, near Aqua Safari</p>
      <p>Greater Accra Region, Ghana</p>
      <p>📧 hello@paradasiahideway.com</p>
    </div>
  </div>
</body>
</html>
`;

const getCancellationEmail = (booking: Booking) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Georgia', serif; background: #0a1628; color: #ffffff; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #132033; }
    .header { background: linear-gradient(135deg, #8b0000, #1e4a6d); padding: 40px; text-align: center; }
    .header h1 { color: #f5a623; margin: 0; font-size: 32px; }
    .content { padding: 40px; }
    .booking-details { background: #0a1628; border-radius: 12px; padding: 24px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #1e4a6d; }
    .detail-label { color: #7db4d8; }
    .detail-value { color: #ffffff; font-weight: bold; }
    .refund-notice { background: #1e4a6d; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center; }
    .footer { background: #0a1628; padding: 30px; text-align: center; }
    .footer p { color: #7db4d8; margin: 5px 0; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌴 Paradasia Hideway</h1>
      <p style="color: #ff6b6b; margin-top: 10px;">Booking Cancellation</p>
    </div>
    <div class="content">
      <p>Dear ${booking.first_name},</p>
      <p>Your booking has been cancelled as requested.</p>
      
      <div class="booking-details">
        <div class="detail-row">
          <span class="detail-label">Room</span>
          <span class="detail-value">${getRoomName(booking.room_type)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Original Check-in</span>
          <span class="detail-value">${formatDate(booking.check_in)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Original Check-out</span>
          <span class="detail-value">${formatDate(booking.check_out)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Amount</span>
          <span class="detail-value">GH₵${booking.total_amount.toLocaleString()}</span>
        </div>
      </div>
      
      <div class="refund-notice">
        <p style="margin: 0; color: #f5a623;">💳 Refund Information</p>
        <p style="margin: 10px 0 0 0; color: #ffffff;">Your refund will be processed within 5-7 business days.</p>
      </div>
      
      <p>We hope to welcome you another time. If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>The Paradasia Hideway Team</p>
    </div>
    <div class="footer">
      <p>Big Ada Island, near Aqua Safari</p>
      <p>Greater Accra Region, Ghana</p>
      <p>📧 hello@paradasiahideway.com</p>
    </div>
  </div>
</body>
</html>
`;

const getAdminCancellationEmail = (booking: Booking) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; color: #333; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; }
    h1 { color: #8b0000; }
    .detail { margin: 10px 0; }
    .label { font-weight: bold; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚠️ Booking Cancellation Alert</h1>
    <p>A booking has been cancelled:</p>
    <div class="detail"><span class="label">Guest:</span> ${booking.first_name} ${booking.last_name}</div>
    <div class="detail"><span class="label">Email:</span> ${booking.email}</div>
    <div class="detail"><span class="label">Room:</span> ${getRoomName(booking.room_type)}</div>
    <div class="detail"><span class="label">Check-in:</span> ${formatDate(booking.check_in)}</div>
    <div class="detail"><span class="label">Check-out:</span> ${formatDate(booking.check_out)}</div>
    <div class="detail"><span class="label">Amount:</span> GH₵${booking.total_amount.toLocaleString()}</div>
    <div class="detail"><span class="label">Reference:</span> ${booking.payment_reference || booking.id}</div>
  </div>
</body>
</html>
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, booking, inquiry }: EmailRequest = await req.json();
    console.log("Sending email:", type);

    let emailResult;

    switch (type) {
      case "booking_confirmation":
        if (!booking) throw new Error("Booking data required");
        emailResult = await sendEmail(
          [booking.email],
          `🌴 Booking Confirmed - ${getRoomName(booking.room_type)}`,
          getConfirmationEmail(booking)
        );
        break;

      case "booking_cancellation":
        if (!booking) throw new Error("Booking data required");
        // Send to guest
        emailResult = await sendEmail(
          [booking.email],
          `Booking Cancelled - Paradasia Hideway`,
          getCancellationEmail(booking)
        );
        // Send to admin
        await sendEmail(
          ["admin@paradasiahideway.com"],
          `⚠️ Booking Cancellation - ${booking.first_name} ${booking.last_name}`,
          getAdminCancellationEmail(booking)
        );
        break;

      case "inquiry_received":
        if (!inquiry) throw new Error("Inquiry data required");
        emailResult = await sendEmail(
          [inquiry.email],
          `We received your message - Paradasia Hideway`,
          `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #132033; color: white; padding: 40px;">
              <h1 style="color: #f5a623;">🌴 Paradasia Hideway</h1>
              <p>Dear ${inquiry.name},</p>
              <p>Thank you for reaching out to us. We have received your message regarding "${inquiry.subject}" and will respond within 24 hours.</p>
              <p>Best regards,<br>The Paradasia Hideway Team</p>
            </div>
          `,
          "Paradasia Hideway <inquiries@resend.dev>"
        );
        break;

      default:
        throw new Error("Invalid email type");
    }

    console.log("Email sent successfully:", emailResult);
    return new Response(JSON.stringify({ success: true, result: emailResult }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Email error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
