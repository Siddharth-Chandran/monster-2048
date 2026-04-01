import React from 'react';
import { motion } from 'framer-motion';
import { MonsterIcon, getMonsterName } from './MonsterIcon';

interface HangingMonsterProps {
  tier: number;
  label: string;
  position: 'left' | 'right';
  isCompact?: boolean;
}

export const HangingMonster: React.FC<HangingMonsterProps> = ({ tier, label, position, isCompact = false }) => {
  const value = Math.pow(2, tier);
  const monsterName = getMonsterName(value);

  // Animation variants for the hanging swing
  const swingTransition = {
    duration: 4 + Math.random() * 2,
    repeat: Infinity,
    ease: "easeInOut" as const
  };

  if (isCompact) {
    return (
      <div className="flex items-center gap-3 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-2 pr-4 shadow-lg flex-1 min-w-0 max-w-[170px]">
        <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-slate-800/80 rounded-xl p-1 relative border border-slate-700/30">
          <MonsterIcon value={value} />
          <div className="absolute -top-1 -right-1 bg-emerald-500 text-[8px] font-black text-white px-1 py-0.5 rounded shadow-sm border border-emerald-400 leading-none">
            {tier}
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter leading-none mb-1">{label}</span>
          <span className="text-xs font-black text-slate-100 truncate leading-none">{monsterName}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`absolute top-0 ${position === 'left' ? 'left-4 sm:left-10' : 'right-4 sm:right-10'} z-20 flex flex-col items-center pointer-events-none hidden lg:flex`}
    >
      {/* Hanging rope/line */}
      <div className="w-[1px] h-16 sm:h-24 bg-gradient-to-b from-slate-700 to-slate-500" />
      
      {/* Monster Container with swinging animation */}
      <motion.div 
        animate={{ 
          rotate: [-5, 5, -5],
          x: [-2, 2, -2]
        }}
        transition={swingTransition}
        style={{ transformOrigin: "top center" }}
        className="flex flex-col items-center"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-800/60 backdrop-blur-md rounded-full p-2 border border-slate-700/50 shadow-xl flex items-center justify-center relative group">
          <MonsterIcon value={value} />
          
          {/* Level Tag */}
          <div className="absolute -bottom-2 bg-emerald-500 text-[10px] sm:text-xs font-bold text-white px-2 py-0.5 rounded-full shadow-lg border border-emerald-400">
            Lvl {tier}
          </div>
        </div>

        {/* Label and Name */}
        <div className="mt-4 text-center">
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{label}</span>
          <span className="block text-xs sm:text-sm font-bold text-slate-200 drop-shadow-md">{monsterName}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
