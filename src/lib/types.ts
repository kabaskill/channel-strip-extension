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
}

export interface AudioDefaults {
  label: string;
  prefix: string;
  min: number;
  max: number;
  step: number;
}

export interface CompressorDefaults {
  threshold: AudioDefaults;
  knee: AudioDefaults;
  ratio: AudioDefaults;
  attack: AudioDefaults;
  release: AudioDefaults;
}

export interface AudioActions {
  setVolume: (value: number) => void;
  setGain: (value: number) => void;
  updateCompressor: (param: string, value: number) => void;
  toggleModule: (module: string) => void;
  initializeFromStorage: () => Promise<void>;
}

export interface MessagePayload {
  type: string;
  payload: number | boolean | { param: string; value: number };
}