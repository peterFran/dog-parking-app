import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
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

export function AppHeader() {
  const [userPoints] = useState(150);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActiveRoute = (route: string) => {
    if (route === '/find-care' && pathname === '/find-care') return true;
    if (route === '/dashboard' && pathname === '/dashboard') return true;
    return false;
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-medium">DogPark(ing)</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Find your perfect dog parking spot
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/find-care">
              <Button
                variant={isActiveRoute('/find-care') ? 'default' : 'ghost'}
                className="flex items-center gap-2"
              >
                <Map className="h-4 w-4" />
                Find Care
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant={isActiveRoute('/dashboard') ? 'default' : 'ghost'}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </nav>

          {/* User Info & Mobile Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {userPoints} points
              </Badge>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
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
              <Link href="/find-care">
                <Button
                  variant={isActiveRoute('/find-care') ? 'default' : 'ghost'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full justify-start"
                >
                  <Map className="h-4 w-4 mr-2" />
                  Find Care
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant={isActiveRoute('/dashboard') ? 'default' : 'ghost'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full justify-start"
                >
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Separator />
              <div className="flex items-center justify-between px-3">
                <span className="text-sm text-muted-foreground">Points Balance</span>
                <Badge variant="outline">{userPoints} points</Badge>
              </div>
              <Separator />
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}