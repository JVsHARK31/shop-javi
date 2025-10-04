'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ChevronRight, ChevronLeft, Lightbulb } from 'lucide-react';

export interface GuideStep {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface FeatureGuideProps {
  storageKey: string;
  steps: GuideStep[];
  showByDefault?: boolean;
}

export function FeatureGuide({ storageKey, steps, showByDefault = true }: FeatureGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenGuide, setHasSeenGuide] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem(storageKey);
      setHasSeenGuide(seen === 'true');

      if (!seen && showByDefault) {
        setTimeout(() => setIsOpen(true), 2000);
      }
    }
  }, [storageKey, showByDefault]);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, 'true');
      setHasSeenGuide(true);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReopen = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  if (!isOpen && hasSeenGuide) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleReopen}
        className="fixed bottom-4 right-4 z-50 shadow-lg"
        title="Lihat panduan fitur"
      >
        <Lightbulb className="h-4 w-4" />
      </Button>
    );
  }

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            {currentStepData.icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                {currentStepData.icon}
              </div>
            )}
            <div className="flex-1">
              <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
              <div className="mt-1 text-xs text-muted-foreground">
                Langkah {currentStep + 1} dari {steps.length}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <CardDescription className="text-sm leading-relaxed text-foreground">
            {currentStepData.description}
          </CardDescription>

          <div className="mt-4 flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-primary'
                    : index < currentStep
                    ? 'bg-primary/50'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between gap-2">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="flex-1"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Sebelumnya
          </Button>
          <Button onClick={handleNext} className="flex-1">
            {isLastStep ? 'Selesai' : 'Selanjutnya'}
            {!isLastStep && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
