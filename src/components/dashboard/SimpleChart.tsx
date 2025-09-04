import { Card } from '@/components/ui/card';
import { DashboardData } from '@/hooks/useGoogleSheets';

interface SimpleChartProps {
  data: DashboardData[];
}

export const SimpleRevenueChart = ({ data }: SimpleChartProps) => {
  const monthlyData = data.reduce((acc, item, index) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const month = months[index % months.length];
    acc[month] = (acc[month] || 0) + item.amountPaid;
    return acc;
  }, {} as Record<string, number>);

  const maxRevenue = Math.max(...Object.values(monthlyData));

  return (
    <Card className="glass-card glass-hover p-6 col-span-2 animate-slide-in-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Revenue Trends</h3>
      </div>

      <div className="space-y-4">
        {Object.entries(monthlyData).map(([month, revenue], index) => (
          <div key={month} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">{month}</span>
              <span className="text-primary font-bold text-base bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ₹{revenue.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="w-full bg-muted/20 rounded-full h-3 shadow-inner">
              <div
                className="bg-gradient-to-r from-primary via-accent to-primary-glow h-3 rounded-full transition-all duration-1000 ease-out shadow-neon animate-glow-pulse"
                style={{
                  width: `${(revenue / maxRevenue) * 100}%`,
                  animationDelay: `${index * 0.1}s`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const SimpleIndustryChart = ({ data }: SimpleChartProps) => {
  const industryData = data.reduce((acc, item) => {
    acc[item.industry] = (acc[item.industry] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(industryData).reduce((sum, count) => sum + count, 0);
  const colors = [
    'from-primary to-primary-glow',
    'from-accent to-accent-glow',
    'from-success to-success',
    'from-warning to-warning',
    'from-destructive to-destructive',
  ];

  return (
    <Card className="glass-card glass-hover p-6 animate-slide-in-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Industry Distribution</h3>
      </div>

      <div className="space-y-4">
        {Object.entries(industryData).map(([industry, count], index) => {
          const percentage = ((count / total) * 100).toFixed(1);
          return (
            <div key={industry} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground font-medium">{industry}</span>
                <span className="text-muted-foreground">{percentage}%</span>
              </div>
              <div className="w-full bg-muted/20 rounded-full h-3 shadow-inner">
                <div
                  className={`bg-gradient-to-r ${colors[index % colors.length]} h-3 rounded-full transition-all duration-1000 ease-out shadow-glow`}
                  style={{
                    width: `${percentage}%`,
                    animationDelay: `${index * 0.1}s`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};