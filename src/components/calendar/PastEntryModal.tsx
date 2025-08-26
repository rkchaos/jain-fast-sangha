import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface PastEntryModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { type: string; completed: boolean }) => void;
  selectedDate: Date;
}

const fastTypes = [
  { id: 'upvas', label: 'Upvas', description: 'Complete fasting without food and water' },
  { id: 'ekasna', label: 'Ekasna', description: 'One meal a day' },
  { id: 'ayambil', label: 'Ayambil', description: 'Simple food without spices' },
  { id: 'other', label: 'Other', description: 'Custom fasting practice' }
];

export const PastEntryModal: React.FC<PastEntryModalProps> = ({ 
  visible, 
  onClose, 
  onSubmit, 
  selectedDate 
}) => {
  const [selectedType, setSelectedType] = useState('');
  const [completed, setCompleted] = useState(false);

  const handleSubmit = () => {
    if (selectedType) {
      onSubmit({
        type: selectedType,
        completed
      });
      // Reset form
      setSelectedType('');
      setCompleted(false);
      onClose();
    }
  };

  const isFormValid = selectedType;

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            Update Past Entry
          </DialogTitle>
          <div className="text-center">
            <Badge variant="outline" className="mt-2">
              {selectedDate?.toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Fast Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">What type of vrat did you observe?</Label>
            <RadioGroup value={selectedType} onValueChange={setSelectedType}>
              {fastTypes.map((type) => (
                <div key={type.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={type.id} className="font-medium cursor-pointer">
                      {type.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {type.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Completion Status */}
          <div className="bg-accent/30 p-4 rounded-lg space-y-3">
            <Label className="text-base font-medium">Did you complete this vrat successfully?</Label>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="completion-status"
                checked={completed}
                onCheckedChange={(checked) => setCompleted(checked as boolean)}
              />
              <Label htmlFor="completion-status" className="cursor-pointer">
                Yes, I completed this vrat successfully
              </Label>
            </div>
            {!completed && selectedType && (
              <p className="text-sm text-muted-foreground italic">
                That's okay! Every attempt is a step forward on your spiritual journey.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!isFormValid}
              className="flex-1"
            >
              Save Entry
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};