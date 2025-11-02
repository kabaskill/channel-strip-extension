// Import Tone.js via CDN for content script
// We'll load it dynamically since we can't use npm imports in content scripts

let toneLoaded = false;
let audioInitialized = false;

// Audio chain nodes
let mediaElement = null;
let mediaElementSource = null;
let eq3 = null;
let compressor = null;
let gainNode = null;

// Load Tone.js dynamically
function loadToneJs() {
  return new Promise((resolve, reject) => {
    if (window.Tone) {
      toneLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/tone@14.8.49/build/Tone.js";
    script.onload = () => {
      toneLoaded = true;
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Initialize audio chain
async function initializeAudio() {
  if (audioInitialized) return true;

  try {
    // Load Tone.js if not already loaded
    if (!toneLoaded) {
      await loadToneJs();
    }

    // Find media element
    mediaElement = document.querySelector("video, audio");
    if (!mediaElement) {
      console.log("No media element found");
      return false;
    }

    // Create Tone.js audio chain
    // MediaElementSource -> EQ3 -> Compressor -> Gain -> Master
    mediaElementSource = new Tone.UserMedia();
    
    // Use MediaElementAudioSourceNode instead
    const audioContext = Tone.context;
    const source = audioContext.createMediaElementSource(mediaElement);
    
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
    // Convert native AudioNode to Tone node
    const toneSource = Tone.connect(source, eq3);
    eq3.connect(compressor);
    compressor.connect(gainNode);
    gainNode.toDestination();

    audioInitialized = true;
    console.log("Audio chain initialized with Tone.js");

    // Load saved settings
    chrome.storage.local.get(
      ["audio-expert-storage"],
      (result) => {
        if (result["audio-expert-storage"]) {
          const state = JSON.parse(result["audio-expert-storage"]).state;
          applyStoredState(state);
        }
      }
    );

    return true;
  } catch (error) {
    console.error("Failed to initialize audio:", error);
    return false;
  }
}

// Apply stored state on load
function applyStoredState(state) {
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
    const eq = state.eq;
    updateEQ("low", eq.low);
    updateEQ("mid", eq.mid);
    updateEQ("high", eq.high);
    updateEQ("lowFreq", eq.lowFreq);
    updateEQ("midFreq", eq.midFreq);
    updateEQ("highFreq", eq.highFreq);
    toggleEQ(eq.isActive);
  }
}

// Audio control functions
function setVolume(volume) {
  if (mediaElement) {
    mediaElement.volume = volume / 100;
  }
}

function setGain(gain, isActive = true) {
  if (initializeAudio() && gainNode) {
    gainNode.gain.rampTo(isActive ? gain : 1, 0.05);
  }
}

function toggleGain(isActive) {
  if (gainNode) {
    // Get current gain value from storage or use default
    chrome.storage.local.get(["audio-expert-storage"], (result) => {
      if (result["audio-expert-storage"]) {
        const state = JSON.parse(result["audio-expert-storage"]).state;
        const gainValue = state.gain?.value || 1;
        gainNode.gain.rampTo(isActive ? gainValue : 1, 0.05);
      }
    });
  }
}

function updateCompressor(param, value) {
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
      compressor.attack.rampTo(value / 1000, 0.05); // Convert ms to seconds
      break;
    case "release":
      compressor.release.rampTo(value / 1000, 0.05); // Convert ms to seconds
      break;
  }
}

function toggleCompressor(isActive) {
  if (compressor) {
    // Bypass compressor by setting threshold very high when disabled
    compressor.threshold.rampTo(isActive ? -24 : 0, 0.05);
  }
}

function updateEQ(param, value) {
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
    case "midFreq":
      // Mid frequency is calculated between low and high
      // We need to adjust both lowFrequency and highFrequency
      break;
    case "highFreq":
      eq3.highFrequency.rampTo(value, 0.05);
      break;
  }
}

function toggleEQ(isActive) {
  if (eq3) {
    if (!isActive) {
      eq3.low.rampTo(0, 0.05);
      eq3.mid.rampTo(0, 0.05);
      eq3.high.rampTo(0, 0.05);
    } else {
      // Restore values from storage
      chrome.storage.local.get(["audio-expert-storage"], (result) => {
        if (result["audio-expert-storage"]) {
          const state = JSON.parse(result["audio-expert-storage"]).state;
          if (state.eq) {
            eq3.low.rampTo(state.eq.low, 0.05);
            eq3.mid.rampTo(state.eq.mid, 0.05);
            eq3.high.rampTo(state.eq.high, 0.05);
          }
        }
      });
    }
  }
}

function toggleVolume(isActive) {
  if (mediaElement) {
    if (!isActive) {
      mediaElement.volume = 0;
    } else {
      chrome.storage.local.get(["audio-expert-storage"], (result) => {
        if (result["audio-expert-storage"]) {
          const state = JSON.parse(result["audio-expert-storage"]).state;
          const volumeValue = state.volume?.value || 100;
          mediaElement.volume = volumeValue / 100;
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
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
