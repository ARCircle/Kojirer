import { Box, Heading, Center, Button, Radio, RadioGroup, Stack } from '@chakra-ui/react'
import React from 'react'

type OptionProps = {
  name: string,
  items: string[]
}

type ToppingProps = {
  name: string
}

const SelectOption: React.FC<OptionProps> = ({ name, items }: OptionProps) => {
  return (
    <Box>
      <Center><Heading size='lg'>{name}</Heading></Center>
      <RadioGroup>
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

const SelectTopping: React.FC<ToppingProps> = ({ name }: ToppingProps) => {
  return (
    <Button>{name}</Button>
  )
}

const SelectDon = () => {
  return (
    <Box border='2px'>
      <Center>丼の注文内容をここで決める</Center>
      <Box>
        <Center><Heading size='md'>オプションを選択</Heading></Center>
        <Center>
          <SelectOption name="カラメ" items={['無', '並', 'マシ', 'マシマシ']} />
          <SelectOption name="アブラ" items={['無', '並', 'マシ', 'マシマシ']} />
          <SelectOption name="にんにく" items={['無', '並', 'マシ', 'マシマシ']} />
        </Center>
      </Box>
      <Box>
        <Center><Heading size='md'>トッピングを選択</Heading></Center>
        <Center>
          <SelectTopping name="マヨネーズ" />
          <SelectTopping name="フライドオニオン" />
          <SelectTopping name="カレー粉" />
          <SelectTopping name="レモン果汁" />
        </Center>
      </Box>
    </Box>
  )
}

const Uketuke: React.FC = () => {
  return (
    <>
      <Heading>受付画面</Heading>
      <SelectDon />
    </>
  )
}

export default Uketuke

