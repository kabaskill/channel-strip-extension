# Channel Strip Chrome Extension

A Chrome extension for manipulating audio playback with various effect.

## Features - more on the way

The extension provides a complete audio processing chain:

- **3-Band Parametric EQ**: Control low, mid, and high frequencies with adjustable frequency points
- **Volume Control**: Precise volume control (0-100%)
- **Gain Boost**: Amplification up to 5x
- **Dynamic Compressor**: Professional dynamics processing with threshold, ratio, attack and release controls
- **Pitch Shifter**: Transpose playing audio by semitones

## Installation - Local only for now

1. Clone the repository
2. Run `npm install` to install dependencies
3. Build the extension with `npm run build`
4. Open Chrome and go to `chrome://extensions/`
5. Enable "Developer mode"
6. Click "Load unpacked" and select the `dist` directory

### Tech Stack

- **React 18** 
- **Tailwind** 
- **Zustand** 
- **Tone.js**
- **shadcn/ui**
- **TypeScript**
- **Chrome Extensions API** 

## Usage

1. Click the extension icon on any webpage with audio/video content
2. Use the tabs to switch between EQ and Compressor
3. Adjust audio parameters with the interactive knobs and sliders:
4. Toggle modules on/off using the enable buttons
5. Settings are automatically saved and persist across sessions

## Architecture

```
[Media Element] → [EQ3] → [Compressor] → [Gain] → [Master Output]
```

- **Content Script**: Loads Tone.js and manages audio processing per tab
- **Popup UI**: React-based interface with Zustand state management
- **State Persistence**: Automatic Chrome storage sync

## Known Issues

- Extension requires Tone.js to load from CDN on first use
- May require page refresh on some websites
- Best tested on YouTube, Spotify, and common video sites
