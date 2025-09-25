import { Card, CardContent } from '@/components/ui/card';
import { Search, Wand2, Database } from 'lucide-react';

export default function SolutionSection() {
  const features = [
    {
      icon: Search,
      title: "Detect & Classify",
      description: "AI algorithms identify messy records in real time, categorizing data quality issues across your entire enterprise ecosystem.",
      gradient: "from-primary/20 to-purple-400/20"
    },
    {
      icon: Wand2, 
      title: "Clean & Standardize",
      description: "Advanced normalization engine transforms entities across merchants, SKUs, customers, and medical terms into consistent formats.",
      gradient: "from-purple-400/20 to-primary/20"
    },
    {
      icon: Database,
      title: "Enrich & Integrate", 
      description: "Seamlessly connect with trusted taxonomies and your existing data lakes, warehouses, and ML pipelines.",
      gradient: "from-primary/20 to-chart-3/20"
    }
  ];

  return (
    <section id="solution" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            AI-Driven Data Normalization & Enrichment
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your data infrastructure with enterprise-grade cleaning and standardization
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover-elevate transition-all duration-300 border-border/50" data-testid={`solution-card-${index}`}>
              <CardContent className="p-8 text-center">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6`}>
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Integration Preview */}
        <div className="mt-16 text-center">
          {/* <Card className="max-w-4xl mx-auto bg-gradient-to-r from-card to-card/50 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Enterprise Integration
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                <div className="p-3 bg-muted/20 rounded-lg">Snowflake</div>
                <div className="p-3 bg-muted/20 rounded-lg">BigQuery</div>
                <div className="p-3 bg-muted/20 rounded-lg">Databricks</div>
                <div className="p-3 bg-muted/20 rounded-lg">AWS S3</div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </section>
  );
}