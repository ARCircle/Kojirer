import { Grid, GridItem, Box, Heading, CircularProgress, CircularProgressLabel, Center, Flex} from '@chakra-ui/react'
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
    <>
      <Heading textAlign='center' color='white' pos='absolute' size='4xl'>{order.id}</Heading>
      <Center>
        <CircularProgress value={calculateProgress(order)} color='green' size='180px' p='10px'>
          <CircularProgressLabel>{order.dons.filter(dons=>dons.status == 2).length}/{order.dons.length}</CircularProgressLabel>
        </CircularProgress>
      </Center>
    </>
  )
}


const YobidashiRows: React.FC = () => {
  return (
    <Center py='20px'>
      <Heading>kari</Heading>
    </Center>
  )
}

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
        id: i,
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
        <GridItem key={order.id} colSpan={1} bg='blue.500' h='200px'>
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
        <Box w='20%' border='2px' borderColor='black' p='20px' mr='5px'>
          <Heading textAlign='center' borderRadius='md' w='fit-content' mx='auto' fontSize='xxx-large'>調理中</Heading>
          <YobidashiRows />
        </Box>
        <Box w='60%' border='2px' borderColor='black' p='20px' verticalAlign='top' ml='5px'>
          <Heading textAlign='center' borderRadius='md' w='fit-content' mx='auto' fontSize='xxx-large'>呼出中</Heading>
          <Grid templateColumns='repeat(3, 1fr)' gap={6} pt='20px'>
            <YobidashiTable n={4}/>
          </Grid>
        </Box>
        <Box w='20%' border='2px' borderColor='black' p='20px' verticalAlign='top' ml='5px'>
          <Heading textAlign='center' borderRadius='md' w='fit-content' mx='auto' fontSize='xxx-large'>呼出中</Heading>
          <YobidashiRows />
        </Box>
      </Flex>
    </>
  );
}

export default Yobidashi;
