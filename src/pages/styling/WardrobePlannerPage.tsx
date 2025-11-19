import React, { useState, useMemo } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  ShoppingBag, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Package,
  Plus,
  Target,
  BarChart3,
} from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { format } from 'date-fns';

interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  purchaseDate: string;
  season: string;
  occasion: string;
}

interface WardrobeGoal {
  id: string;
  name: string;
  targetItems: number;
  currentItems: number;
  category: string;
  deadline?: string;
}

const WardrobePlannerPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'goals' | 'analysis'>('overview');

  // Mock wardrobe data
  const wardrobeItems = useMemo(() => [
    {
      id: 'w1',
      name: 'Classic Black Dress',
      category: 'Dresses',
      image: '/api/placeholder/200/200',
      price: 299.99,
      purchaseDate: '2023-06-15',
      season: 'all',
      occasion: 'formal',
    },
    {
      id: 'w2',
      name: 'Winter Coat',
      category: 'Outerwear',
      image: '/api/placeholder/200/200',
      price: 450.00,
      purchaseDate: '2023-10-20',
      season: 'winter',
      occasion: 'casual',
    },
    {
      id: 'w3',
      name: 'Leather Handbag',
      category: 'Bags',
      image: '/api/placeholder/200/200',
      price: 599.99,
      purchaseDate: '2023-08-10',
      season: 'all',
      occasion: 'all',
    },
  ] as WardrobeItem[], []);

  const wardrobeGoals = useMemo(() => [
    {
      id: 'g1',
      name: 'Build Work Wardrobe',
      targetItems: 10,
      currentItems: 6,
      category: 'Work',
      deadline: '2024-03-01',
    },
    {
      id: 'g2',
      name: 'Summer Essentials',
      targetItems: 8,
      currentItems: 5,
      category: 'Summer',
      deadline: '2024-06-01',
    },
    {
      id: 'g3',
      name: 'Formal Event Pieces',
      targetItems: 5,
      currentItems: 2,
      category: 'Formal',
      deadline: '2024-05-01',
    },
  ] as WardrobeGoal[], []);

  const wardrobeStats = useMemo(() => {
    const totalItems = wardrobeItems.length;
    const totalValue = wardrobeItems.reduce((sum, item) => sum + item.price, 0);
    const categories = wardrobeItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const seasons = wardrobeItems.reduce((acc, item) => {
      acc[item.season] = (acc[item.season] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalItems,
      totalValue,
      categories,
      seasons,
      averageItemValue: totalValue / totalItems || 0,
    };
  }, [wardrobeItems]);

  const getGoalProgress = (goal: WardrobeGoal) => {
    return (goal.currentItems / goal.targetItems) * 100;
  };

  return (
    <div className="space-y-8">
      <div>
        <H1>Wardrobe Planner</H1>
        <P className="text-muted-foreground">Organize, plan, and optimize your wardrobe</P>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <P className="text-3xl font-bold">{wardrobeStats.totalItems}</P>
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Wardrobe Value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <P className="text-3xl font-bold">{formatPrice(wardrobeStats.totalValue)}</P>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Avg Item Value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <P className="text-3xl font-bold">{formatPrice(wardrobeStats.averageItemValue)}</P>
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active Goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <P className="text-3xl font-bold">{wardrobeGoals.length}</P>
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>By Category</CardTitle>
                <CardDescription>Items organized by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(wardrobeStats.categories).map(([category, count]) => {
                  const percentage = (count / wardrobeStats.totalItems) * 100;
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{category}</span>
                        <span className="text-muted-foreground">{count} items</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>By Season</CardTitle>
                <CardDescription>Seasonal wardrobe distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(wardrobeStats.seasons).map(([season, count]) => {
                  const percentage = (count / wardrobeStats.totalItems) * 100;
                  return (
                    <div key={season} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium capitalize">{season}</span>
                        <span className="text-muted-foreground">{count} items</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Recent Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Active Goals</CardTitle>
              <CardDescription>Track your wardrobe building progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wardrobeGoals.map((goal) => {
                  const progress = getGoalProgress(goal);
                  return (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <P className="font-semibold">{goal.name}</P>
                          <Muted className="text-sm">
                            {goal.currentItems} / {goal.targetItems} items
                            {goal.deadline && ` • Due ${format(new Date(goal.deadline), 'MMM dd, yyyy')}`}
                          </Muted>
                        </div>
                        <Badge variant={progress >= 100 ? 'default' : 'secondary'}>
                          {Math.round(progress)}%
                        </Badge>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <H1 className="text-2xl">Wardrobe Inventory</H1>
              <P className="text-muted-foreground">View and manage all your wardrobe items</P>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wardrobeItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-4">
                  <P className="font-semibold mb-1">{item.name}</P>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{item.category}</Badge>
                    <Badge variant="secondary" className="capitalize">{item.season}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <P className="font-bold">{formatPrice(item.price)}</P>
                    <Muted className="text-xs">
                      {format(new Date(item.purchaseDate), 'MMM yyyy')}
                    </Muted>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <H1 className="text-2xl">Wardrobe Goals</H1>
              <P className="text-muted-foreground">Set and track your wardrobe building goals</P>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Goal
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {wardrobeGoals.map((goal) => {
              const progress = getGoalProgress(goal);
              const isComplete = progress >= 100;
              return (
                <Card key={goal.id} className={isComplete ? 'border-green-500' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {goal.name}
                          {isComplete && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {goal.category} • {goal.currentItems} / {goal.targetItems} items
                        </CardDescription>
                      </div>
                      <Badge variant={isComplete ? 'default' : 'secondary'}>
                        {Math.round(progress)}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={progress} className="h-3" />
                    {goal.deadline && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Deadline: {format(new Date(goal.deadline), 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                    {!isComplete && (
                      <P className="text-sm text-muted-foreground">
                        {goal.targetItems - goal.currentItems} more items needed
                      </P>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wardrobe Analysis</CardTitle>
              <CardDescription>Insights about your wardrobe composition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <P className="font-semibold mb-2">Category Distribution</P>
                  <div className="space-y-2">
                    {Object.entries(wardrobeStats.categories).map(([category, count]) => {
                      const percentage = (count / wardrobeStats.totalItems) * 100;
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-sm">{category}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={percentage} className="w-32 h-2" />
                            <span className="text-sm font-medium w-12 text-right">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <P className="font-semibold mb-2">Recommendations</P>
                  <div className="space-y-2">
                    {Object.entries(wardrobeStats.categories).length < 5 && (
                      <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div>
                          <P className="text-sm font-medium">Diversify Your Wardrobe</P>
                          <Muted className="text-xs">
                            Consider adding items from other categories for more versatility
                          </Muted>
                        </div>
                      </div>
                    )}
                    {wardrobeStats.totalItems < 20 && (
                      <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                        <Target className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <P className="text-sm font-medium">Build Your Capsule Wardrobe</P>
                          <Muted className="text-xs">
                            Aim for 20-30 versatile pieces for a complete wardrobe
                          </Muted>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WardrobePlannerPage;

