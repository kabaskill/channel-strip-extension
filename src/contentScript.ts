// Content script for audio processing
import * as Tone from "tone";

let audioInitialized = false;

// Audio chain nodes
let mediaElement: HTMLMediaElement | null = null;
let mediaElementSource: MediaElementAudioSourceNode | null = null;
let eq3: Tone.EQ3 | null = null;
let compressor: Tone.Compressor | null = null;
let gainNode: Tone.Gain | null = null;

// Initialize audio chain
async function initializeAudio(): Promise<boolean> {
  if (audioInitialized) return true;

  try {
    // Find media element
    mediaElement = document.querySelector("video, audio");
    if (!mediaElement) {
      console.log("No media element found");
      return false;
    }

    // Get Tone's audio context
    const audioContext = Tone.getContext().rawContext as AudioContext;
    
    // Create MediaElementSource from native audio context
    mediaElementSource = audioContext.createMediaElementSource(mediaElement);
    
    // Create Tone.js nodes
    eq3 = new Tone.EQ3({
      low: 0,
      mid: 0,
      high: 0,
      lowFrequency: 400,
      highFrequency: 8000,
    });

    compressor = new Tone.Compressor({
      threshold: -24,
      ratio: 12,
      attack: 0.003,
      release: 0.25,
      knee: 30,
    });

    gainNode = new Tone.Gain(1);

    // Connect the chain
    // Native source -> Tone EQ -> Compressor -> Gain -> Destination
    Tone.connect(mediaElementSource, eq3);
    eq3.connect(compressor);
    compressor.connect(gainNode);
    gainNode.toDestination();

    audioInitialized = true;
    console.log("Audio chain initialized with Tone.js");

    // Load saved settings
    chrome.storage.local.get(["audio-expert-storage"], (result) => {
      if (result["audio-expert-storage"]) {
        try {
          const state = JSON.parse(result["audio-expert-storage"]).state;
          applyStoredState(state);
        } catch (e) {
          console.error("Failed to parse stored state:", e);
        }
      }
    });

    return true;
  } catch (error) {
    console.error("Failed to initialize audio:", error);
    audioInitialized = false;
    return false;
  }
}

// Apply stored state on load
interface StoredState {
  volume?: { value: number; isActive: boolean };
  gain?: { value: number; isActive: boolean };
  compressor?: {
    threshold: number;
    knee: number;
    ratio: number;
    attack: number;
    release: number;
    isActive: boolean;
  };
  eq?: {
    low: number;
    mid: number;
    high: number;
    lowFreq: number;
    highFreq: number;
    isActive: boolean;
  };
}

function applyStoredState(state: StoredState) {
  if (!state) return;

  if (state.volume) {
    setVolume(state.volume.value);
  }
  if (state.gain) {
    setGain(state.gain.value, state.gain.isActive);
  }
  if (state.compressor) {
    const comp = state.compressor;
    updateCompressor("threshold", comp.threshold);
    updateCompressor("knee", comp.knee);
    updateCompressor("ratio", comp.ratio);
    updateCompressor("attack", comp.attack);
    updateCompressor("release", comp.release);
    toggleCompressor(comp.isActive);
  }
  if (state.eq) {
    const eqState = state.eq;
    updateEQ("low", eqState.low);
    updateEQ("mid", eqState.mid);
    updateEQ("high", eqState.high);
    updateEQ("lowFreq", eqState.lowFreq);
    updateEQ("highFreq", eqState.highFreq);
    toggleEQ(eqState.isActive);
  }
}

// Audio control functions
function setVolume(volume: number) {
  if (mediaElement) {
    mediaElement.volume = volume / 100;
  }
}

function setGain(gain: number, isActive = true) {
  if (audioInitialized && gainNode) {
    gainNode.gain.rampTo(isActive ? gain : 1, 0.05);
  }
}

function toggleGain(isActive: boolean) {
  if (gainNode) {
    chrome.storage.local.get(["audio-expert-storage"], (result) => {
      if (result["audio-expert-storage"]) {
        try {
          const state = JSON.parse(result["audio-expert-storage"]).state;
          const gainValue = state.gain?.value || 1;
          gainNode!.gain.rampTo(isActive ? gainValue : 1, 0.05);
        } catch (e) {
          console.error("Failed to parse state:", e);
        }
      }
    });
  }
}

