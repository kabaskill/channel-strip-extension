let audioContext;
let gainNode;
let compNode;
let source;

function initializeAudio() {
  if (!audioContext) {
    const media = document.querySelector("video, audio");
    if (!media) return false;

    audioContext = new AudioContext();
    source = audioContext.createMediaElementSource(media);
    gainNode = audioContext.createGain();
    compNode = audioContext.createDynamicsCompressor();
    
    // Set up the audio routing
    source.connect(compNode);
    compNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Initialize compressor parameters
    compNode.threshold.setValueAtTime(-24, audioContext.currentTime);
    compNode.knee.setValueAtTime(30, audioContext.currentTime);
    compNode.ratio.setValueAtTime(12, audioContext.currentTime);
    compNode.attack.setValueAtTime(0.003, audioContext.currentTime);
    compNode.release.setValueAtTime(0.25, audioContext.currentTime);

    // Load saved settings
    chrome.storage.local.get(["volume", "gain", "compressor"], (result) => {
      if (result.volume) setVolume(result.volume.value);
      if (result.gain) setGain(result.gain.value);
      if (result.compressor) updateCompressor(result.compressor);
    });

    return true;
  }
  return true;
}

function setVolume(volume) {
  const media = document.querySelector("video, audio");
  if (media) {
    media.volume = volume / 100;
  }
}

function setGain(gain) {
  if (initializeAudio() && gainNode) {
    gainNode.gain.setValueAtTime(gain, audioContext.currentTime);
  }
}

function updateCompressor(params) {
  if (initializeAudio() && compNode) {
    if (params.threshold !== undefined) {
      compNode.threshold.setValueAtTime(params.threshold, audioContext.currentTime);
    }
    if (params.knee !== undefined) {
      compNode.knee.setValueAtTime(params.knee, audioContext.currentTime);
    }
    if (params.ratio !== undefined) {
      compNode.ratio.setValueAtTime(params.ratio, audioContext.currentTime);
    }
    if (params.attack !== undefined) {
      compNode.attack.setValueAtTime(params.attack / 1000, audioContext.currentTime);
    }
    if (params.release !== undefined) {
      compNode.release.setValueAtTime(params.release / 1000, audioContext.currentTime);
    }
  }
}

chrome.runtime.onMessage.addListener((message) => {
  switch (message.type) {
    case "SET_VOLUME":
      setVolume(message.payload);
      break;
    case "SET_GAIN":
      setGain(message.payload);
      break;
    case "SET_COMP":
      updateCompressor({ [message.payload.param]: message.payload.value });
      break;
  }
});