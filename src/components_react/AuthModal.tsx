'use client';

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

// Apple Logo SVG Component
const AppleLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/>
  </svg>
);

// Google Logo SVG Component
const GoogleLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

interface AuthModalProps {
  children: React.ReactNode;
  onSocialLogin: (provider: 'apple' | 'google') => Promise<void> | void;
  onEmailAuth?: () => void;
}

export function AuthModal({ children, onSocialLogin, onEmailAuth }: AuthModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<'apple' | 'google' | null>(null);

  const handleSocialLogin = async (provider: 'apple' | 'google') => {
    setLoading(provider);
    try {
      await onSocialLogin(provider);
      setOpen(false);
    } catch (error) {
      // Keep modal open on error
      console.error('Auth error:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleEmailAuth = () => {
    if (onEmailAuth) {
      onEmailAuth();
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-center">Join DogPark(ing)</CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              Sign up or sign in to get started
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-12 flex items-center justify-center gap-3 hover:bg-black hover:text-white transition-colors"
              onClick={() => handleSocialLogin('apple')}
              disabled={loading === 'apple'}
            >
              {loading === 'apple' ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Connecting...
                </>
              ) : (
                <>
                  <AppleLogo className="h-5 w-5" />
                  Continue with Apple
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              className="w-full h-12 flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-colors"
              onClick={() => handleSocialLogin('google')}
              disabled={loading === 'google'}
            >
              {loading === 'google' ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Connecting...
                </>
              ) : (
                <>
                  <GoogleLogo className="h-5 w-5" />
                  Continue with Google
                </>
              )}
            </Button>
            
            <div className="relative">
              <Separator className="my-4" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-card px-2 text-xs text-muted-foreground">
                  OR
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full text-sm text-muted-foreground hover:text-foreground"
                onClick={handleEmailAuth}
              >
                Sign up with email
              </Button>
              <Button 
                variant="ghost" 
                className="w-full text-sm text-muted-foreground hover:text-foreground"
                onClick={handleEmailAuth}
              >
                Already have an account? Sign in
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-muted-foreground leading-relaxed">
                By continuing, you agree to our{' '}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}