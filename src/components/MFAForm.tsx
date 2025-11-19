import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Smartphone, Mail, Key, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { P, Muted } from '@/components/ui/typography';

interface MFAFormProps {
  onVerify: (code: string, method: string) => void;
  onResend?: () => void;
  method?: 'sms' | 'email' | 'authenticator';
  phoneNumber?: string;
  email?: string;
}

const MFAForm: React.FC<MFAFormProps> = ({
  onVerify,
  onResend,
  method = 'sms',
  phoneNumber,
  email,
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6).split('');
      const newCode = [...code];
      pastedCode.forEach((char, i) => {
        if (index + i < 6) {
          newCode[index + i] = char;
        }
      });
      setCode(newCode);
      // Focus last input
      if (index + pastedCode.length < 6) {
        inputRefs.current[index + pastedCode.length]?.focus();
      }
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }
    onVerify(fullCode, method);
  };

  const handleResend = () => {
    setCode(['', '', '', '', '', '']);
    setTimeLeft(300);
    if (onResend) {
      onResend();
    }
    toast.info('Verification code resent');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMethodIcon = () => {
    switch (method) {
      case 'sms':
        return <Smartphone className="h-5 w-5" />;
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'authenticator':
        return <Key className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const getMethodLabel = () => {
    switch (method) {
      case 'sms':
        return `SMS to ${phoneNumber ? `+${phoneNumber}` : 'your phone'}`;
      case 'email':
        return `Email to ${email || 'your email'}`;
      case 'authenticator':
        return 'Authenticator App';
      default:
        return 'Verification';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getMethodIcon()}
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Enter the 6-digit verification code sent to {getMethodLabel()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center gap-2">
          {code.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-2xl font-semibold"
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Code expires in {formatTime(timeLeft)}</span>
          </div>
          <Button
            variant="link"
            onClick={handleResend}
            disabled={timeLeft > 0}
            className="p-0 h-auto"
          >
            Resend Code
          </Button>
        </div>

        <Button onClick={handleVerify} className="w-full" size="lg">
          Verify Code
        </Button>

        {method === 'authenticator' && (
          <div className="bg-muted p-4 rounded-lg">
            <P className="text-sm font-semibold mb-2">Using Authenticator App?</P>
            <Muted className="text-sm">
              Open your authenticator app and enter the 6-digit code displayed.
            </Muted>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MFAForm;

