import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- Shared Types & Helpers ---

interface MonsterProps {
  value: number;
}

export const getMonsterColor = (value: number) => {
  switch (value) {
    case 2: return 'bg-emerald-200 text-emerald-900 border-emerald-400 shadow-[inset_0_-4px_0_rgba(16,185,129,0.3)]';
    case 4: return 'bg-green-300 text-green-900 border-green-500 shadow-[inset_0_-4px_0_rgba(34,197,94,0.3)]';
    case 8: return 'bg-purple-300 text-purple-900 border-purple-500 shadow-[inset_0_-4px_0_rgba(168,85,247,0.3)]';
    case 16: return 'bg-yellow-200 text-yellow-900 border-yellow-400 shadow-[inset_0_-4px_0_rgba(234,179,8,0.3)]';
    case 32: return 'bg-orange-300 text-orange-900 border-orange-500 shadow-[inset_0_-4px_0_rgba(249,115,22,0.3)]';
    case 64: return 'bg-indigo-300 text-indigo-900 border-indigo-500 shadow-[inset_0_-4px_0_rgba(99,102,241,0.3)]';
    case 128: return 'bg-blue-300 text-blue-900 border-blue-500 shadow-[inset_0_-4px_0_rgba(59,130,246,0.3)]';
    case 256: return 'bg-yellow-400 text-yellow-900 border-yellow-600 shadow-[inset_0_-4px_0_rgba(202,138,4,0.3)]';
    case 512: return 'bg-teal-300 text-teal-900 border-teal-500 shadow-[inset_0_-4px_0_rgba(20,184,166,0.3)]';
    case 1024: return 'bg-green-400 text-green-900 border-green-600 shadow-[inset_0_-4px_0_rgba(22,163,74,0.3)]';
    case 2048: return 'bg-emerald-500 text-emerald-900 border-emerald-700 shadow-xl shadow-yellow-500/50';
    default: return 'bg-gray-800 text-gray-200 border-gray-600';
  }
}

export const getMonsterName = (value: number) => {
  switch (value) {
    case 2: return 'Slimey';
    case 4: return 'Sproutling';
    case 8: return 'Floof';
    case 16: return 'Horn-Toad';
    case 32: return 'Ember-Pup';
    case 64: return 'Shadow-Bat';
    case 128: return 'Crystal-Grit';
    case 256: return 'Storm-Chirp';
    case 512: return 'Deep-Fin';
    case 1024: return 'Forest-Guard';
    case 2048: return 'Elder-Drake';
    default: return 'Unknown';
  }
}

// --- Face Component (Blinking & Expression Logic) ---

const Face: React.FC<{ 
  color?: string,
  joy?: boolean,
  size?: number 
}> = ({ color = "#064e3b", joy = false, size = 1 }) => {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000 + Math.random() * 5000);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <motion.g scale={size}>
      {joy ? (
        // Happy / Merged expression
        <motion.g>
           <motion.path d="M40 50 Q45 45 50 50" stroke={color} strokeWidth="3" fill="none" />
           <motion.path d="M50 50 Q55 45 60 50" stroke={color} strokeWidth="3" fill="none" />
           <motion.path 
             animate={{ scaleX: [1, 1.2, 1], scaleY: [1, 0.8, 1] }}
             transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" as const }}
             d="M45 60 Q50 65 55 60" stroke={color} strokeWidth="3" fill="none" 
           />
        </motion.g>
      ) : (
        // Standard blinking eyes
        <motion.g>
          <motion.ellipse 
            cx="42" cy="55" rx="3" ry={blink ? 0.1 : 3} 
            fill={color} 
          />
          <motion.ellipse 
            cx="58" cy="55" rx="3" ry={blink ? 0.1 : 3} 
            fill={color} 
          />
        </motion.g>
      )}
    </motion.g>
  );
};

// --- Main Evolution Matrix ---

