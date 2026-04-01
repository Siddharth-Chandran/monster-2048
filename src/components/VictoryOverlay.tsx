import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { MonsterIcon } from './MonsterIcon';

export const VictoryOverlay: React.FC = () => {
  const hasWon = useGameStore(state => state.hasWon);
  const setHasWon = useGameStore(state => state.setHasWon);
  const resetGame = useGameStore(state => state.resetGame);

  useEffect(() => {
    if (hasWon) {
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [hasWon]);

  return (
    <AnimatePresence>
      {hasWon && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="relative max-w-lg w-full bg-slate-900 border-2 border-emerald-500/50 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_100px_rgba(16,185,129,0.2)] text-center overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-8 drop-shadow-[0_0_50px_rgba(16,185,129,0.4)]"
            >
              <MonsterIcon value={2048} />
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 via-emerald-500 to-teal-700 tracking-tighter leading-none mb-4">
              THE ELDER-DRAKE<br/>AWAKENS
            </h1>
            
            <p className="text-emerald-400/90 font-bold tracking-[0.2em] text-sm uppercase mb-8">
              Victory is Yours, Master Merger
            </p>

            <p className="text-slate-400 text-base md:text-lg mb-10 max-w-sm mx-auto leading-relaxed">
              You have united the ancient lineages and summoned the ultimate guardian of the realm.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setHasWon(false)}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-[0_10px_20px_rgba(5,150,105,0.3)] transition-all active:scale-[0.98] uppercase tracking-wider"
              >
                Keep Exploring
              </button>
              <button
                onClick={() => {
                  setHasWon(false);
                  resetGame();
                }}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-all uppercase tracking-wider"
              >
                Start New Journey
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
