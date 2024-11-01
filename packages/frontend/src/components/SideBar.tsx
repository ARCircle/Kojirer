import { 
  Box, 
  Button, 
  Text, 
  useColorModeValue, 
  VStack
} from "@chakra-ui/react";
import paths from "api";
import React from "react";
import ReceptionDonCard from "./ReceptionDonCard";
import { $api } from "@/utils/client";
import ReceptionCallNumInput from "./ReceptionCallNumInput";

type Don = paths["/order"]["post"]["requestBody"]["content"]["application/json"]["dons"][0];

interface SidebarProps {
  dons: Don[],
  selectingIndex?: number | null,
  onSelect?: (index: number, don: Don) => void
}

const SidebarContent: React.FC<SidebarProps> = ({ 
  dons, 
  selectingIndex = null,
  onSelect = () => {},
}) => {
  const { data } = $api.useQuery('post', '/order/price', {
    body: {
      dons,
    }
  });

  const price = data?.price || 0;

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={80}
      pos="fixed"
      h="full"
    >
      <VStack 
        h="20"
        alignItems="center" 
        mx="8" 
        align="stretch"  
      >
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          注文情報
        </Text>
      </VStack>
      <Box overflow="scroll" px="8" h="100%">
      {
          dons.map((don, idx) => 
            <ReceptionDonCard 
              key={idx}
              index={idx + 1}
              isSelecting={selectingIndex === idx}
              onClick={() => {
                onSelect(idx, don);
              }}
              {...don}
            />
          )
        }
      </Box>
      <VStack 
        bottom={0} 
        pos='fixed' 
        p={10} 
        align='stretch'
        backdropFilter='blur(10px)'
        background='rgba(255, 255, 255, 0.4)'
      >
        <Text fontSize='xl'>合計金額 ￥{price}</Text>
        <ReceptionCallNumInput />
        <Button colorScheme='teal' mt={4}>
          注文
        </Button>
      </VStack>
    </Box>
  )
}

export default SidebarContent;