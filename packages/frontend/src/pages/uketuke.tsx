import ReceptionDonForm from '@/components/ReceptionDonForm';
import SidebarContent from '@/components/SideBar';
import { $api } from '@/utils/client';
import paths from 'api';
import React, { useState } from 'react';

type Don = paths['/order']['post']['requestBody']['content']['application/json']['dons'][0] & { uniqueId: string };

const Uketuke: React.FC = () => {
  const [dons, setDons] = useState<Don[]>([]);
  const [selectingIdx, setSelectingIdx] = useState<number | null>(null);
  const [selectingDon, setSelectingDon] = useState<Don | null>(null);
  const { mutate } = $api.useMutation('post', '/order');

  return (
    <div className="min-h-screen bg-gray-100">
      <SidebarContent
        dons={dons}
        selectingIndex={selectingIdx}
        onSelect={(idx, don) => {
          setSelectingDon(don);
          setSelectingIdx(idx);
        }}
        onDelete={(uniqueId) => {
          setDons(dons.filter((don) => don.uniqueId !== uniqueId));
        }}
        onOrder={(callNum) => {
          mutate({
            body: {
              dons,
              callNum,
            },
          });
          setDons([]);
        }}
      />
      <div className="ml-80 p-4">
        <div className="rounded-md bg-white p-10">
          <ReceptionDonForm
            onSubmit={(don) => setDons([...dons, don])}
            onEdit={(idx, don) => {
              setDons(dons.map((d, index) => (index === idx ? don : d)));
              setSelectingDon(null);
              setSelectingIdx(null);
            }}
            index={selectingIdx}
            yasai={selectingDon?.yasai}
            abura={selectingDon?.abura}
            karame={selectingDon?.karame}
            ninniku={selectingDon?.ninniku}
            toppings={selectingDon?.toppings}
          />
        </div>
      </div>
    </div>
  );
};

export default Uketuke;
