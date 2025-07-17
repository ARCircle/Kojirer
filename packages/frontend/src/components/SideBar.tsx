import { $api } from '@/utils/client';
import { Button } from '@/components/ui/button';
import paths from 'api';
import React, { useState } from 'react';
import { SwipeableList, SwipeableListItem, SwipeAction, TrailingActions } from 'react-swipeable-list';
import ReceptionCallNumInput from './ReceptionCallNumInput';
import ReceptionDonCard from './ReceptionDonCard';

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
    <div className="bg-white border-r border-gray-200 w-80 fixed h-full">
      <div className="h-20 flex items-center justify-center mx-8">
        <h1 className="text-2xl font-mono font-bold mt-4">
          注文情報
        </h1>
      </div>
      <div className="overflow-y-auto px-8 h-[60%]">
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
      </div>
      <div className="fixed bottom-0 p-10 space-y-4 backdrop-blur-sm bg-white/40">
        <div className="text-xl">合計金額 ￥{isLoading ? '...' : price}</div>
        <ReceptionCallNumInput value={callNum} onChange={setCallNum} />

        <Button variant="teal" className="mt-4 w-full" onClick={() => onOrder(callNum)} disabled={dons.length == 0}>
          注文
        </Button>
      </div>
    </div>
  );
};

export default SidebarContent;
