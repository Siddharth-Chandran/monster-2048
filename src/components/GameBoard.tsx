import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Tile } from './Tile';

export const GameBoard: React.FC = () => {
  const tiles = useGameStore(state => state.tiles);
  const move = useGameStore(state => state.move);
  const status = useGameStore(state => state.status);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      
      if (status !== 'playing') return;
      if (['ArrowUp', 'w', 'W'].includes(e.key)) move('UP');
      if (['ArrowDown', 's', 'S'].includes(e.key)) move('DOWN');
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) move('LEFT');
      if (['ArrowRight', 'd', 'D'].includes(e.key)) move('RIGHT');
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, status]);

  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || status !== 'playing') return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const dx = touchEndX - touchStart.x;
    const dy = touchEndY - touchStart.y;
    
    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
      if (Math.abs(dx) > Math.abs(dy)) {
        move(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        move(dy > 0 ? 'DOWN' : 'UP');
      }
    }
    setTouchStart(null);
  };

  return (
    <div className="relative w-full aspect-square bg-slate-800 p-2 rounded-2xl shadow-2xl glass-panel shadow-black/50 mx-auto border-slate-700 select-none"
         onTouchStart={handleTouchStart}
         onTouchEnd={handleTouchEnd}
         style={{ touchAction: 'none' }}>
      
      <div className="grid grid-cols-4 grid-rows-4 w-full h-full">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="p-2">
            <div className="w-full h-full bg-slate-900/50 rounded-xl shadow-inner shadow-black/80" />
          </div>
        ))}
      </div>

      <div className="absolute inset-2" style={{ pointerEvents: 'none' }}>
        {tiles.map(tile => (
          <Tile key={tile.id} tile={tile} />
        ))}
      </div>
      
      {status === 'over' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl animate-fade-in pointer-events-auto">
          <div className="text-center p-8 bg-slate-900/90 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-lg transform scale-95 md:scale-100">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-3">Game Over</h2>
            <p className="text-slate-300 font-medium mb-6">Your monsters can evolve no further!</p>
            <button 
              onClick={() => useGameStore.getState().resetGame()}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-1">
              Hatch New Eggs
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
