import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface CheckInModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { type: string; note?: string }) => void;
  truthText?: string;
}

const fastTypes = [
  { id: 'upvas', label: 'Upvas', description: 'Complete fasting without food and water' },
  { id: 'ekasna', label: 'Ekasna', description: 'One meal a day' },
  { id: 'ayambil', label: 'Ayambil', description: 'Simple food without spices' },
  { id: 'other', label: 'Other', description: 'Custom fasting practice' }
];

export const CheckInModal: React.FC<CheckInModalProps> = ({ 
  visible, 
  onClose, 
  onSubmit, 
  truthText = "Please be truthful — this is for your spiritual progress." 
}) => {
  const [selectedType, setSelectedType] = useState('');
  const [customType, setCustomType] = useState('');
  const [note, setNote] = useState('');
  const [agreedToTruth, setAgreedToTruth] = useState(false);

  const handleSubmit = () => {
    const finalType = selectedType === 'other' ? customType : selectedType;
    if (finalType && agreedToTruth) {
      onSubmit({
        type: finalType,
        note: note.trim() || undefined
      });
      // Reset form
      setSelectedType('');
      setCustomType('');
      setNote('');
      setAgreedToTruth(false);
      onClose();
    }
  };

  const isFormValid = selectedType && 
    (selectedType !== 'other' || customType.trim()) && 
    agreedToTruth;

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">Start your Vrat</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Fast Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Choose your vrat type</Label>
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

            {/* Custom Type Input */}
            {selectedType === 'other' && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="custom-type">Specify your vrat</Label>
                <Input
                  id="custom-type"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  placeholder="Describe your custom vrat..."
                />
              </div>
            )}
          </div>

          {/* Optional Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Add a note (optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any intentions or thoughts for today's vrat..."
              rows={3}
            />
          </div>

          {/* Truth Agreement */}
          <div className="bg-accent/30 p-4 rounded-lg space-y-3">
            <p className="text-sm text-foreground font-medium text-center">
              {truthText}
            </p>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="truth-agreement"
                checked={agreedToTruth}
                onCheckedChange={(checked) => setAgreedToTruth(checked as boolean)}
              />
              <Label htmlFor="truth-agreement" className="text-sm cursor-pointer">
                I agree to be truthful in my practice
              </Label>
            </div>
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
              Check in
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};