import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Leaf, TrendingUp, Info } from 'lucide-react';
import { P, Muted } from '@/components/ui/typography';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SustainabilityScoreProps {
  score: number; // 0-100
  breakdown?: {
    materials: number;
    production: number;
    shipping: number;
    packaging: number;
  };
  showBreakdown?: boolean;
}

const SustainabilityScore: React.FC<SustainabilityScoreProps> = ({
  score,
  breakdown,
  showBreakdown = false,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const getScoreBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    if (score >= 40) return 'outline';
    return 'destructive';
  };

  return (
    <Card className="border-green-500/20">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <P className="font-semibold">Sustainability Score</P>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <P className="text-sm">
                    Score based on materials, production methods, shipping, and packaging sustainability
                  </P>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Badge variant={getScoreBadgeVariant(score)} className={getScoreColor(score)}>
            {getScoreLabel(score)}
          </Badge>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <P className="text-sm font-medium">Overall Score</P>
              <P className={`text-2xl font-bold ${getScoreColor(score)}`}>
                {score}/100
              </P>
            </div>
            <Progress value={score} className="h-3" />
          </div>

          {showBreakdown && breakdown && (
            <div className="space-y-2 pt-2 border-t">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Muted className="text-xs">Materials</Muted>
                  <Muted className="text-xs">{breakdown.materials}%</Muted>
                </div>
                <Progress value={breakdown.materials} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Muted className="text-xs">Production</Muted>
                  <Muted className="text-xs">{breakdown.production}%</Muted>
                </div>
                <Progress value={breakdown.production} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Muted className="text-xs">Shipping</Muted>
                  <Muted className="text-xs">{breakdown.shipping}%</Muted>
                </div>
                <Progress value={breakdown.shipping} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Muted className="text-xs">Packaging</Muted>
                  <Muted className="text-xs">{breakdown.packaging}%</Muted>
                </div>
                <Progress value={breakdown.packaging} className="h-2" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SustainabilityScore;

