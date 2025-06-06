import { Box, HStack, Spinner } from '@chakra-ui/react';

import { DonCard } from '@/components/DonCard';
import { $api } from '@/utils/client';
import { paths } from 'api/schema';
import { useEffect, useState } from 'react';

type Don = paths['/dons/status/']['post']['responses']['200']['content']['application/json'][0];

const KitchenUI = () => {
  // $api.useQueryでrefetchメソッドを含むオブジェクトを取得
  const { data, error, isLoading, refetch } = $api.useQuery('post', '/dons/status/', {
    body: { status: 1 },
  });

  const mutation = $api.useMutation('put', '/dons/{id}');

  const [dons, setDons] = useState<Don[]>([]);

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
        status: 1,
      },
    });
    // データの再取得
    refetch();
  };

  // 1秒ごとにrefetchを呼び出す
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 1000); // 1秒間隔

    // コンポーネントがアンマウントされるときにintervalをクリア
    return () => clearInterval(intervalId);
  }, [refetch]);

  return (
    <Box p={5} overflowX='auto' height='100vh'>
      {isLoading || !dons ? (
        <Spinner />
      ) : (
        <HStack spacing={6} justify='flex-end' width='max-content' direction='row-reverse' height='100%'>
          {dons.map((don) => (
            <DonCard don={don} completeCooking={completeCooking} />
          ))}
        </HStack>
      )}
    </Box>
  );
};

export default KitchenUI;
