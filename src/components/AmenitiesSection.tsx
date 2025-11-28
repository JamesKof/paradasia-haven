import {
  Waves,
  Utensils,
  Music,
  Sun,
  Ship,
  Users,
  Heart,
  Sparkles,
} from "lucide-react";

const amenities = [
  {
    icon: Waves,
    title: "Waterfront Relaxation",
    description: "Private beach access with sun loungers overlooking pristine waters.",
  },
  {
    icon: Utensils,
    title: "Gourmet Dining",
    description: "Authentic Ghanaian cuisine and international delights prepared by our chefs.",
  },
  {
    icon: Music,
    title: "Live Entertainment",
    description: "Traditional music performances and cultural experiences every evening.",
  },
  {
    icon: Sun,
    title: "Beach Activities",
    description: "Sunbathing, beach volleyball, and water sports on clean, golden sands.",
  },
  {
    icon: Ship,
    title: "Boat Tours",
    description: "Guided aquatic adventures exploring the stunning Big Ada estuary.",
  },
  {
    icon: Users,
    title: "Concierge Service",
    description: "Dedicated hospitality team ensuring your every need is met.",
  },
  {
    icon: Heart,
    title: "Romantic Packages",
    description: "Special arrangements for honeymoons, anniversaries, and proposals.",
  },
  {
    icon: Sparkles,
    title: "Spa & Wellness",
    description: "Rejuvenating treatments inspired by African healing traditions.",
  },
];

export const AmenitiesSection = () => {
  return (
    <section id="amenities" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-brand-orange text-sm tracking-widest uppercase mb-4">
            Amenities
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6">
            Premium Island
            <span className="text-orange-gradient block">Experiences</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From waterfront relaxation to gourmet dining, discover everything that makes 
            Paradasia Hideway an unforgettable destination.
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((amenity, index) => (
            <div
              key={amenity.title}
              className="group relative p-6 bg-card rounded-2xl border border-border hover:border-brand-orange/30 transition-all duration-500 shadow-elevation-2 hover:shadow-elevation-4 overflow-hidden"
            >
              {/* Background Glow on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-orange-dark to-brand-orange flex items-center justify-center mb-5 group-hover:shadow-orange-glow transition-all duration-500 group-hover:scale-110">
                  <amenity.icon className="w-7 h-7 text-brand-blue-dark" />
                </div>

                {/* Content */}
                <h3 className="font-display text-foreground text-lg mb-2 group-hover:text-brand-blue transition-colors duration-300">
                  {amenity.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {amenity.description}
                </p>
              </div>

              {/* Decorative Corner */}
              <div className="absolute -bottom-2 -right-2 w-16 h-16 border border-brand-blue/10 rounded-full group-hover:border-brand-orange/30 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
