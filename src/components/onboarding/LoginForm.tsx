import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LoginFormProps {
  onBack: () => void;
  onSwitchToSignup: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onBack, onSwitchToSignup }) => {
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState(''); // email or phone

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      toast.error('Please enter your email or phone number');
      return;
    }

    setLoading(true);
    try {
      // Check if identifier is email or phone
      const isEmail = identifier.includes('@');
      
      let profileData;
      if (isEmail) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', identifier)
          .single();
        
        if (error || !data) {
          throw new Error('No account found with this email. Please create an account first.');
        }
        profileData = data;
      } else {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('phone', identifier)
          .single();
        
        if (error || !data) {
          throw new Error('No account found with this phone. Please create an account first.');
        }
        profileData = data;
      }

      if (profileData) {
        // Generate a magic link for instant login
        const { data: magicLinkData, error: magicLinkError } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email: profileData.email,
        });

        if (magicLinkError) {
          // Fallback: try to sign in using the user's email directly
          const { error: signInError } = await supabase.auth.signInWithOtp({
            email: profileData.email,
            options: {
              emailRedirectTo: `${window.location.origin}/`
            }
          });

          if (signInError) throw signInError;
          toast.success(`Magic link sent to ${profileData.email}! Check your email to sign in.`);
        } else if (magicLinkData.properties?.action_link) {
          // Direct login using magic link
          window.location.href = magicLinkData.properties.action_link;
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl text-foreground">Welcome Back</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sign in to continue your tapasya journey
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Email or Phone Number</Label>
              <Input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your email or phone number"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-3 pt-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-sacred hover:shadow-floating" 
                disabled={loading}
                size="lg"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
              
              <div className="text-center space-y-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onSwitchToSignup}
                  className="text-sm"
                  disabled={loading}
                >
                  Don't have an account? Sign up
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={onBack}
                  disabled={loading}
                >
                  Back
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};