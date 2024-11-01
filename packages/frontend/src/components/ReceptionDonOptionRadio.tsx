import { $api } from "@/utils/client";
import { 
  Radio, 
  RadioGroup, 
  Stack,
} from "@chakra-ui/react";
import React, { useState } from "react";

export interface ReceptionDonOptionRadioProps {
  value?: number,
  onChange?: (value: number) => void,
}

const ReceptionDonOptionRadio: React.FC<ReceptionDonOptionRadioProps> = ({ 
  value = 3, 
  onChange = () => {},
}) => {
  const [ innerValue, innerSetValue ] = useState(value);
  const { data: options } = $api.useQuery('get', '/options');

  const setValue = (value: number) => {
    innerSetValue(value);
    onChange(value);
  }
 
  return (
    <RadioGroup value={String(innerValue)} onChange={(v) => setValue(Number(v))} size="lg">
      <Stack spacing={5} direction='row'>
        {
          options?.map(({id, label}) => 
            <Radio 
              key={id}
              value={String(id)}
            >{ label }</Radio>
          )
        }
      </Stack>
    </RadioGroup>
  );
};

export default ReceptionDonOptionRadio;