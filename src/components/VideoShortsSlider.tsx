import { useState } from "react";
import { Play, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import paradasiaCover from "@/assets/paradasia-cover.jpg";
import paradasiaAerial1 from "@/assets/paradasia-aerial-1.jpg";
import paradasiaAerial2 from "@/assets/paradasia-aerial-2.jpg";
import paradasiaSunset1 from "@/assets/paradasia-sunset-1.jpg";
import paradasiaSunset2 from "@/assets/paradasia-sunset-2.jpg";
import paradasiaNight from "@/assets/paradasia-night-1.jpg";

// Paradasia Hideway video content with real property images
const shorts = [
  {
    id: "short1",
    videoId: "DJwGD0CZyrk",
    title: "Paradise Awaits at Paradasia Hideway",
    thumbnail: paradasiaCover,
  },
  {
    id: "short2",
    videoId: "DJwGD0CZyrk",
    title: "Aerial Views of Big Ada",
    thumbnail: paradasiaAerial1,
  },
  {
    id: "short3",
    videoId: "DJwGD0CZyrk",
    title: "Luxury Island Living in Ghana",
    thumbnail: paradasiaAerial2,
  },
  {
    id: "short4",
    videoId: "DJwGD0CZyrk",
    title: "Romantic Sunset Moments",
    thumbnail: paradasiaSunset1,
  },
  {
    id: "short5",
    videoId: "DJwGD0CZyrk",
    title: "Golden Hour at Paradasia",
    thumbnail: paradasiaSunset2,
  },
  {
    id: "short6",
    videoId: "DJwGD0CZyrk",
    title: "Night Ambiance",
    thumbnail: paradasiaNight,
  },
];

// Duplicate for seamless loop
const duplicatedShorts = [...shorts, ...shorts];

export const VideoShortsSlider = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section id="shorts" className="py-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(28 90% 45%), hsl(28 92% 54%), hsl(35 95% 60%))' }}>
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-block text-brand-blue-dark text-sm tracking-widest uppercase mb-2 font-semibold">
              Featured Videos
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-brand-blue-dark">
              Experience <span className="text-white">Paradasia</span>
            </h2>
          </div>
          <a
            href="https://www.youtube.com/@ParadasiaHideway"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-blue-dark hover:text-white transition-colors text-sm font-medium"
          >
            View All →
          </a>
        </div>
      </div>

      {/* Sliding Cards Container */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={`flex gap-6 ${isPaused ? "" : "animate-scroll"}`}
          style={{
            width: "fit-content",
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {duplicatedShorts.map((short, index) => (
            <div
              key={`${short.id}-${index}`}
              className="group relative w-[260px] sm:w-[300px] flex-shrink-0 cursor-pointer"
              onClick={() => setSelectedVideo(short.videoId)}
            >
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-elevation-4 transition-all duration-500 group-hover:shadow-elevation-6 group-hover:shadow-orange-glow group-hover:-translate-y-2">
                {/* Thumbnail */}
                <img
                  src={short.thumbnail}
                  alt={short.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-dark via-brand-blue-dark/30 to-transparent" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white shadow-lg">
                    <Play className="w-7 h-7 text-brand-blue-dark ml-1" fill="currentColor" />
                  </div>
                </div>
                
                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-medium text-sm line-clamp-2">
                    {short.title}
                  </h3>
                </div>

                {/* White Border on Hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-white rounded-2xl transition-colors duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Fade Edges - match orange gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-20 pointer-events-none z-10" style={{ background: 'linear-gradient(to right, hsl(28 90% 45%), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none z-10" style={{ background: 'linear-gradient(to left, hsl(35 95% 60%), transparent)' }} />
      </div>

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0 bg-brand-blue-dark border-brand-blue overflow-hidden">
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-brand-blue/80 text-brand-sky-light hover:bg-brand-orange hover:text-brand-blue-dark transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
          {selectedVideo && (
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0`}
                title="Paradasia Hideway Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
