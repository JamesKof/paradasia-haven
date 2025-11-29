import { Heart, Compass, Waves, Home } from "lucide-react";
import paradasiaSunset from "@/assets/paradasia-sunset-1.jpg";

const features = [
  {
    icon: Heart,
    title: "Romantic Retreat",
    description: "Perfect hideaway for love birds seeking intimate moments amidst nature's beauty.",
  },
  {
    icon: Compass,
    title: "Adventure Awaits",
    description: "Explore aquatic wonders, island trails, and unforgettable experiences.",
  },
  {
    icon: Waves,
    title: "Aquatic Serenity",
    description: "Surrounded by serene waters and the gentle rhythm of nature.",
  },
  {
    icon: Home,
    title: "Home Away",
    description: "Experience warm Ghanaian hospitality in a luxurious setting.",
  },
];

export const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-elevation-5">
              <img
                src={paradasiaSunset}
                alt="Paradasia Hideway sunset view over Big Ada"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-dark/60 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-8 -right-8 bg-card rounded-2xl p-6 shadow-elevation-5 max-w-[280px] border border-brand-orange/20">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-orange-dark to-brand-orange flex items-center justify-center">
                  <span className="font-display text-brand-blue-dark text-2xl font-bold">5★</span>
                </div>
                <div>
                  <p className="font-display text-foreground text-lg">Luxury Experience</p>
                  <p className="text-muted-foreground text-sm">Near Aqua Safari</p>
                </div>
              </div>
            </div>
            
            {/* Decorative Border */}
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-brand-blue/20 rounded-2xl -z-10" />
          </div>

          {/* Content Side */}
          <div>
            <span className="inline-block text-brand-orange text-sm tracking-widest uppercase mb-4">
              Welcome to Paradise
            </span>
            
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6 leading-tight">
              Where Tradition Meets
              <span className="text-orange-gradient block">Elegance</span>
            </h2>
            
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Nestled in the heart of Big Ada, Ghana, Paradasia Hideway is a luxury island escape 
              positioned close to the renowned Aqua Safari. Our sanctuary offers the perfect blend 
              of Pan-African luxury and aquatic serenity — ideal for couples, adventurers, and 
              nature lovers seeking an unforgettable experience.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group p-5 rounded-xl bg-muted/50 hover:bg-brand-orange/5 border border-transparent hover:border-brand-orange/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-orange-dark to-brand-orange flex items-center justify-center mb-4 group-hover:shadow-orange-glow transition-shadow duration-300">
                    <feature.icon className="w-6 h-6 text-brand-blue-dark" />
                  </div>
                  <h3 className="font-display text-foreground text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
