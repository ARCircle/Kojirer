import ReceptionDonForm from '@/components/ReceptionDonForm';
import SidebarContent from '@/components/SideBar';
import { $api } from '@/utils/client';
import paths from 'api';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';

type Don = paths['/order']['post']['requestBody']['content']['application/json']['dons'][0] & { uniqueId: string };

const Uketuke: React.FC = () => {
  const [dons, setDons] = useState<Don[]>([]);
  const [selectingIdx, setSelectingIdx] = useState<number | null>(null);
  const [selectingDon, setSelectingDon] = useState<Don | null>(null);
  const { mutate } = $api.useMutation('post', '/order');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center gap-6 py-6"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-700">kojirer</h1>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white shadow-lg">
          <motion.div
            className="flex items-center"
            whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Utensils size={24} className="text-white" />
          </motion.div>
          <span className="text-lg md:text-xl font-bold">注文受付</span>
        </div>
      </motion.div>

      <div className="relative">
        {/* Sidebar */}
        <motion.div 
          className="fixed left-0 top-0 pt-32 h-full z-10"
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
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
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="ml-80 p-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-xl border border-white/20">
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
        </motion.div>
      </div>

      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-teal-300/10 to-teal-200/10 rounded-full"
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
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-teal-400/10 to-teal-300/10 rounded-full"
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

export default Uketuke;
