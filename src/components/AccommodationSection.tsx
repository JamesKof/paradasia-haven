import { Crown, Users, Bed, Wifi, Wind, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import presidentialSuite from "@/assets/presidential-suite.jpg";
import standardRoom from "@/assets/standard-room.jpg";

const rooms = [
  {
    id: "presidential",
    name: "Presidential Suite",
    price: 5000,
    image: presidentialSuite,
    description: "The epitome of luxury with panoramic ocean views, private balcony, and exclusive amenities for an unforgettable stay.",
    features: ["King Canopy Bed", "Ocean View Balcony", "Private Butler", "Premium Minibar"],
    guests: "2-4 Guests",
    icon: Crown,
  },
  {
    id: "standard",
    name: "Standard Room",
    price: 3000,
    image: standardRoom,
    description: "Elegant comfort with all essential amenities, perfect for couples seeking a romantic island getaway.",
    features: ["Queen Bed", "Garden/Ocean View", "En-suite Bathroom", "Room Service"],
    guests: "2 Guests",
    icon: Bed,
  },
];

const commonAmenities = [
  { icon: Wifi, name: "Free Wi-Fi" },
  { icon: Wind, name: "Air Conditioning" },
  { icon: Coffee, name: "Breakfast" },
];

export const AccommodationSection = () => {
  return (
    <section id="accommodation" className="section-padding bg-brand-blue-dark">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-brand-orange text-sm tracking-widest uppercase mb-4">
            Accommodation
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-sky-light mb-6">
            Luxurious Island
            <span className="text-brand-orange block">Sanctuaries</span>
          </h2>
          <p className="text-brand-sky/80 text-lg max-w-2xl mx-auto">
            Choose from our carefully curated accommodations, each designed to provide 
            the ultimate in comfort and Pan-African elegance.
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {rooms.map((room, index) => (
            <div
              key={room.id}
              className="group relative bg-brand-blue-light rounded-2xl overflow-hidden border border-brand-blue hover:border-brand-orange/30 transition-all duration-500 shadow-elevation-4 hover:shadow-elevation-6"
            >
              {/* Image */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-dark via-brand-blue-dark/40 to-transparent" />
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-brand-orange-dark via-brand-orange to-brand-orange-light text-brand-blue-dark px-4 py-2 rounded-full font-bold shadow-elevation-3">
                  GH₵{room.price.toLocaleString()}<span className="text-xs font-normal">/night</span>
                </div>
                
                {/* Room Type Icon */}
                <div className="absolute top-4 left-4 w-12 h-12 bg-brand-blue-dark/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-brand-orange/30">
                  <room.icon className="w-6 h-6 text-brand-orange" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-brand-sky-light text-2xl">{room.name}</h3>
                  <div className="flex items-center gap-2 text-brand-sky text-sm">
                    <Users className="w-4 h-4" />
                    {room.guests}
                  </div>
                </div>
                
                <p className="text-brand-sky/80 mb-6 leading-relaxed">
                  {room.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {room.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 bg-brand-orange/10 text-brand-orange text-xs rounded-full border border-brand-orange/20"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Common Amenities */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-brand-blue">
                  {commonAmenities.map((amenity) => (
                    <div
                      key={amenity.name}
                      className="flex items-center gap-2 text-brand-sky/70 text-sm"
                    >
                      <amenity.icon className="w-4 h-4" />
                      {amenity.name}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button variant="orange" className="w-full">
                  Book {room.name}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
