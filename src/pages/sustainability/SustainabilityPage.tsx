import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Leaf, 
  Recycle, 
  Award, 
  Heart,
  Users,
  TrendingUp,
  Globe,
  Factory,
  Truck,
  Package,
  CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import EcoFriendlyBadge from '@/components/sustainability/EcoFriendlyBadge';
import SustainabilityScore from '@/components/sustainability/SustainabilityScore';

const SustainabilityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'certifications' | 'impact' | 'programs'>('overview');

  const certifications = [
    {
      id: 'ft1',
      name: 'Fair Trade Certified',
      description: 'Ensures fair wages and working conditions',
      icon: <Award className="h-6 w-6" />,
      products: 1250,
    },
    {
      id: 'org1',
      name: 'Organic Certified',
      description: '100% organic materials and processes',
      icon: <Leaf className="h-6 w-6" />,
      products: 890,
    },
    {
      id: 'cf1',
      name: 'Conflict-Free',
      description: 'Ethically sourced materials',
      icon: <CheckCircle className="h-6 w-6" />,
      products: 2100,
    },
    {
      id: 'aw1',
      name: 'Cruelty-Free',
      description: 'No animal testing or harm',
      icon: <Heart className="h-6 w-6" />,
      products: 1560,
    },
  ];

  const impactStats = [
    {
      label: 'Trees Planted',
      value: '125,000',
      icon: <Leaf className="h-5 w-5" />,
      color: 'text-green-600',
    },
    {
      label: 'CO₂ Offset (tons)',
      value: '45,000',
      icon: <Globe className="h-5 w-5" />,
      color: 'text-blue-600',
    },
    {
      label: 'People Supported',
      value: '12,500',
      icon: <Users className="h-5 w-5" />,
      color: 'text-purple-600',
    },
    {
      label: 'Waste Diverted (tons)',
      value: '8,500',
      icon: <Recycle className="h-5 w-5" />,
      color: 'text-orange-600',
    },
  ];

  const programs = [
    {
      id: 'p1',
      name: 'Recycling Program',
      description: 'Return used products for recycling and get store credit',
      icon: <Recycle className="h-6 w-6" />,
      status: 'active',
    },
    {
      id: 'p2',
      name: 'Buy-Back Program',
      description: 'Sell back your items for credit towards new purchases',
      icon: <TrendingUp className="h-6 w-6" />,
      status: 'active',
    },
    {
      id: 'p3',
      name: 'Carbon Offset',
      description: 'Offset your order\'s carbon footprint at checkout',
      icon: <Leaf className="h-6 w-6" />,
      status: 'active',
    },
    {
      id: 'p4',
      name: 'Green Shipping',
      description: 'Choose carbon-neutral shipping options',
      icon: <Truck className="h-6 w-6" />,
      status: 'active',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <H1 className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-green-600" />
          Sustainability & Ethics
        </H1>
        <P className="text-muted-foreground">
          Our commitment to environmental responsibility and ethical practices
        </P>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="impact">Our Impact</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Mission Statement */}
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader>
              <CardTitle>Our Commitment</CardTitle>
            </CardHeader>
            <CardContent>
              <P className="mb-4">
                We are committed to creating a sustainable and ethical luxury marketplace that
                respects our planet and supports communities worldwide. Through transparent sourcing,
                carbon-neutral operations, and social responsibility initiatives, we're building a
                better future for fashion.
              </P>
              <div className="grid gap-4 md:grid-cols-3 mt-6">
                <div className="text-center p-4 bg-background rounded-lg">
                  <Leaf className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <P className="font-semibold">Carbon Neutral</P>
                  <Muted className="text-xs">By 2025</Muted>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <Recycle className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <P className="font-semibold">100% Recyclable</P>
                  <Muted className="text-xs">Packaging</Muted>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <Award className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                  <P className="font-semibold">Ethical Sourcing</P>
                  <Muted className="text-xs">All Products</Muted>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {impactStats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`${stat.color}`}>{stat.icon}</div>
                  </div>
                  <P className="text-3xl font-bold mb-1">{stat.value}</P>
                  <Muted className="text-sm">{stat.label}</Muted>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Featured Programs */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Programs</CardTitle>
              <CardDescription>Ways to make a positive impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {programs.slice(0, 4).map((program) => (
                  <div
                    key={program.id}
                    className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">{program.icon}</div>
                    <div className="flex-1">
                      <P className="font-semibold mb-1">{program.name}</P>
                      <Muted className="text-sm">{program.description}</Muted>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-6">
          <div>
            <H1 className="text-2xl mb-2">Certifications & Standards</H1>
            <P className="text-muted-foreground">
              Products verified by leading certification bodies
            </P>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {certifications.map((cert) => (
              <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">{cert.icon}</div>
                    <div className="flex-1">
                      <CardTitle>{cert.name}</CardTitle>
                      <CardDescription>{cert.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Muted className="text-sm">{cert.products} certified products</Muted>
                    <Badge variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="impact" className="space-y-6">
          <div>
            <H1 className="text-2xl mb-2">Our Impact</H1>
            <P className="text-muted-foreground">
              Measurable results from our sustainability initiatives
            </P>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {impactStats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color}`}>{stat.icon}</div>
                    <P className="text-3xl font-bold">{stat.value}</P>
                  </div>
                  <P className="font-semibold mb-2">{stat.label}</P>
                  <Progress value={75} className="h-2" />
                  <Muted className="text-xs mt-2">75% of annual goal achieved</Muted>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Impact Stories</CardTitle>
              <CardDescription>Real stories from our community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <P className="font-semibold mb-2">Reforestation Project in Brazil</P>
                  <Muted className="text-sm">
                    Through our carbon offset program, we've planted 25,000 trees in the Amazon,
                    helping restore critical forest ecosystems and support local communities.
                  </Muted>
                </div>
                <div className="p-4 border rounded-lg">
                  <P className="font-semibold mb-2">Fair Trade Partnership</P>
                  <Muted className="text-sm">
                    Working with artisan communities in 15 countries, we've supported over 5,000
                    craftspeople with fair wages and sustainable practices.
                  </Muted>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <div>
            <H1 className="text-2xl mb-2">Sustainability Programs</H1>
            <P className="text-muted-foreground">
              Participate in our sustainability initiatives
            </P>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {programs.map((program) => (
              <Card key={program.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">{program.icon}</div>
                    <CardTitle>{program.name}</CardTitle>
                  </div>
                  <CardDescription>{program.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Calculate Your Impact</CardTitle>
              <CardDescription>
                See the carbon footprint of your order and offset options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/sustainability/carbon-footprint">
                <Button>
                  <Leaf className="h-4 w-4 mr-2" />
                  Carbon Footprint Calculator
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SustainabilityPage;

