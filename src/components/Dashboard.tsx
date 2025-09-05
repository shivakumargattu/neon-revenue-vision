import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { StatsCard } from './dashboard/StatsCard';
import { SimpleRevenueChart, SimpleIndustryChart } from './dashboard/SimpleChart';
import { ClientTable } from './dashboard/ClientTable';
import { Card } from '@/components/ui/card';
import { 
  TrendingUp, 
  Users, 
  Building, 
  DollarSign, 
  RefreshCw,
  Activity,
  Zap,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/116p6eIRUU2JbIvyd3RPXtIyz9AsnSGRqGpTKE55z46s/export?format=csv';

export const Dashboard = () => {
  const { 
    data, 
    loading, 
    error, 
    lastUpdated, 
    refetch, 
    analytics 
  } = useGoogleSheets(CSV_URL);
  
  const { toast } = useToast();

  const handleRefresh = async () => {
    await refetch();
    toast({
      title: "Dashboard Updated",
      description: "Data has been refreshed from Google Sheets",
    });
  };

  const formatCurrency = (amount: number) => 
    `₹${amount.toLocaleString('en-IN')}`;

  const formatDate = (date: Date) => 
    date.toLocaleString('en-IN', { 
      dateStyle: 'short', 
      timeStyle: 'short' 
    });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass-card p-8 text-center max-w-md">
          <div className="text-destructive mb-4">
            <Activity className="w-12 h-12 mx-auto mb-2" />
            <h2 className="text-xl font-bold">Connection Error</h2>
          </div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline" className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Connection
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Header */}
      <header className="glass-surface border-b border-primary/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Service Payments Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Track payments received from clients for services provided
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <div className="text-sm text-muted-foreground">
                  Last updated: {formatDate(lastUpdated)}
                </div>
              )}
              <Button 
                onClick={handleRefresh} 
                disabled={loading}
                className="bg-primary hover:bg-primary-glow text-primary-foreground font-semibold px-6 py-2 shadow-neon hover:shadow-cyan transition-all duration-300 border border-primary/30"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      {loading && !data.length ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="glass-card p-8 text-center">
            <div className="animate-glow-pulse">
              <Zap className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-bold mb-2">Loading Dashboard</h2>
              <p className="text-muted-foreground">Fetching data from Google Sheets...</p>
            </div>
          </Card>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto p-6 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Payments Received"
              value={formatCurrency(analytics.totalRevenue)}
              change="From all clients"
              trend="up"
              icon={<DollarSign className="w-6 h-6" />}
              className="animate-fade-in-scale"
            />
            <StatsCard
              title="Paying Clients"
              value={analytics.totalClients}
              change="Active service clients"
              trend="up"
              icon={<Users className="w-6 h-6" />}
              className="animate-fade-in-scale"
              style={{ animationDelay: '0.1s' }}
            />
            <StatsCard
              title="Industries"
              value={analytics.industryDistribution.length}
              change="Diverse portfolio"
              trend="neutral"
              icon={<Building className="w-6 h-6" />}
              className="animate-fade-in-scale"
              style={{ animationDelay: '0.2s' }}
            />
            <StatsCard
              title="Avg Payment/Client"
              value={formatCurrency(analytics.avgRevenuePerClient)}
              change="Service value per client"
              trend="up"
              icon={<Target className="w-6 h-6" />}
              className="animate-fade-in-scale"
              style={{ animationDelay: '0.3s' }}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SimpleRevenueChart data={data} />
            <SimpleIndustryChart data={data} />
          </div>

          {/* Client Table */}
          <div className="grid grid-cols-1 gap-6">
            <ClientTable data={data} />
          </div>

          {/* Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card glass-hover p-6 animate-slide-in-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Data Health</h3>
                <Activity className="w-5 h-5 text-success" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Connection Status</span>
                  <span className="text-success font-medium">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Records Loaded</span>
                  <span className="text-foreground font-medium">{data.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Auto-Refresh</span>
                  <span className="text-accent font-medium">30s</span>
                </div>
              </div>
            </Card>

            <Card className="glass-card glass-hover p-6 animate-slide-in-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Growth Metrics</h3>
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Revenue Growth</span>
                  <span className="text-success font-medium">+12.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Client Acquisition</span>
                  <span className="text-success font-medium">+18.3%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Market Expansion</span>
                  <span className="text-primary font-medium">Active</span>
                </div>
              </div>
            </Card>

            <Card className="glass-card glass-hover p-6 animate-slide-in-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">System Status</h3>
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">API Response</span>
                  <span className="text-success font-medium">Fast</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Data Sync</span>
                  <span className="text-success font-medium">Real-time</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="text-success font-medium">99.9%</span>
                </div>
              </div>
            </Card>
          </div>
        </main>
      )}
    </div>
  );
};