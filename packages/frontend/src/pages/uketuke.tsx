import { Box, Heading, Center, Button, Radio, RadioGroup, Stack, useNumberInput } from '@chakra-ui/react'
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

const SelectTopping: React.FC<ToppingProps> = ({ name, value, setValue }: ToppingProps) => {
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
      <Button {...dec}>-</Button>
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
        <Center>
          <SelectTopping name="マヨネーズ" value={mayonezu} setValue={setMayonezu} />
          <SelectTopping name="フライドオニオン" value={friedOnion} setValue={setFriedOnion} />
          <SelectTopping name="カレー粉" value={curryPowder} setValue={setCurryPowder} />
          <SelectTopping name="レモン果汁" value={lemonJuice} setValue={setLemonJuice} />
        </Center>
      </Box>
      <Box>
        <Heading>デバッグ</Heading>
        <Box>カラメ:  {karame}</Box>
        <Box>アブラ: {abura}</Box>
        <Box>にんにく: {niniku}</Box>
        <Box>マヨネーズ: {mayonezu}</Box>
        <Box>フライドオニオン: {friedOnion}</Box>
        <Box>カレー粉: {curryPowder}</Box>
        <Box>レモン果汁: {lemonJuice}</Box>
      </Box>
    </Box>
  )
}

const Uketuke: React.FC = () => {
  return (
    <>
      <Center><Heading>受付画面</Heading></Center>
      <SelectDon />
    </>
  )
}

export default Uketuke

