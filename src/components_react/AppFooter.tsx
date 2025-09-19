import React from 'react';
import { Heart } from 'lucide-react';

interface AppFooterProps {
  hide?: boolean;
}

export function AppFooter({ hide = false }: AppFooterProps) {
  if (hide) return null;

  return (
    <footer className="border-t bg-card/30 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              © 2025 DogPark(ing). Your trusted dog parking solution.
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Help</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}