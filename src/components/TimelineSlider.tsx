import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface TimelineSliderProps {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  disabled: boolean;
}

export function TimelineSlider({
  currentStep,
  totalSteps,
  onStepChange,
  isPlaying,
  onPlayPause,
  disabled,
}: TimelineSliderProps) {
  if (totalSteps === 0) {
    return null;
  }

  const handleStepToStart = () => {
    onStepChange(0);
  };

  const handleStepToEnd = () => {
    onStepChange(totalSteps);
  };

  return (
    <div className="w-full max-w-6xl bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm">Timeline</h3>
          <span className="text-sm text-gray-600">
            Step {currentStep} / {totalSteps}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleStepToStart}
            disabled={disabled || currentStep === 0}
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onPlayPause}
            disabled={disabled}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleStepToEnd}
            disabled={disabled || currentStep === totalSteps}
          >
            <SkipForward className="w-4 h-4" />
          </Button>

          <div className="flex-1">
            <Slider
              value={[currentStep]}
              onValueChange={(values) => onStepChange(values[0])}
              min={0}
              max={totalSteps}
              step={1}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
