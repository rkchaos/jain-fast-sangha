import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SignupFormProps {
  onSignup: (data: { name: string; phone: string; email: string }) => void;
  onBack?: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Use direct signup edge function
      const { data, error } = await supabase.functions.invoke('direct_signup', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        if (data.error.includes('already exists') || data.type === 'phone_exists' || data.type === 'email_exists') {
          toast.error('Account already exists. Please try logging in instead.');
          if (data.redirectToLogin) {
            // Auto redirect to login after 2 seconds
            setTimeout(() => {
              window.location.hash = '#login';
            }, 2000);
          }
          return;
        }
        throw new Error(data.error);
      }

      if (data.success && data.login_url) {
        // Navigate to the magic link URL to auto-login
        window.location.href = data.login_url;
        return;
      }

      toast.success(`Welcome ${formData.name}! Account created successfully.`);
      onSignup(formData);
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl text-foreground">Create Account</CardTitle>
          <p className="text-sm text-muted-foreground">
            Join the Tapasya Tracker community
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="space-y-3 pt-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-sacred hover:shadow-floating" 
                disabled={loading}
                size="lg"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
              {onBack && (
                <Button type="button" variant="outline" className="w-full" onClick={onBack}>
                  Back
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};