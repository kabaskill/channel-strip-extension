import { signal } from "@preact/signals-react";
import { ModuleType } from "./types";

// AUDIO MODULES
// VOLUME
export const volumeState = signal({ isActive: true, value: 100 });
export const volumeDefaults = { label: "Volume", prefix: "%", min: 0, max: 100, step: 1 };

// GAIN
export const gainState = signal({ isActive: true, value: 1 });
export const gainDefaults = { label: "Gain", prefix: "x", min: 1, max: 5, step: 0.05 };

// COMPRESSOR
export const compressorState = signal({
  isActive: true,
  threshold: -24,
  knee: 30,
  ratio: 12,
  attack: 3,
  release: 250,
  reduction: 0,
});
export const compressorDefaults = {
  threshold: { label: "Threshold", prefix: "dB", min: -100, max: 0, step: 1 },
  knee: { label: "Knee", prefix: "dB", min: 0, max: 40, step: 1 },
  ratio: { label: "Ratio", prefix: ":1", min: 1, max: 20, step: 1 },
  attack: { label: "Attack", prefix: "ms", min: 0, max: 1000, step: 1 },
  release: { label: "Release", prefix: "ms", min: 0, max: 1000, step: 1 },
  reduction: { label: "Reduction", prefix: "dB", min: 0, max: 100, step: 1 },
};

// Actions
export const audioActions = {
  setVolume: (value: number) => {
    volumeState.value = { ...volumeState.value, value: value };
    sendToContentScript("SET_VOLUME", value);
  },

  setGain: (value: number) => {
    gainState.value = { ...gainState.value, value: value };
    sendToContentScript("SET_GAIN", Number(value));
  },

  updateCompressor: (param: string, value: number) => {
    compressorState.value = {
      ...compressorState.value,
      [param]: value,
    };
    sendToContentScript("SET_COMP", { param, value });
  },

  toggleModule: (module: ModuleType) => {
    switch (module) {
      case "volume":
        volumeState.value = { ...volumeState.value, isActive: !volumeState.value.isActive };
        break;
      case "gain":
        gainState.value = { ...gainState.value, isActive: !gainState.value.isActive };
        break;
      case "compressor":
        compressorState.value = {
          ...compressorState.value,
          isActive: !compressorState.value.isActive,
        };
        break;
      default:
        break;
    }
    return;
    // Send the updated active state to content script
    // sendToContentScript(`SET_${module.toUpperCase()}_ACTIVE`, moduleMap[module].value.isActive);
  },

  // Initialize state from storage
  initializeFromStorage: async () => {
    try {
      const result = await chrome.storage.local.get(["volume", "gain", "compressor"]);

      if (result.volume) {
        volumeState.value = result.volume;
      }
      if (result.gain) {
        gainState.value = result.gain;
      }
      if (result.compressor) {
        compressorState.value = result.compressor;
      }
    } catch (error) {
      console.warn("Failed to load state from storage:", error);
    }
  },
};

// Helper function to send messages to content script
function sendToContentScript(
  type: string,
  payload: number | boolean | { param: string; value: number }
) {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type, payload });

        // Save to storage
        const storageKey = type.toLowerCase().slice(4).split("_")[0];
        chrome.storage.local.set({ [storageKey]: payload });
      }
    });
  } catch (error) {
    console.warn(error);
  }
}
