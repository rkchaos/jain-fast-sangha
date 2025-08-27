import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SignupFormProps {
  onSignup: (data: { name: string; phone: string; email: string; password: string; confirmPassword: string }) => void;
  onBack?: () => void;
  userData?: { name: string; phone: string; email: string; password: string; confirmPassword: string } | null;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onBack, userData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    password: userData?.password || '',
    confirmPassword: userData?.confirmPassword || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields', { duration: 5000 });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match', { duration: 5000 });
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters', { duration: 5000 });
      return;
    }

    setLoading(true);
    try {
      // Check if user already exists by checking both email and phone
      const { data: existingByEmail } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', formData.email)
        .maybeSingle();

      const { data: existingByPhone } = await supabase
        .from('profiles')  
        .select('phone')
        .eq('phone', formData.phone)
        .maybeSingle();

      if (existingByEmail) {
        toast.error('An account with this email already exists. Please try logging in instead.', { duration: 5000 });
        return;
      }

      if (existingByPhone) {
        toast.error('An account with this phone number already exists. Please try logging in instead.', { duration: 5000 });
        return;
      }

      // Create auth user with password and set email redirect
      const redirectUrl = `${window.location.origin}/`;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: formData.name,
            phone: formData.phone
          }
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          toast.error('Account already exists. Please try logging in instead.', { duration: 5000 });
          return;
        }
        throw authError;
      }

      if (authData.user) {
        // If no session was created, attempt to sign in with password
        if (!authData.session) {
          console.log('No session created, attempting to sign in...');
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
          });
          
          if (signInError && signInError.message.includes('email not confirmed')) {
            toast.info('Account created! Please check your email to confirm your account, then try logging in.', { duration: 8000 });
            return;
          } else if (signInError) {
            console.error('Sign in error:', signInError);
            toast.info('Account created! Please check your email to confirm your account.', { duration: 8000 });
            return;
          }
        }
        
        toast.success(`Welcome ${formData.name}! Account created successfully.`, { duration: 5000 });
        
        // Proceed to next step
        setTimeout(() => {
          onSignup(formData);
        }, 1000);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account. Please try again.', { duration: 5000 });
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

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                minLength={6}
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