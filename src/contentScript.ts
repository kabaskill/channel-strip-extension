// Content script for audio processing
import { AudioChain } from "./lib/audio/AudioChain";

let audioChain: AudioChain | null = null;
let initializationPromise: Promise<boolean> | null = null;

// Initialize audio chain
async function initializeAudio(): Promise<boolean> {
  // Return existing promise if initialization is in progress
  if (initializationPromise) {
    return initializationPromise;
  }

  // Return true if already initialized
  if (audioChain?.isInitialized) {
    return true;
  }

  initializationPromise = (async () => {
    try {
      // Find media element
      const mediaElement = document.querySelector("video, audio") as HTMLMediaElement;
      if (!mediaElement) {
        console.log("No media element found");
        return false;
      }

      // Create and initialize audio chain
      audioChain = new AudioChain();
      const success = await audioChain.initialize(mediaElement);

      if (success) {
        // Load saved settings
        chrome.storage.local.get(["audio-expert-storage"], (result) => {
          if (result["audio-expert-storage"]) {
            try {
              const state = JSON.parse(result["audio-expert-storage"]).state;
              audioChain?.applyStoredState(state);
            } catch (e) {
              console.error("Failed to parse stored state:", e);
            }
          }
        });
      }

      return success;
    } catch (error) {
      console.error("Failed to initialize audio:", error);
      return false;
    } finally {
      initializationPromise = null;
    }
  })();

  return initializationPromise;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  initializeAudio().then(() => {
    if (!audioChain) {
      sendResponse({ success: false, error: "Audio chain not initialized" });
      return;
    }

    try {
      switch (message.type) {
        // Volume controls
        case "SET_VOLUME":
          audioChain.setVolume(message.payload);
          break;
        case "TOGGLE_VOLUME":
          // Volume toggle is handled directly on media element
          chrome.storage.local.get(["audio-expert-storage"], (result) => {
            if (result["audio-expert-storage"]) {
              try {
                const state = JSON.parse(result["audio-expert-storage"]).state;
                const volumeValue = message.payload ? (state.volume?.value || 100) : 0;
                audioChain?.setVolume(volumeValue);
              } catch (e) {
                console.error("Failed to parse state:", e);
              }
            }
          });
          break;

        // Gain controls
        case "SET_GAIN":
          audioChain.updateModuleParam("gain", "gain", message.payload);
          break;
        case "TOGGLE_GAIN":
          audioChain.toggleModule("gain", message.payload);
          break;

        // Compressor controls
        case "SET_COMPRESSOR":
          audioChain.updateModuleParam("compressor", message.payload.param, message.payload.value);
          break;
        case "TOGGLE_COMPRESSOR":
          audioChain.toggleModule("compressor", message.payload);
          break;

        // EQ controls
        case "SET_EQ":
          audioChain.updateModuleParam("eq", message.payload.param, message.payload.value);
          break;
        case "TOGGLE_EQ":
          audioChain.toggleModule("eq", message.payload);
          break;

        // Gate controls
        case "SET_GATE":
          audioChain.updateModuleParam("gate", message.payload.param, message.payload.value);
          break;
        case "TOGGLE_GATE":
          audioChain.toggleModule("gate", message.payload);
          break;

        // Limiter controls
        case "SET_LIMITER":
          audioChain.updateModuleParam("limiter", message.payload.param, message.payload.value);
          break;
        case "TOGGLE_LIMITER":
          audioChain.toggleModule("limiter", message.payload);
          break;

        // PitchShift controls
        case "SET_PITCH_SHIFT":
          audioChain.updateModuleParam("pitchShift", message.payload.param, message.payload.value);
          break;
        case "TOGGLE_PITCH_SHIFT":
          audioChain.toggleModule("pitchShift", message.payload);
          break;

        // Mono controls
        case "TOGGLE_MONO":
          audioChain.toggleModule("mono", message.payload);
          break;

        // Reset all
        case "RESET_ALL":
          // Dispose current chain and reinitialize
          audioChain.dispose();
          audioChain = null;
          initializeAudio();
          break;

        default:
          console.warn("Unknown message type:", message.type);
      }

      sendResponse({ success: true });
    } catch (error) {
      console.error("Error handling message:", error);
      sendResponse({ success: false, error: String(error) });
    }
  });

  return true; // Keep the message channel open for async response
});

// Auto-initialize when media element is detected
const observer = new MutationObserver(() => {
  if (!audioChain?.isInitialized && document.querySelector("video, audio")) {
    initializeAudio();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Also try to initialize immediately
if (document.readyState === "complete") {
  initializeAudio();
} else {
  window.addEventListener("load", initializeAudio);
}
