// import { $api } from '@/utils/client';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RadioGroup } from '@/components/ui/radio-group';
// import { Label } from '@/components/ui/label';
import React from 'react';

export interface ReceptionDonOptionRadioProps {
  value?: number;
  onChange?: (value: number) => void;
}

const ReceptionDonOptionRadio: React.FC<ReceptionDonOptionRadioProps> = ({ value = 3, onChange = () => {} }) => {
  // const { data: options } = $api.useQuery('get', '/options');

  const setValue = (value: number) => {
    onChange(value);
  };

  return (
    <RadioGroup value={String(value)} onValueChange={(v) => setValue(Number(v))} className='flex flex-row gap-6'>
      {/* {options?.map(({ id, label }) => (
        <div key={id} className="flex items-center space-x-2">
          <RadioGroupItem value={String(id)} id={`radio-${id}`} />
          <Label htmlFor={`radio-${id}`} className="text-lg">{label}</Label>
        </div>
      ))} */}
    </RadioGroup>
  );
};

export default ReceptionDonOptionRadio;
