import { Link, Path } from '@/router';
import React from 'react';
import { motion } from 'framer-motion';
import { Home as HomeIcon, Eye, ChefHat, Utensils } from 'lucide-react';

export default function Home() {
  const navigationItems: {
    to: Path;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    hoverColor: string;
  }[] = [
    {
      to: '/status',
      title: 'ステータス',
      description: '注文状況を確認',
      icon: <Eye size={32} className="text-white" />,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700'
    },
    {
      to: '/kitchen',
      title: 'キッチン',
      description: '調理管理画面',
      icon: <ChefHat size={32} className="text-white" />,
      color: 'bg-orange-600',
      hoverColor: 'hover:bg-orange-700'
    },
    {
      to: '/uketuke',
      title: '注文受付',
      description: '新規注文登録',
      icon: <Utensils size={32} className="text-white" />,
      color: 'bg-teal-600',
      hoverColor: 'hover:bg-teal-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center gap-6 py-8 mb-12"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-700">kojirer</h1>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-600 text-white shadow-lg">
          <motion.div
            className="flex items-center"
            whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <HomeIcon size={24} className="text-white" />
          </motion.div>
          <span className="text-lg md:text-xl font-bold">ホーム</span>
        </div>
      </motion.div>

      {/* Navigation Cards */}
      <motion.div 
        className="max-w-6xl mx-auto px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <Link to={item.to}>
                <motion.div
                  className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 cursor-pointer transition-all duration-300 ${item.hoverColor}`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-center space-y-4">
                    <motion.div
                      className={`w-20 h-20 ${item.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}
                      whileHover={{ rotate: [0, -5, 5, -3, 3, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {item.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-lg">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center mt-16 px-6"
      >
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 mx-auto max-w-2xl shadow-lg border border-white/30">
          <h2 className="text-3xl font-bold text-gray-700 mb-4">注文管理システムへようこそ</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            効率的な注文管理で、スムーズな店舗運営をサポートします。<br />
            上記のメニューから必要な機能をお選びください。
          </p>
        </div>
      </motion.div>

      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-300/5 to-purple-300/5 rounded-full"
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
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-indigo-300/5 to-cyan-300/5 rounded-full"
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
}
