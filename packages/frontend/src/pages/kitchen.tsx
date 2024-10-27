import {
  Box,
  HStack,
} from "@chakra-ui/react";

import { DonCard } from "@/components/DonCard";
import { createExampleDons } from "@/utils/donUtils"; 

const KitchenUI = () => {
  const exampleDons = createExampleDons(20);
  return (
    <Box p={5} overflowX="auto">
      <HStack spacing={6} justify="flex-end" width="max-content" direction="row-reverse">
        {exampleDons.reverse().map(don => (
          <DonCard key={don.id} {...don} />
        ))}
      </HStack>
    </Box>
  );
};

export default KitchenUI;
