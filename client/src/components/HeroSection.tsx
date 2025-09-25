import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const [, setLocation] = useLocation();

  const navigateToApp = () => {
    setLocation('/app/');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(270_100%_20%)] via-background to-[hsl(220_100%_50%)] opacity-40"></div>
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-float"></div>
        <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-purple-400/40 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-primary/25 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 leading-tight">
          Transform Data Chaos Into{' '}
          <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            AI Success
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          We turn messy data into AI-ready fuel across banking, supply chain, retail, healthcare, and more.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="text-lg px-8 py-4 h-auto font-semibold"
            onClick={navigateToApp}
            data-testid="hero-button-demo"
          >
            Request a Demo
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-8 py-4 h-auto font-semibold bg-background/10 backdrop-blur-sm border-primary/30 hover:bg-primary/10"
            onClick={navigateToApp}
            data-testid="hero-button-trial"
          >
            Start Free Trial
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground/30 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}