import { volumeState, gainState, audioActions, volumeDefaults, gainDefaults, compressorState, compressorDefaults} from "@/lib/audioState"; //prettier-ignore
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import Fader from "@/components/Fader";
import AnimatedCircularProgressBar from "./components/ui/animated-circular-progress-bar";
import { useSignals } from "@preact/signals-react/runtime";

export default function App() {
  useSignals();
  useEffect(() => {
    audioActions.initializeFromStorage();
  }, []);

  return (
    <div className={cn("w-[800px] min-h-[400px]", "bg-blue-400 p-6", "flex flex-col gap-6")}>
      <h1 className="text-xl font-bold text-center">Audio Expert</h1>

      <AnimatedCircularProgressBar
        max={100}
        min={0}
        value={45}
        gaugePrimaryColor="blue"
        gaugeSecondaryColor="red"
        className="w-40 h-40"
      />

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
              onClick={() => audioActions.toggleModule("volume")}
            >
              Vol Enable
            </button>

            <div>
              <Fader
                value={volumeState.value.value}
                isActive={volumeState.value.isActive}
                defaults={volumeDefaults}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  audioActions.setVolume(Number(e.target.value))
                }
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
              value={gainState.value.value}
              isActive={gainState.value.isActive}
              defaults={gainDefaults}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                audioActions.setGain(Number(e.target.value))
              }
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
                value={compressorState.value.threshold}
                isActive={compressorState.value.isActive}
                defaults={compressorDefaults.threshold}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  audioActions.updateCompressor("threshold", Number(e.target.value))
                }
              />
              <Fader
                value={compressorState.value.threshold}
                isActive={compressorState.value.isActive}
                defaults={compressorDefaults.knee}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  audioActions.updateCompressor("knee", Number(e.target.value))
                }
              />
              <Fader
                value={compressorState.value.threshold}
                isActive={compressorState.value.isActive}
                defaults={compressorDefaults.ratio}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  audioActions.updateCompressor("ratio", Number(e.target.value))
                }
              />
              <Fader
                value={compressorState.value.threshold}
                isActive={compressorState.value.isActive}
                defaults={compressorDefaults.attack}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  audioActions.updateCompressor("attack", Number(e.target.value))
                }
              />
              <Fader
                value={compressorState.value.threshold}
                isActive={compressorState.value.isActive}
                defaults={compressorDefaults.release}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  audioActions.updateCompressor("release", Number(e.target.value))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
