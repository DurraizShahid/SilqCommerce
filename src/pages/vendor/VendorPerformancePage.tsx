import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Award, Target, BarChart3, Star, Package, Users } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

const VendorPerformancePage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [timeRange, setTimeRange] = useState('30d');

  const performanceMetrics = {
    overallScore: 87,
    rank: 12,
    totalVendors: 156,
    sales: {
      current: 125000,
      previous: 110000,
      growth: 13.6,
    },
    orders: {
      current: 245,
      previous: 210,
      growth: 16.7,
    },
    rating: {
      current: 4.8,
      previous: 4.7,
      growth: 2.1,
    },
    conversion: {
      current: 3.2,
      previous: 2.9,
      growth: 10.3,
    },
  };

  const benchmarks = {
    averageSales: 85000,
    averageRating: 4.5,
    averageConversion: 2.5,
    topVendorSales: 250000,
  };

  const kpis = [
    {
      name: 'Sales Performance',
      value: performanceMetrics.sales.current,
      target: benchmarks.topVendorSales,
      percentage: (performanceMetrics.sales.current / benchmarks.topVendorSales) * 100,
      status: performanceMetrics.sales.current >= benchmarks.averageSales ? 'above' : 'below',
    },
    {
      name: 'Customer Rating',
      value: performanceMetrics.rating.current,
      target: 5.0,
      percentage: (performanceMetrics.rating.current / 5.0) * 100,
      status: performanceMetrics.rating.current >= benchmarks.averageRating ? 'above' : 'below',
    },
    {
      name: 'Conversion Rate',
      value: `${performanceMetrics.conversion.current}%`,
      target: '4.0%',
      percentage: (performanceMetrics.conversion.current / 4.0) * 100,
      status: performanceMetrics.conversion.current >= benchmarks.averageConversion ? 'above' : 'below',
    },
    {
      name: 'Order Volume',
      value: performanceMetrics.orders.current,
      target: 300,
      percentage: (performanceMetrics.orders.current / 300) * 100,
      status: performanceMetrics.orders.current >= 200 ? 'above' : 'below',
    },
  ];

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (growth < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Performance Metrics</H1>
          <P className="text-muted-foreground">Track your performance and compare with benchmarks</P>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overall Performance */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">{performanceMetrics.overallScore}</div>
            <Progress value={performanceMetrics.overallScore} className="h-2 mb-2" />
            <Muted className="text-sm">Out of 100</Muted>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Vendor Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">#{performanceMetrics.rank}</div>
            <Muted className="text-sm">
              Out of {performanceMetrics.totalVendors} vendors
            </Muted>
            <Badge variant="default" className="mt-2">
              Top {Math.round((performanceMetrics.rank / performanceMetrics.totalVendors) * 100)}%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              Performance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-6 w-6 text-green-500" />
              <span className="text-2xl font-bold text-green-500">+8.5%</span>
            </div>
            <Muted className="text-sm">Improved from last period</Muted>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(performanceMetrics.sales.current)}</div>
            <div className="flex items-center gap-1 mt-1">
              {getGrowthIcon(performanceMetrics.sales.growth)}
              <span className={`text-sm ${performanceMetrics.sales.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {performanceMetrics.sales.growth > 0 ? '+' : ''}
                {performanceMetrics.sales.growth}%
              </span>
            </div>
            <Muted className="text-xs mt-1">vs last period</Muted>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.orders.current}</div>
            <div className="flex items-center gap-1 mt-1">
              {getGrowthIcon(performanceMetrics.orders.growth)}
              <span className={`text-sm ${performanceMetrics.orders.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {performanceMetrics.orders.growth > 0 ? '+' : ''}
                {performanceMetrics.orders.growth}%
              </span>
            </div>
            <Muted className="text-xs mt-1">vs last period</Muted>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4" />
              Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.rating.current}</div>
            <div className="flex items-center gap-1 mt-1">
              {getGrowthIcon(performanceMetrics.rating.growth)}
              <span className={`text-sm ${performanceMetrics.rating.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {performanceMetrics.rating.growth > 0 ? '+' : ''}
                {performanceMetrics.rating.growth}%
              </span>
            </div>
            <Muted className="text-xs mt-1">vs last period</Muted>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.conversion.current}%</div>
            <div className="flex items-center gap-1 mt-1">
              {getGrowthIcon(performanceMetrics.conversion.growth)}
              <span className={`text-sm ${performanceMetrics.conversion.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {performanceMetrics.conversion.growth > 0 ? '+' : ''}
                {performanceMetrics.conversion.growth}%
              </span>
            </div>
            <Muted className="text-xs mt-1">vs last period</Muted>
          </CardContent>
        </Card>
      </div>

      {/* KPI Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {kpis.map((kpi) => (
            <div key={kpi.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>{kpi.name}</Label>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <P className="font-semibold">{kpi.value}</P>
                    <Muted className="text-xs">Target: {kpi.target}</Muted>
                  </div>
                  <Badge variant={kpi.status === 'above' ? 'default' : 'secondary'}>
                    {kpi.status === 'above' ? 'Above Average' : 'Below Average'}
                  </Badge>
                </div>
              </div>
              <Progress value={kpi.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Benchmarks Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Benchmark Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <div>
                <P className="font-semibold">Your Sales</P>
                <Muted className="text-sm">vs Market Average</Muted>
              </div>
              <div className="text-right">
                <P className="font-bold text-lg">{formatPrice(performanceMetrics.sales.current)}</P>
                <Muted className="text-sm">
                  Avg: {formatPrice(benchmarks.averageSales)} • Top: {formatPrice(benchmarks.topVendorSales)}
                </Muted>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <div>
                <P className="font-semibold">Your Rating</P>
                <Muted className="text-sm">vs Market Average</Muted>
              </div>
              <div className="text-right">
                <P className="font-bold text-lg">{performanceMetrics.rating.current} ⭐</P>
                <Muted className="text-sm">Market Avg: {benchmarks.averageRating} ⭐</Muted>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <div>
                <P className="font-semibold">Your Conversion Rate</P>
                <Muted className="text-sm">vs Market Average</Muted>
              </div>
              <div className="text-right">
                <P className="font-bold text-lg">{performanceMetrics.conversion.current}%</P>
                <Muted className="text-sm">Market Avg: {benchmarks.averageConversion}%</Muted>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorPerformancePage;

