import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Accommodation", href: "#accommodation" },
  { name: "Amenities", href: "#amenities" },
  { name: "Explore", href: "#explore" },
  { name: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-deep-blue/95 backdrop-blur-md shadow-elevation-4"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-dark via-gold to-gold-light flex items-center justify-center shadow-elevation-3">
              <span className="font-display text-deep-blue text-xl font-bold">P</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-gold text-xl tracking-wide">Paradasia</span>
              <span className="block text-gold-muted text-xs tracking-widest uppercase">Hideway</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-gold-muted hover:text-gold transition-colors duration-300 text-sm font-medium gold-underline"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-gold-muted hover:text-gold">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button variant="gold" size="default">
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-gold p-2 hover:bg-gold/10 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ${
            isOpen ? "max-h-[500px] pb-6" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-2 pt-4 border-t border-gold/20">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 text-gold-muted hover:text-gold hover:bg-gold/10 rounded-lg transition-all duration-300"
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col gap-3 mt-4 px-4">
              <Button variant="outline" className="w-full">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button variant="gold" className="w-full">
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
