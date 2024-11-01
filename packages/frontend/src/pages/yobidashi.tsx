import { SimpleGrid, GridItem, Box, Heading, Center, Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { paths } from "api/schema";
import { $api } from "@/utils/client";

type Order = paths['/order/status']['post']['responses']['200']['content']['application/json'][0]

type FudaProps = {
  order: Order
  color: string
}

const FudaSimple: React.FC<FudaProps> = ({ order, color }) => {
  const responsiveFontSize = { base: '0.5em', md: '3em', lg: '3em' };
  return (
    <Center h='100%' w='100%' bg={color} borderColor='gray' border='4px' borderRadius='16px' fontSize={responsiveFontSize} fontWeight='bold'>{order.id}</Center>
  )
}

const FudaProgress: React.FC<FudaProps> = ({ order: order }) => {
  function calculateProgress(order: Order): number {
    const numDons = order.dons.length;
    const numDoneDons = order.dons.filter(don => don.status === 2).length;
    return Math.floor(numDoneDons / numDons * 100);
  }
  const responsiveFontSize = { base: '0.5em', md: '2em', lg: '2.5em' };

  return (
    <Box h='100%' w='100%' pos='relative' borderColor='gray' border='4px' borderRadius='16px' overflow='hidden'>
      <Box h='100%' w={`${calculateProgress(order)}%`} bg='blue.400' pos='absolute' opacity={0.3} ></Box>
      <Flex flexDirection='row' px='10px' h='100%' pos='absolute' w='100%'>
        <Center w='50%' fontWeight='bold' fontSize={responsiveFontSize} color='black' pr='2px' >{order.id}</Center>
        <Center w='2%'>
          <Center h='90%' color='gray.400' border='2px' borderRadius={4}></Center>
        </Center>
        {/* <Divider orientation='horizontal' /> */}
        <Center w='50%' fontSize={responsiveFontSize} fontWeight='bold'>{`${order.dons.filter(don => don.status === 2).length}/${order.dons.length}`}</Center>
      </Flex>
    </Box>
  )
}

const YobidashiRow: React.FC<{ status: string }> = ({ status }) => {
  let statusNum = 0;
  if (status === 'cooking') {
    statusNum = 1;
  }
  else if (status === 'calling') {
    statusNum = 2;
  }
  else if (status === 'finish') {
    statusNum = 3;
  }
  const { data, error, isLoading, refetch } = $api.useQuery("post", "/order/status", {
    body: { status: statusNum },
  });

  const [ordersCooking, setCookingOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (error) {
      return;
    }
    if (data && !isLoading) {
      setCookingOrders(data);
    }
  }, [data, error, isLoading]);

  // 1秒ごとにrefetchを呼び出す
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 1000); // 1秒間隔

    // コンポーネントがアンマウントされるときにintervalをクリア
    return () => clearInterval(intervalId);
  }, [refetch]);

  // 本当にこれでいいのかは不明
  if (data === undefined) {
    return <div>loading...</div>;
  }

  return (
    <>
      {ordersCooking.map((order) => {
        return (
          <>
            <Box h='100px' py='5px'>
              {status === 'cooking' && <FudaProgress order={order} color={'blue.200'} />}
              {status === 'finish' && <FudaSimple order={order} color={'green.300'} />}
            </Box>
          </>
        )
      })}
    </>
  )
}

const YobidashiTable: React.FC<{ status: string }> = ({ status }) => {
  let statusNum = 0;
  if (status === 'cooking') {
    statusNum = 1;
  }
  else if (status === 'calling') {
    statusNum = 2;
  }
  else if (status === 'finish') {
    statusNum = 3;
  }
  const { data, error, isLoading, refetch } = $api.useQuery("post", "/order/status", {
    body: { status: statusNum },
  });

  const [ordersCalling, setOrdersCalling] = useState<Order[]>([]);

  useEffect(() => {
    if (error) {
      return;
    }
    if (data && !isLoading) {
      setOrdersCalling(data);
    }
  }, [data, error, isLoading]);

  // 1秒ごとにrefetchを呼び出す
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 1000); // 1秒間隔

    // コンポーネントがアンマウントされるときにintervalをクリア
    return () => clearInterval(intervalId);
  }, [refetch]);

  // 本当にこれでいいのかは不明
  if (data === undefined) {
    return <div>loading...</div>;
  }

  return (
    <>
      {ordersCalling.map((order) => (
        <GridItem key={order.id} colSpan={1} h='100px'>
          {status === 'cooking' && <FudaProgress order={order} color={'blue.200'} />}
          {status === 'calling' && <FudaSimple order={order} color={'blue.200'} />}
          {status === 'finish' && <FudaSimple order={order} color={'green.300'} />}
        </GridItem>
      ))}
    </>
  )
}

const Yobidashi: React.FC = () => {
  type TableLabelProp = {
    name: string
  }
  const responsiveSpace = { base: '1px', md: '5px', lg: '10px' }; // https://v2.chakra-ui.com/docs/styled-system/responsive-styles
  const TableLabel: React.FC<TableLabelProp> = ({ name }: TableLabelProp) => {
    return (
      <Heading textAlign='center' p='2px' w='fit-content' mx='auto' fontSize='5xl' fontWeight='bold' >{name}</Heading>
    )
  }
  return (
    <>
      <Heading textAlign='center' fontSize='xxx-large'>呼び出し口画面</Heading>
      <Flex flexDirection='row' px='10px'>
        <Box w='25%' border='2px' borderColor='black' p={responsiveSpace} mx={responsiveSpace}>
          <TableLabel name='調理中' />
          <YobidashiRow status={'cooking'} />
        </Box>
        <Box w='50%' border='2px' borderColor='black' p={responsiveSpace} verticalAlign='top' mx={responsiveSpace}>
          <TableLabel name='呼出中' />
          <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={responsiveSpace} pt={responsiveSpace}>
            <YobidashiTable status={'calling'} />
          </SimpleGrid>
        </Box>
        <Box w='25%' border='2px' borderColor='black' p={responsiveSpace} verticalAlign='top' mx={responsiveSpace}>
          <TableLabel name='呼出完了' />
          {/* <Grid templateColumns='repeat(2, 1fr)' gap={6} pt='20px'>
            <YobidashiTable n={Math.floor(Math.random()*16)+4} status={'finish'}/>
          </Grid> */}
          <YobidashiRow status={'finish'} />
        </Box>
      </Flex>
    </>
  );
}

export default Yobidashi;
