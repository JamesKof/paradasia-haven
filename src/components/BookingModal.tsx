import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, X, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomType: "presidential" | "standard";
  roomName: string;
  pricePerNight: number;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        ref: string;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

export const BookingModal = ({
  isOpen,
  onClose,
  roomType,
  roomName,
  pricePerNight,
}: BookingModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const nights = calculateNights();
  const totalAmount = nights * pricePerNight;

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to make a booking.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!checkIn || !checkOut || nights <= 0) {
      toast({
        title: "Invalid Dates",
        description: "Please select valid check-in and check-out dates.",
        variant: "destructive",
      });
      return;
    }

    if (!firstName || !lastName || !email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Generate payment reference
    const paymentRef = `PH-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Initialize Paystack
    const handler = window.PaystackPop.setup({
      key: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // This will be replaced with actual publishable key
      email: email,
      amount: totalAmount * 100, // Paystack uses pesewas/kobo
      currency: "GHS",
      ref: paymentRef,
      callback: async (response) => {
        // Payment successful, create booking
        try {
          const { error } = await supabase.from("bookings").insert({
            user_id: user.id,
            email,
            first_name: firstName,
            last_name: lastName,
            phone,
            room_type: roomType,
            room_price: pricePerNight,
            check_in: checkIn,
            check_out: checkOut,
            guests,
            special_requests: specialRequests || null,
            booking_status: "confirmed",
            payment_status: "paid",
            payment_reference: response.reference,
            total_amount: totalAmount,
          });

          if (error) throw error;

          toast({
            title: "Booking Confirmed!",
            description: "Your reservation has been confirmed. Check your email for details.",
          });
          onClose();
          navigate("/profile");
        } catch (error) {
          console.error("Error creating booking:", error);
          toast({
            title: "Booking Error",
            description: "Payment successful but booking failed. Please contact support.",
            variant: "destructive",
          });
        }
        setIsProcessing(false);
      },
      onClose: () => {
        setIsProcessing(false);
        toast({
          title: "Payment Cancelled",
          description: "You cancelled the payment. Your booking was not completed.",
        });
      },
    });

    handler.openIframe();
  };

  // For demo without actual Paystack, create booking directly
  const handleDemoBooking = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to make a booking.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!checkIn || !checkOut || nights <= 0) {
      toast({
        title: "Invalid Dates",
        description: "Please select valid check-in and check-out dates.",
        variant: "destructive",
      });
      return;
    }

    if (!firstName || !lastName || !email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const paymentRef = `PH-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        room_type: roomType,
        room_price: pricePerNight,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        special_requests: specialRequests || null,
        booking_status: "pending",
        payment_status: "pending",
        payment_reference: paymentRef,
        total_amount: totalAmount,
      });

      if (error) throw error;

      toast({
        title: "Booking Created!",
        description: "Your booking is pending. Payment integration coming soon!",
      });
      onClose();
      navigate("/profile");
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast({
        title: "Booking Error",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-brand-blue-light border-brand-blue max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-brand-sky-light">
            Book {roomName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Room Info */}
          <div className="flex items-center justify-between p-4 bg-brand-blue-dark/50 rounded-lg">
            <div>
              <p className="text-brand-sky-light font-medium">{roomName}</p>
              <p className="text-brand-sky/70 text-sm">GH₵{pricePerNight.toLocaleString()} per night</p>
            </div>
            {nights > 0 && (
              <div className="text-right">
                <p className="text-brand-orange font-bold text-lg">
                  GH₵{totalAmount.toLocaleString()}
                </p>
                <p className="text-brand-sky/70 text-xs">{nights} night{nights > 1 ? "s" : ""}</p>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-brand-sky text-sm mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={today}
                className="w-full px-4 py-3 bg-brand-blue-dark border border-brand-blue rounded-lg text-brand-sky-light focus:outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="block text-brand-sky text-sm mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || today}
                className="w-full px-4 py-3 bg-brand-blue-dark border border-brand-blue rounded-lg text-brand-sky-light focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-brand-sky text-sm mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Number of Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full px-4 py-3 bg-brand-blue-dark border border-brand-blue rounded-lg text-brand-sky-light focus:outline-none focus:border-brand-orange"
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} Guest{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Guest Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-brand-sky text-sm mb-2">First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-brand-blue-dark border border-brand-blue rounded-lg text-brand-sky-light focus:outline-none focus:border-brand-orange"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label className="block text-brand-sky text-sm mb-2">Last Name *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-brand-blue-dark border border-brand-blue rounded-lg text-brand-sky-light focus:outline-none focus:border-brand-orange"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-brand-sky text-sm mb-2">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-brand-blue-dark border border-brand-blue rounded-lg text-brand-sky-light focus:outline-none focus:border-brand-orange"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-brand-sky text-sm mb-2">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-brand-blue-dark border border-brand-blue rounded-lg text-brand-sky-light focus:outline-none focus:border-brand-orange"
              placeholder="+233 XX XXX XXXX"
            />
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-brand-sky text-sm mb-2">Special Requests</label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-brand-blue-dark border border-brand-blue rounded-lg text-brand-sky-light placeholder:text-brand-sky/50 focus:outline-none focus:border-brand-orange resize-none"
              placeholder="Any special requirements..."
            />
          </div>

          {/* Book Button */}
          <Button
            variant="orange"
            size="lg"
            className="w-full"
            onClick={handleDemoBooking}
            disabled={isProcessing || nights <= 0}
          >
            <CreditCard className="w-5 h-5 mr-2" />
            {isProcessing ? "Processing..." : `Book Now - GH₵${totalAmount.toLocaleString()}`}
          </Button>

          <p className="text-brand-sky/50 text-xs text-center">
            By booking, you agree to our terms and conditions
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