function updateCompressor(param: string, value: number) {
  if (!audioInitialized) initializeAudio();
  if (!compressor) return;

  switch (param) {
    case "threshold":
      compressor.threshold.rampTo(value, 0.05);
      break;
    case "knee":
      compressor.knee.rampTo(value, 0.05);
      break;
    case "ratio":
      compressor.ratio.rampTo(value, 0.05);
      break;
    case "attack":
      compressor.attack.rampTo(value / 1000, 0.05);
      break;
    case "release":
      compressor.release.rampTo(value / 1000, 0.05);
      break;
  }
}

function toggleCompressor(isActive: boolean) {
  if (compressor) {
    // Store current threshold
    chrome.storage.local.get(["audio-expert-storage"], (result) => {
      if (result["audio-expert-storage"]) {
        try {
          const state = JSON.parse(result["audio-expert-storage"]).state;
          const threshold = state.compressor?.threshold || -24;
          compressor!.threshold.rampTo(isActive ? threshold : 0, 0.05);
        } catch (e) {
          console.error("Failed to parse state:", e);
        }
      }
    });
  }
}

function updateEQ(param: string, value: number) {
  if (!audioInitialized) initializeAudio();
  if (!eq3) return;

  switch (param) {
    case "low":
      eq3.low.rampTo(value, 0.05);
      break;
    case "mid":
      eq3.mid.rampTo(value, 0.05);
      break;
    case "high":
      eq3.high.rampTo(value, 0.05);
      break;
    case "lowFreq":
      eq3.lowFrequency.rampTo(value, 0.05);
      break;
    case "highFreq":
      eq3.highFrequency.rampTo(value, 0.05);
      break;
  }
}

function toggleEQ(isActive: boolean) {
  if (eq3) {
    if (!isActive) {
      eq3.low.rampTo(0, 0.05);
      eq3.mid.rampTo(0, 0.05);
      eq3.high.rampTo(0, 0.05);
    } else {
      chrome.storage.local.get(["audio-expert-storage"], (result) => {
        if (result["audio-expert-storage"]) {
          try {
            const state = JSON.parse(result["audio-expert-storage"]).state;
            if (state.eq) {
              eq3!.low.rampTo(state.eq.low, 0.05);
              eq3!.mid.rampTo(state.eq.mid, 0.05);
              eq3!.high.rampTo(state.eq.high, 0.05);
            }
          } catch (e) {
            console.error("Failed to parse state:", e);
          }
        }
      });
    }
  }
}

function toggleVolume(isActive: boolean) {
  if (mediaElement) {
    if (!isActive) {
      mediaElement.volume = 0;
    } else {
      chrome.storage.local.get(["audio-expert-storage"], (result) => {
        if (result["audio-expert-storage"]) {
          try {
            const state = JSON.parse(result["audio-expert-storage"]).state;
            const volumeValue = state.volume?.value || 100;
            mediaElement!.volume = volumeValue / 100;
          } catch (e) {
            console.error("Failed to parse state:", e);
          }
        }
      });
    }
  }
}

function resetAll() {
  setVolume(100);
  setGain(1);
  if (eq3) {
    eq3.low.rampTo(0, 0.05);
    eq3.mid.rampTo(0, 0.05);
    eq3.high.rampTo(0, 0.05);
  }
  if (compressor) {
    compressor.threshold.rampTo(-24, 0.05);
    compressor.knee.rampTo(30, 0.05);
    compressor.ratio.rampTo(12, 0.05);
    compressor.attack.rampTo(0.003, 0.05);
    compressor.release.rampTo(0.25, 0.05);
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  initializeAudio().then(() => {
    switch (message.type) {
      case "SET_VOLUME":
        setVolume(message.payload);
        break;
      case "TOGGLE_VOLUME":
        toggleVolume(message.payload);
        break;
      case "SET_GAIN":
        setGain(message.payload);
        break;
      case "TOGGLE_GAIN":
        toggleGain(message.payload);
        break;
      case "SET_COMPRESSOR":
        updateCompressor(message.payload.param, message.payload.value);
        break;
      case "TOGGLE_COMPRESSOR":
        toggleCompressor(message.payload);
        break;
      case "SET_EQ":
        updateEQ(message.payload.param, message.payload.value);
        break;
      case "TOGGLE_EQ":
        toggleEQ(message.payload);
        break;
      case "RESET_ALL":
        resetAll();
        break;
    }
    sendResponse({ success: true });
  });
  return true; // Keep the message channel open for async response
});

// Auto-initialize when media element is detected
const observer = new MutationObserver(() => {
  if (!audioInitialized && document.querySelector("video, audio")) {
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
