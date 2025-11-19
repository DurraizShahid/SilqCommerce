import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Star, ShoppingBag, Heart, Gift, Crown, Award, Target } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'shopping' | 'social' | 'loyalty' | 'milestone';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
  reward?: string;
}

const AchievementsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unlocked' | 'locked'>('all');

  const achievements: Achievement[] = [
    {
      id: 'a1',
      name: 'First Purchase',
      description: 'Make your first purchase',
      icon: <ShoppingBag className="h-6 w-6" />,
      category: 'shopping',
      unlocked: true,
      unlockedAt: '2023-10-15',
      reward: '10 points',
    },
    {
      id: 'a2',
      name: 'Loyal Customer',
      description: 'Make 10 purchases',
      icon: <Heart className="h-6 w-6" />,
      category: 'loyalty',
      unlocked: true,
      unlockedAt: '2023-11-10',
      progress: 10,
      target: 10,
      reward: '50 points',
    },
    {
      id: 'a3',
      name: 'Review Master',
      description: 'Write 5 product reviews',
      icon: <Star className="h-6 w-6" />,
      category: 'social',
      unlocked: false,
      progress: 3,
      target: 5,
      reward: '25 points',
    },
    {
      id: 'a4',
      name: 'Wishlist Collector',
      description: 'Add 20 items to your wishlist',
      icon: <Gift className="h-6 w-6" />,
      category: 'shopping',
      unlocked: false,
      progress: 12,
      target: 20,
      reward: '30 points',
    },
    {
      id: 'a5',
      name: 'VIP Member',
      description: 'Reach Gold tier in loyalty program',
      icon: <Crown className="h-6 w-6" />,
      category: 'milestone',
      unlocked: true,
      unlockedAt: '2023-11-20',
      reward: '100 points + VIP badge',
    },
    {
      id: 'a6',
      name: 'Social Butterfly',
      description: 'Share 10 products on social media',
      icon: <Award className="h-6 w-6" />,
      category: 'social',
      unlocked: false,
      progress: 7,
      target: 10,
      reward: '40 points',
    },
    {
      id: 'a7',
      name: 'Big Spender',
      description: 'Spend $5,000 total',
      icon: <Trophy className="h-6 w-6" />,
      category: 'milestone',
      unlocked: false,
      progress: 3500,
      target: 5000,
      reward: '200 points',
    },
    {
      id: 'a8',
      name: 'Referral Champion',
      description: 'Refer 5 friends who make a purchase',
      icon: <Target className="h-6 w-6" />,
      category: 'social',
      unlocked: false,
      progress: 2,
      target: 5,
      reward: '75 points',
    },
  ];

  const filteredAchievements = achievements.filter((achievement) => {
    if (activeTab === 'unlocked') return achievement.unlocked;
    if (activeTab === 'locked') return !achievement.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalPoints = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => {
      const points = parseInt(a.reward?.match(/\d+/)?.[0] || '0');
      return sum + points;
    }, 0);

  const getCategoryColor = (category: Achievement['category']) => {
    switch (category) {
      case 'shopping':
        return 'bg-blue-100 text-blue-600';
      case 'social':
        return 'bg-purple-100 text-purple-600';
      case 'loyalty':
        return 'bg-yellow-100 text-yellow-600';
      case 'milestone':
        return 'bg-green-100 text-green-600';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <H1>Achievements</H1>
        <P className="text-muted-foreground">Unlock achievements and earn rewards</P>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Unlocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {unlockedCount} / {achievements.length}
            </div>
            <Progress
              value={(unlockedCount / achievements.length) * 100}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4" />
              Total Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPoints}</div>
            <Muted className="text-xs mt-1">From unlocked achievements</Muted>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((unlockedCount / achievements.length) * 100).toFixed(0)}%
            </div>
            <Muted className="text-xs mt-1">Achievement completion rate</Muted>
          </CardContent>
        </Card>
      </div>

      {/* Achievements List */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList>
          <TabsTrigger value="all">All Achievements</TabsTrigger>
          <TabsTrigger value="unlocked">Unlocked ({unlockedCount})</TabsTrigger>
          <TabsTrigger value="locked">
            Locked ({achievements.length - unlockedCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAchievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`relative overflow-hidden ${
                  achievement.unlocked ? 'border-primary' : 'opacity-75'
                }`}
              >
                {achievement.unlocked && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="default">Unlocked</Badge>
                  </div>
                )}
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        achievement.unlocked
                          ? getCategoryColor(achievement.category)
                          : 'bg-muted'
                      }`}
                    >
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{achievement.name}</CardTitle>
                      <Muted className="text-sm mb-3 block">{achievement.description}</Muted>
                      {achievement.progress !== undefined && achievement.target && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>
                              {achievement.progress} / {achievement.target}
                            </span>
                          </div>
                          <Progress
                            value={(achievement.progress / achievement.target) * 100}
                            className="h-2"
                          />
                        </div>
                      )}
                      {achievement.unlocked && achievement.unlockedAt && (
                        <Muted className="text-xs mt-2 block">
                          Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </Muted>
                      )}
                      {achievement.reward && (
                        <Badge variant="outline" className="mt-2">
                          Reward: {achievement.reward}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AchievementsPage;

