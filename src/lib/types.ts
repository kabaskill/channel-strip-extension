// types.ts

// Common message types used across the extension
export type MessageType = "SET_VOLUME" | "SET_GAIN" | "SET_COMP" | "SET_MODULE_ACTIVE";
export type ModuleType = "volume" | "gain" | "compressor";
export type CompressorParam = "threshold" | "knee" | "ratio" | "attack" | "release";

// Core interfaces
export interface AudioState {
  isActive: boolean;
  value: number;
}

export interface CompressorState {
  isActive: boolean;
  threshold: number;
  knee: number;
  ratio: number;
  attack: number;
  release: number;
  reduction: number;
}

// Simplified message types
export type Message = {
  type: MessageType;
  payload: number | boolean | { param: CompressorParam; value: number };
};


// Audio action types
export interface AudioActions {
  setVolume: (value: number) => void;
  setGain: (value: number) => void;
  updateCompressor: (param: CompressorParam, value: number) => void;
  toggleModule: (module: ModuleType) => void;
  initializeFromStorage: () => Promise<void>;
}
