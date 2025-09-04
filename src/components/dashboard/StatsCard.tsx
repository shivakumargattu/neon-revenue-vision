import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: ReactNode;
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
  style?: React.CSSProperties;
}

export const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  className,
  trend = 'neutral',
  style
}: StatsCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card 
      className={cn(
        'glass-card glass-hover p-6 relative overflow-hidden group',
        'animate-fade-in-scale',
        className
      )}
      style={style}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-muted-foreground text-sm font-medium">
            {title}
          </div>
          <div className="text-primary/80 group-hover:text-primary transition-colors">
            {icon}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl font-bold text-foreground">
            {value}
          </div>
          {change && (
            <div className={cn('text-sm font-medium', getTrendColor())}>
              {change}
            </div>
          )}
        </div>
      </div>
      
      {/* Subtle border glow on hover */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" 
           style={{ filter: 'blur(1px)' }} />
    </Card>
  );
};