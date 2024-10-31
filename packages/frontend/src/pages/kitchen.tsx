import {
  Box,
  HStack,
  Spinner,
} from "@chakra-ui/react";

import { DonCard } from "@/components/DonCard";
import { $api } from "@/utils/client";

const KitchenUI = () => {
  const { data, error, isLoading } = $api.useQuery("post", "/dons/status/", {
    body: { status: 1 },
  });
  if (error) { 
    return "network error";
  }

  return (
    <Box p={5} overflowX="auto">
      {
        isLoading || !data ? (
          <Spinner />
        ) : (
          <HStack spacing={6} justify="flex-end" width="max-content" direction="row-reverse">
            {data.reverse().map(don => (
              <DonCard key={don.id} {...don} />
            ))}
          </HStack>
        )
      }
    </Box>
  );
};

export default KitchenUI;
