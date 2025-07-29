import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Mail, 
  User, 
  Users, 
  Bell, 
  ArrowRight, 
  ArrowLeft,
  Star,
  Heart
} from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    sangha: "",
    notificationTime: "9:00"
  });

  const totalSteps = 4;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const sanghaOptions = [
    "Mumbai Jain Centre",
    "Delhi Jain Community", 
    "Pune Jain Samaj",
    "Bangalore Jain Society",
    "Create New Sangha"
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="bg-gradient-sacred rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
              <Star className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome to Your Sacred Journey
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Join thousands of Jains practicing mindful fasting together. 
              Track your spiritual progress, connect with your Sangha, and 
              deepen your dharmic practice.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Building spiritual discipline together</span>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Create Your Profile</h2>
              <p className="text-muted-foreground">
                Let's personalize your spiritual practice
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="h-12"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="Enter your email"
                  className="h-12"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Join Your Sangha</h2>
              <p className="text-muted-foreground">
                Connect with your spiritual community
              </p>
            </div>
            
            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4" />
                Select or Create Your Sangha
              </Label>
              <div className="space-y-2">
                {sanghaOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => updateFormData("sangha", option)}
                    className={`w-full p-4 text-left rounded-lg border transition-all ${
                      formData.sangha === option
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-medium">{option}</div>
                    {option !== "Create New Sangha" && (
                      <div className="text-sm text-muted-foreground">
                        {Math.floor(Math.random() * 200) + 50} members
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Notification Preferences</h2>
              <p className="text-muted-foreground">
                When would you like your daily reminders?
              </p>
            </div>
            
            <div>
              <Label htmlFor="time" className="flex items-center gap-2 mb-3">
                <Bell className="h-4 w-4" />
                Daily Reminder Time
              </Label>
              <select
                id="time"
                value={formData.notificationTime}
                onChange={(e) => updateFormData("notificationTime", e.target.value)}
                className="w-full p-4 rounded-lg border border-border bg-background"
              >
                <option value="6:00">6:00 AM - Early morning</option>
                <option value="9:00">9:00 AM - Morning</option>
                <option value="12:00">12:00 PM - Noon</option>
                <option value="18:00">6:00 PM - Evening</option>
                <option value="21:00">9:00 PM - Night</option>
              </select>
            </div>

            <Card className="bg-accent/20 border-accent">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">You're all set! 🙏</h3>
                <p className="text-sm text-muted-foreground">
                  Ready to begin your mindful fasting journey with your Sangha community.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dawn flex flex-col">
      {/* Progress Bar */}
      <div className="pt-8 px-6">
        <Progress value={progress} className="h-2 mb-2" />
        <p className="text-center text-sm text-muted-foreground">
          Step {currentStep + 1} of {totalSteps}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <Card className="w-full max-w-md shadow-floating">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="p-6">
        <div className="flex gap-3 max-w-md mx-auto">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          <Button
            variant="sacred"
            onClick={handleNext}
            className="flex-1 gap-2"
            disabled={
              (currentStep === 1 && (!formData.name || !formData.email)) ||
              (currentStep === 2 && !formData.sangha)
            }
          >
            {currentStep === totalSteps - 1 ? "Begin Journey" : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}