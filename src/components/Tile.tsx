import React from 'react';
import { motion } from 'framer-motion';
import type { TileData } from '../store/useGameStore';
import { useGameStore } from '../store/useGameStore';
import { MonsterIcon, getMonsterColor, getMonsterName } from './MonsterIcon';

interface Props {
  tile: TileData;
}

export const Tile: React.FC<Props> = ({ tile }) => {
  const moveDirection = useGameStore(state => state.moveDirection);
  const x = `${tile.c * 100}%`;
  const y = `${tile.r * 100}%`;

  // Calculate 3D board perspective (tilt toward center)
  // Grid is 0-3, so center is 1.5
  const tiltY = (tile.c - 1.5) * 4; // rotate around Y axis based on column
  const tiltX = (1.5 - tile.r) * 4; // rotate around X axis based on row

  // Determine "squish" anticipation based on global move direction
  const isMoving = !!moveDirection && !tile.toDelete && !tile.isNew;
  let squishX = 1.0;
  let squishY = 1.0;
  let parallaxX = 0;
  let parallaxY = 0;

  if (isMoving) {
    if (moveDirection === 'UP') { squishX = 0.96; squishY = 1.04; parallaxY = -6; }
    if (moveDirection === 'DOWN') { squishX = 0.96; squishY = 1.04; parallaxY = 6; }
    if (moveDirection === 'LEFT') { squishX = 1.04; squishY = 0.96; parallaxX = -6; }
    if (moveDirection === 'RIGHT') { squishX = 1.04; squishY = 0.96; parallaxX = 6; }
  }

  // Merging animation pop
  const scaleValues = tile.toDelete ? [1, 1.3, 0] : (tile.isNew ? [0, 1.25, 1] : 1);
  const zIdx = tile.toDelete ? 10 : (tile.isNew ? 50 : 20);

  return (
    <motion.div
      layout
      style={{ 
        x, y, zIndex: zIdx,
        perspective: 1000
      }}
      initial={tile.isNew ? { scale: 0, x, y } : false}
      animate={{ 
        scale: scaleValues,
        opacity: tile.toDelete ? [1, 0] : 1, 
        rotateX: tiltX,
        rotateY: tiltY,
        zIndex: zIdx 
      }}
      transition={{ 
        layout: { type: 'spring', stiffness: 350, damping: 25 },
        scale: { duration: 0.3, type: 'spring', stiffness: 500, damping: 30 }, 
        rotateX: { duration: 0.5 },
        rotateY: { duration: 0.5 },
        opacity: { duration: 0.2 } 
      }}
      className="absolute w-1/4 h-1/4 p-1 sm:p-2"
    >
      <motion.div 
        animate={{ 
            scaleX: squishX, 
            scaleY: squishY,
            x: parallaxX,
            y: parallaxY
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={`w-full h-full rounded-2xl shadow-2xl border-t border-white/30 flex flex-col items-center justify-center overflow-visible relative ${getMonsterColor(tile.value)}`}
      >
        {/* Shine Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />

        <div className="w-10 h-10 sm:w-16 sm:h-16 relative flex-shrink-0 origin-bottom z-10 filter drop-shadow-md">
          <MonsterIcon value={tile.value} />
        </div>
        
        <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-tighter px-1 text-center mt-1 text-white/90 drop-shadow-sm">
          {getMonsterName(tile.value)}
        </div>
      </motion.div>
    </motion.div>
  );
};
