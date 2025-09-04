import { Card } from '@/components/ui/card';
import { DashboardData } from '@/hooks/useGoogleSheets';
import { Badge } from '@/components/ui/badge';
import { Mail, Building, DollarSign } from 'lucide-react';

interface ClientTableProps {
  data: DashboardData[];
}

export const ClientTable = ({ data }: ClientTableProps) => {
  const formatCurrency = (amount: number) => 
    `₹${amount.toLocaleString('en-IN')}`;

  const getIndustryColor = (industry: string) => {
    const colors = {
      'Technology': 'bg-primary/20 text-primary',
      'Healthcare': 'bg-success/20 text-success',
      'Finance': 'bg-accent/20 text-accent',
      'Education': 'bg-warning/20 text-warning',
      'Retail': 'bg-destructive/20 text-destructive',
    };
    return colors[industry as keyof typeof colors] || 'bg-muted/20 text-muted-foreground';
  };

  // Sort by amount paid descending
  const sortedData = [...data].sort((a, b) => b.amountPaid - a.amountPaid);

  return (
    <Card className="glass-card p-6 col-span-3 animate-slide-in-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Top Clients</h3>
        <div className="text-sm text-muted-foreground">
          {data.length} total clients
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scroll">
        {sortedData.slice(0, 10).map((client, index) => (
          <div 
            key={`${client.client}-${index}`}
            className="glass-surface rounded-lg p-4 hover:bg-primary/5 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="font-semibold text-foreground truncate">
                    {client.client}
                  </div>
                  <Badge className={getIndustryColor(client.industry)}>
                    <Building className="w-3 h-3 mr-1" />
                    {client.industry}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {client.gmail && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span className="truncate max-w-[200px]">{client.gmail}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-lg font-bold text-primary group-hover:text-primary-glow transition-colors">
                <DollarSign className="w-5 h-5" />
                {formatCurrency(client.amountPaid)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};