import ReceptionDonForm from '@/components/ReceptionDonForm'
import SidebarContent from '@/components/SideBar'
import { $api } from '@/utils/client';
import { Box, useColorModeValue } from '@chakra-ui/react'
import paths from 'api';
import React, { useState } from 'react'

type Don = paths["/order"]["post"]["requestBody"]["content"]["application/json"]["dons"][0] & { uniqueId: string };

const Uketuke: React.FC = () => {
  const [ dons, setDons ] = useState<Don[]>([]);
  const [ selectingIdx, setSelectingIdx ] = useState<number | null>(null);
  const [ selectingDon, setSelectingDon ] = useState<Don | null>(null);
  const { mutate } = $api.useMutation('post', '/order');

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent 
        dons={dons}
        selectingIndex={selectingIdx}
        onSelect={(idx, don) => { 
          setSelectingDon(don);
          setSelectingIdx(idx);
        }}
        onDelete={(uniqueId) => {
          setDons(dons.filter((don) => don.uniqueId !== uniqueId))
        }}
        onOrder={(callNum) => {
          mutate({
            body: {
              dons,
              callNum
            }
          });
        }}
      />
      <Box ml={80} p="4">
        <Box borderRadius='md' background='white' p={10}>
          <ReceptionDonForm 
            onSubmit={(don) => setDons([...dons, don])}
            onEdit={(idx, don) => {
              setDons(
                dons.map((d, index) => (index === idx ? don : d))
              );
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
        </Box>
      </Box>
    </Box>
  );
};

export default Uketuke
