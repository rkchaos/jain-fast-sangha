import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Ad {
  id: string;
  mediaUrl: string;
  targetUrl: string;
  alt: string;
}

interface InterstitialAdProps {
  ad: Ad;
  frequencyMins: number;
  enabled?: boolean;
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({ 
  ad, 
  frequencyMins,
  enabled = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastShown, setLastShown] = useState<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const checkShowAd = () => {
      const now = Date.now();
      const timeSinceLastShown = now - lastShown;
      const frequencyMs = frequencyMins * 60 * 1000;

      if (timeSinceLastShown >= frequencyMs) {
        setIsVisible(true);
        setLastShown(now);
      }
    };

    // Initial check after component mounts
    const initialTimer = setTimeout(checkShowAd, 1000);

    // Set up recurring check
    const interval = setInterval(checkShowAd, 60000); // Check every minute

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [frequencyMins, lastShown, enabled]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleAdClick = () => {
    window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
    handleClose();
  };

  if (!enabled || !isVisible) return null;

  return (
    <Dialog open={isVisible} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-0 bg-transparent border-none shadow-none">
        <div className="relative bg-background rounded-lg overflow-hidden shadow-floating">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background rounded-full"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Ad content */}
          <div 
            className="cursor-pointer group"
            onClick={handleAdClick}
          >
            <div className="aspect-video relative">
              <img
                src={ad.mediaUrl}
                alt={ad.alt}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-center text-white">
                  <p className="text-lg font-semibold mb-2">{ad.alt}</p>
                  <Button variant="secondary" size="lg">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Close text */}
          <div className="p-4 text-center">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};