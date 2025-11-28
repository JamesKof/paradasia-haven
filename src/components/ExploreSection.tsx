import { MapPin, Camera, Heart, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import explore1 from "@/assets/explore-1.jpg";
import explore2 from "@/assets/explore-2.jpg";

const experiences = [
  {
    title: "Sunset River Cruises",
    description: "Romantic boat rides through the serene Big Ada estuary at golden hour.",
    icon: Heart,
  },
  {
    title: "Island Hopping",
    description: "Explore hidden beaches and untouched natural wonders.",
    icon: Compass,
  },
  {
    title: "Photography Tours",
    description: "Capture stunning landscapes with our expert guides.",
    icon: Camera,
  },
  {
    title: "Aqua Safari Proximity",
    description: "Easy access to Ghana's premier water sports destination.",
    icon: MapPin,
  },
];

export const ExploreSection = () => {
  return (
    <section id="explore" className="section-padding bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-brand-orange text-sm tracking-widest uppercase mb-4">
            Explore Big Ada
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6">
            Adventures in
            <span className="text-orange-gradient block">Paradise</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the magic of Big Ada — from tranquil river cruises to thrilling 
            water adventures, all within reach of Paradasia Hideway.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden shadow-elevation-4 h-[350px]">
                <img
                  src={explore1}
                  alt="Romantic sunset cruise"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-elevation-4 h-[350px] mt-8">
                <img
                  src={explore2}
                  alt="Beautiful beach at sunrise"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            
            {/* Decorative Element */}
            <div className="absolute -bottom-4 -left-4 w-32 h-32 border-2 border-brand-blue/20 rounded-full -z-10" />
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-orange/10 rounded-full -z-10" />
          </div>

          {/* Experiences */}
          <div>
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div
                  key={exp.title}
                  className="group flex gap-5 p-5 bg-card rounded-xl border border-border hover:border-brand-orange/30 transition-all duration-300 shadow-elevation-1 hover:shadow-elevation-3"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-orange-dark to-brand-orange flex items-center justify-center shrink-0 group-hover:shadow-orange-glow transition-shadow duration-300">
                    <exp.icon className="w-7 h-7 text-brand-blue-dark" />
                  </div>
                  <div>
                    <h3 className="font-display text-foreground text-lg mb-1 group-hover:text-brand-blue transition-colors duration-300">
                      {exp.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="orange" size="lg" className="mt-8">
              Plan Your Adventure
            </Button>
          </div>
        </div>

        {/* Highlight Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-brand-blue-dark p-8 md:p-12 shadow-elevation-5">
          <div className="relative z-10 text-center">
            <h3 className="font-display text-2xl md:text-3xl text-brand-sky-light mb-4">
              Romantic & Adventure Packages Available
            </h3>
            <p className="text-brand-sky/80 mb-6 max-w-2xl mx-auto">
              Whether you're celebrating love or seeking thrills, our curated packages 
              offer unforgettable experiences tailored to your desires.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="orange">Romantic Getaway</Button>
              <Button variant="hero-outline">Adventure Package</Button>
            </div>
          </div>
          
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-ocean/10 rounded-full blur-2xl" />
        </div>
      </div>
    </section>
  );
};
