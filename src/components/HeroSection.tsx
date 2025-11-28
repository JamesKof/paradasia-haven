import { Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

export const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Video Overlay Button */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <div className="animate-fade-in-up">
          <span className="inline-block px-6 py-2 mb-6 text-gold border border-gold/40 rounded-full text-sm tracking-widest uppercase bg-deep-blue/30 backdrop-blur-sm">
            Big Ada, Ghana
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gold-light mb-6 animate-fade-in-up animation-delay-100 leading-tight">
          Paradasia
          <span className="block text-gold">Hideway</span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-gold-muted mb-4 animate-fade-in-up animation-delay-200 font-light max-w-3xl mx-auto">
          Culture blended in tour, good food, good music, clean beaches.
        </p>

        <p className="text-base sm:text-lg text-gold-muted/80 mb-10 animate-fade-in-up animation-delay-300 max-w-2xl mx-auto">
          Your exclusive island sanctuary near Aqua Safari — where Pan-African luxury meets aquatic serenity.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
          <Button variant="hero" size="xl">
            Book Your Escape
          </Button>
          <a
            href="https://youtu.be/DJwGD0CZyrk"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="hero-outline" size="xl">
              <Play className="w-5 h-5 mr-2" />
              Watch Experience
            </Button>
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
          <a
            href="#about"
            className="flex flex-col items-center gap-2 text-gold-muted hover:text-gold transition-colors"
          >
            <span className="text-xs tracking-widest uppercase">Discover More</span>
            <ChevronDown className="w-6 h-6" />
          </a>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-gold/10 rounded-full animate-float" />
      <div className="absolute bottom-40 right-10 w-24 h-24 border border-gold/10 rounded-full animate-float animation-delay-200" />
    </section>
  );
};
