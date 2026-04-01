let audioCtx: AudioContext | null = null;

export const initAudio = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
};

export const resumeAudio = async () => {
  if (audioCtx && audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }
};

const playChime = (freq: number, vol: number, type: OscillatorType, duration: number = 0.5) => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + duration);
};

export const playMergeSound = (tier: number, isDiscovery: boolean = false) => {
  if (!audioCtx) return;
  resumeAudio();

  const PENTATONIC_FREQUENCIES = [
    261.63, // 1 Slimey
    293.66, // 2 Sproutling
    329.63, // 3 Floof
    392.00, // 4 Horn-Toad
    440.00, // 5 Ember-Pup
    523.25, // 6 Shadow-Bat
    587.33, // 7 Crystal-Grit
    659.25, // 8 Storm-Chirp
    783.99, // 9 Deep-Fin
    880.00, // 10 Forest-Guard
    1046.50 // 11 Elder-Drake
  ];

  const tIndex = Math.min(Math.max(0, tier - 1), 10);
  const freq = PENTATONIC_FREQUENCIES[tIndex];

  if (isDiscovery && tier === 11) {
    // Elder Drake Triumphant Chord
    playChime(1046.50, 0.5, 'sine', 1.5);
    playChime(1318.51, 0.5, 'sine', 1.5);
    playChime(1567.98, 0.5, 'sine', 1.5);
    playChime(523.25, 0.8, 'triangle', 2.0); // Bass
    
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 400]);
  } else if (isDiscovery) {
    // Discovery major third chord
    playChime(freq, 0.4, 'sine', 1.0);
    playChime(freq * 1.25, 0.4, 'sine', 1.0);
    
    if (navigator.vibrate) navigator.vibrate([50, 50, 150]);
  } else {
    // Standard chime
    playChime(freq, 0.2, 'sine', 0.5);
    setTimeout(() => {
      playChime(freq * 2, 0.1, 'sine', 0.2);
    }, 50);
    
    if (navigator.vibrate) navigator.vibrate(20); // short tick
  }
};
