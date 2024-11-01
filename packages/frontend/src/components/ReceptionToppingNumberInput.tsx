import { 
  Button, 
  HStack, 
  Text, 
  useNumberInput 
} from "@chakra-ui/react";
import React from "react";

export interface ReceptionToppingNumberInputProps {
  value?: number,
  onChange?: (value: number) => void,
  canDecrement?: boolean,
}

const ReceptionToppingNumberInput: React.FC<ReceptionToppingNumberInputProps> = ({
  value,
  onChange = () => {},
  canDecrement,
}) => {
  const { valueAsNumber, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      value,
      defaultValue: 0,
      min: 0,
      precision: 0
    });

  const inc = getIncrementButtonProps();
  const dec = canDecrement && getDecrementButtonProps();

  return (
    <HStack maxW='230px' gap={10}>
      <Button 
        {...inc} 
        onClick={() => onChange(valueAsNumber + 1)}
      >+</Button>
      <Text fontSize='lg'>{ valueAsNumber }</Text>
      <Button 
        {...dec} 
        isDisabled={!canDecrement} 
        onClick={() => {
          valueAsNumber > 0 && onChange(valueAsNumber - 1);
        }}
      >-</Button>
    </HStack>
  );
};

export default ReceptionToppingNumberInput;