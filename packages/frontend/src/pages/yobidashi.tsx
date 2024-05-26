import { Grid, GridItem, Box, Heading, CircularProgress, CircularProgressLabel, Center, Flex, calc} from '@chakra-ui/react'
import React from 'react'

type TableProps = {
  n: number
}

type Don = {
  id: number,
  status: number
}

type Order = {
  id: number,
  dons: Don[]
}

type MockProps = {
  numOrders: number
}

type FudaProps = {
  order: Order
}

const Fuda: React.FC<FudaProps> = ({ order }) => {
  function calculateProgress(order: Order): number {
    const numDons = order.dons.length;
    const numDoneDons = order.dons.filter(don => don.status === 2).length;
    return Math.floor(numDoneDons / numDons * 100);
  }

  return (
    <Box h='100%' w='100%' pos='relative'>
      <Box h='100%' w={`${calculateProgress(order)}%`} bg='blue.200' pos='absolute'></Box>
      <Flex flexDirection='row' px='10px' h='100%' pos='absolute' w='100%'>
        <Center w='50%' fontWeight='bold' fontSize='1em' color='black' pr='2px' >{order.id}</Center>
        <Center w='2%'>
          <Center h='90%' color='gray.400' border='4px' borderRadius={4}></Center>
        </Center>
        <Center w='50%' fontSize='1em'>{`${order.dons.filter(don => don.status === 2).length}/${order.dons.length}`}</Center>
      </Flex>
    </Box>
  )
}

// const YobidashiRows: React.FC = () => {
//   return (
//     <Center py='20px'>
//       <Heading>kari</Heading>
//     </Center>
//   )
// }

const YobidashiTable: React.FC<TableProps> = ({ n }: TableProps) => {
  function generateMockOrders({numOrders}: MockProps): Order[] {
    const orders: Order[] = [];

    // Generate mock data for orders
    for (let i = 1; i <=numOrders; i++) {
      const dons: Don[] = [];
      const numDons = Math.floor(Math.random() * 4) + 2;

      // Generate mock data for dons
      for (let j = 1; j <= numDons; j++) {
        const don: Don = {
          id: j,
          status: Math.floor(Math.random() * 3)
        };
        dons.push(don);
      }

      const order: Order = {
        id: 200+i,
        dons: dons
      };

      orders.push(order);
    }

    return orders;
  }

  const data = generateMockOrders({numOrders: n});
  return (
    <>
      {data.map((order) => (
        <GridItem key={order.id} colSpan={1} h='100px' borderColor='gray' border='4px'>
          <Fuda order={order} />
        </GridItem>
      ))}
    </>
  )
}

const Yobidashi: React.FC = () => {
  return (
    <>
      <Heading textAlign='center' fontSize='xxx-large'>呼び出し口画面</Heading>
      <Flex flexDirection='row' px='10px'>
        <Box w='25%' border='2px' borderColor='black' p='20px' mr='5px'>
          <Heading textAlign='center' borderRadius='md' w='fit-content' mx='auto' fontSize='xxx-large'>調理中</Heading>
          <Grid templateColumns='repeat(2, 1fr)' gap={6} pt='20px'>
            <YobidashiTable n={Math.floor(Math.random()*16)+4}/>
          </Grid>
        </Box>
        <Box w='50%' border='2px' borderColor='black' p='20px' verticalAlign='top' ml='5px'>
          <Heading textAlign='center' borderRadius='md' w='fit-content' mx='auto' fontSize='xxx-large'>調理完了＆呼出中</Heading>
          <Grid templateColumns='repeat(4, 1fr)' gap={6} pt='20px'>
            <YobidashiTable n={Math.floor(Math.random()*32)+8}/>
          </Grid>
        </Box>
        <Box w='25%' border='2px' borderColor='black' p='20px' verticalAlign='top' ml='5px'>
          <Heading textAlign='center' borderRadius='md' w='fit-content' mx='auto' fontSize='xxx-large'>呼出完了</Heading>
          <Grid templateColumns='repeat(2, 1fr)' gap={6} pt='20px'>
            <YobidashiTable n={Math.floor(Math.random()*16)+4}/>
          </Grid>
        </Box>
      </Flex>
    </>
  );
}

export default Yobidashi;
