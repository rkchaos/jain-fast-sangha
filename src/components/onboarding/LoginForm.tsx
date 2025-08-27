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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '', // email or phone
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      toast.error('Please enter both email/phone and password', { duration: 5000 });
      return;
    }

    setLoading(true);
    try {
      // Check if identifier is email or phone
      const isEmail = formData.identifier.includes('@');
      
      let profileData;
      if (isEmail) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', formData.identifier)
          .maybeSingle();
        
        if (error || !data) {
          throw new Error('No account found with this email. Please create an account first.');
        }
        profileData = data;
      } else {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('phone', formData.identifier)
          .maybeSingle();
        
        if (error || !data) {
          throw new Error('No account found with this phone. Please create an account first.');
        }
        profileData = data;
      }

      // Sign in with email and password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: profileData.email,
        password: formData.password
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          toast.error('Incorrect password. Please try again.', { duration: 5000 });
        } else {
          throw authError;
        }
        return;
      }

      if (authData.user) {
        toast.success(`Welcome back, ${profileData.name}! 🙏`, { duration: 5000 });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.', { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.identifier) {
      toast.error('Please enter your email first', { duration: 5000 });
      return;
    }

    const isEmail = formData.identifier.includes('@');
    if (!isEmail) {
      toast.error('Please enter your email address for password reset', { duration: 5000 });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.identifier, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
      
      toast.success('Password reset email sent! Check your inbox.', { duration: 5000 });
      setShowForgotPassword(false);
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error('Failed to send password reset email', { duration: 5000 });
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
                name="identifier"
                type="text"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Enter your email or phone number"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
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
                  onClick={handleForgotPassword}
                  className="text-sm text-muted-foreground"
                  disabled={loading}
                >
                  Forgot Password?
                </Button>
                
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