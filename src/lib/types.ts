// types.ts

// Common message types used across the extension
export type MessageType =
  | "SET_VOLUME"
  | "TOGGLE_VOLUME"
  | "SET_GAIN"
  | "TOGGLE_GAIN"
  | "SET_COMPRESSOR"
  | "TOGGLE_COMPRESSOR"
  | "SET_EQ"
  | "TOGGLE_EQ"
  | "RESET_ALL";

export type ModuleType = "volume" | "gain" | "compressor" | "eq";
export type CompressorParam = "threshold" | "knee" | "ratio" | "attack" | "release";
export type EQParam = "low" | "mid" | "high" | "lowFreq" | "midFreq" | "highFreq";

// Core state interfaces
export interface VolumeState {
  isActive: boolean;
  value: number;
}

export interface GainState {
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

export interface EQState {
  isActive: boolean;
  low: number;
  mid: number;
  high: number;
  lowFreq: number;
  midFreq: number;
  highFreq: number;
}

// Legacy - kept for backward compatibility
export interface AudioState {
  isActive: boolean;
  value: number;
}

// Message payload types
export type MessagePayload =
  | number
  | boolean
  | { param: CompressorParam; value: number }
  | { param: EQParam; value: number }
  | null;

// Simplified message types
export type Message = {
  type: MessageType;
  payload: MessagePayload;
};
