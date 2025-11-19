import React, { useState, useMemo } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Palette, 
  Sparkles, 
  CheckCircle, 
  Camera,
  Download,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';

interface ColorSeason {
  id: string;
  name: string;
  description: string;
  colors: {
    name: string;
    hex: string;
    category: 'primary' | 'accent' | 'neutral';
  }[];
  characteristics: string[];
  bestFor: string[];
}

const ColorAnalysisPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [analysisResult, setAnalysisResult] = useState<ColorSeason | null>(null);
  const [showResults, setShowResults] = useState(false);

  const colorSeasons: ColorSeason[] = [
    {
      id: 'spring',
      name: 'Spring',
      description: 'Warm and bright colors that complement your natural warmth',
      colors: [
        { name: 'Coral', hex: '#FF7F50', category: 'primary' },
        { name: 'Peach', hex: '#FFDAB9', category: 'primary' },
        { name: 'Mint Green', hex: '#98FB98', category: 'accent' },
        { name: 'Sky Blue', hex: '#87CEEB', category: 'accent' },
        { name: 'Cream', hex: '#FFFDD0', category: 'neutral' },
        { name: 'Camel', hex: '#C19A6B', category: 'neutral' },
      ],
      characteristics: ['Warm undertones', 'Light to medium skin', 'Golden or strawberry blonde hair'],
      bestFor: ['Daytime events', 'Spring and summer', 'Professional settings'],
    },
    {
      id: 'summer',
      name: 'Summer',
      description: 'Cool and soft colors that enhance your natural coolness',
      colors: [
        { name: 'Rose', hex: '#FFB6C1', category: 'primary' },
        { name: 'Lavender', hex: '#E6E6FA', category: 'primary' },
        { name: 'Powder Blue', hex: '#B0E0E6', category: 'accent' },
        { name: 'Soft Pink', hex: '#FFC0CB', category: 'accent' },
        { name: 'Gray', hex: '#808080', category: 'neutral' },
        { name: 'Navy', hex: '#000080', category: 'neutral' },
      ],
      characteristics: ['Cool undertones', 'Light skin', 'Ash blonde or light brown hair'],
      bestFor: ['Evening events', 'Year-round', 'Elegant occasions'],
    },
    {
      id: 'autumn',
      name: 'Autumn',
      description: 'Warm and rich colors that complement your earthy tones',
      colors: [
        { name: 'Burnt Orange', hex: '#CC5500', category: 'primary' },
        { name: 'Olive Green', hex: '#808000', category: 'primary' },
        { name: 'Rust', hex: '#B7410E', category: 'accent' },
        { name: 'Mustard', hex: '#FFDB58', category: 'accent' },
        { name: 'Brown', hex: '#8B4513', category: 'neutral' },
        { name: 'Beige', hex: '#F5F5DC', category: 'neutral' },
      ],
      characteristics: ['Warm undertones', 'Medium to dark skin', 'Red or auburn hair'],
      bestFor: ['Fall and winter', 'Casual settings', 'Natural looks'],
    },
    {
      id: 'winter',
      name: 'Winter',
      description: 'Cool and bold colors that create striking contrast',
      colors: [
        { name: 'True Red', hex: '#FF0000', category: 'primary' },
        { name: 'Royal Blue', hex: '#4169E1', category: 'primary' },
        { name: 'Fuchsia', hex: '#FF00FF', category: 'accent' },
        { name: 'Emerald', hex: '#50C878', category: 'accent' },
        { name: 'Black', hex: '#000000', category: 'neutral' },
        { name: 'White', hex: '#FFFFFF', category: 'neutral' },
      ],
      characteristics: ['Cool undertones', 'High contrast', 'Dark hair and light skin or vice versa'],
      bestFor: ['Formal events', 'Bold statements', 'Year-round'],
    },
  ];

  const questions = [
    {
      id: 'q1',
      question: 'What is your natural skin undertone?',
      options: [
        { value: 'warm', label: 'Warm (golden, peachy)' },
        { value: 'cool', label: 'Cool (pink, blue)' },
        { value: 'neutral', label: 'Neutral (balanced)' },
        { value: 'olive', label: 'Olive (greenish)' },
      ],
    },
    {
      id: 'q2',
      question: 'What is your natural hair color?',
      options: [
        { value: 'blonde', label: 'Blonde (light to golden)' },
        { value: 'brown', label: 'Brown (light to dark)' },
        { value: 'black', label: 'Black' },
        { value: 'red', label: 'Red or Auburn' },
      ],
    },
    {
      id: 'q3',
      question: 'What color jewelry looks best on you?',
      options: [
        { value: 'gold', label: 'Gold' },
        { value: 'silver', label: 'Silver' },
        { value: 'both', label: 'Both' },
        { value: 'rose', label: 'Rose Gold' },
      ],
    },
    {
      id: 'q4',
      question: 'Which colors make you look most vibrant?',
      options: [
        { value: 'warm-bright', label: 'Warm and bright (coral, peach)' },
        { value: 'cool-soft', label: 'Cool and soft (rose, lavender)' },
        { value: 'warm-rich', label: 'Warm and rich (rust, olive)' },
        { value: 'cool-bold', label: 'Cool and bold (true red, royal blue)' },
      ],
    },
  ];

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentStep].id]: value });
  };

  const handleNext = () => {
    if (!answers[questions[currentStep].id]) {
      toast.error('Please select an answer');
      return;
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      analyzeColors();
    }
  };

  const analyzeColors = () => {
    // Simple analysis logic
    const warmAnswers = ['warm', 'gold', 'warm-bright', 'warm-rich', 'red'].filter(a =>
      Object.values(answers).includes(a)
    ).length;
    const coolAnswers = ['cool', 'silver', 'cool-soft', 'cool-bold'].filter(a =>
      Object.values(answers).includes(a)
    ).length;

    let season: ColorSeason;
    if (warmAnswers > coolAnswers) {
      if (answers.q4 === 'warm-bright') {
        season = colorSeasons.find(s => s.id === 'spring')!;
      } else {
        season = colorSeasons.find(s => s.id === 'autumn')!;
      }
    } else {
      if (answers.q4 === 'cool-bold') {
        season = colorSeasons.find(s => s.id === 'winter')!;
      } else {
        season = colorSeasons.find(s => s.id === 'summer')!;
      }
    }

    setAnalysisResult(season);
    setShowResults(true);
    localStorage.setItem('color_analysis', JSON.stringify(season));
    toast.success('Color analysis complete!');
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setAnalysisResult(null);
    setShowResults(false);
  };

  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentQuestion = questions[currentStep];
  const selectedAnswer = answers[currentQuestion.id];

  if (showResults && analysisResult) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <H1>Your Color Analysis Results</H1>
          <P className="text-muted-foreground">Personalized color palette based on your answers</P>
        </div>

        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Palette className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">{analysisResult.name} Color Season</CardTitle>
            </div>
            <CardDescription className="text-base">{analysisResult.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Color Palette */}
            <div>
              <P className="font-semibold mb-4">Your Color Palette</P>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {analysisResult.colors.map((color) => (
                  <div key={color.name} className="text-center">
                    <div
                      className="w-full h-24 rounded-lg mb-2 border-2 border-border"
                      style={{ backgroundColor: color.hex }}
                    />
                    <P className="text-sm font-medium">{color.name}</P>
                    <Muted className="text-xs">{color.hex}</Muted>
                  </div>
                ))}
              </div>
            </div>

            {/* Characteristics */}
            <div>
              <P className="font-semibold mb-2">Your Characteristics</P>
              <div className="flex flex-wrap gap-2">
                {analysisResult.characteristics.map((char, idx) => (
                  <Badge key={idx} variant="outline">{char}</Badge>
                ))}
              </div>
            </div>

            {/* Best For */}
            <div>
              <P className="font-semibold mb-2">Best For</P>
              <div className="flex flex-wrap gap-2">
                {analysisResult.bestFor.map((item, idx) => (
                  <Badge key={idx} variant="secondary">{item}</Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" onClick={handleReset}>
                Retake Analysis
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Palette
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <H1>Color Analysis</H1>
        <P className="text-muted-foreground">Discover your personal color season and perfect palette</P>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Question {currentStep + 1} of {questions.length}</CardTitle>
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
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentStep === questions.length - 1 ? (
                <>
                  Analyze Colors
                  <Sparkles className="h-4 w-4 ml-2" />
                </>
              ) : (
                'Next'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorAnalysisPage;

