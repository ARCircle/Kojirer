import { $api } from '@/utils/client';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { paths } from 'api/schema';
import React, { useEffect, useState } from 'react';

type Order = paths['/order/status']['post']['responses']['200']['content']['application/json'][0];

type FudaProps = {
  order: Order;
  color: string;
};

const FudaSimple: React.FC<FudaProps> = ({ order, color }) => {
  const queryClient = useQueryClient();
  const { mutate } = $api.useMutation('put', '/order/status');

  const getBackgroundColor = () => {
    if (color === 'blue.200') return 'bg-blue-200';
    if (color === 'green.300') return 'bg-green-300';
    return 'bg-gray-200';
  };

  return (
    <div
      className={cn(
        'h-full w-full border-4 border-gray-400 rounded-2xl cursor-pointer flex items-center justify-center',
        'text-3xl md:text-5xl lg:text-5xl font-bold',
        getBackgroundColor()
      )}
      onClick={() =>
        mutate(
          {
            body: { orderId: order.id, targetStatus: 3 },
          },
          {
            onSuccess: (result) => {
              queryClient.setQueryData(
                [
                  'post',
                  '/order/status',
                  {
                    body: { status: 3 },
                  },
                ],
                (old: Order[]) => [...old, result],
              );
              queryClient.setQueryData(
                [
                  'post',
                  '/order/status',
                  {
                    body: { status: 2 },
                  },
                ],
                (old: Order[]) => old.filter((o) => o.id !== result.id),
              );
            },
          },
        )
      }
    >
      {order.id}
    </div>
  );
};

const FudaProgress: React.FC<FudaProps> = ({ order: order }) => {
  function calculateProgress(order: Order): number {
    const numDons = order.dons.length;
    const numDoneDons = order.dons.filter((don) => don.status === 2).length;
    return Math.floor((numDoneDons / numDons) * 100);
  }

  return (
    <div className="h-full w-full relative border-4 border-gray-400 rounded-2xl overflow-hidden">
      <div 
        className="h-full bg-blue-400 absolute opacity-30" 
        style={{ width: `${calculateProgress(order)}%` }}
      ></div>
      <div className="flex flex-row px-2 h-full absolute w-full">
        <div className="w-1/2 flex items-center justify-center font-bold text-black pr-1 text-2xl md:text-3xl lg:text-4xl">
          {order.id}
        </div>
        <div className="w-[2%] flex items-center justify-center">
          <div className="h-[90%] border-2 border-gray-400 rounded"></div>
        </div>
        <div className="w-1/2 flex items-center justify-center font-bold text-2xl md:text-3xl lg:text-4xl">
          {`${order.dons.filter((don) => don.status === 2).length}/${order.dons.length}`}
        </div>
      </div>
    </div>
  );
};

const YobidashiRow: React.FC<{ status: string }> = ({ status }) => {
  let statusNum = 0;
  if (status === 'cooking') {
    statusNum = 1;
  } else if (status === 'calling') {
    statusNum = 2;
  } else if (status === 'finish') {
    statusNum = 3;
  }
  const { data, error, isLoading, refetch } = $api.useQuery('post', '/order/status', {
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
          <div key={order.id} className="h-[100px] py-1">
            {status === 'cooking' && <FudaProgress order={order} color={'blue.200'} />}
            {status === 'finish' && <FudaSimple order={order} color={'green.300'} />}
          </div>
        );
      })}
    </>
  );
};

const YobidashiTable: React.FC<{ status: string }> = ({ status }) => {
  let statusNum = 0;
  if (status === 'cooking') {
    statusNum = 1;
  } else if (status === 'calling') {
    statusNum = 2;
  } else if (status === 'finish') {
    statusNum = 3;
  }
  const { data, error, isLoading, refetch } = $api.useQuery('post', '/order/status', {
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
        <div key={order.id} className="h-[100px]">
          {status === 'cooking' && <FudaProgress order={order} color={'blue.200'} />}
          {status === 'calling' && <FudaSimple order={order} color={'blue.200'} />}
          {status === 'finish' && <FudaSimple order={order} color={'green.300'} />}
        </div>
      ))}
    </>
  );
};

const Yobidashi: React.FC = () => {
  type TableLabelProp = {
    name: string;
  };
  const TableLabel: React.FC<TableLabelProp> = ({ name }: TableLabelProp) => {
    return (
      <h1 className="text-center p-1 w-fit mx-auto text-5xl font-bold">
        {name}
      </h1>
    );
  };
  return (
    <div>
      <h1 className="text-center text-6xl font-bold">
        呼び出し口画面
      </h1>
      <div className="flex flex-row px-2">
        <div className="w-1/4 border-2 border-black p-1 md:p-2 lg:p-3 mx-1 md:mx-2 lg:mx-3">
          <TableLabel name='調理中' />
          <YobidashiRow status={'cooking'} />
        </div>
        <div className="w-1/2 border-2 border-black p-1 md:p-2 lg:p-3 mx-1 md:mx-2 lg:mx-3">
          <TableLabel name='呼出中' />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2 lg:gap-3 pt-1 md:pt-2 lg:pt-3">
            <YobidashiTable status={'calling'} />
          </div>
        </div>
        <div className="w-1/4 border-2 border-black p-1 md:p-2 lg:p-3 mx-1 md:mx-2 lg:mx-3">
          <TableLabel name='呼出完了' />
          <YobidashiRow status={'finish'} />
        </div>
      </div>
    </div>
  );
};

export default Yobidashi;
