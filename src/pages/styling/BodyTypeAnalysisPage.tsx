import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Sparkles, 
  CheckCircle, 
  Download,
  Share2,
  Lightbulb,
} from 'lucide-react';
import { toast } from 'sonner';

interface BodyType {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  bestStyles: string[];
  avoidStyles: string[];
  tips: string[];
}

const BodyTypeAnalysisPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [analysisResult, setAnalysisResult] = useState<BodyType | null>(null);
  const [showResults, setShowResults] = useState(false);

  const bodyTypes: BodyType[] = [
    {
      id: 'hourglass',
      name: 'Hourglass',
      description: 'Balanced proportions with defined waist',
      characteristics: ['Bust and hips are similar width', 'Well-defined waist', 'Curvy silhouette'],
      bestStyles: ['Fitted dresses', 'Wrap styles', 'Belted pieces', 'A-line skirts'],
      avoidStyles: ['Boxy shapes', 'Oversized tops', 'Baggy clothing'],
      tips: ['Emphasize your waist', 'Choose fitted pieces', 'Balance top and bottom'],
    },
    {
      id: 'pear',
      name: 'Pear',
      description: 'Narrow shoulders, wider hips',
      characteristics: ['Smaller bust', 'Narrow shoulders', 'Wider hips', 'Defined waist'],
      bestStyles: ['A-line dresses', 'Structured tops', 'Dark bottoms', 'Statement necklines'],
      avoidStyles: ['Tight bottoms', 'Light-colored pants', 'Cropped tops'],
      tips: ['Draw attention upward', 'Balance proportions', 'Use color strategically'],
    },
    {
      id: 'apple',
      name: 'Apple',
      description: 'Broader midsection, slimmer legs',
      characteristics: ['Fuller midsection', 'Narrower hips', 'Slimmer legs', 'Average to larger bust'],
      bestStyles: ['Empire waist', 'V-necks', 'A-line dresses', 'Structured jackets'],
      avoidStyles: ['High-waisted pants', 'Crop tops', 'Tight waistbands'],
      tips: ['Create vertical lines', 'Define shoulders', 'Choose flowy fabrics'],
    },
    {
      id: 'rectangle',
      name: 'Rectangle',
      description: 'Straight silhouette with minimal curves',
      characteristics: ['Straight silhouette', 'Minimal waist definition', 'Balanced proportions'],
      bestStyles: ['Layered looks', 'Belted pieces', 'Ruffles and details', 'Peplum styles'],
      avoidStyles: ['Boxy shapes', 'Oversized everything', 'No definition'],
      tips: ['Create curves with styling', 'Add volume strategically', 'Use accessories'],
    },
    {
      id: 'inverted-triangle',
      name: 'Inverted Triangle',
      description: 'Broad shoulders, narrower hips',
      characteristics: ['Broad shoulders', 'Larger bust', 'Narrower hips', 'Athletic build'],
      bestStyles: ['A-line skirts', 'V-necks', 'Dark tops', 'Wide-leg pants'],
      avoidStyles: ['Shoulder pads', 'Puff sleeves', 'Tight tops'],
      tips: ['Balance top and bottom', 'Draw attention downward', 'Create waist definition'],
    },
  ];

  const questions = [
    {
      id: 'q1',
      question: 'How would you describe your shoulder width?',
      options: [
        { value: 'narrow', label: 'Narrow (smaller than hips)' },
        { value: 'balanced', label: 'Balanced (similar to hips)' },
        { value: 'broad', label: 'Broad (wider than hips)' },
      ],
    },
    {
      id: 'q2',
      question: 'How would you describe your waist?',
      options: [
        { value: 'defined', label: 'Well-defined and smaller' },
        { value: 'straight', label: 'Straight (similar to bust/hips)' },
        { value: 'fuller', label: 'Fuller (wider than bust/hips)' },
      ],
    },
    {
      id: 'q3',
      question: 'How would you describe your hip width?',
      options: [
        { value: 'narrow', label: 'Narrow (smaller than shoulders)' },
        { value: 'balanced', label: 'Balanced (similar to shoulders)' },
        { value: 'wide', label: 'Wide (wider than shoulders)' },
      ],
    },
    {
      id: 'q4',
      question: 'Where do you tend to carry weight?',
      options: [
        { value: 'hips', label: 'Hips and thighs' },
        { value: 'midsection', label: 'Midsection/waist' },
        { value: 'balanced', label: 'Evenly distributed' },
        { value: 'upper', label: 'Upper body/shoulders' },
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
      analyzeBodyType();
    }
  };

  const analyzeBodyType = () => {
    // Simple analysis logic
    const shoulder = answers.q1;
    const waist = answers.q2;
    const hips = answers.q3;
    const weight = answers.q4;

    let bodyType: BodyType;

    if (waist === 'defined' && shoulder === 'balanced' && hips === 'balanced') {
      bodyType = bodyTypes.find(bt => bt.id === 'hourglass')!;
    } else if (hips === 'wide' && shoulder === 'narrow') {
      bodyType = bodyTypes.find(bt => bt.id === 'pear')!;
    } else if (waist === 'fuller' || weight === 'midsection') {
      bodyType = bodyTypes.find(bt => bt.id === 'apple')!;
    } else if (shoulder === 'broad' && hips === 'narrow') {
      bodyType = bodyTypes.find(bt => bt.id === 'inverted-triangle')!;
    } else {
      bodyType = bodyTypes.find(bt => bt.id === 'rectangle')!;
    }

    setAnalysisResult(bodyType);
    setShowResults(true);
    localStorage.setItem('body_type_analysis', JSON.stringify(bodyType));
    toast.success('Body type analysis complete!');
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
          <H1>Your Body Type Analysis</H1>
          <P className="text-muted-foreground">Personalized styling recommendations based on your body type</P>
        </div>

        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <User className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">{analysisResult.name} Body Type</CardTitle>
            </div>
            <CardDescription className="text-base">{analysisResult.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Characteristics */}
            <div>
              <P className="font-semibold mb-2">Your Characteristics</P>
              <div className="flex flex-wrap gap-2">
                {analysisResult.characteristics.map((char, idx) => (
                  <Badge key={idx} variant="outline">{char}</Badge>
                ))}
              </div>
            </div>

            {/* Best Styles */}
            <div>
              <P className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Best Styles for You
              </P>
              <div className="flex flex-wrap gap-2">
                {analysisResult.bestStyles.map((style, idx) => (
                  <Badge key={idx} variant="default">{style}</Badge>
                ))}
              </div>
            </div>

            {/* Avoid Styles */}
            <div>
              <P className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-red-600">✕</span>
                Styles to Avoid
              </P>
              <div className="flex flex-wrap gap-2">
                {analysisResult.avoidStyles.map((style, idx) => (
                  <Badge key={idx} variant="destructive">{style}</Badge>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="p-4 bg-muted rounded-lg">
              <P className="font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-600" />
                Styling Tips
              </P>
              <ul className="list-disc list-inside space-y-1">
                {analysisResult.tips.map((tip, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">{tip}</li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" onClick={handleReset}>
                Retake Analysis
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Guide
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
        <H1>Body Type Analysis</H1>
        <P className="text-muted-foreground">Discover your body type and get personalized styling recommendations</P>
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
                  Analyze Body Type
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

export default BodyTypeAnalysisPage;

