import React, { useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { DiscoveryOverlay } from './components/DiscoveryOverlay';
import { useGameStore } from './store/useGameStore';
import { RefreshCcw, Trophy } from 'lucide-react';
import { playMergeSound, initAudio } from './utils/audio';

function App() {
  const score = useGameStore(state => state.score);
  const bestScore = useGameStore(state => state.bestScore);
  const resetGame = useGameStore(state => state.resetGame);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const [mounted, setMounted] = React.useState(false);
  useEffect(() => {
    setMounted(true);
    // Initialize audio on first click/interaction globally
    const handleInteraction = () => {
        initAudio();
        window.removeEventListener('pointerdown', handleInteraction);
        window.removeEventListener('keydown', handleInteraction);
    };
    window.addEventListener('pointerdown', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
  }, []);

  // Listen for merge events for audio and haptics
  useEffect(() => {
    const handleMergeEvent = (e: Event) => {
        const customEvent = e as CustomEvent<{ value: number, discoveries: number[] }>;
        const tier = Math.log2(customEvent.detail.value);
        const isDiscovery = customEvent.detail.discoveries.length > 0;
        playMergeSound(tier, isDiscovery);
    };
    window.addEventListener('merge_event', handleMergeEvent);
    return () => window.removeEventListener('merge_event', handleMergeEvent);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-[100dvh] bg-[#0f172a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black flex flex-col items-center justify-center p-4 overflow-hidden relative font-sans text-slate-200">
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

      <div className="max-w-md w-full z-10 flex flex-col">
        
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-600 drop-shadow-sm tracking-tighter leading-none pb-1">
              Monster<br/>Merge
            </h1>
            <p className="text-slate-400 text-sm font-medium mt-2">Evolve your cute beasts!</p>
          </div>
          
          <div className="flex space-x-2 sm:space-x-3">
            <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-2 sm:p-3 shadow-lg border border-slate-700/50 flex flex-col items-center min-w-[70px] sm:min-w-[80px]">
              <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Score</span>
              <span className="text-lg sm:text-xl font-bold text-white leading-none">{score}</span>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-2 sm:p-3 shadow-lg border border-slate-700/50 flex flex-col items-center min-w-[70px] sm:min-w-[80px]">
              <span className="text-[10px] sm:text-xs text-yellow-500/80 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                <Trophy size={10} /> Best
              </span>
              <span className="text-lg sm:text-xl font-bold text-white leading-none">{bestScore}</span>
            </div>
          </div>
        </header>

        <div className="flex justify-between items-center mb-6 px-1">
          <p className="text-slate-400 text-xs sm:text-sm max-w-[60%]">
            Merge monsters to discover the <strong className="text-emerald-400 font-semibold">Elder-Drake</strong>!
          </p>
          <button 
            onClick={() => resetGame()} 
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 sm:px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-colors shadow-md group whitespace-nowrap">
            <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
            New Game
          </button>
        </div>

        <GameBoard />

      </div>

      <DiscoveryOverlay />
    </div>
  );
}

export default App;
