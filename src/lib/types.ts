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
  | "SET_GATE"
  | "TOGGLE_GATE"
  | "SET_LIMITER"
  | "TOGGLE_LIMITER"
  | "SET_PITCH_SHIFT"
  | "TOGGLE_PITCH_SHIFT"
  | "TOGGLE_MONO"
  | "RESET_ALL";

export type ModuleType = "volume" | "gain" | "compressor" | "eq" | "gate" | "limiter" | "pitchShift" | "mono";
export type CompressorParam = "threshold" | "knee" | "ratio" | "attack" | "release";
export type EQParam = "low" | "mid" | "high" | "lowFreq" | "midFreq" | "highFreq";
export type GateParam = "threshold" | "smoothing";
export type LimiterParam = "threshold";
export type PitchShiftParam = "pitch" | "windowSize";

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

export interface GateState {
  isActive: boolean;
  threshold: number;
  smoothing: number;
}

export interface LimiterState {
  isActive: boolean;
  threshold: number;
}

export interface PitchShiftState {
  isActive: boolean;
  pitch: number;
  windowSize: number;
}

export interface MonoState {
  isActive: boolean;
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
  | { param: GateParam; value: number }
  | { param: LimiterParam; value: number }
  | { param: PitchShiftParam; value: number }
  | null;

// Simplified message types
export type Message = {
  type: MessageType;
  payload: MessagePayload;
};
