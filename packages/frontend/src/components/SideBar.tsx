import { Box, Button, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { SwipeableList, SwipeableListItem, SwipeAction, TrailingActions } from 'react-swipeable-list';
import paths from 'api';
import React, { useState } from 'react';
import ReceptionDonCard from './ReceptionDonCard';
import { $api } from '@/utils/client';
import ReceptionCallNumInput from './ReceptionCallNumInput';

import 'react-swipeable-list/dist/styles.css';

type Don = paths['/order']['post']['requestBody']['content']['application/json']['dons'][0] & { uniqueId: string };

interface SidebarProps {
  dons: Don[];
  selectingIndex?: number | null;
  onSelect?: (index: number, don: Don) => void;
  onDelete?: (uniqueId: string) => void;
  onOrder?: (callNum: number) => void;
}

const SidebarContent: React.FC<SidebarProps> = ({
  dons,
  selectingIndex = null,
  onSelect = () => {},
  onDelete = () => {},
  onOrder = () => {},
}) => {
  const { data, isLoading } = $api.useQuery('post', '/order/price', {
    body: {
      dons,
    },
  });
  const [callNum, setCallNum] = useState(0);

  const price = data?.price || 0;

  const trailingActions = (uniqueId: string) => (
    <TrailingActions>
      <SwipeAction destructive={true} onClick={() => onDelete(uniqueId)}>
        Delete
      </SwipeAction>
    </TrailingActions>
  );

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight='1px'
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={80}
      pos='fixed'
      h='full'
    >
      <VStack h='20' alignItems='center' mx='8' align='stretch'>
        <Text fontSize='2xl' fontFamily='monospace' fontWeight='bold' mt={4}>
          注文情報
        </Text>
      </VStack>
      <Box overflowY='auto' px='8' h='60%'>
        <SwipeableList>
          {dons.map((don, idx) => (
            <SwipeableListItem trailingActions={trailingActions(don.uniqueId)} key={don.uniqueId}>
              <ReceptionDonCard
                index={idx + 1}
                isSelecting={selectingIndex === idx}
                onClick={() => {
                  onSelect(idx, don);
                }}
                {...don}
              />
            </SwipeableListItem>
          ))}
        </SwipeableList>
      </Box>
      <VStack
        bottom={0}
        pos='fixed'
        p={10}
        align='stretch'
        backdropFilter='blur(10px)'
        background='rgba(255, 255, 255, 0.4)'
      >
        <Text fontSize='xl'>合計金額 ￥{isLoading ? '...' : price}</Text>
        <ReceptionCallNumInput value={callNum} onChange={setCallNum} />

        <Button colorScheme='teal' mt={4} onClick={() => onOrder(callNum)} isDisabled={dons.length == 0}>
          注文
        </Button>
      </VStack>
    </Box>
  );
};

export default SidebarContent;
