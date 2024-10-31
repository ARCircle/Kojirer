import { Box, Heading, Center, Button, Radio, RadioGroup, Stack, useNumberInput, Card, HStack, CardHeader, CardBody, Text, useToast } from '@chakra-ui/react'
import { client } from '@/utils/client'
import React from 'react'

type Don = {
  id: number
  price: number
  customizes: {
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

type CustomizeProps = {
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
  setId: (value: number) => void
}

const SelectCustomize: React.FC<CustomizeProps> = ({ name, items, value, setValue }: CustomizeProps) => {
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
      <Button {...(mode ? dec : inc)} colorScheme={mode && value !== 0 ? 'red' : 'gray'}>{name} ({value})</Button>
    </Stack>
  )
}

const SelectDon: React.FC<SelectDonProps> = ({ id, setId, dons, setDons }: SelectDonProps) => {

  const [price, setPrice] = React.useState(0);
  const [karame, setKarame] = React.useState('');
  const [abura, setAbura] = React.useState('');
  const [niniku, setNiniku] = React.useState('');
  const [mayonezu, setMayonezu] = React.useState(0);
  const [friedOnion, setFriedOnion] = React.useState(0);
  const [curryPowder, setCurryPowder] = React.useState(0);
  const [lemonJuice, setLemonJuice] = React.useState(0);
  const [doDecrement, setDoDecrement] = React.useState(false);
  const toast = useToast();

  const submitDon = () => {
    // [TODO] 丼の情報が変わるたびにBEから価格を取得するようにする
    const selectedDon: Don = {
      id: id,
      price: price,
      customizes: {
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
    if (dons.length === id) {
      setDons([...dons, selectedDon])
      setId(dons.length + 1)
    }
    else {
      setDons(dons.map((don) => (don.id === id) ? selectedDon : don))
      setId(dons.length)
    }

    setKarame('')
    setAbura('')
    setNiniku('')
    setMayonezu(0)
    setFriedOnion(0)
    setCurryPowder(0)
    setLemonJuice(0)
    setDoDecrement(false)
  }

  const restoreDon = React.useCallback(() => {
    setPrice(dons[id].price)
    setKarame(dons[id].customizes.karame)
    setAbura(dons[id].customizes.abura)
    setNiniku(dons[id].customizes.niniku)
    setMayonezu(dons[id].toppings.mayonezu)
    setFriedOnion(dons[id].toppings.friedOnion)
    setCurryPowder(dons[id].toppings.curryPowder)
    setLemonJuice(dons[id].toppings.lemonJuice)
  }, [dons, id])

  const fetchPrice = React.useCallback(async () => {
    const data = {
      size: 2, // 今年度は麺がないため固定する
      toppings: [mayonezu, friedOnion, curryPowder, lemonJuice].map((v, ind) => (
        {
          id: ind+1,
          amount: v
        }
      )),
      snsFollowed: false
    }
    const res = await client.POST("/dons/price", { body: data })
    if (res.data && res.data.price) {
      setPrice(res.data.price)
    } else {
      toast({
        title: '価格の取得に失敗しました',
        status: 'error',
        variant: 'left-accent'
      })
    }

  }, [mayonezu, friedOnion, curryPowder, lemonJuice, toast])

  React.useEffect(() => {
    if (dons.length !== id) {
      restoreDon()
    }
  }, [id, restoreDon, dons.length])

  React.useEffect(() => { fetchPrice() }, [mayonezu, friedOnion, curryPowder, lemonJuice, fetchPrice])

  return (
    <Box border='2px'>
      <Center><Heading>丼{id}を選択中</Heading></Center>
      <Center><Heading size='md'>価格: ¥{price}</Heading></Center>
      <Box>
        <Center><Heading size='md'>カスタマイズを選択</Heading></Center>
        <Center>
          <SelectCustomize name="カラメ" items={['無', '並', 'マシ', 'マシマシ']} value={karame} setValue={setKarame} />
          <SelectCustomize name="アブラ" items={['無', '並', 'マシ', 'マシマシ']} value={abura} setValue={setAbura} />
          <SelectCustomize name="にんにく" items={['無', '並', 'マシ', 'マシマシ']} value={niniku} setValue={setNiniku} />
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

const OrderContents: React.FC<OrderContentsProps> = ({ dons, setId }: OrderContentsProps) => {
  return (
    <Box>
      <Center><Heading size='lg'>注文情報</Heading></Center>
      <Center>
        <HStack>
          {dons.map((don) => (
            <Card key={don.id}>
              <CardHeader><Center><Heading>丼{don.id}</Heading></Center></CardHeader>
              <CardBody>
                <Text>価格: ¥{don.price}</Text>
                <Text>カラメ: {don.customizes.karame}</Text>
                <Text>アブラ: {don.customizes.abura}</Text>
                <Text>にんにく: {don.customizes.niniku}</Text>
                <Text>マヨネーズ: {don.toppings.mayonezu}</Text>
                <Text>フライドオニオン: {don.toppings.friedOnion}</Text>
                <Text>カレー粉: {don.toppings.curryPowder}</Text>
                <Text>レモン果汁: {don.toppings.lemonJuice}</Text>
                <Center><Button colorScheme='green' onClick={() => setId(don.id)}>編集する</Button></Center>
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
      <OrderContents dons={Dons} setId={setDonId} />
    </>
  )
}

export default Uketuke
