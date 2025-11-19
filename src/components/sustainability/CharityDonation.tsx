import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Heart, CheckCircle, Info } from 'lucide-react';
import { P, Muted } from '@/components/ui/typography';
import { useCurrency } from '@/context/CurrencyContext';
import { toast } from 'sonner';

interface Charity {
  id: string;
  name: string;
  description: string;
  category: 'education' | 'environment' | 'health' | 'poverty' | 'animals';
  logo?: string;
  verified: boolean;
}

interface CharityDonationProps {
  onDonationChange?: (amount: number, charityId: string | null) => void;
  defaultAmount?: number;
  defaultCharity?: string;
}

const CharityDonation: React.FC<CharityDonationProps> = ({
  onDonationChange,
  defaultAmount = 0,
  defaultCharity = null,
}) => {
  const { formatPrice } = useCurrency();
  const [selectedCharity, setSelectedCharity] = useState<string | null>(defaultCharity);
  const [donationAmount, setDonationAmount] = useState<string>(defaultAmount.toString());
  const [customAmount, setCustomAmount] = useState<string>('');

  const charities: Charity[] = [
    {
      id: 'c1',
      name: 'Education for All',
      description: 'Supporting education initiatives worldwide',
      category: 'education',
      verified: true,
    },
    {
      id: 'c2',
      name: 'Climate Action Fund',
      description: 'Fighting climate change through reforestation',
      category: 'environment',
      verified: true,
    },
    {
      id: 'c3',
      name: 'Global Health Initiative',
      description: 'Improving healthcare access in underserved communities',
      category: 'health',
      verified: true,
    },
    {
      id: 'c4',
      name: 'End Poverty Now',
      description: 'Supporting economic development programs',
      category: 'poverty',
      verified: true,
    },
    {
      id: 'c5',
      name: 'Animal Welfare Society',
      description: 'Protecting and caring for animals',
      category: 'animals',
      verified: true,
    },
  ];

  const quickAmounts = [5, 10, 25, 50, 100];

  const handleAmountSelect = (amount: number) => {
    setDonationAmount(amount.toString());
    setCustomAmount('');
    if (selectedCharity && onDonationChange) {
      onDonationChange(amount, selectedCharity);
    }
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    const amount = parseFloat(value) || 0;
    setDonationAmount(amount.toString());
    if (selectedCharity && onDonationChange) {
      onDonationChange(amount, selectedCharity);
    }
  };

  const handleCharitySelect = (charityId: string) => {
    setSelectedCharity(charityId);
    const amount = parseFloat(donationAmount) || 0;
    if (onDonationChange) {
      onDonationChange(amount, charityId);
    }
  };

  const selectedCharityData = charities.find(c => c.id === selectedCharity);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          <CardTitle>Donate to Charity</CardTitle>
        </div>
        <CardDescription>
          Add a donation to your order to support a cause you care about
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Charity Selection */}
        <div className="space-y-3">
          <Label>Select a Charity</Label>
          <RadioGroup value={selectedCharity || ''} onValueChange={handleCharitySelect}>
            <div className="space-y-2">
              {charities.map((charity) => (
                <div
                  key={charity.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedCharity === charity.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleCharitySelect(charity.id)}
                >
                  <RadioGroupItem value={charity.id} id={charity.id} className="mt-1" />
                  <Label htmlFor={charity.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <P className="font-semibold">{charity.name}</P>
                      {charity.verified && (
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <Muted className="text-xs">{charity.description}</Muted>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Donation Amount */}
        {selectedCharity && (
          <div className="space-y-3 pt-4 border-t">
            <Label>Donation Amount</Label>
            <div className="grid grid-cols-5 gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={donationAmount === amount.toString() ? 'default' : 'outline'}
                  onClick={() => handleAmountSelect(amount)}
                  className="w-full"
                >
                  {formatPrice(amount)}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="customAmount">Custom Amount</Label>
              <Input
                id="customAmount"
                type="number"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => handleCustomAmount(e.target.value)}
                min="1"
              />
            </div>
            {parseFloat(donationAmount) > 0 && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <Muted className="text-sm">Total Donation</Muted>
                  <P className="text-lg font-bold">{formatPrice(parseFloat(donationAmount) || 0)}</P>
                </div>
                {selectedCharityData && (
                  <Muted className="text-xs mt-1 block">
                    To: {selectedCharityData.name}
                  </Muted>
                )}
              </div>
            )}
          </div>
        )}

        {!selectedCharity && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>Select a charity to add a donation</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CharityDonation;

