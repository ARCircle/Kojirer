import {
  Box,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Stack,
  StackDivider,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";

export const DonCard = (don: Don) => {
  const id = don.id;
  function renderInfoRowContent(
    label: string, // 表示名
    amount: number, // 増減の数
    defaultAmount: number, // オプションのデフォルト数
    incrementBgColor: string, // 増加させるときの背景色
    decrementBgColor: string // 減少させるときの背景色
  ) {
    const bgColor = amount < defaultAmount ? decrementBgColor : incrementBgColor;
    if (amount === defaultAmount) {
      // デフォルトから変わらないときは表示しない
      return null
    }
    else {
      // デフォルトから変更があるときは表示する
      return (
        <Card bg={bgColor} variant='outline' borderWidth={0}>
          <SimpleGrid columns={2} gridTemplateColumns="3fr 7fr" gap={0}>
            <Box px={2} display="flex" alignItems="center" justifyContent="center">
              <Text fontSize="4xl" fontWeight="bold" color={amount > 0 ? 'red.500' : 'blue'}>
                {amount > 0 ? '＋' : 'ー' /* 増減が+-1のときは，記号だけ表示 */}
                {amount > 1 ? amount : '' /* 2個以上増やすときは数字も表示 */}
              </Text>
            </Box>
            <Box pl={1} display="flex" alignItems="center" justifyContent="left">
              <Text fontSize="xl" fontWeight="bold">
                {label}
              </Text>
            </Box>
          </SimpleGrid>
        </Card>
      )
    }
  }

  function renderCustomiseContent(customise: Don["customise"]) {
    if (customise) {
      const items = Object.keys(customise).map((key) => {
        return renderInfoRowContent(
          key,  // label
          customise[key], // amount
          0,  // defaultAmount
          'red.100', // incrementBgColor
          'blue.100' // decrementBgColor
        );
      });
      return items;
    }
    return null;
  }

  function renderToppingsContent(toppings: Don["toppings"]) {
    if (toppings) {
      const items = Object.keys(toppings)
        .filter((key) => toppings[key] >= 0) // 個数が負の場合はスキップ
        .map((key) => {
        return renderInfoRowContent(
          key,  // label
          toppings[key], // amount
          0,  // defaultAmount
          'yellow.200', // incrementBgColor
          'lightgray' // decrementBgColor
        );
      });
      return items;
    }
    return null;
  }

  return (
    <Box width="300px">
      <Card variant='outline' borderWidth='3px' width="300px">
        {/* header */}
        <CardHeader bg="cyan" margin='10px' borderRadius="md">
          <Heading
            size='3xl'
            fontWeight="bold"
            textAlign="center"
          >
            {id}
          </Heading>
        </CardHeader>

        {/* body */}
        <CardBody>
          <Stack divider={<StackDivider />} spacing='4'>
            {/* customizes */}
            <Stack spacing='4'>
              {
                renderCustomiseContent(don["customise"])
              }
            </Stack>
            {/* toppings */}
            <Stack spacing='4'>
              {
                renderToppingsContent(don["toppings"])
              }
            </Stack>
          </Stack>
        </CardBody>
      </Card>
    </Box>
    
  )
}