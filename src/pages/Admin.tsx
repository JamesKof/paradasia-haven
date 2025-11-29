import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Calendar, MessageSquare, Users, TrendingUp, 
  ArrowLeft, LogOut, DollarSign, CheckCircle, XCircle, Clock,
  Eye, Trash2, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

interface Booking {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  room_type: "presidential" | "standard";
  room_price: number;
  check_in: string;
  check_out: string;
  guests: number;
  booking_status: "pending" | "confirmed" | "cancelled" | "completed";
  payment_status: "pending" | "paid" | "refunded" | "failed";
  total_amount: number;
  created_at: string;
  special_requests: string | null;
  payment_reference: string | null;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

interface Analytics {
  totalBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  cancelledBookings: number;
  newInquiries: number;
}

const Admin = () => {
  const { user, signOut } = useAuth();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    newInquiries: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!isAdminLoading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAdmin, isAdminLoading, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);

      // Fetch inquiries
      const { data: inquiriesData, error: inquiriesError } = await supabase
        .from("guest_inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (inquiriesError) throw inquiriesError;
      setInquiries(inquiriesData || []);

      // Calculate analytics
      const allBookings = bookingsData || [];
      const allInquiries = inquiriesData || [];
      
      setAnalytics({
        totalBookings: allBookings.length,
        confirmedBookings: allBookings.filter(b => b.booking_status === "confirmed").length,
        totalRevenue: allBookings
          .filter(b => b.payment_status === "paid")
          .reduce((sum, b) => sum + b.total_amount, 0),
        pendingBookings: allBookings.filter(b => b.booking_status === "pending").length,
        cancelledBookings: allBookings.filter(b => b.booking_status === "cancelled").length,
        newInquiries: allInquiries.filter(i => i.status === "new").length,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: "pending" | "confirmed" | "cancelled" | "completed") => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ booking_status: status })
        .eq("id", bookingId);

      if (error) throw error;

