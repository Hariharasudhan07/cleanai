import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const navigateToApp = () => {
    setLocation('/app/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-foreground">CleanAI</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => scrollToSection('problem')}
                className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium transition-colors"
                data-testid="nav-problem"
              >
                Problem
              </button>
              <button 
                onClick={() => scrollToSection('solution')}
                className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium transition-colors"
                data-testid="nav-solution"
              >
                Solution
              </button>
              <button 
                onClick={() => scrollToSection('impact')}
                className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium transition-colors"
                data-testid="nav-impact"
              >
                Impact
              </button>
            </div>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={navigateToApp} data-testid="button-demo">
              Request Demo
            </Button>
            <Button size="sm" onClick={navigateToApp} data-testid="button-trial">
              Start Free Trial
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card rounded-lg mt-2 border border-border">
              <button 
                onClick={() => scrollToSection('problem')}
                className="text-muted-foreground hover:text-foreground block px-3 py-2 text-base font-medium w-full text-left"
                data-testid="mobile-nav-problem"
              >
                Problem
              </button>
              <button 
                onClick={() => scrollToSection('solution')}
                className="text-muted-foreground hover:text-foreground block px-3 py-2 text-base font-medium w-full text-left"
                data-testid="mobile-nav-solution"
              >
                Solution
              </button>
              <button 
                onClick={() => scrollToSection('impact')}
                className="text-muted-foreground hover:text-foreground block px-3 py-2 text-base font-medium w-full text-left"
                data-testid="mobile-nav-impact"
              >
                Impact
              </button>
              <div className="pt-4 pb-2 space-y-2">
                <Button variant="ghost" size="sm" className="w-full" onClick={navigateToApp} data-testid="mobile-button-demo">
                  Request Demo
                </Button>
                <Button size="sm" className="w-full" onClick={navigateToApp} data-testid="mobile-button-trial">
                  Start Free Trial
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}