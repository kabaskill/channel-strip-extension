// audioState.ts - Constants and defaults for audio modules
// State management now handled by Zustand store

// VOLUME DEFAULTS
export const volumeDefaults = {
  label: "Volume",
  prefix: "%",
  min: 0,
  max: 100,
  step: 1,
};

// GAIN DEFAULTS
export const gainDefaults = {
  label: "Gain",
  prefix: "x",
  min: 1,
  max: 5,
  step: 0.05,
};

// COMPRESSOR DEFAULTS
export const compressorDefaults = {
  threshold: { label: "Threshold", prefix: "dB", min: -100, max: 0, step: 1 },
  knee: { label: "Knee", prefix: "dB", min: 0, max: 40, step: 1 },
  ratio: { label: "Ratio", prefix: ":1", min: 1, max: 20, step: 1 },
  attack: { label: "Attack", prefix: "ms", min: 0, max: 1000, step: 1 },
  release: { label: "Release", prefix: "ms", min: 0, max: 1000, step: 1 },
  reduction: { label: "Reduction", prefix: "dB", min: 0, max: 100, step: 1 },
};

// EQ DEFAULTS
export const eqDefaults = {
  low: { label: "Low", prefix: "dB", min: -12, max: 12, step: 0.5 },
  mid: { label: "Mid", prefix: "dB", min: -12, max: 12, step: 0.5 },
  high: { label: "High", prefix: "dB", min: -12, max: 12, step: 0.5 },
  lowFreq: { label: "Low Freq", prefix: "Hz", min: 20, max: 500, step: 10 },
  midFreq: { label: "Mid Freq", prefix: "Hz", min: 400, max: 4000, step: 100 },
  highFreq: { label: "High Freq", prefix: "Hz", min: 3000, max: 16000, step: 500 },
};

// GATE DEFAULTS
export const gateDefaults = {
  threshold: { label: "Threshold", prefix: "dB", min: -100, max: 0, step: 1 },
  smoothing: { label: "Smoothing", prefix: "", min: 0, max: 1, step: 0.01 },
};

// LIMITER DEFAULTS
export const limiterDefaults = {
  threshold: { label: "Threshold", prefix: "dB", min: -20, max: 0, step: 1 },
};

// PITCH SHIFT DEFAULTS
export const pitchShiftDefaults = {
  pitch: { label: "Pitch", prefix: " semitones", min: -12, max: 12, step: 1 },
  windowSize: { label: "Window", prefix: "s", min: 0.03, max: 0.5, step: 0.01 },
};
