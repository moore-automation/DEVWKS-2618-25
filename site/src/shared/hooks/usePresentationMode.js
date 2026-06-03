import { useState, useCallback, useEffect } from 'react';

export const usePresentationMode = (steps = []) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const totalSteps = steps.length;
  const currentStepData = steps[currentStep];

  const goToNext = useCallback(() => {
    setCurrentStep((prev) => (prev < totalSteps - 1 ? prev + 1 : prev));
  }, [totalSteps]);

  const goToPrevious = useCallback(() => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Down') {
        if (currentStep < totalSteps - 1) {
          e.preventDefault();
          goToNext();
        }
      } else if (e.key === 'ArrowUp' || e.key === 'Up') {
        if (currentStep > 0) {
          e.preventDefault();
          goToPrevious();
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, totalSteps, goToNext, goToPrevious, reset]);

  return {
    currentStep,
    totalSteps,
    currentStepData,
    goToNext,
    goToPrevious,
    reset,
    isPlaying,
    setIsPlaying,
    canGoNext: currentStep < totalSteps - 1,
    canGoPrevious: currentStep > 0,
  };
};
