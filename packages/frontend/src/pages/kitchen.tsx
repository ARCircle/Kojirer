import {
  Box,
  HStack,
  Spinner,
} from "@chakra-ui/react";

import { DonCard } from "@/components/DonCard";
import { $api } from "@/utils/client";
import { useEffect, useState } from "react";

const KitchenUI = () => {
  // $api.useQueryでrefetchメソッドを含むオブジェクトを取得
  const { data, error, isLoading, refetch } = $api.useQuery("post", "/dons/status/", {
    body: { status: 1 },
  });

  const mutation = $api.useMutation("put", "/dons/{id}");

  const [dons, setDons] = useState<any | undefined>(undefined);

  useEffect(() => { 
    if (error) {
      return;
    }
    if (data && !isLoading) {
      setDons(data);
    }
  }, [data, error, isLoading]);

  // completeCooking関数内でデータを更新し、refetchを呼び出す
  const completeCooking = async (id: number) => {
    await mutation.mutate({
      params: {
        path: { id },
      },
      body: {
        status: 2,
      }
    });
    // データの再取得
    refetch();
  };

  // 15秒ごとにrefetchを呼び出す
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 15000); // 15秒間隔

    // コンポーネントがアンマウントされるときにintervalをクリア
    return () => clearInterval(intervalId);
  }, [refetch]);

  return (
    <Box p={5} overflowX="auto" height="100vh">
      {
        isLoading || !dons ? (
          <Spinner />
        ) : (
          <HStack spacing={6} justify="flex-end" width="max-content" direction="row-reverse" height="100%">
            {dons.reverse().map(don => (
              <DonCard don={don} completeCooking={completeCooking} />
            ))}
          </HStack>
        )
      }
    </Box>
  );
};

export default KitchenUI;
