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
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Cooldown timer
  React.useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cooldown > 0) {
      setError(`Please wait ${cooldown} seconds before requesting another link`);
      return;
    }
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send_magic_link', {
        body: { email: email.trim() }
      });

      if (error) throw error;

      toast.success('Login link sent! Check your email to continue.');
      setCooldown(60); // Set 60 second cooldown
    } catch (error: any) {
      console.error('Error sending magic link:', error);
      if (error.message?.includes('No account found')) {
        setError('No account found with this email. Please sign up first.');
      } else if (error.message?.includes('Too many requests')) {
        setError('Too many requests. Please wait before trying again.');
        setCooldown(60);
      } else {
        setError('Failed to send login link. Please try again.');
      }
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
            We'll send you a magic link to login
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className={error ? 'border-destructive' : ''}
                disabled={loading}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <div className="space-y-3 pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                disabled={loading || cooldown > 0}
              >
                {loading ? 'Sending...' : cooldown > 0 ? `Wait ${cooldown}s` : 'Send Login Link'}
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