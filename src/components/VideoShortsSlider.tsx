import { useState } from "react";
import { Play, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const shorts = [
  {
    id: "short1",
    videoId: "DJwGD0CZyrk",
    title: "Island Paradise Experience",
    thumbnail: "https://img.youtube.com/vi/DJwGD0CZyrk/maxresdefault.jpg",
  },
  {
    id: "short2",
    videoId: "DJwGD0CZyrk",
    title: "Sunset Boat Cruise",
    thumbnail: "https://img.youtube.com/vi/DJwGD0CZyrk/hqdefault.jpg",
  },
  {
    id: "short3",
    videoId: "DJwGD0CZyrk",
    title: "Beach Vibes",
    thumbnail: "https://img.youtube.com/vi/DJwGD0CZyrk/sddefault.jpg",
  },
  {
    id: "short4",
    videoId: "DJwGD0CZyrk",
    title: "Aquatic Adventures",
    thumbnail: "https://img.youtube.com/vi/DJwGD0CZyrk/mqdefault.jpg",
  },
];

// Duplicate for seamless loop
const duplicatedShorts = [...shorts, ...shorts];

export const VideoShortsSlider = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section id="shorts" className="py-16 bg-brand-blue-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-block text-brand-orange text-sm tracking-widest uppercase mb-2">
              Featured Videos
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-brand-sky-light">
              Experience <span className="text-brand-orange">Paradasia</span>
            </h2>
          </div>
          <a
            href="https://www.youtube.com/@ParadasiaHideway/shorts"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-sky hover:text-brand-orange transition-colors text-sm"
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
              className="group relative w-[280px] sm:w-[320px] flex-shrink-0 cursor-pointer"
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
                  <div className="w-16 h-16 rounded-full bg-brand-orange/90 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-orange shadow-lg">
                    <Play className="w-7 h-7 text-brand-blue-dark ml-1" fill="currentColor" />
                  </div>
                </div>
                
                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-brand-sky-light font-medium text-sm line-clamp-2">
                    {short.title}
                  </h3>
                </div>

                {/* Orange Border on Hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-brand-orange rounded-2xl transition-colors duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-brand-blue-dark to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-brand-blue-dark to-transparent pointer-events-none z-10" />
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
