import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import logo from "@/assets/logo.png";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Accommodation", href: "#accommodation" },
  { name: "Gallery", href: "/gallery", isRoute: true },
  { name: "Explore", href: "#explore" },
  { name: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-elevation-4"
          : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3">
            <img src={logo} alt="Paradasia Hideway" className="h-14 w-auto" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.isRoute ? (
                <span
                  key={link.name}
                  onClick={() => navigate(link.href)}
                  className="px-4 py-2 text-brand-blue hover:text-brand-orange transition-colors duration-300 text-sm font-medium orange-underline cursor-pointer"
                >
                  {link.name}
                </span>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 text-brand-blue hover:text-brand-orange transition-colors duration-300 text-sm font-medium orange-underline"
                >
                  {link.name}
                </a>
              )
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-brand-orange hover:text-brand-orange-dark"
                    onClick={() => navigate("/admin")}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-brand-blue hover:text-brand-orange"
                  onClick={() => navigate("/profile")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-brand-blue hover:text-brand-orange"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-brand-blue hover:text-brand-orange"
                onClick={() => navigate("/auth")}
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}
            <a href="#accommodation">
              <Button variant="orange" size="default">
                Book Now
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-brand-blue p-2 hover:bg-brand-blue/10 rounded-lg transition-colors"
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
          <div className="flex flex-col gap-2 pt-4 border-t border-brand-blue/20">
            {navLinks.map((link) =>
              link.isRoute ? (
                <span
                  key={link.name}
                  onClick={() => {
                    navigate(link.href);
                    setIsOpen(false);
                  }}
                  className="px-4 py-3 text-brand-blue hover:text-brand-orange hover:bg-brand-orange/10 rounded-lg transition-all duration-300 cursor-pointer"
                >
                  {link.name}
                </span>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-brand-blue hover:text-brand-orange hover:bg-brand-orange/10 rounded-lg transition-all duration-300"
                >
                  {link.name}
                </a>
              )
            )}
            <div className="flex flex-col gap-3 mt-4 px-4">
              {user ? (
                <>
                  {isAdmin && (
                    <Button variant="outline" className="w-full text-brand-orange border-brand-orange" onClick={() => navigate("/admin")}>
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </Button>
                  )}
                  <Button variant="outline" className="w-full text-brand-blue border-brand-blue" onClick={() => navigate("/profile")}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  <Button variant="ghost" className="w-full text-brand-blue" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button variant="outline" className="w-full text-brand-blue border-brand-blue" onClick={() => navigate("/auth")}>
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
              <a href="#accommodation" onClick={() => setIsOpen(false)}>
                <Button variant="orange" className="w-full">
                  Book Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
