import { Button } from '@/components/ui/button';
import React from 'react';

export interface ReceptionToppingNumberInputProps {
  value?: number;
  onChange?: (value: number) => void;
  canDecrement?: boolean;
}

const ReceptionToppingNumberInput: React.FC<ReceptionToppingNumberInputProps> = ({
  value = 0,
  onChange = () => {},
  canDecrement = false,
}) => {
  const currentValue = value || 0;

  return (
    <div className="flex items-center gap-10 max-w-[230px]">
      <Button onClick={() => onChange(currentValue + 1)} size="sm">
        +
      </Button>
      <span className="text-lg min-w-8 text-center">{currentValue}</span>
      <Button
        disabled={!canDecrement}
        onClick={() => {
          currentValue > 0 && onChange(currentValue - 1);
        }}
        size="sm"
      >
        -
      </Button>
    </div>
  );
};

export default ReceptionToppingNumberInput;
