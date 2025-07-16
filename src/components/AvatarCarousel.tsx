import React, { useState, useRef } from "react";

interface Avatar {
  name: string;
  image: string;
  role: string;
  rating: number;
  status: string;
  description: string;
  tags: { label: string; color: string }[];
}

interface AvatarCarouselProps {
  avatars: Avatar[];
}

const VISIBLE_COUNT = 3;

const AvatarCarousel: React.FC<AvatarCarouselProps> = ({ avatars }) => {
  const [startIdx, setStartIdxRaw] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Clamp startIdx so the last group is always fully visible
  const maxStartIdx = Math.max(0, avatars.length - VISIBLE_COUNT);
  const setStartIdx = (idx: number) =>
    setStartIdxRaw(Math.max(0, Math.min(idx, maxStartIdx)));

  const canGoLeft = startIdx > 0;
  const canGoRight = startIdx < maxStartIdx;

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(false);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) setIsDragging(true);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 50 && canGoLeft) {
      setStartIdx(startIdx - 1);
    } else if (deltaX < -50 && canGoRight) {
      setStartIdx(startIdx + 1);
    }
    touchStartX.current = null;
    setIsDragging(false);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Left Arrow */}
      <button
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md border border-gray-200 transition disabled:opacity-30 disabled:pointer-events-none`}
        onClick={() => canGoLeft && setStartIdx(startIdx - 1)}
        disabled={!canGoLeft}
        aria-label="Önceki"
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            d="M15 19l-7-7 7-7"
            stroke="#333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {/* Avatars Row */}
      <div
        className="overflow-hidden px-12"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 w-full"
          style={{
            transform: `translateX(-${startIdx * (100 / VISIBLE_COUNT)}%)`,
          }}
        >
          {avatars.map((avatar, idx) => {
            // Add mx-4 to all cards except the first and last visible
            let marginClass = "";
            if (idx !== 0 && idx !== avatars.length - 1) marginClass = "mx-4";
            return (
              <div
                key={avatar.name}
                className={`relative group rounded-2xl border-2 p-6 bg-white shadow-md transition-all duration-300 flex-shrink-0 ${marginClass}`}
                style={{
                  borderColor: avatar.tags[0]?.color || "#e5e7eb",
                  flex: `0 0 ${100 / VISIBLE_COUNT}%`,
                  maxWidth: `${100 / VISIBLE_COUNT}%`,
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={avatar.image}
                    alt={avatar.name}
                    className="w-16 h-16 rounded-full object-cover border-2"
                    style={{ borderColor: avatar.tags[0]?.color || "#e5e7eb" }}
                  />
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {avatar.name}
                    </h3>
                    <p className="text-sm text-gray-600">{avatar.role}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        {avatar.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 font-medium">
                      {avatar.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {avatar.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {avatar.tags.map(tag => (
                    <span
                      key={tag.label}
                      className={`px-2 py-1 text-xs rounded-full`}
                      style={{ background: tag.color + "22", color: tag.color }}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Right Arrow */}
      <button
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md border border-gray-200 transition disabled:opacity-30 disabled:pointer-events-none`}
        onClick={() => canGoRight && setStartIdx(startIdx + 1)}
        disabled={!canGoRight}
        aria-label="Sonraki"
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            d="M9 5l7 7-7 7"
            stroke="#333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default AvatarCarousel;
