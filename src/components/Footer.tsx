import { Heart } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-deep-blue border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-dark via-gold to-gold-light flex items-center justify-center">
              <span className="font-display text-deep-blue text-lg font-bold">P</span>
            </div>
            <div>
              <span className="font-display text-gold text-lg">Paradasia Hideway</span>
              <p className="text-gold-muted/70 text-xs">Your Island Sanctuary</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a href="#about" className="text-gold-muted hover:text-gold transition-colors">
              About
            </a>
            <a href="#accommodation" className="text-gold-muted hover:text-gold transition-colors">
              Rooms
            </a>
            <a href="#amenities" className="text-gold-muted hover:text-gold transition-colors">
              Amenities
            </a>
            <a href="#contact" className="text-gold-muted hover:text-gold transition-colors">
              Contact
            </a>
            <a href="#" className="text-gold-muted hover:text-gold transition-colors">
              Privacy Policy
            </a>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2 text-gold-muted/70 text-sm">
            <span>© {currentYear} Paradasia Hideway</span>
            <Heart className="w-4 h-4 text-gold fill-gold" />
          </div>
        </div>
      </div>
    </footer>
  );
};
