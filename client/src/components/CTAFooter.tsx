import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function CTAFooter() {
  const [, setLocation] = useLocation();

  const navigateToApp = () => {
    setLocation('/app/');
  };

  return (
    <footer className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-card/50 to-background">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main CTA */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-8">
            Make Your Data AI-Ready Today
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Button 
              size="lg" 
              className="text-lg px-10 py-4 h-auto font-semibold"
              onClick={navigateToApp}
              data-testid="footer-button-demo"
            >
              Request a Demo
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-10 py-4 h-auto font-semibold border-primary/30 hover:bg-primary/10"
              onClick={navigateToApp}
              data-testid="footer-button-trial"
            >
              Start Free Trial
            </Button>
          </div>
          
          <p className="text-muted-foreground">
            Join us to transform your data infrastructure
          </p>
        </div>

        {/* Footer Links */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-6">
              <h3 className="text-lg font-semibold text-foreground">CleanAI</h3>
              <span className="text-muted-foreground text-sm">
                © 2025 CleanAI. All rights reserved.
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a 
                href="#privacy" 
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                data-testid="link-privacy"
              >
                Privacy Policy
              </a>
              <a 
                href="#contact" 
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                data-testid="link-contact"
              >
                Contact
              </a>
              <a 
                href="#terms" 
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                data-testid="link-terms"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}