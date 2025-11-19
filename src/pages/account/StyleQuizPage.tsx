import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface QuizQuestion {
  id: string;
  question: string;
  options: { value: string; label: string; description?: string }[];
}

const StyleQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions: QuizQuestion[] = [
    {
      id: 'q1',
      question: 'What best describes your style?',
      options: [
        { value: 'minimalist', label: 'Minimalist', description: 'Clean lines, neutral colors' },
        { value: 'classic', label: 'Classic', description: 'Timeless, elegant pieces' },
        { value: 'trendy', label: 'Trendy', description: 'Latest fashion trends' },
        { value: 'bohemian', label: 'Bohemian', description: 'Free-spirited, eclectic' },
        { value: 'edgy', label: 'Edgy', description: 'Bold, statement pieces' },
        { value: 'romantic', label: 'Romantic', description: 'Feminine, soft, delicate' },
        { value: 'sporty', label: 'Sporty', description: 'Athletic, casual, comfortable' },
      ],
    },
    {
      id: 'q2',
      question: 'What colors do you prefer?',
      options: [
        { value: 'neutrals', label: 'Neutrals', description: 'Black, white, beige, gray' },
        { value: 'pastels', label: 'Pastels', description: 'Soft, muted colors' },
        { value: 'bold', label: 'Bold Colors', description: 'Vibrant, eye-catching' },
        { value: 'earth', label: 'Earth Tones', description: 'Browns, greens, terracotta' },
        { value: 'jewel', label: 'Jewel Tones', description: 'Rich, deep colors' },
        { value: 'monochrome', label: 'Monochrome', description: 'Single color palette' },
      ],
    },
    {
      id: 'q3',
      question: 'How do you prefer to shop?',
      options: [
        { value: 'curated', label: 'Curated Collections', description: 'Pre-selected items' },
        { value: 'browse', label: 'Browse & Discover', description: 'Explore everything' },
        { value: 'specific', label: 'Specific Items', description: 'Know what I want' },
        { value: 'inspiration', label: 'Get Inspired', description: 'See what\'s trending' },
        { value: 'stylist', label: 'With Stylist Help', description: 'Professional guidance' },
      ],
    },
    {
      id: 'q4',
      question: 'What occasions do you shop for most?',
      options: [
        { value: 'work', label: 'Work/Professional' },
        { value: 'casual', label: 'Casual/Everyday' },
        { value: 'formal', label: 'Formal Events' },
        { value: 'special', label: 'Special Occasions' },
        { value: 'travel', label: 'Travel' },
        { value: 'all', label: 'All of the above' },
      ],
    },
    {
      id: 'q5',
      question: 'What is your budget range?',
      options: [
        { value: 'budget', label: 'Budget-Friendly', description: 'Under $200' },
        { value: 'mid', label: 'Mid-Range', description: '$200 - $500' },
        { value: 'premium', label: 'Premium', description: '$500 - $1,500' },
        { value: 'luxury', label: 'Luxury', description: '$1,500+' },
      ],
    },
    {
      id: 'q6',
      question: 'How often do you update your wardrobe?',
      options: [
        { value: 'seasonally', label: 'Seasonally', description: 'Every 3-4 months' },
        { value: 'monthly', label: 'Monthly', description: 'Regular updates' },
        { value: 'as-needed', label: 'As Needed', description: 'When items wear out' },
        { value: 'rarely', label: 'Rarely', description: 'Only when necessary' },
      ],
    },
    {
      id: 'q7',
      question: 'What matters most when choosing clothes?',
      options: [
        { value: 'comfort', label: 'Comfort', description: 'Feel good in what I wear' },
        { value: 'style', label: 'Style', description: 'Look fashionable' },
        { value: 'quality', label: 'Quality', description: 'Durability and craftsmanship' },
        { value: 'price', label: 'Price', description: 'Value for money' },
        { value: 'sustainability', label: 'Sustainability', description: 'Eco-friendly options' },
      ],
    },
  ];

  const totalSteps = questions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentStep].id]: value });
  };

  const handleNext = () => {
    if (!answers[questions[currentStep].id]) {
      toast.error('Please select an answer');
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Generate AI insights
    const styleType = determineStyleType();
    const aiInsights = generateAIStyleInsights(answers, styleType);
    
    // Save style profile with AI insights
    const styleProfile = {
      answers,
      completedAt: new Date().toISOString(),
      styleType,
      aiInsights,
      recommendations: generateStyleRecommendations(styleType, answers),
    };
    
    localStorage.setItem('style_profile', JSON.stringify(styleProfile));
    toast.success('Style profile created with AI insights!');
    navigate('/account/preferences');
  };

  const generateAIStyleInsights = (answers: Record<string, string>, styleType: string) => {
    const insights = {
      primaryStyle: styleType,
      colorPalette: answers.q2 || 'varied',
      shoppingBehavior: answers.q3 || 'browse',
      occasionFocus: answers.q4 || 'all',
      budgetRange: answers.q5 || 'mid',
      confidence: 0.85,
      recommendations: [] as string[],
    };

    // AI-generated insights
    if (styleType === 'minimalist') {
      insights.recommendations.push('Focus on quality over quantity', 'Invest in timeless pieces', 'Neutral color palette works best');
    } else if (styleType === 'classic') {
      insights.recommendations.push('Build a capsule wardrobe', 'Choose versatile pieces', 'Invest in tailoring');
    } else if (styleType === 'trendy') {
      insights.recommendations.push('Mix trends with classics', 'Update accessories seasonally', 'Follow fashion weeks');
    }

    return insights;
  };

  const generateStyleRecommendations = (styleType: string, answers: Record<string, string>) => {
    // This would integrate with product recommendations
    return {
      categories: [answers.q4 || 'all'],
      priceRange: answers.q5 || 'mid',
      styleTags: [styleType, answers.q2 || 'varied'],
    };
  };

  const determineStyleType = () => {
    // Simple logic to determine style type based on answers
    const styleAnswers = Object.values(answers);
    if (styleAnswers.includes('minimalist')) return 'minimalist';
    if (styleAnswers.includes('classic')) return 'classic';
    if (styleAnswers.includes('trendy')) return 'trendy';
    return 'eclectic';
  };

  const currentQuestion = questions[currentStep];
  const selectedAnswer = answers[currentQuestion.id];

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <H1>Style Quiz</H1>
        <P className="text-muted-foreground">Help us understand your style preferences</P>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Question {currentStep + 1} of {totalSteps}</CardTitle>
            <Badge variant="outline">{Math.round(progress)}% Complete</Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <H1 className="text-2xl mb-6">{currentQuestion.question}</H1>
            <RadioGroup
              value={selectedAnswer || ''}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedAnswer === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleAnswer(option.value)}
                >
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <Label
                    htmlFor={option.value}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-semibold">{option.label}</div>
                    {option.description && (
                      <Muted className="text-sm mt-1">{option.description}</Muted>
                    )}
                  </Label>
                  {selectedAnswer === option.value && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentStep === totalSteps - 1 ? (
                <>
                  Complete
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Style Preview (if completed) */}
      {Object.keys(answers).length === totalSteps && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Your AI-Generated Style Profile
            </CardTitle>
            <CardDescription>
              Personalized insights powered by AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <P className="mb-4">Based on your answers, we've created your personalized style profile!</P>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="default">Style: {determineStyleType()}</Badge>
              {answers.q2 && <Badge variant="outline">Colors: {answers.q2}</Badge>}
              {answers.q4 && <Badge variant="outline">Occasions: {answers.q4}</Badge>}
              <Badge variant="outline" className="bg-primary/10">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </div>
            {generateAIStyleInsights(answers, determineStyleType()).recommendations.length > 0 && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <P className="text-sm font-semibold mb-2">AI Style Recommendations:</P>
                <ul className="list-disc list-inside space-y-1">
                  {generateAIStyleInsights(answers, determineStyleType()).recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StyleQuizPage;