      setBookings(prev => 
        prev.map(b => b.id === bookingId ? { ...b, booking_status: status } : b)
      );
      toast({ title: "Success", description: "Booking status updated." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };

  const updateInquiryStatus = async (inquiryId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("guest_inquiries")
        .update({ status })
        .eq("id", inquiryId);

      if (error) throw error;

      setInquiries(prev => 
        prev.map(i => i.id === inquiryId ? { ...i, status } : i)
      );
      toast({ title: "Success", description: "Inquiry status updated." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };

  const deleteInquiry = async (inquiryId: string) => {
    try {
      const { error } = await supabase
        .from("guest_inquiries")
        .delete()
        .eq("id", inquiryId);

      if (error) throw error;

      setInquiries(prev => prev.filter(i => i.id !== inquiryId));
      toast({ title: "Success", description: "Inquiry deleted." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete inquiry.", variant: "destructive" });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "paid":
      case "resolved":
        return "bg-green-500/20 text-green-400";
      case "pending":
      case "new":
        return "bg-yellow-500/20 text-yellow-400";
      case "cancelled":
      case "failed":
        return "bg-red-500/20 text-red-400";
      case "completed":
      case "in_progress":
        return "bg-brand-sky/20 text-brand-sky";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (isAdminLoading || isLoading) {
    return (
      <div className="min-h-screen bg-brand-blue-dark flex items-center justify-center">
        <div className="text-brand-sky">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-brand-blue-dark">
      {/* Header */}
      <header className="bg-brand-blue-light/50 border-b border-brand-blue sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src={logo} alt="Paradasia Hideway" className="h-10" />
            <span className="text-brand-orange font-semibold">Admin</span>
          </a>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={fetchData} className="text-brand-sky hover:text-brand-orange">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="text-brand-sky hover:text-brand-orange">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-brand-sky hover:text-brand-orange transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </a>

        <h1 className="font-display text-3xl text-brand-sky-light mb-8">Admin Dashboard</h1>

        {/* Analytics Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-brand-blue-light rounded-xl p-6 border border-brand-blue">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-brand-orange/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-brand-orange" />
              </div>
              <div>
                <p className="text-brand-sky/70 text-sm">Total Bookings</p>
                <p className="text-brand-sky-light text-2xl font-bold">{analytics.totalBookings}</p>
              </div>
            </div>
          </div>
          <div className="bg-brand-blue-light rounded-xl p-6 border border-brand-blue">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-brand-sky/70 text-sm">Confirmed</p>
                <p className="text-brand-sky-light text-2xl font-bold">{analytics.confirmedBookings}</p>
              </div>
            </div>
          </div>
          <div className="bg-brand-blue-light rounded-xl p-6 border border-brand-blue">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-brand-sky/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-brand-sky" />
              </div>
              <div>
                <p className="text-brand-sky/70 text-sm">Revenue</p>
                <p className="text-brand-sky-light text-2xl font-bold">GH₵{analytics.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-brand-blue-light rounded-xl p-6 border border-brand-blue">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-brand-sky/70 text-sm">New Inquiries</p>
                <p className="text-brand-sky-light text-2xl font-bold">{analytics.newInquiries}</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="bg-brand-blue-light border border-brand-blue">
            <TabsTrigger
              value="bookings"
              className="data-[state=active]:bg-brand-orange data-[state=active]:text-brand-blue-dark"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger
              value="inquiries"
              className="data-[state=active]:bg-brand-orange data-[state=active]:text-brand-blue-dark"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Inquiries
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <div className="bg-brand-blue-light rounded-2xl border border-brand-blue overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-brand-blue">
                      <th className="px-4 py-3 text-left text-brand-sky text-sm font-medium">Guest</th>
                      <th className="px-4 py-3 text-left text-brand-sky text-sm font-medium">Room</th>
                      <th className="px-4 py-3 text-left text-brand-sky text-sm font-medium">Dates</th>
                      <th className="px-4 py-3 text-left text-brand-sky text-sm font-medium">Amount</th>
                      <th className="px-4 py-3 text-left text-brand-sky text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-brand-sky text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-brand-blue/50 hover:bg-brand-blue-dark/30">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-brand-sky-light font-medium">{booking.first_name} {booking.last_name}</p>
                            <p className="text-brand-sky/70 text-sm">{booking.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-brand-sky-light capitalize">
                            {booking.room_type === "presidential" ? "Presidential Suite" : "Standard Room"}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-brand-sky-light text-sm">{formatDate(booking.check_in)}</p>
                          <p className="text-brand-sky/70 text-sm">{formatDate(booking.check_out)}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-brand-orange font-bold">GH₵{booking.total_amount.toLocaleString()}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(booking.booking_status)}`}>
                              {booking.booking_status}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(booking.payment_status)}`}>
                              {booking.payment_status}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedBooking(booking)}
                              className="text-brand-sky hover:text-brand-orange"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {booking.booking_status === "pending" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateBookingStatus(booking.id, "confirmed")}
                                className="text-green-400 hover:text-green-300"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            {booking.booking_status === "confirmed" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateBookingStatus(booking.id, "completed")}
                                className="text-brand-sky hover:text-brand-sky-light"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {bookings.length === 0 && (
                <div className="p-12 text-center text-brand-sky/70">
                  No bookings found.
                </div>
              )}
            </div>
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries">
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="bg-brand-blue-light rounded-xl p-6 border border-brand-blue"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-brand-sky-light font-semibold">{inquiry.subject}</h3>
                      <p className="text-brand-sky/70 text-sm">{inquiry.name} • {inquiry.email}</p>
                      {inquiry.phone && <p className="text-brand-sky/70 text-sm">{inquiry.phone}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status}
                      </span>
                      <span className="text-brand-sky/50 text-xs">{formatDateTime(inquiry.created_at)}</span>
                    </div>
                  </div>
                  <p className="text-brand-sky-light mb-4">{inquiry.message}</p>
                  <div className="flex gap-2">
                    {inquiry.status === "new" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateInquiryStatus(inquiry.id, "in_progress")}
                      >
                        Mark In Progress
                      </Button>
                    )}
                    {inquiry.status === "in_progress" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateInquiryStatus(inquiry.id, "resolved")}
                      >
                        Mark Resolved
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteInquiry(inquiry.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {inquiries.length === 0 && (
                <div className="bg-brand-blue-light rounded-xl p-12 border border-brand-blue text-center text-brand-sky/70">
                  No inquiries found.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-brand-blue-dark/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-blue-light rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 border border-brand-blue">
            <div className="flex items-start justify-between mb-6">
              <h2 className="font-display text-xl text-brand-sky-light">Booking Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(null)}>
                <XCircle className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-brand-sky/70 text-sm">Guest Name</p>
                  <p className="text-brand-sky-light">{selectedBooking.first_name} {selectedBooking.last_name}</p>
                </div>
                <div>
                  <p className="text-brand-sky/70 text-sm">Email</p>
                  <p className="text-brand-sky-light">{selectedBooking.email}</p>
                </div>
                <div>
                  <p className="text-brand-sky/70 text-sm">Phone</p>
                  <p className="text-brand-sky-light">{selectedBooking.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-brand-sky/70 text-sm">Room</p>
                  <p className="text-brand-sky-light capitalize">
                    {selectedBooking.room_type === "presidential" ? "Presidential Suite" : "Standard Room"}
                  </p>
                </div>
                <div>
                  <p className="text-brand-sky/70 text-sm">Check-in</p>
                  <p className="text-brand-sky-light">{formatDate(selectedBooking.check_in)}</p>
                </div>
                <div>
                  <p className="text-brand-sky/70 text-sm">Check-out</p>
                  <p className="text-brand-sky-light">{formatDate(selectedBooking.check_out)}</p>
                </div>
                <div>
                  <p className="text-brand-sky/70 text-sm">Guests</p>
                  <p className="text-brand-sky-light">{selectedBooking.guests}</p>
                </div>
                <div>
                  <p className="text-brand-sky/70 text-sm">Total Amount</p>
                  <p className="text-brand-orange font-bold">GH₵{selectedBooking.total_amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-brand-sky/70 text-sm">Booking Status</p>
                  <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(selectedBooking.booking_status)}`}>
                    {selectedBooking.booking_status}
                  </span>
                </div>
                <div>
                  <p className="text-brand-sky/70 text-sm">Payment Status</p>
                  <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(selectedBooking.payment_status)}`}>
                    {selectedBooking.payment_status}
                  </span>
                </div>
              </div>
              
              {selectedBooking.special_requests && (
                <div>
                  <p className="text-brand-sky/70 text-sm">Special Requests</p>
                  <p className="text-brand-sky-light">{selectedBooking.special_requests}</p>
                </div>
              )}
              
              {selectedBooking.payment_reference && (
                <div>
                  <p className="text-brand-sky/70 text-sm">Payment Reference</p>
                  <p className="text-brand-sky-light font-mono text-sm">{selectedBooking.payment_reference}</p>
                </div>
              )}
              
              <div>
                <p className="text-brand-sky/70 text-sm">Booked On</p>
                <p className="text-brand-sky-light">{formatDateTime(selectedBooking.created_at)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
