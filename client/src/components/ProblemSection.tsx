import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, TrendingDown } from 'lucide-react';

export default function ProblemSection() {
  const industryExamples = [
    {
      title: "Banking & Payments",
      messyData: "`DEB1T PAYP4L +R4N5FAR`, `5tripe nords+r0m`",
      consequence: "fraud models misfire, compliance at risk",
      icon: "💳"
    },
    {
      title: "Supply & Demand", 
      messyData: "duplicate SKUs, free-text warehouses",
      consequence: "inaccurate forecasts, excess inventory",
      icon: "📦"
    },
    {
      title: "Retail & E-commerce",
      messyData: "`Adiddas`, random size codes",
      consequence: "broken recommendations, lost sales", 
      icon: "🛒"
    },
    {
      title: "Healthcare",
      messyData: "`HTN` vs `Hypertension`",
      consequence: "flawed patient insights",
      icon: "🏥"
    },
    {
      title: "Travel",
      messyData: "duplicate guests, mixed dates",
      consequence: "overbooking and weak loyalty analytics",
      icon: "✈️"
    }
  ];

  return (
    <section id="problem" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive mr-3" />
            <TrendingDown className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            The Hidden Problem Across Industries
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Dirty, inconsistent data silently kills AI ROI.
          </p>
        </div>

        {/* Industry Examples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industryExamples.map((example, index) => (
            <Card key={index} className="hover-elevate transition-all duration-300" data-testid={`problem-card-${index}`}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">{example.icon}</span>
                  <h3 className="text-lg font-semibold text-foreground">{example.title}</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Messy Input:</p>
                    <code className="block bg-destructive/10 text-destructive p-2 rounded text-sm font-mono border border-destructive/20">
                      {example.messyData}
                    </code>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-destructive mr-2">→</span>
                    <p className="text-sm text-muted-foreground italic">{example.consequence}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Impact Statement */}
        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground">
            <span className="text-destructive font-semibold">Result:</span> Billions lost in AI investments that fail to deliver.
          </p>
        </div>
      </div>
    </section>
  );
}