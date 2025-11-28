import { Heart } from "lucide-react";
import logo from "@/assets/logo.png";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-blue-dark border-t border-brand-blue">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Paradasia Hideway" className="h-12 w-auto" />
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a href="#about" className="text-brand-sky hover:text-brand-orange transition-colors">
              About
            </a>
            <a href="#accommodation" className="text-brand-sky hover:text-brand-orange transition-colors">
              Rooms
            </a>
            <a href="#amenities" className="text-brand-sky hover:text-brand-orange transition-colors">
              Amenities
            </a>
            <a href="#contact" className="text-brand-sky hover:text-brand-orange transition-colors">
              Contact
            </a>
            <a href="#" className="text-brand-sky hover:text-brand-orange transition-colors">
              Privacy Policy
            </a>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2 text-brand-sky/70 text-sm">
            <span>© {currentYear} Paradasia Hideway</span>
            <Heart className="w-4 h-4 text-brand-orange fill-brand-orange" />
          </div>
        </div>
      </div>
    </footer>
  );
};
