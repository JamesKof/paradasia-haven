import { z } from "zod";

// Contact form validation
export const contactFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "First name contains invalid characters"),
  lastName: z
    .string()
    .trim()
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]*$/, "Last name contains invalid characters")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^[\d\s+()-]*$/, "Phone number contains invalid characters")
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .trim()
    .max(100, "Subject must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Booking form validation
export const bookingFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "First name contains invalid characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Last name contains invalid characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^[\d\s+()-]*$/, "Phone number contains invalid characters")
    .optional()
    .or(z.literal("")),
  checkIn: z
    .string()
    .min(1, "Check-in date is required"),
  checkOut: z
    .string()
    .min(1, "Check-out date is required"),
  guests: z
    .number()
    .int()
    .min(1, "At least 1 guest required")
    .max(10, "Maximum 10 guests allowed"),
  specialRequests: z
    .string()
    .trim()
    .max(500, "Special requests must be less than 500 characters")
    .optional()
    .or(z.literal("")),
}).refine((data) => {
  if (data.checkIn && data.checkOut) {
    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);
    return checkOutDate > checkInDate;
  }
  return true;
}, {
  message: "Check-out date must be after check-in date",
  path: ["checkOut"],
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;
