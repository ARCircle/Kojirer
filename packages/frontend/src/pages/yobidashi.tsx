import { Grid, GridItem, Box, Heading, CircularProgress, CircularProgressLabel, Center, Flex, calc, Divider, Text} from '@chakra-ui/react'
import React from 'react'

type TableProps = {
  n: number
  status: string
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
  color: string
}

const FudaSimple: React.FC<FudaProps> = ({ order, color }) => {
  return (
    <Center h='100%' w='100%' bg={color} borderColor='gray' border='4px' borderRadius='16px' fontSize='xxx-large' fontWeight='bold'>{order.id}</Center>
  )
}

const FudaProgress: React.FC<FudaProps> = ({ order }) => {
  function calculateProgress(order: Order): number {
    const numDons = order.dons.length;
    const numDoneDons = order.dons.filter(don => don.status === 2).length;
    return Math.floor(numDoneDons / numDons * 100);
  }

  return (
    <Box h='100%' w='100%' pos='relative' borderColor='gray' border='4px' borderRadius='16px' overflow='hidden'>
      <Box h='100%' w={`${calculateProgress(order)}%`} bg='blue.400' pos='absolute' opacity={0.3} ></Box>
      <Flex flexDirection='row' px='10px' h='100%' pos='absolute' w='100%'>
        <Center w='50%' fontWeight='bold' fontSize='1em' color='black' pr='2px' >{order.id}</Center>
        <Center w='2%'>
          <Center h='90%' color='gray.400' border='2px' borderRadius={4}></Center>
        </Center>
        {/* <Divider orientation='horizontal' /> */}
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

const YobidashiTable: React.FC<TableProps> = ({ n, status }: TableProps) => {
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
        <GridItem key={order.id} colSpan={1} h='100px'>
          {status === 'cooking' && <FudaProgress order={order} color={'blue.200'} />}
          {status === 'calling' && <FudaSimple order={order} color={'blue.200'}/>}
          {status === 'finish' && <FudaSimple order={order} color={'green.300'}/>}
        </GridItem>
      ))}
    </>
  )
}

const Yobidashi: React.FC = () => {
  type TableLabelProp = {
    name: string
  }
  const TableLabel: React.FC<TableLabelProp> = ({name}: TableLabelProp) => {
    return (
      <Heading textAlign='center' p='2px' w='fit-content' mx='auto' fontSize='5xl' fontWeight='bold' >{name}</Heading>
    )
  }
  return (
    <>
      <Heading textAlign='center' fontSize='xxx-large'>呼び出し口画面</Heading>
      <Flex flexDirection='row' px='10px'>
        <Box w='25%' border='2px' borderColor='black' p='20px' mr='5px'>
          <TableLabel name='調理中'/>
          <Grid templateColumns='repeat(2, 1fr)' gap={6} pt='20px'>
            <YobidashiTable n={Math.floor(Math.random()*16)+4} status={'cooking'}/>
          </Grid>
        </Box>
        <Box w='50%' border='2px' borderColor='black' p='20px' verticalAlign='top' ml='5px'>
          <TableLabel name='呼出中'/>
          <Grid templateColumns='repeat(4, 1fr)' gap={6} pt='20px'>
            <YobidashiTable n={Math.floor(Math.random()*32)+8} status={'calling'}/>
          </Grid>
        </Box>
        <Box w='25%' border='2px' borderColor='black' p='20px' verticalAlign='top' ml='5px'>
          <TableLabel name='呼出完了'/>
          <Grid templateColumns='repeat(2, 1fr)' gap={6} pt='20px'>
            <YobidashiTable n={Math.floor(Math.random()*16)+4} status={'finish'}/>
          </Grid>
        </Box>
      </Flex>
    </>
  );
}

export default Yobidashi;
