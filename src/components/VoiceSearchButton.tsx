import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface VoiceSearchButtonProps {
  onTranscript?: (text: string) => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const VoiceSearchButton: React.FC<VoiceSearchButtonProps> = ({
  onTranscript,
  className = '',
  variant = 'outline',
  size = 'default',
}) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if Web Speech API is available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast.info('Listening... Speak now');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        
        if (onTranscript) {
          onTranscript(transcript);
        } else {
          // Navigate to search with transcript
          navigate(`/search?q=${encodeURIComponent(transcript)}`);
          toast.success(`Searching for: ${transcript}`);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        let errorMessage = 'Voice recognition error';
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'No microphone found. Please check your microphone.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please enable it in your browser settings.';
            break;
          default:
            errorMessage = `Error: ${event.error}`;
        }
        
        toast.error(errorMessage);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [navigate, onTranscript]);

  const handleToggleListening = () => {
    if (!isSupported) {
      toast.error('Voice search is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
      } catch (error) {
        toast.error('Failed to start voice recognition');
      }
    }
  };

  if (!isSupported) {
    return (
      <Button
        variant={variant}
        size={size}
        disabled
        className={className}
        title="Voice search not supported"
      >
        <MicOff className="h-4 w-4" />
        {size !== 'icon' && <span className="ml-2">Voice Search</span>}
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleListening}
      className={className}
      disabled={isListening}
    >
      {isListening ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {size !== 'icon' && <span className="ml-2">Listening...</span>}
        </>
      ) : (
        <>
          <Mic className="h-4 w-4" />
          {size !== 'icon' && <span className="ml-2">Voice Search</span>}
        </>
      )}
    </Button>
  );
};

export default VoiceSearchButton;

