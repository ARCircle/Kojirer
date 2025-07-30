import { $api } from '@/utils/client';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { paths } from 'api/schema';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Order = paths['/order/status']['post']['responses']['200']['content']['application/json'][0];

type FudaProps = {
  order: Order;
  color: string;
};

const FudaSimple: React.FC<FudaProps> = ({ order, color }) => {
  const queryClient = useQueryClient();
  const { mutate } = $api.useMutation('put', '/order/status');
  const [isHovered, setIsHovered] = useState(false);

  const getGradientColors = () => {
    if (color === 'blue.200') return 'from-blue-400 via-blue-300 to-blue-200';
    if (color === 'green.300') return 'from-emerald-400 via-emerald-300 to-emerald-200';
    return 'from-gray-400 via-gray-300 to-gray-200';
  };

  const getBorderColor = () => {
    if (color === 'blue.200') return 'border-blue-400';
    if (color === 'green.300') return 'border-emerald-400';
    return 'border-gray-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'h-full w-full rounded-2xl cursor-pointer flex items-center justify-center relative overflow-hidden',
        'text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800',
        'bg-gradient-to-br shadow-xl hover:shadow-2xl transition-all duration-300',
        'border-2 backdrop-blur-sm',
        getGradientColors(),
        getBorderColor(),
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
      {/* Shimmer effect */}
      <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transform -skew-x-12 transition-all duration-700 hover:translate-x-full' />

      {/* Order number */}
      <motion.span
        animate={{
          scale: isHovered ? 1.1 : 1,
          textShadow: isHovered ? '0 0 20px rgba(255,255,255,0.8)' : '0 0 0px rgba(255,255,255,0)',
        }}
        transition={{ duration: 0.2 }}
      >
        {order.id}
      </motion.span>

      {/* Pulse effect for calling status */}
      {color === 'blue.200' && (
        <motion.div
          className='absolute inset-0 rounded-2xl border-2 border-blue-400'
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.div>
  );
};

const FudaProgress: React.FC<FudaProps> = ({ order: order }) => {
  function calculateProgress(order: Order): number {
    const numDons = order.dons.length;
    const numDoneDons = order.dons.filter((don) => don.status === 2).length;
    return Math.floor((numDoneDons / numDons) * 100);
  }

  const progress = calculateProgress(order);
  const completedItems = order.dons.filter((don) => don.status === 2).length;
  const totalItems = order.dons.length;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className='h-full w-full relative rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-orange-50 border-2 border-orange-300 shadow-lg hover:shadow-xl transition-all duration-300'
    >
      {/* Progress bar background */}
      <motion.div
        className='h-full bg-gradient-to-r from-orange-400 via-orange-300 to-yellow-300 absolute'
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      {/* Animated shimmer on progress bar */}
      <div className='absolute inset-0'>
        <motion.div
          className='h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30'
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content overlay */}
      <div className='flex flex-row px-3 h-full absolute w-full z-10'>
        <div className='w-1/2 flex items-center justify-center font-bold text-gray-800 pr-2 text-2xl md:text-3xl lg:text-4xl'>
          <motion.span
            animate={{
              scale: progress === 100 ? [1, 1.1, 1] : 1,
              color: progress === 100 ? '#059669' : '#374151',
            }}
            transition={{ duration: 0.5 }}
          >
            {order.id}
          </motion.span>
        </div>

        {/* Divider */}
        <div className='w-[2%] flex items-center justify-center'>
          <div className='h-[70%] w-0.5 bg-gray-400 rounded-full opacity-50'></div>
        </div>

        <div className='w-1/2 flex items-center justify-center font-bold text-2xl md:text-3xl lg:text-4xl'>
          <motion.span
            key={`${completedItems}-${totalItems}`}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={cn('text-gray-800', progress === 100 && 'text-emerald-600')}
          >
            {completedItems}/{totalItems}
          </motion.span>
        </div>
      </div>

      {/* Progress completion celebration */}
      {progress === 100 && (
        <motion.div
          className='absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 opacity-20'
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Subtle pulse for active orders */}
      {progress > 0 && progress < 100 && (
        <motion.div
          className='absolute inset-0 border-2 border-orange-400 rounded-2xl'
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.div>
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
    <AnimatePresence>
      {ordersCooking.map((order, index) => {
        return (
          <motion.div
            key={order.id}
            className='h-[100px] py-1'
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {status === 'cooking' && <FudaProgress order={order} color={'blue.200'} />}
            {status === 'finish' && <FudaSimple order={order} color={'green.300'} />}
          </motion.div>
        );
      })}
    </AnimatePresence>
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
    <AnimatePresence>
      {ordersCalling.map((order, index) => (
        <motion.div
          key={order.id}
          className='h-[100px]'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          layout
        >
          {status === 'cooking' && <FudaProgress order={order} color={'blue.200'} />}
          {status === 'calling' && <FudaSimple order={order} color={'blue.200'} />}
          {status === 'finish' && <FudaSimple order={order} color={'green.300'} />}
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

const Yobidashi: React.FC = () => {
  type TableLabelProp = {
    name: string;
    icon: string;
    color: string;
  };
  const TableLabel: React.FC<TableLabelProp> = ({ name, icon, color }: TableLabelProp) => {
    return (
      <motion.div
        className='text-center p-3 mx-auto mb-4'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className={cn(
            'inline-flex items-center gap-3 px-6 py-3 rounded-2xl',
            'text-3xl md:text-4xl lg:text-5xl font-bold text-white shadow-lg',
            'bg-gradient-to-r',
            color,
          )}
        >
          <span className='text-4xl md:text-5xl lg:text-6xl'>{icon}</span>
          <span>{name}</span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-center mb-8'
      >
        <h1 className='text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4'>
          kojirer
        </h1>
        <p className='text-xl md:text-2xl text-gray-600 font-medium'>リアルタイム注文管理システム</p>
      </motion.div>

      {/* Status Columns */}
      <motion.div
        className='flex flex-row gap-4 px-2 max-w-7xl mx-auto'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Cooking Column */}
        <motion.div
          className='w-1/4 bg-white/70 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-xl border border-orange-200'
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <TableLabel name='調理中' icon='👨‍🍳' color='from-orange-500 to-red-500' />
          <YobidashiRow status={'cooking'} />
        </motion.div>

        {/* Calling Column */}
        <motion.div
          className='w-1/2 bg-white/70 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-xl border border-blue-200'
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <TableLabel name='呼出中' icon='📢' color='from-blue-500 to-cyan-500' />
          <motion.div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4' layout>
            <YobidashiTable status={'calling'} />
          </motion.div>
        </motion.div>

        {/* Finished Column */}
        <motion.div
          className='w-1/4 bg-white/70 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-xl border border-emerald-200'
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <TableLabel name='完了' icon='✅' color='from-emerald-500 to-green-500' />
          <YobidashiRow status={'finish'} />
        </motion.div>
      </motion.div>

      {/* Floating background elements */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <motion.div
          className='absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full'
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className='absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-indigo-300/10 to-cyan-300/10 rounded-full'
          animate={{
            rotate: [360, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    </div>
  );
};

export default Yobidashi;
