import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ProblemSection from '@/components/ProblemSection';
import SolutionSection from '@/components/SolutionSection';
import ImpactSection from '@/components/ImpactSection';
import CTAFooter from '@/components/CTAFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <ImpactSection />
      </main>
      <CTAFooter />
    </div>
  );
}