// import { $api } from '@/utils/client';
import { Button } from '@/components/ui/button';
// import paths from 'api';
import React, { useState } from 'react';
// import { SwipeableList, SwipeableListItem, SwipeAction, TrailingActions } from 'react-swipeable-list';
import { SwipeableList } from 'react-swipeable-list';
import ReceptionCallNumInput from './ReceptionCallNumInput';
// import ReceptionDonCard from './ReceptionDonCard';
import { motion, AnimatePresence } from 'framer-motion';
// import { ShoppingCart, Trash2 } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';

import 'react-swipeable-list/dist/styles.css';

// type Don = paths['/order']['post']['requestBody']['content']['application/json']['dons'][0] & { uniqueId: string };

interface SidebarProps {
  dons: Don[];
  selectingIndex?: number | null;
  onSelect?: (index: number, don: Don) => void;
  onDelete?: (uniqueId: string) => void;
  onOrder?: (callNum: number) => void;
}

const SidebarContent: React.FC<SidebarProps> = ({
  dons,
  // selectingIndex = null,
  // onSelect = () => {},
  // onDelete = () => {},
  onOrder = () => {},
}) => {
  // const { data, isLoading } = $api.useQuery('post', '/order/price', {
  //   body: {
  //     dons,
  //   },
  // });
  const [callNum, setCallNum] = useState(0);

  // const price = data?.price || 0;

  // const trailingActions = (uniqueId: string) => (
  //   <TrailingActions>
  //     <SwipeAction
  //       destructive={true}
  //       onClick={() => onDelete(uniqueId)}
  //       Tag='div'
  //       // className='bg-red-500 flex items-center justify-center text-white font-bold'
  //     >
  //       <div className='flex items-center gap-2'>
  //         <Trash2 size={20} />
  //         <span>削除</span>
  //       </div>
  //     </SwipeAction>
  //   </TrailingActions>
  // );

  return (
    <div className='bg-white/80 backdrop-blur-sm border-r border-white/30 w-80 fixed h-full shadow-2xl'>
      <div className='bg-teal-600 text-white shadow-lg'>
        <motion.div
          className='h-20 flex items-center justify-center mx-6'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='inline-flex items-center gap-2'>
            <motion.div whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }} transition={{ duration: 0.5 }}>
              <ShoppingCart size={24} className='text-white' />
            </motion.div>
            <h1 className='text-xl font-bold'>注文情報</h1>
          </div>
        </motion.div>
      </div>

      <div className='overflow-y-auto px-6 py-4 h-[calc(100%-280px)]'>
        <AnimatePresence>
          {dons.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='text-center text-gray-500 mt-8'
            >
              <ShoppingCart size={48} className='mx-auto mb-4 opacity-30' />
              <p>注文を追加してください</p>
            </motion.div>
          ) : (
            <SwipeableList>
              {/* {dons.map((don, idx) => ( */}
              {dons.map((_, idx) => (
                <motion.div
                  // key={don.uniqueId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                >
                  {/* <SwipeableListItem trailingActions={trailingActions(don.uniqueId)}> */}
                  {/* <ReceptionDonCard
                      index={idx + 1}
                      isSelecting={selectingIndex === idx}
                      onClick={() => {
                        onSelect(idx, don);
                      }}
                      {...don}
                    /> */}
                  {/* </SwipeableListItem> */}
                </motion.div>
              ))}
            </SwipeableList>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className='absolute bottom-0 left-0 right-0 p-6 space-y-4 bg-white/90 backdrop-blur-sm border-t border-white/30'
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className='bg-teal-500 text-white px-4 py-3 rounded-xl shadow-lg'>
          {/* <div className='text-lg font-bold text-center'>合計金額 ￥{isLoading ? '...' : price?.toLocaleString()}</div> */}
        </div>

        <ReceptionCallNumInput value={callNum} onChange={setCallNum} />

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant='teal'
            className='mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 shadow-lg'
            onClick={() => onOrder(callNum)}
            disabled={dons.length === 0}
          >
            注文確定
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SidebarContent;
