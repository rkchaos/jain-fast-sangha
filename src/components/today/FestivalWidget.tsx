import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Play, BookOpen } from 'lucide-react';

interface FestivalWidgetProps {
  date: string;
  title: string;
  virtue: string;
  description?: string;
  liveLink?: string;
}

export const FestivalWidget: React.FC<FestivalWidgetProps> = ({
  date,
  title,
  virtue,
  description,
  liveLink
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showLive, setShowLive] = useState(false);

  const handleWatchLive = () => {
    if (liveLink) {
      setShowLive(true);
    }
  };

  return (
    <>
      <Card className="bg-gradient-peaceful text-secondary-foreground shadow-gentle">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-background/50">
                {date}
              </Badge>
              {liveLink && (
                <Badge className="bg-destructive text-destructive-foreground">
                  LIVE
                </Badge>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-lg leading-tight">
                {title}
              </h3>
              <p className="text-sm opacity-90 mt-2">
                {virtue}
              </p>
            </div>

            <div className="flex gap-2">
              {liveLink && (
                <Button 
                  size="sm" 
                  onClick={handleWatchLive}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  <Play className="h-3 w-3 mr-1" />
                  Watch Live
                </Button>
              )}
              {description && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowDetails(true)}
                  className="bg-background/50 hover:bg-background/70"
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  Read more
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">Today's Teaching</h4>
              <p className="text-muted-foreground">{virtue}</p>
            </div>
            {description && (
              <div>
                <h4 className="font-medium text-foreground mb-2">Description</h4>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Live Stream Modal */}
      <Dialog open={showLive} onOpenChange={setShowLive}>
        <DialogContent className="w-full max-w-2xl">
          <DialogHeader>
            <DialogTitle>Live Stream - {title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            {liveLink ? (
              <iframe
                src={liveLink}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <p className="text-muted-foreground">Live stream will appear here</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};