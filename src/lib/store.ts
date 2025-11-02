import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { VolumeState, GainState, CompressorState, EQState } from "./types";

// Chrome storage adapter for Zustand persist middleware
const chromeStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return new Promise((resolve) => {
      chrome.storage.local.get([name], (result) => {
        resolve(result[name] || null);
      });
    });
  },
  setItem: async (name: string, value: string): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [name]: value }, () => {
        resolve();
      });
    });
  },
  removeItem: async (name: string): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.local.remove([name], () => {
        resolve();
      });
    });
  },
};

// Combined store state
interface AudioStore {
  // Volume
  volume: VolumeState;
  setVolume: (value: number) => void;
  toggleVolume: () => void;

  // Gain
  gain: GainState;
  setGain: (value: number) => void;
  toggleGain: () => void;

  // Compressor
  compressor: CompressorState;
  updateCompressor: (param: keyof Omit<CompressorState, "isActive" | "reduction">, value: number) => void;
  toggleCompressor: () => void;

  // EQ
  eq: EQState;
  updateEQ: (param: keyof Omit<EQState, "isActive">, value: number) => void;
  toggleEQ: () => void;

  // Utility
  resetToDefaults: () => void;
}

// Default values
const defaultVolume: VolumeState = { isActive: true, value: 100 };
const defaultGain: GainState = { isActive: true, value: 1 };
const defaultCompressor: CompressorState = {
  isActive: true,
  threshold: -24,
  knee: 30,
  ratio: 12,
  attack: 3,
  release: 250,
  reduction: 0,
};
const defaultEQ: EQState = {
  isActive: true,
  low: 0,
  mid: 0,
  high: 0,
  lowFreq: 400,
  midFreq: 2500,
  highFreq: 8000,
};

// Helper function to send messages to content script
const sendToContentScript = (type: string, payload: unknown) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { type, payload }, () => {
        // Handle any errors silently (tab might not have content script loaded)
        if (chrome.runtime.lastError) {
          console.log("Content script not ready:", chrome.runtime.lastError.message);
        }
      });
    }
  });
};

// Create the store
export const useAudioStore = create<AudioStore>()(
  persist(
    (set, get) => ({
      // Volume state and actions
      volume: defaultVolume,
      setVolume: (value: number) => {
        set({ volume: { ...get().volume, value } });
        sendToContentScript("SET_VOLUME", value);
      },
      toggleVolume: () => {
        const newState = !get().volume.isActive;
        set({ volume: { ...get().volume, isActive: newState } });
        sendToContentScript("TOGGLE_VOLUME", newState);
      },

      // Gain state and actions
      gain: defaultGain,
      setGain: (value: number) => {
        set({ gain: { ...get().gain, value } });
        sendToContentScript("SET_GAIN", value);
      },
      toggleGain: () => {
        const newState = !get().gain.isActive;
        set({ gain: { ...get().gain, isActive: newState } });
        sendToContentScript("TOGGLE_GAIN", newState);
      },

      // Compressor state and actions
      compressor: defaultCompressor,
      updateCompressor: (param, value) => {
        set({
          compressor: { ...get().compressor, [param]: value },
        });
        sendToContentScript("SET_COMPRESSOR", { param, value });
      },
      toggleCompressor: () => {
        const newState = !get().compressor.isActive;
        set({ compressor: { ...get().compressor, isActive: newState } });
        sendToContentScript("TOGGLE_COMPRESSOR", newState);
      },

      // EQ state and actions
      eq: defaultEQ,
      updateEQ: (param, value) => {
        set({
          eq: { ...get().eq, [param]: value },
        });
        sendToContentScript("SET_EQ", { param, value });
      },
      toggleEQ: () => {
        const newState = !get().eq.isActive;
        set({ eq: { ...get().eq, isActive: newState } });
        sendToContentScript("TOGGLE_EQ", newState);
      },

      // Utility
      resetToDefaults: () => {
        set({
          volume: defaultVolume,
          gain: defaultGain,
          compressor: defaultCompressor,
          eq: defaultEQ,
        });
        sendToContentScript("RESET_ALL", null);
      },
    }),
    {
      name: "audio-expert-storage",
      storage: createJSONStorage(() => chromeStorage),
    }
  )
);

// Selectors for optimized re-renders
export const selectVolume = (state: AudioStore) => state.volume;
export const selectGain = (state: AudioStore) => state.gain;
export const selectCompressor = (state: AudioStore) => state.compressor;
export const selectEQ = (state: AudioStore) => state.eq;
