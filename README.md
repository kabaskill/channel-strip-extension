# Audio Expert Chrome Extension

A Chrome extension that provides advanced audio controls like volume and gain control, and dynamic compression.

More features are on the way...

## Features

Curently the extension utilizes 3 modules from Web Audio API

- Volume control (0-100%)
- Gain boost (up to 4x amplification)
- Dynamic compression

## Installation

1. Clone the repository
2. Run `npm install` to install dependencies
3. Build the extension with `npm run build`
4. Open Chrome and go to `chrome://extensions/`
5. Enable "Developer mode"
6. Click "Load unpacked" and select the `dist` directory

### Tech Stack

- React
- Tailwind CSS
- @preact/signals-react for state management
- Chrome Extensions API
- Web Audio API

## Usage

1. Click the extension icon on any webpage with audio/video content
2. Use the sliders to adjust audio parameters:

   - Volume: Basic volume control
   - Gain: Amplification beyond normal volume
   - Compressor: Dynamic range compression settings

3. Toggle modules on/off using the enable buttons (This is currently buggy)

## Known Issues

Since I've been testing the extension on only YouTube,

I'm not sure if the extension:

- would work any other site than YouTube
- might require page refresh
