# Channel Strip Chrome Extension

A Chrome extension for manipulating audio playback with various effect.

## Features - more on the way

The extension provides a complete audio processing chain:

- **3-Band Parametric EQ**: Control low, mid, and high frequencies with adjustable frequency points
- **Volume Control**: Precise volume control (0-100%)
- **Gain Boost**: Amplification up to 5x
- **Dynamic Compressor**: Professional dynamics processing with threshold, ratio, attack and release controls
- **Pitch Shifter**: Transpose playing audio by semitones

## Developer Roadmap

- Pitch Shifting sounds okay in the range of 1-2 semitones. More than that breaks the audio. So the next update would be improving the Pitch Shifter to better handle the bigger intervals.
- More audio modules are always on the table. Simplest to implement would be the Delay. Currently, adding more audio modules are not the priority though.
- The signal chain is static. Meaning, you can't change the order of the modules at the time of writing this. Implementing the ability to put modules or copies of modules to any point on the signal chain would be a next natural step for the development process.

### Future plans

- Support for other browsers


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
[Media Element] -> [EQ3] -> [Compressor] -> [Gate] -> [Pitch Shifter] -> [Gain] -> [Mono] -> [Master Output]
```

## Known Issues

- Extension don't wait for the user interaction to start the audio engine resulting an error.
- May require page refresh
- Best tested on YouTube. It should work on other audio/video semitones
