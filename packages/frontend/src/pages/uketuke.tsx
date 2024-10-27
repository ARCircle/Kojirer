import { Box, Heading, Center, Button, Radio, RadioGroup, Stack, useNumberInput, Card, HStack } from '@chakra-ui/react'
import React from 'react'

type OptionProps = {
  name: string
  items: string[]
  value: string
  setValue: (value: string) => void
}

type ToppingProps = {
  name: string
  value: number
  setValue: (value: number) => void
  mode: boolean
}

const SelectOption: React.FC<OptionProps> = ({ name, items, value, setValue }: OptionProps) => {
  return (
    <Box>
      <Center><Heading size='sm'>{name}({value})</Heading></Center>
      <RadioGroup onChange={setValue} value={value}>
        <Stack>
          {items.map((item) => {
            return (
              <Radio key={item} value={item}>{item}</Radio>
            )
          })}
        </Stack>
      </RadioGroup>
    </Box>
  )
}

const SelectTopping: React.FC<ToppingProps> = ({ name, value, setValue, mode }: ToppingProps) => {
  const { getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
    value,
    min: 0,
    max: 20,
    step: 1,
    onChange: (_, valueAsNumber) => setValue(valueAsNumber),
  })
  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  return (
    <Stack>
      <Button {...inc}>{name} ({value})</Button>
      {mode ? <Button {...dec}>-</Button> : <></>}
    </Stack>
  )
}

const SelectDon = () => {

  const [karame, setKarame] = React.useState('');
  const [abura, setAbura] = React.useState('');
  const [niniku, setNiniku] = React.useState('');
  const [mayonezu, setMayonezu] = React.useState(0);
  const [friedOnion, setFriedOnion] = React.useState(0);
  const [curryPowder, setCurryPowder] = React.useState(0);
  const [lemonJuice, setLemonJuice] = React.useState(0);
  const [doDecrement, setDoDecrement] = React.useState(false);

  return (
    <Box border='2px'>
      <Center>丼の注文内容をここで決める</Center>
      <Box>
        <Center><Heading size='md'>オプションを選択</Heading></Center>
        <Center>
          <SelectOption name="カラメ" items={['無', '並', 'マシ', 'マシマシ']} value={karame} setValue={setKarame} />
          <SelectOption name="アブラ" items={['無', '並', 'マシ', 'マシマシ']} value={abura} setValue={setAbura} />
          <SelectOption name="にんにく" items={['無', '並', 'マシ', 'マシマシ']} value={niniku} setValue={setNiniku} />
        </Center>
      </Box>
      <Box>
        <Center><Heading size='md'>トッピングを選択</Heading></Center>
        <Center><Button onClick={() => setDoDecrement(!doDecrement)}>デクリメントモード ({doDecrement.toString()})</Button></Center>
        <Center>
          <SelectTopping name="マヨネーズ" value={mayonezu} setValue={setMayonezu} mode={doDecrement} />
          <SelectTopping name="フライドオニオン" value={friedOnion} setValue={setFriedOnion} mode={doDecrement} />
          <SelectTopping name="カレー粉" value={curryPowder} setValue={setCurryPowder} mode={doDecrement} />
          <SelectTopping name="レモン果汁" value={lemonJuice} setValue={setLemonJuice} mode={doDecrement} />
        </Center>
      </Box>
    </Box>
  )
}

const OrderContents = () => {
  return (
    <Box>
      <Center><Heading size='lg'>注文情報</Heading></Center>
      <Center>
        <HStack>
          {[...Array(5).keys()].map((i) => (
            <Card>
              <Center>丼の情報{i}</Center>
            </Card>
          ))}
        </HStack>
      </Center>
      <Center>
        <Button colorScheme='blue'>確定する</Button>
      </Center>
    </Box>
  )
}

const Uketuke: React.FC = () => {
  return (
    <>
      <Center><Heading>受付画面</Heading></Center>
      <SelectDon />
      <OrderContents />
    </>
  )
}

export default Uketuke
