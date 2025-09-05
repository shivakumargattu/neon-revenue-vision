import { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';

export interface DashboardData {
  client: string;
  amountPaid: number;
  industry: string;
  gmail: string;
}

export const useGoogleSheets = (csvUrl: string, refreshInterval = 30000) => {
  const [data, setData] = useState<DashboardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => {
          // Normalize headers to match our interface
          const normalized = header.toLowerCase().trim();
          if (normalized.includes('client')) return 'client';
          if (normalized.includes('amount') || normalized.includes('paid') || normalized.includes('revenue') || normalized.includes('apid')) return 'amountPaid';
          if (normalized.includes('industry')) return 'industry';
          if (normalized.includes('gmail') || normalized.includes('email')) return 'gmail';
          return header;
        },
        transform: (value, header) => {
          // Transform amount to number, removing currency symbols
          if (header === 'amountPaid') {
            const cleaned = value.replace(/[₹$,\s]/g, '');
            return parseFloat(cleaned) || 0;
          }
          return value;
        },
        complete: (results) => {
          const validData = results.data
            .filter((row: any) => row.client && row.amountPaid)
            .map((row: any) => ({
              client: row.client,
              amountPaid: Number(row.amountPaid),
              industry: row.industry || 'Unknown',
              gmail: row.gmail || ''
            }));

          setData(validData);
          setLastUpdated(new Date());
          setLoading(false);
        },
        error: (error) => {
          setError(error.message);
          setLoading(false);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setLoading(false);
    }
  }, [csvUrl]);

  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh
    const interval = setInterval(fetchData, refreshInterval);
    
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  const totalRevenue = data.reduce((sum, item) => sum + item.amountPaid, 0);
  const totalClients = data.length;
  const uniqueIndustries = [...new Set(data.map(item => item.industry))];
  
  const industryDistribution = uniqueIndustries.map(industry => ({
    name: industry,
    value: data.filter(item => item.industry === industry).length,
    revenue: data.filter(item => item.industry === industry).reduce((sum, item) => sum + item.amountPaid, 0)
  }));

  const monthlyRevenue = data.reduce((acc, item) => {
    // For demo purposes, distribute data across recent months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const randomMonth = months[Math.floor(Math.random() * months.length)];
    acc[randomMonth] = (acc[randomMonth] || 0) + item.amountPaid;
    return acc;
  }, {} as Record<string, number>);

  const revenueChartData = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
    month,
    revenue
  }));

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch: fetchData,
    analytics: {
      totalRevenue,
      totalClients,
      industryDistribution,
      revenueChartData,
      avgRevenuePerClient: totalClients > 0 ? totalRevenue / totalClients : 0
    }
  };
};