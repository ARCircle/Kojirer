import ReceptionDonForm from '@/components/ReceptionDonForm'
import SidebarContent from '@/components/SideBar'
import { Box, useColorModeValue } from '@chakra-ui/react'
import paths from 'api';
import React, { useState } from 'react'

type Don = paths["/order"]["post"]["requestBody"]["content"]["application/json"]["dons"][0];

const Uketuke: React.FC = () => {
  const [ dons, setDons ] = useState<Don[]>([]);
  const [ selectingIdx, setSelectingIdx ] = useState<number | null>(null);
  const [ selectingDon, setSelectingDon ] = useState<Don | null>(null);

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent 
        dons={dons}
        onSelect={(idx, don) => { 
          setSelectingDon(don);
          setSelectingIdx(idx);
        }}
      />
      <Box ml={80} p="4">
        <Box borderRadius='md' background='white' p={10}>
          <ReceptionDonForm 
            onSubmit={(don) => setDons([...dons, don])}
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
