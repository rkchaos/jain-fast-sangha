import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface Ad {
  id: string;
  mediaUrl: string;
  targetUrl: string;
  alt: string;
}

interface AdCarouselProps {
  ads: Ad[];
  autoSwipeInterval?: number;
}

// Default ads data
const defaultAds: Ad[] = [
  { id: 'ad-1', mediaUrl: '/placeholder.svg', targetUrl: 'https://example.com/puja-kit', alt: 'Puja Kit' },
  { id: 'ad-2', mediaUrl: '/placeholder.svg', targetUrl: 'https://example.com/books', alt: 'Jain Books' },
  { id: 'ad-3', mediaUrl: '/placeholder.svg', targetUrl: 'https://example.com/retreat', alt: 'Spiritual Retreat' }
];

export const AdCarousel: React.FC<AdCarouselProps> = ({ 
  ads = defaultAds, 
  autoSwipeInterval = 6000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused && ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
      }, autoSwipeInterval);

      return () => clearInterval(interval);
    }
  }, [isPaused, ads.length, autoSwipeInterval]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const handleAdClick = (targetUrl: string) => {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  if (!ads.length) return null;

  const currentAd = ads[currentIndex];

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-gentle transition-shadow"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <CardContent className="p-0 relative group">
        <div className="relative aspect-video bg-muted">
          <img
            src={currentAd.mediaUrl}
            alt={currentAd.alt}
            className="w-full h-full object-cover"
            loading="lazy"
            onClick={() => handleAdClick(currentAd.targetUrl)}
          />
          
          {/* Overlay with external link icon */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              size="sm"
              variant="secondary"
              className="bg-background/90 hover:bg-background"
              onClick={() => handleAdClick(currentAd.targetUrl)}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit
            </Button>
          </div>

          {/* Navigation arrows */}
          {ads.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Dots indicator */}
        {ads.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {ads.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-background/60'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};