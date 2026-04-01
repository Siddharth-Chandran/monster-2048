import { create } from 'zustand';

export interface TileData {
  id: string;
  r: number;
  c: number;
  value: number;
  isNew?: boolean;
  toDelete?: boolean;
}

interface GameState {
  tiles: TileData[];
  score: number;
  bestScore: number;
  status: 'playing' | 'over' | 'discovery';
  discoveredTiers: number[];
  discoveredQueue: number[]; // queue of tiers to show overlay for
  moveDirection: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null;
  move: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
  spawnTile: () => void;
  resetGame: () => void;
  clearDeleted: () => void;
  resumeFromDiscovery: () => void;
}

const getEmptySpots = (grid: (TileData | null)[][]) => {
  const emptySpots: { r: number, c: number }[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (!grid[r][c]) emptySpots.push({ r, c });
    }
  }
  return emptySpots;
};

const getDirectionVector = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
  switch (dir) {
    case 'UP': return { dr: -1, dc: 0 };
    case 'DOWN': return { dr: 1, dc: 0 };
    case 'LEFT': return { dr: 0, dc: -1 };
    case 'RIGHT': return { dr: 0, dc: 1 };
  }
};

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useGameStore = create<GameState>((set, get) => ({
  tiles: [],
  score: 0,
  bestScore: parseInt(localStorage.getItem('monster-merge-best') || '0', 10),
  status: 'playing',
  discoveredTiers: JSON.parse(localStorage.getItem('monster-merge-discovered') || '[1, 2]'),
  discoveredQueue: [],
  moveDirection: null,

  resetGame: () => {
    set((state) => {
      let t1r = Math.floor(Math.random() * 4);
      let t1c = Math.floor(Math.random() * 4);
      let t2r = Math.floor(Math.random() * 4);
      let t2c = Math.floor(Math.random() * 4);
      while (t1r === t2r && t1c === t2c) {
        t2r = Math.floor(Math.random() * 4);
        t2c = Math.floor(Math.random() * 4);
      }

      return {
        tiles: [
          { id: generateId(), r: t1r, c: t1c, value: Math.random() < 0.9 ? 2 : 4, isNew: true },
          { id: generateId(), r: t2r, c: t2c, value: Math.random() < 0.9 ? 2 : 4, isNew: true },
        ],
        score: 0,
        status: 'playing',
        discoveredQueue: [],
        moveDirection: null
      };
    });
  },

  resumeFromDiscovery: () => {
    set(state => {
      const newQueue = state.discoveredQueue.slice(1);
      return {
        discoveredQueue: newQueue,
        status: newQueue.length > 0 ? 'discovery' : 'playing'
      };
    });
  },

  spawnTile: () => {
    set((state) => {
      const grid = Array(4).fill(null).map(() => Array(4).fill(null));
      state.tiles.filter(t => !t.toDelete).forEach(t => { grid[t.r][t.c] = t; });
      const emptySpots = getEmptySpots(grid);
      if (emptySpots.length === 0) return state;

      const spot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
      return {
        tiles: [
          ...state.tiles.map(t => ({ ...t, isNew: false })),
          { id: generateId(), r: spot.r, c: spot.c, value: Math.random() < 0.9 ? 2 : 4, isNew: true }
        ]
      };
    });
  },

  clearDeleted: () => {
    set((state) => ({
      tiles: state.tiles.filter(t => !t.toDelete)
    }));
  },

  move: (direction) => {
    const { dr, dc } = getDirectionVector(direction);

    set((state) => {
      if (state.status !== 'playing') return state;

      let moved = false;
      let scoreInc = 0;
      let newDiscoveries: number[] = [];

      const activeTiles = state.tiles.filter(t => !t.toDelete).map(t => ({ ...t, isNew: false }));
      const deletedTiles = state.tiles.filter(t => t.toDelete);

      const grid: (TileData | null)[][] = Array(4).fill(null).map(() => Array(4).fill(null));
      activeTiles.forEach(t => { grid[t.r][t.c] = t; });

      const sortedTiles = [...activeTiles];
      if (direction === 'UP') sortedTiles.sort((a, b) => a.r - b.r);
      if (direction === 'DOWN') sortedTiles.sort((a, b) => b.r - a.r);
      if (direction === 'LEFT') sortedTiles.sort((a, b) => a.c - b.c);
      if (direction === 'RIGHT') sortedTiles.sort((a, b) => b.c - a.c);

      const mergedThisTurn = new Set<string>();

      sortedTiles.forEach(tile => {
        let r = tile.r;
        let c = tile.c;

        grid[r][c] = null;

        while (true) {
          const nextR = r + dr;
          const nextC = c + dc;

          if (nextR < 0 || nextR >= 4 || nextC < 0 || nextC >= 4) break;

          const nextTile = grid[nextR][nextC];
          if (nextTile) {
            if (nextTile.value === tile.value && !mergedThisTurn.has(nextTile.id) && !mergedThisTurn.has(tile.id)) {
              // Merge
              r = nextR;
              c = nextC;
              const mergedVal = nextTile.value * 2;
              nextTile.value = mergedVal;
              mergedThisTurn.add(nextTile.id);
              tile.toDelete = true;
              scoreInc += mergedVal;
              moved = true;
              
              const tierIndex = Math.log2(mergedVal);
              if (!state.discoveredTiers.includes(tierIndex) && !newDiscoveries.includes(tierIndex)) {
                newDiscoveries.push(tierIndex);
              }
            }
            break;
          }

          r = nextR;
          c = nextC;
          moved = true;
        }

        tile.r = r;
        tile.c = c;
        if (!tile.toDelete) {
          grid[r][c] = tile;
        }
      });

      if (!moved) return { ...state, moveDirection: direction };

      const emptySpots = getEmptySpots(grid);
      if (emptySpots.length > 0) {
        const spot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
        const newTile = {
          id: generateId(),
          r: spot.r,
          c: spot.c,
          value: Math.random() < 0.9 ? 2 : 4,
          isNew: true
        };
        activeTiles.push(newTile);
        grid[spot.r][spot.c] = newTile;
      }

      let isGameOver = true;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (!grid[r][c]) {
            isGameOver = false; break;
          }
          const current = grid[r][c];
          if (r < 3 && grid[r + 1][c]?.value === current?.value) isGameOver = false;
          if (c < 3 && grid[r][c + 1]?.value === current?.value) isGameOver = false;
        }
      }

      const newScore = state.score + scoreInc;
      const newBestScore = Math.max(newScore, state.bestScore);
      localStorage.setItem('monster-merge-best', newBestScore.toString());
      
      const nextDiscovered = [...state.discoveredTiers, ...newDiscoveries].sort((a,b) => a-b);
      localStorage.setItem('monster-merge-discovered', JSON.stringify(nextDiscovered));

      setTimeout(() => {
        get().clearDeleted();
      }, 150);
      
      const newQueue = [...state.discoveredQueue, ...newDiscoveries];

      // If we merged anything this turn, audio handles playing sound.
      // But we need to call audio from out of store, or just fire a custom event...
      // Better to trigger audio in GameBoard or App via useEffect based on scoreInc, 
      // but the instructions said "trigger a haptic / sound on merge". 
      // We'll leave that to the component reacting to mergedThisTurn or just do it right here with window event.
      if (mergedThisTurn.size > 0 || newDiscoveries.length > 0) {
        const maxMergeValue = Array.from(mergedThisTurn).map(id => activeTiles.find(t => t.id === id)?.value).filter(Boolean) as number[];
        if (maxMergeValue.length > 0) {
          const maxVal = Math.max(...maxMergeValue);
          const event = new CustomEvent('merge_event', { detail: { value: maxVal, discoveries: newDiscoveries } });
          window.dispatchEvent(event);
        }
      }

      return {
        tiles: [...activeTiles, ...deletedTiles],
        score: newScore,
        bestScore: newBestScore,
        discoveredTiers: nextDiscovered,
        discoveredQueue: newQueue,
        status: newQueue.length > 0 ? 'discovery' : (isGameOver ? 'over' : 'playing'),
        moveDirection: direction
      };
    });
  }
}));
