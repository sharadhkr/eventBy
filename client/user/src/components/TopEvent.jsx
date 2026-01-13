import React, { useState, useEffect, useCallback } from 'react';

const images = [
  'https://i.pinimg.com/736x/ea/49/d8/ea49d86910b5f0e469917931ed8bde17.jpg',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
];

const SLIDE_DURATION = 4000;

const TopEvent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  }, []);

  useEffect(() => {
    const interval = setInterval(goToNext, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
<div className=" mx-1">      <h1>Top event</h1>

    <div className="relative w-full max-w-4xl mx-auto aspect-video sm:aspect-[21/9] rounded-[2rem] overflow-hidden bg-slate-200 shadow-2xl">
      {/* Slide Container */}
      <div className="relative w-full h-full">
        {images.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
            <img 
              src={src} 
              alt={`Event ${index + 1}`} 
              className="w-full h-full object-cover" 
            />
          </div>
        ))}
      </div>

      {/* Indicators Section */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center items-center gap-3 px-6">
        {images.map((_, index) => {
          const isActive = index === currentIndex;
          return (
            <div 
              key={index} 
              className={`relative transition-all duration-500 ease-in-out h-1.5 rounded-full overflow-hidden ${
                isActive ? 'w-24 bg-white/20 backdrop-blur-md' : 'w-2 bg-white/40'
              }`}
            >
              {/* Progress Fill for Active Line */}
              {isActive && (
                <div 
                  className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-progress-fill"
                  style={{ animationDuration: `${SLIDE_DURATION}ms` }}
                />
              )}
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress-fill {
          animation: progressFill linear forwards;
        }
      `}</style>
    </div>
    </div>
  );
};

export default TopEvent;