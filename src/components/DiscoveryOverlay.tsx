import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '../store/useGameStore';
import { MonsterIcon, getMonsterName } from './MonsterIcon';
import { motion, AnimatePresence } from 'framer-motion';

export const DiscoveryOverlay: React.FC = () => {
  const discoveredQueue = useGameStore(state => state.discoveredQueue);
  const resumeFromDiscovery = useGameStore(state => state.resumeFromDiscovery);

  const currentDiscoveryTier = discoveredQueue[0];

  useEffect(() => {
    if (currentDiscoveryTier) {
      // Fire confetti
      const colors = currentDiscoveryTier === 11 
        ? ['#fde047', '#34d399', '#fcd34d'] // Elder drake colors
        : ['#60a5fa', '#34d399', '#f472b6', '#fbbf24']; // generic colorful

      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors,
        zIndex: 9999
      });
    }
  }, [currentDiscoveryTier]);

  return (
    <AnimatePresence>
      {currentDiscoveryTier && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="bg-slate-800 border-2 border-slate-600 rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center"
          >
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
              New Discovery!
            </h2>
            <p className="text-slate-300 font-medium mb-8">
              You've unlocked a new evolution tier!
            </p>
            
            <div className="w-48 h-48 mb-6 relative">
              <motion.div 
                animate={{ 
                  y: [0, -10, 0], 
                  rotate: [0, -5, 5, 0] 
                }} 
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="w-full h-full drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                {/* 2^tier = value */}
                <MonsterIcon value={Math.pow(2, currentDiscoveryTier)} />
              </motion.div>
            </div>

            <h3 className="text-4xl font-bold text-white mb-2 drop-shadow-md">
              {getMonsterName(Math.pow(2, currentDiscoveryTier))}
            </h3>
            <p className="text-slate-400 text-sm mb-8 uppercase tracking-widest font-bold">
              Tier {currentDiscoveryTier}
            </p>

            <button 
              onClick={() => resumeFromDiscovery()}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold text-lg shadow-lg shadow-emerald-900/50 hover:-translate-y-1 transition-all"
            >
              Merge On!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