export const MonsterIcon: React.FC<MonsterProps> = ({ value }) => {
  // Common bobbing animation
  const bobbingTransition = {
    duration: 3 + Math.random() * 2,
    repeat: Infinity,
    ease: "easeInOut" as const
  };

  switch (value) {
    case 2: // Tier 1: Slimey
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-lg">
          {/* Body */}
          <motion.path 
            animate={{ d: [
              "M20 70 Q20 30 50 30 Q80 30 80 70 Q80 85 50 85 Q20 85 20 70 Z",
              "M22 68 Q22 28 50 28 Q78 28 78 68 Q78 87 50 87 Q22 87 22 68 Z",
              "M20 70 Q20 30 50 30 Q80 30 80 70 Q80 85 50 85 Q20 85 20 70 Z"
            ] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const }}
            fill="#6ee7b7" 
            stroke="#059669"
            strokeWidth="1"
          />
          {/* Surface highlights (2.5D Effect) */}
          <motion.ellipse cx="35" cy="45" rx="10" ry="5" fill="white" fillOpacity="0.3" rotate={-20} />
          {/* Face (Parallax enabled in Tile.tsx via scale/translate) */}
          <Face color="#047857" size={1.2} />
        </svg>
      );

    case 4: // Tier 2: Sproutling
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-2 overflow-visible">
          {/* Seed Body */}
          <motion.ellipse 
            animate={{ rx: [20, 22, 20], ry: [25, 23, 25] }}
            transition={bobbingTransition}
            cx="50" cy="65" rx="20" ry="25" 
            fill="#86efac" stroke="#166534" strokeWidth="2" 
          />
          {/* Sprout Limb (Skeletal Rotation) */}
          <motion.g 
            style={{ transformOrigin: "50px 45px" }}
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
          >
            <path d="M50 45 Q50 20 65 15" stroke="#14532d" strokeWidth="4" fill="none" strokeLinecap="round" />
            <motion.path 
              animate={{ rotate: [-20, 20, -20] }}
              d="M65 15 Q75 10 70 25 Q65 15 65 15" 
              fill="#22c55e" 
            />
          </motion.g>
          <Face color="#14532d" />
        </svg>
      );

    case 8: // Tier 3: Floof
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-2">
          {/* Base Layer */}
          <motion.circle 
            animate={{ scale: [1, 1.05, 1] }}
            transition={bobbingTransition}
            cx="50" cy="50" r="38" fill="#d8b4fe" />
          {/* Fur Layers (Depth Simulation) */}
          <motion.g animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" as const }}>
             {Array.from({ length: 12 }).map((_, i) => (
                <circle key={i} cx={50 + 38 * Math.cos(i)} cy={50 + 38 * Math.sin(i)} r="6" fill="#c084fc" />
             ))}
          </motion.g>
          <Face color="#581c87" size={1.3} />
        </svg>
      );

    case 16: // Tier 4: Horn-Toad
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-2 overflow-visible">
          {/* Body */}
          <motion.ellipse 
            animate={{ scaleY: [1, 0.95, 1] }} transition={bobbingTransition}
            cx="50" cy="65" rx="38" ry="28" fill="#fde047" stroke="#ca8a04" strokeWidth="2" />
          {/* Skeletal Horns */}
          <motion.g style={{ transformOrigin: "50px 42px" }} animate={{ rotate: [-5, 5, -5] }} transition={bobbingTransition}>
              <path d="M42 42 L50 15 L58 42" fill="#ca8a04" />
          </motion.g>
          {/* Cheeks */}
          <circle cx="30" cy="65" r="8" fill="#fbbf24" fillOpacity="0.5" />
          <circle cx="70" cy="65" r="8" fill="#fbbf24" fillOpacity="0.5" />
          <Face color="#713f12" />
        </svg>
      );

    case 32: // Tier 5: Ember-Pup
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible p-2">
          {/* Flame Tail (Skeletal sway) */}
          <motion.path 
            animate={{ d: [
                "M30 75 Q10 75 15 45 Q20 15 30 75",
                "M30 75 Q 5 65 10 35 Q15 15 30 75",
                "M30 75 Q10 75 15 45 Q20 15 30 75"
            ]}}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" as const }}
            fill="#f97316"
          />
          {/* Head Body */}
          <motion.circle 
            animate={{ y: [0, -3, 0] }} transition={bobbingTransition}
            cx="55" cy="55" r="30" fill="#fdba74" stroke="#c2410c" strokeWidth="2" />
          {/* Ears */}
          <motion.path d="M35 35 L50 25 L45 50" fill="#f97316" animate={{ rotate: [-5, 10, -5] }} transition={bobbingTransition}/>
          <motion.path d="M75 35 L60 25 L65 50" fill="#f97316" animate={{ rotate: [5, -10, 5] }} transition={bobbingTransition}/>
          <Face color="#7c2d12" />
        </svg>
      );

    case 64: // Tier 6: Shadow-Bat
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible p-2">
          {/* Skeletal Wings */}
          <motion.g animate={{ rotateY: [0, 45, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" as const }}>
              <path d="M10 40 Q 30 20 50 50 L10 65 Z" fill="#4338ca" />
          </motion.g>
          <motion.g animate={{ rotateY: [0, -45, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" as const }}>
              <path d="M90 40 Q 70 20 50 50 L90 65 Z" fill="#4338ca" />
          </motion.g>
          <motion.circle cx="50" cy="55" r="25" fill="#4f46e5" stroke="#312e81" strokeWidth="2" />
          <Face color="#fef08a" size={1.2} />
        </svg>
      );

    case 128: // Tier 7: Crystal-Grit
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-2 overflow-visible">
          <motion.g 
            animate={{ 
                rotate: [0, 360], 
                scale: [1, 1.05, 1] 
            }} 
            transition={{ 
                rotate: { duration: 15, repeat: Infinity, ease: "linear" as const },
                scale: bobbingTransition
            }}
          >
             <polygon points="50,10 85,50 50,90 15,50" fill="#93c5fd" stroke="#1e40af" strokeWidth="2" />
             <polygon points="50,10 50,90 15,50" fill="#60a5fa" />
          </motion.g>
          <Face color="#1e3a8a" />
        </svg>
      );

    case 256: // Tier 8: Storm-Chirp
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible p-2">
           {/* Static Sparks */}
           <motion.g animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 1 }}>
              <path d="M20 20 L30 30 M80 20 L70 30 M50 10 L50 25" stroke="#fde047" strokeWidth="3" />
           </motion.g>
           <motion.circle 
             animate={{ x: [-1, 1, -1], y: [-1, 1, -1] }}
             transition={{ duration: 0.1, repeat: Infinity, ease: "linear" as const }}
             cx="50" cy="50" r="30" fill="#fef08a" stroke="#a16207" strokeWidth="2" />
           <path d="M65 45 L85 40 L75 55" fill="#ca8a04" />
           <Face color="#422006" />
        </svg>
      );

    case 512: // Tier 9: Deep-Fin
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible p-2">
          {/* Angler Light */}
          <motion.g animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}>
              <path d="M60 40 Q 80 10 90 20" stroke="#0f766e" strokeWidth="3" fill="none" />
              <motion.circle 
                animate={{ r: [6, 12, 6], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
                cx="90" cy="20" r="8" fill="#22d3ee" 
              />
          </motion.g>
          <motion.ellipse 
            animate={{ skewX: [-2, 2, -2] }} transition={bobbingTransition}
            cx="45" cy="65" rx="35" ry="25" fill="#2dd4bf" stroke="#065f46" strokeWidth="2" />
          <Face color="#115e59" />
        </svg>
      );

    case 1024: // Tier 10: Forest-Guard
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible p-2">
          {/* Tree-like blocky skeletal body */}
          <motion.path 
             animate={{ scaleY: [1, 0.98, 1] }} transition={bobbingTransition}
             d="M30 85 L35 40 Q50 30 65 40 L70 85 Z" fill="#4ade80" stroke="#166534" strokeWidth="2" />
          {/* Leafy Canopy Layer */}
          <motion.path 
             animate={{ y: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const }}
             d="M15 50 Q50 10 85 50 Z" fill="#16a34a" />
          {/* Decorative Flowers */}
          <circle cx="40" cy="35" r="3" fill="#f472b6" />
          <circle cx="65" cy="30" r="4" fill="#fbbf24" />
          <Face color="#064e3b" />
        </svg>
      );

    case 2048: // Tier 11: Elder-Drake
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          {/* Grand skeletal wings */}
          <motion.g style={{ transformOrigin: "50px 50px" }} animate={{ rotate: [-20, 20, -20] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}>
             <path d="M50 50 L10 20 L20 60 Z" fill="#10b981" />
             <path d="M50 50 L90 20 L80 60 Z" fill="#10b981" />
          </motion.g>
          {/* Tail swaying */}
          <motion.path 
            animate={{ d: [
                "M50 80 Q70 95 80 80 Q90 60 70 50",
                "M50 80 Q60 98 70 85 Q80 70 70 50",
                "M50 80 Q70 95 80 80 Q90 60 70 50"
            ]}}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const }}
            fill="#34d399"
          />
          {/* Majestic Body */}
          <motion.path 
            animate={{ scale: [1, 1.02, 1] }} transition={bobbingTransition}
            d="M30 75 Q50 30 70 75 L50 85 Z" fill="#34d399" stroke="#065f46" strokeWidth="2" />
          <Face color="#047857" size={1.5} />
          {/* Decorative crown / glow */}
          <motion.circle 
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
            cx="50" cy="50" r="45" fill="url(#elderGlow)" 
          />
          <defs>
            <radialGradient id="elderGlow">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-2">
          <circle cx="50" cy="50" r="40" fill="#cbd5e1" />
        </svg>
      );
  }
}
