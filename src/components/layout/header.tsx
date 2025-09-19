'use client';

import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Map, 
  User, 
  Heart, 
  Search, 
  Bell,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userPoints] = useState(150);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-medium">DogPark(ing)</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Find your perfect dog parking spot
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/venues">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  Find Care
                </Button>
              </Link>
              {user && (
                <Link href="/dashboard">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              )}
            </nav>

            {/* User Info & Mobile Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                {user && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {userPoints} points
                  </Badge>
                )}
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
                {user ? (
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/auth/login">
                      <Button variant="outline">Sign In</Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button>Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t">
              <div className="space-y-3">
                <Link href="/venues" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Map className="h-4 w-4 mr-2" />
                    Find Care
                  </Button>
                </Link>
                {user && (
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Separator />
                {user && (
                  <>
                    <div className="flex items-center justify-between px-3">
                      <span className="text-sm text-muted-foreground">Points Balance</span>
                      <Badge variant="outline">{userPoints} points</Badge>
                    </div>
                    <Separator />
                  </>
                )}
                {user ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-muted-foreground"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full justify-start">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
  );
}