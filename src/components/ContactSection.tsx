import { useState } from "react";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";

const contactInfo = [
  {
    icon: MapPin,
    label: "Location",
    value: "Big Ada Island, near Aqua Safari",
    subtext: "Greater Accra Region, Ghana",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+233 XX XXX XXXX",
    subtext: "Available 24/7",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@paradasiahideway.com",
    subtext: "We respond within 24 hours",
  },
];

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

export const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (field: keyof ContactFormData, value: string) => {
    const partialData = { ...formData, [field]: value };
    const result = contactFormSchema.safeParse(partialData);
    
    if (!result.success) {
      const fieldError = result.error.errors.find(e => e.path[0] === field);
      if (fieldError) {
        setErrors(prev => ({ ...prev, [field]: fieldError.message }));
      } else {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    } else {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof ContactFormData) => {
    validateField(field, formData[field] || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const result = contactFormSchema.safeParse(formData);
    
    if (!result.success) {
      const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof ContactFormData;
        if (!newErrors[field]) {
          newErrors[field] = err.message;
        }
      });
      setErrors(newErrors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const validatedData = result.data;
      
      // Save inquiry to database
      const { error } = await supabase.from("guest_inquiries").insert({
        name: `${validatedData.firstName} ${validatedData.lastName || ""}`.trim(),
        email: validatedData.email,
        phone: validatedData.phone || null,
        subject: validatedData.subject || "General Inquiry",
        message: validatedData.message,
      });

      if (error) throw error;

      // Send confirmation email
      try {
        await supabase.functions.invoke("send-email", {
          body: {
            type: "inquiry_received",
            inquiry: {
              name: `${validatedData.firstName} ${validatedData.lastName || ""}`.trim(),
              email: validatedData.email,
              subject: validatedData.subject || "General Inquiry",
              message: validatedData.message,
            },
          },
        });
      } catch (emailError) {
        console.error("Email error:", emailError);
      }

      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } catch (error: any) {
      console.error("Error submitting inquiry:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-brand-blue-dark">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-brand-orange text-sm tracking-widest uppercase mb-4">
            Contact Us
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-sky-light mb-6">
            Begin Your
            <span className="text-brand-orange block">Journey</span>
          </h2>
          <p className="text-brand-sky/80 text-lg max-w-2xl mx-auto">
            Ready to experience the ultimate island escape? Reach out to us and 
            let us help you plan your perfect getaway.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-brand-blue-light rounded-2xl p-8 border border-brand-blue shadow-elevation-4">
            <h3 className="font-display text-brand-sky-light text-2xl mb-6">Send Us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-brand-sky text-sm mb-2">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    onBlur={() => handleBlur("firstName")}
                    className={`w-full px-4 py-3 bg-brand-blue-dark border rounded-lg text-brand-sky-light placeholder:text-brand-sky/50 focus:outline-none transition-all duration-300 ${
                      errors.firstName 
                        ? "border-red-500 focus:border-red-500" 
                        : "border-brand-blue focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-brand-sky text-sm mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    onBlur={() => handleBlur("lastName")}
                    className={`w-full px-4 py-3 bg-brand-blue-dark border rounded-lg text-brand-sky-light placeholder:text-brand-sky/50 focus:outline-none transition-all duration-300 ${
                      errors.lastName 
                        ? "border-red-500 focus:border-red-500" 
                        : "border-brand-blue focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-brand-sky text-sm mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`w-full px-4 py-3 bg-brand-blue-dark border rounded-lg text-brand-sky-light placeholder:text-brand-sky/50 focus:outline-none transition-all duration-300 ${
                    errors.email 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-brand-blue focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-brand-sky text-sm mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  className={`w-full px-4 py-3 bg-brand-blue-dark border rounded-lg text-brand-sky-light placeholder:text-brand-sky/50 focus:outline-none transition-all duration-300 ${
                    errors.phone 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-brand-blue focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                  }`}
                  placeholder="+233 XX XXX XXXX"
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-brand-sky text-sm mb-2">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  onBlur={() => handleBlur("subject")}
                  className={`w-full px-4 py-3 bg-brand-blue-dark border rounded-lg text-brand-sky-light placeholder:text-brand-sky/50 focus:outline-none transition-all duration-300 ${
                    errors.subject 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-brand-blue focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                  }`}
                  placeholder="Booking inquiry, Special request, etc."
                />
                {errors.subject && (
                  <p className="text-red-400 text-xs mt-1">{errors.subject}</p>
                )}
              </div>
              
              <div>
                <label className="block text-brand-sky text-sm mb-2">Message *</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  onBlur={() => handleBlur("message")}
                  className={`w-full px-4 py-3 bg-brand-blue-dark border rounded-lg text-brand-sky-light placeholder:text-brand-sky/50 focus:outline-none transition-all duration-300 resize-none ${
                    errors.message 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-brand-blue focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                  }`}
                  placeholder="Tell us about your dream getaway... (minimum 10 characters)"
                />
                {errors.message && (
                  <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                variant="orange" 
                size="lg" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  className="flex items-start gap-4 p-5 bg-brand-blue-light rounded-xl border border-brand-blue hover:border-brand-orange/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-orange-dark to-brand-orange flex items-center justify-center shrink-0">
                    <info.icon className="w-6 h-6 text-brand-blue-dark" />
                  </div>
                  <div>
                    <p className="text-brand-sky text-sm mb-1">{info.label}</p>
                    <p className="text-brand-sky-light font-medium">{info.value}</p>
                    <p className="text-brand-sky/70 text-sm">{info.subtext}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="relative h-[250px] rounded-xl overflow-hidden border border-brand-blue">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63526.91680665088!2d0.5967!3d5.8167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1020f0c6a5b8b42f%3A0x8d9e1c8a8e7f8d8e!2sBig%20Ada%2C%20Ghana!5e0!3m2!1sen!2sus!4v1234567890"
                className="w-full h-full grayscale contrast-125 opacity-80"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-dark/60 to-transparent pointer-events-none" />
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-12 h-12 rounded-full bg-brand-orange/10 hover:bg-brand-orange/20 flex items-center justify-center text-brand-orange transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
