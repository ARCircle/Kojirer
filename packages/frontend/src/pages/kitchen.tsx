
import { DonCard } from '@/components/DonCard';
import { $api } from '@/utils/client';
import { paths } from 'api/schema';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Clock } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center gap-6 py-6 mb-8"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-700">kojirer</h1>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white shadow-lg">
          <motion.div
            className="flex items-center"
            whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <ChefHat size={24} className="text-white" />
          </motion.div>
          <span className="text-lg md:text-xl font-bold">キッチン</span>
        </div>
      </motion.div>

      {/* Kitchen Content */}
      <motion.div 
        className="px-6 pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {isLoading || !dons ? (
          <motion.div 
            className="flex flex-col items-center justify-center h-96"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mb-4"></div>
            <p className="text-xl text-gray-600 font-medium">調理データを読み込み中...</p>
          </motion.div>
        ) : dons.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center h-96"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20 text-center">
              <ChefHat size={64} className="mx-auto mb-6 text-orange-500 opacity-50" />
              <h3 className="text-2xl font-bold text-gray-700 mb-4">調理待ちの注文はありません</h3>
              <p className="text-lg text-gray-600">新しい注文が入ると、ここに表示されます。</p>
            </div>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <motion.div 
              className="flex gap-6 justify-end w-max flex-row-reverse min-h-[calc(100vh-200px)] pb-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <AnimatePresence>
                {dons.map((don, index) => (
                  <motion.div
                    key={don.id}
                    initial={{ opacity: 0, x: 20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <DonCard don={don} completeCooking={completeCooking} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Status Bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-white/30 p-4"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-orange-600">
              <Clock size={20} />
              <span className="font-medium">リアルタイム更新中</span>
            </div>
            <div className="h-4 w-0.5 bg-gray-300"></div>
            <div className="text-gray-600">
              調理中の注文: <span className="font-bold text-orange-600">{dons?.length || 0}</span>件
            </div>
          </div>
          <div className="text-sm text-gray-500">
            自動更新: 1秒間隔
          </div>
        </div>
      </motion.div>

      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-orange-300/10 to-red-300/10 rounded-full"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-yellow-300/10 to-orange-300/10 rounded-full"
          animate={{
            rotate: [360, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </div>
  );
};

export default KitchenUI;
