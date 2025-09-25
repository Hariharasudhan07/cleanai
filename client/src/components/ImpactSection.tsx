import { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, Clock, Shield } from 'lucide-react';

interface CounterProps {
  end: number;
  suffix: string;
  prefix?: string;
  icon: any;
  label: string;
  trend: 'up' | 'down';
  isVisible: boolean;
}

function AnimatedCounter({ end, suffix, prefix = '', icon: Icon, label, trend, isVisible }: CounterProps) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number;
    const duration = 2000; // 2 seconds
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(end * easeOutQuart));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, isVisible]);
  
  return (
    <Card className="hover-elevate transition-all duration-300" data-testid={`impact-counter-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className={`p-3 rounded-full ${trend === 'up' ? 'bg-chart-3/20' : 'bg-destructive/20'}`}>
            <Icon className={`w-6 h-6 ${trend === 'up' ? 'text-chart-3' : 'text-destructive'}`} />
          </div>
          {trend === 'up' ? (
            <TrendingUp className="w-5 h-5 text-chart-3 ml-2" />
          ) : (
            <TrendingDown className="w-5 h-5 text-destructive ml-2" />
          )}
        </div>
        
        <div className={`text-3xl font-bold mb-2 ${isVisible ? 'animate-count-up' : 'opacity-0'}`}>
          <span className={trend === 'up' ? 'text-chart-3' : 'text-destructive'}>
            {prefix}{count}{suffix}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
      </CardContent>
    </Card>
  );
}

export default function ImpactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const metrics = [
    {
      end: 98,
      suffix: '%',
      icon: Target,
      label: 'Data Accuracy',
      trend: 'up' as const
    },
    {
      end: 70,
      suffix: '%',
      icon: Clock,
      label: 'Manual Cleansing Time',
      trend: 'down' as const
    },
    {
      end: 40,
      suffix: '%',
      icon: TrendingDown,
      label: 'AI Model Cost',
      trend: 'down' as const
    },
    {
      end: 35,
      suffix: ' pts',
      prefix: '+',
      icon: TrendingUp,
      label: 'Prediction Accuracy',
      trend: 'up' as const
    },
    {
      end: 50,
      suffix: '%',
      icon: Shield,
      label: 'Compliance Risk',
      trend: 'down' as const
    }
  ];

  return (
    <section ref={sectionRef} id="impact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Measurable Business Impact
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Real results from enterprise customers across industries
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <AnimatedCounter
              key={index}
              {...metric}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* ROI Statement */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-purple-400/10 border-primary/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Up to 3× return on data spend within 12 months
              </h3>
              <p className="text-muted-foreground">
                Average enterprise ROI based on reduced operational costs and improved AI model performance
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}