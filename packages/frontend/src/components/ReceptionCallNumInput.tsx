import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';

export interface ReceptionCallNumInputProps {
  value?: number;
  onChange?: (value: number) => void;
}

const ReceptionCallNumInput: React.FC<ReceptionCallNumInputProps> = ({ value = 0, onChange = () => {} }) => {
  const currentValue = value || 0;

  return (
    <div>
      <div className="text-sm font-medium mb-2">呼び出し番号</div>
      <div className="flex gap-2 max-w-[230px]">
        <Button onClick={() => onChange(currentValue + 1)} size="sm">
          +
        </Button>
        <Input 
          type="number" 
          value={currentValue} 
          onChange={(e) => onChange(Number(e.target.value))} 
          min={1}
          className="text-center"
        />
        <Button
          onClick={() => {
            currentValue > 1 && onChange(currentValue - 1);
          }}
          size="sm"
        >
          -
        </Button>
      </div>
    </div>
  );
};

export default ReceptionCallNumInput;
