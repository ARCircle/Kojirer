import { 
  Button,
  HStack,
  Input,
  Text, 
  useNumberInput
} from "@chakra-ui/react";
import React from "react";

export interface ReceptionCallNumInputProps {
  value?: number,
  onChange?: (value: number) => void,
}

const ReceptionCallNumInput: React.FC<ReceptionCallNumInputProps> = ({
  value,
  onChange = () => {},
}) => {

  const { valueAsNumber, getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      value,
      defaultValue: 0,
      min: 0,
      precision: 0
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  return (
    <>
      <Text>呼び出し番号</Text>
      <HStack maxW='230px'>
        <Button {...inc} onClick={() => onChange(valueAsNumber + 1)}>+</Button>
        <Input {...input}/>
        <Button {...dec} onClick={() => onChange(valueAsNumber - 1)}>-</Button>
      </HStack>
    </>
    
  );
}

export default ReceptionCallNumInput;