// App.jsx
import { useEffect } from "react";
import Fader from "./components/Fader";
import {
  volumeState,
  gainState,
  audioActions,
  volumeDefaults,
  gainDefaults,
  compressorState,
  compressorDefaults,
} from "./signals/audioState";
import { cn } from "./utils/cn";

export default function App() {
  useEffect(() => {
    audioActions.initializeFromStorage();
  }, []);

  return (
    <div className={cn("w-[800px] min-h-[400px]", "bg-blue-400 p-6", "flex flex-col gap-6")}>
      <h1 className="text-xl font-bold text-center">Audio Expert</h1>

      <div className="flex-1 p-4 bg-blue-200 rounded-lg shadow-md overflow-x-auto">
        <div className="flex gap-2 min-w-min">
          <div>
            <button
              type="button"
              className={cn(
                "px-4 py-2 rounded-md",
                "bg-white border-2 border-gray-300",
                "font-medium text-sm",
                "transition-colors duration-200",
                "hover:bg-gray-50 active:bg-gray-100",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              )}
              onClick={() => {
                volumeState.value.isActive = !volumeState.value.isActive;
                console.log(volumeState.value.isActive);
              }}
            >
              Vol Enable
            </button>

            <div>
              <Fader
                signal={volumeState}
                defaults={volumeDefaults}
                onChange={(e) => audioActions.setVolume(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              className={cn(
                "px-4 py-2 rounded-md",
                "bg-white border-2 border-gray-300",
                "font-medium text-sm",
                "transition-colors duration-200",
                "hover:bg-gray-50 active:bg-gray-100",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              )}
              onClick={() => audioActions.toggleModule("gain")}
            >
              Gain Enable
            </button>
            <Fader
              signal={gainState}
              defaults={gainDefaults}
              onChange={(e) => audioActions.setGain(e.target.value)}
            />
          </div>

          <div>
            <button
              type="button"
              className={cn(
                "px-4 py-2 rounded-md",
                "bg-white border-2 border-gray-300",
                "font-medium text-sm",
                "transition-colors duration-200",
                "hover:bg-gray-50 active:bg-gray-100",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              )}
              onClick={() => audioActions.toggleModule("compressor")}
            >
              Comp Enable
            </button>

            <div className="flex gap-4 p-2 bg-orange-400">
              <Fader
                signal={compressorState}
                defaults={compressorDefaults.threshold}
                onChange={(e) => audioActions.updateCompressor("threshold", e.target.value)}
                paramName="threshold"
              />
              <Fader
                signal={compressorState}
                defaults={compressorDefaults.knee}
                onChange={(e) => audioActions.updateCompressor("knee", e.target.value)}
                paramName="knee"
              />
              <Fader
                signal={compressorState}
                defaults={compressorDefaults.ratio}
                onChange={(e) => audioActions.updateCompressor("ratio", e.target.value)}
                paramName="ratio"
              />
              <Fader
                signal={compressorState}
                defaults={compressorDefaults.attack}
                onChange={(e) => audioActions.updateCompressor("attack", e.target.value)}
                paramName="attack"
              />
              <Fader
                signal={compressorState}
                defaults={compressorDefaults.release}
                onChange={(e) => audioActions.updateCompressor("release", e.target.value)}
                paramName="release"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
