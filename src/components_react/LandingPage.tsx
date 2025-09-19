'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Heart, 
  MapPin, 
  Clock, 
  Shield, 
  Star, 
  Check,
  Users,
  Award,
  Smartphone,
  ArrowRight
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AuthModal } from './AuthModal';
import { useAuth } from '../contexts/AuthContext';

interface PricingTier {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  points: number;
  bonusPoints?: number;
  savings?: string;
  popular?: boolean;
  features: string[];
}

const pricingTiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    description: 'Perfect for occasional visits',
    monthlyPrice: 29,
    points: 120,
    features: [
      '120 points per month',
      'Access to all venues',
      'Mobile app',
      'Basic support'
    ]
  },
  {
    id: 'plus',
    name: 'Plus Pack',
    description: 'Great for regular dog parents',
    monthlyPrice: 69,
    points: 320,
    bonusPoints: 50,
    savings: '15% savings',
    popular: true,
    features: [
      '320 points per month',
      '50 bonus points',
      'Priority booking',
      'Premium support',
      'Cancellation protection',
      'Monthly dog treats'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    description: 'Ultimate care for your furry family',
    monthlyPrice: 119,
    points: 600,
    bonusPoints: 150,
    savings: '25% savings',
    features: [
      '600 points per month',
      '150 bonus points',
      'Unlimited last-minute bookings',
      'Dedicated support',
      'Free venue transfers',
      'Monthly grooming credit',
      'Holiday bonus points'
    ]
  }
];

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();

  const handleSocialLogin = async (provider: 'apple' | 'google') => {
    if (provider === 'google') {
      try {
        await signInWithGoogle();
        // On successful Google auth, redirect to find-care page
        router.push('/find-care');
      } catch (error) {
        console.error('Google sign-in failed:', error);
        // Could show error toast here in the future
      }
    }
    // Apple login does nothing (as requested)
  };

  const handleEmailAuth = () => {
    // Email auth does nothing (as requested)
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-20 bg-transparent">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-white text-lg font-medium">DogPark(ing)</span>
            </div>
            <div className="flex items-center gap-4">
              <AuthModal onSocialLogin={handleSocialLogin} onEmailAuth={handleEmailAuth}>
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Sign In
                </Button>
              </AuthModal>
              <AuthModal onSocialLogin={handleSocialLogin} onEmailAuth={handleEmailAuth}>
                <Button variant="secondary">
                  Get Started
                </Button>
              </AuthModal>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1581838560913-e731a8ed82e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZ3MlMjBwbGF5aW5nJTIwb3V0ZG9vciUyMGRheWNhcmV8ZW58MXx8fHwxNzU2NzM4MzU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Happy dogs playing outdoors"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-white mb-6 leading-tight">
              Your Dog's Perfect
              <br />
              <span className="text-primary">Day Out</span>
              <br />
              Awaits
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl leading-relaxed">
              Discover trusted dog care venues in your neighborhood. Book last-minute or plan ahead with our points-based system designed for busy dog parents.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <AuthModal onSocialLogin={handleSocialLogin} onEmailAuth={handleEmailAuth}>
                <Button size="lg" className="text-lg px-8 py-6">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </AuthModal>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20">
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-lg">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-medium text-white">500+</p>
                <p className="text-white/80 text-sm">Trusted Venues</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-medium text-white">50k+</p>
                <p className="text-white/80 text-sm">Happy Dogs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-medium text-white">4.9★</p>
                <p className="text-white/80 text-sm">Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="absolute bottom-20 right-8 hidden lg:block">
          <Card className="w-72 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Liverpool Street</p>
                  <p className="text-sm text-muted-foreground">0.3 mi away</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Available Now</Badge>
                <span className="text-sm text-primary font-medium">25 pts/hr</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-4">
              Why Dog Parents Love DogPark(ing)
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make finding and booking dog care as easy as finding a parking spot
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Last-Minute Bookings</h3>
              <p className="text-muted-foreground">
                Need care now? Find available spots in real-time and book instantly with our points system.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Trusted & Vetted</h3>
              <p className="text-muted-foreground">
                All venues are personally inspected and regularly reviewed by our team and community.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Mobile-First</h3>
              <p className="text-muted-foreground">
                Book on the go with our responsive app. Perfect for busy dog parents on the move.
              </p>
            </Card>
          </div>

          {/* Visual Feature with Image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-medium mb-4">
                Find Care Anywhere, Anytime
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Our interactive map shows real-time availability at dog care venues near you. 
                Filter by your dog's needs, read reviews, and book with confidence.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Real-time availability updates</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Detailed venue profiles and photos</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Community reviews and ratings</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1630643772418-3bd252085b03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBvd25lciUyMHdhbGtpbmclMjBjaXR5JTIwc3RyZWV0fGVufDF8fHx8MTc1NjczODM1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Dog owner walking in the city"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works for you. All plans include access to our full network of trusted venues.
            </p>
          </div>

          {/* Pay As You Go */}
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="p-6 bg-gradient-to-r from-accent/50 to-secondary/30 border-2 border-dashed border-primary/30">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-medium mb-2">Pay As You Go</h3>
                  <p className="text-muted-foreground">
                    No commitment. Buy points when you need them, use them when you want.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-medium">£0.20</p>
                    <p className="text-sm text-muted-foreground">per point</p>
                  </div>
                  <Button variant="outline">
                    Buy Points
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Subscription Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card 
                key={tier.id} 
                className={`relative p-6 ${tier.popular ? 'ring-2 ring-primary scale-105' : ''}`}
              >
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <p className="text-muted-foreground">{tier.description}</p>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-medium">£{tier.monthlyPrice}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-primary font-medium">
                        {tier.points} points
                      </span>
                      {tier.bonusPoints && (
                        <span className="text-amber-600">
                          + {tier.bonusPoints} bonus
                        </span>
                      )}
                    </div>
                    {tier.savings && (
                      <p className="text-sm text-green-600 font-medium mt-1">
                        {tier.savings}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full" 
                    variant={tier.popular ? 'default' : 'outline'}
                    onClick={onGetStarted}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              All plans include 24/7 support and access to our premium network
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Secure payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-4">
              Trusted by Dog Parents Everywhere
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <div className="aspect-[3/2] rounded-2xl overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1711702321421-7e65e5333805?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwZXQlMjBjYXJlJTIwZmFjaWxpdHl8ZW58MXx8fHwxNzU2NzM4MzU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern pet care facility"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[3/2] rounded-2xl overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1734921696542-7f7c9e831edb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2dzJTIwc29jaWFsaXppbmclMjBwYXJrfGVufDF8fHx8MTc1NjczODM1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Dogs socializing at park"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "DogPark(ing) has been a lifesaver for my busy schedule. I can find quality care for Max anywhere in the city!"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-medium">S</span>
                </div>
                <div>
                  <p className="font-medium">Sarah M.</p>
                  <p className="text-sm text-muted-foreground">Golden Retriever Parent</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "The point system is so convenient. No more worrying about cash or cards - just book and go!"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-orange-600 font-medium">M</span>
                </div>
                <div>
                  <p className="font-medium">Michael R.</p>
                  <p className="text-sm text-muted-foreground">French Bulldog Dad</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "Love how I can see real-time availability. Perfect for last-minute work meetings!"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-amber-600 font-medium">J</span>
                </div>
                <div>
                  <p className="font-medium">Jennifer L.</p>
                  <p className="text-sm text-muted-foreground">Rescue Dog Mom</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-medium text-white mb-4">
            Ready to Give Your Dog the Best Care?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of happy dog parents who trust DogPark(ing) for their pet care needs.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-lg px-8 py-6"
            onClick={onGetStarted}
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-white/80 text-sm mt-4">
            No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/30 border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                  <Heart className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-medium">DogPark(ing)</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your trusted dog parking solution for busy pet parents everywhere.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition-colors">Find Venues</a>
                <a href="#" className="block hover:text-foreground transition-colors">Pricing</a>
                <a href="#" className="block hover:text-foreground transition-colors">Mobile App</a>
                <a href="#" className="block hover:text-foreground transition-colors">For Venues</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition-colors">About Us</a>
                <a href="#" className="block hover:text-foreground transition-colors">Careers</a>
                <a href="#" className="block hover:text-foreground transition-colors">Press</a>
                <a href="#" className="block hover:text-foreground transition-colors">Contact</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition-colors">Help Center</a>
                <a href="#" className="block hover:text-foreground transition-colors">Safety</a>
                <a href="#" className="block hover:text-foreground transition-colors">Terms of Service</a>
                <a href="#" className="block hover:text-foreground transition-colors">Privacy Policy</a>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 DogPark(ing). All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}