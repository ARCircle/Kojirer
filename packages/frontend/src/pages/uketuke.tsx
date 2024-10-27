import { Box, Heading, Center, Button, Radio, RadioGroup, Stack, useNumberInput, Card, HStack, CardHeader, CardBody, Text } from '@chakra-ui/react'
import React from 'react'

type Don = {
  id: number
  price: number
  options: {
    karame: string
    abura: string
    niniku: string
  }
  toppings: {
    mayonezu: number
    friedOnion: number
    curryPowder: number
    lemonJuice: number
  }
}

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

type SelectDonProps = {
  id: number
  setId: (value: number) => void
  dons: Don[]
  setDons: (value: Don[]) => void
}

type OrderContentsProps = {
  dons: Don[]
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

const SelectDon: React.FC<SelectDonProps> = ({ id, setId, dons, setDons }: SelectDonProps) => {

  const [karame, setKarame] = React.useState('');
  const [abura, setAbura] = React.useState('');
  const [niniku, setNiniku] = React.useState('');
  const [mayonezu, setMayonezu] = React.useState(0);
  const [friedOnion, setFriedOnion] = React.useState(0);
  const [curryPowder, setCurryPowder] = React.useState(0);
  const [lemonJuice, setLemonJuice] = React.useState(0);
  const [doDecrement, setDoDecrement] = React.useState(false);

  const submitDon = () => {
    const selectedDon: Don = {
      id: id,
      price: 0,
      options: {
        karame: karame,
        abura: abura,
        niniku: niniku
      },
      toppings: {
        mayonezu: mayonezu,
        friedOnion: friedOnion,
        curryPowder: curryPowder,
        lemonJuice: lemonJuice
      }
    }
    setDons([...dons, selectedDon])

    setKarame('')
    setAbura('')
    setNiniku('')
    setMayonezu(0)
    setFriedOnion(0)
    setCurryPowder(0)
    setLemonJuice(0)
    setDoDecrement(false)

    setId(id + 1)
  }

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
      <Center><Button colorScheme='blue' onClick={submitDon}>確定する</Button></Center>
    </Box>
  )
}

const OrderContents: React.FC<OrderContentsProps> = ({ dons }: OrderContentsProps) => {
  return (
    <Box>
      <Center><Heading size='lg'>注文情報</Heading></Center>
      <Center>
        <HStack>
          {dons.map((don) => (
            <Card>
              <CardHeader><Center><Heading>丼{don.id}</Heading></Center></CardHeader>
              <CardBody>
                <Text>価格: ¥{don.price}</Text>
                <Text>カラメ: {don.options.karame}</Text>
                <Text>アブラ: {don.options.abura}</Text>
                <Text>にんにく: {don.options.niniku}</Text>
                <Text>マヨネーズ: {don.toppings.mayonezu}</Text>
                <Text>フライドオニオン: {don.toppings.friedOnion}</Text>
                <Text>カレー粉: {don.toppings.curryPowder}</Text>
                <Text>レモン果汁: {don.toppings.lemonJuice}</Text>
                <Center><Button colorScheme='green'>編集する</Button></Center>
              </CardBody>
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
  const [Dons, setDons] = React.useState<Don[]>([])
  const [DonId, setDonId] = React.useState(0)
  return (
    <>
      <Center><Heading>受付画面</Heading></Center>
      <SelectDon id={DonId} setId={setDonId} dons={Dons} setDons={setDons} />
      <OrderContents dons={Dons} />
    </>
  )
}

export default Uketuke
