import { useAudioStore } from "@/lib/store";
import { volumeDefaults, gainDefaults } from "@/lib/audioState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Knob from "./components/ui/Knob";
import Meter from "./components/ui/Meter";
import Compressor from "./components/Compressor";
import EQ from "./components/EQ";
import Gate from "./components/Gate";
import PitchShift from "./components/PitchShift";
import Mono from "./components/Mono";
import Power from "./components/Power";
import { cn } from "@/lib/utils";
import { useMeterValues } from "./hooks/useMeterValues";
import { Button } from "./components/ui/button";

export default function App() {
  const volume = useAudioStore((state) => state.volume);
  const setVolume = useAudioStore((state) => state.setVolume);
  const toggleVolume = useAudioStore((state) => state.toggleVolume);

  const gain = useAudioStore((state) => state.gain);
  const setGain = useAudioStore((state) => state.setGain);
  const toggleGain = useAudioStore((state) => state.toggleGain);

  const { meters, isConnected } = useMeterValues();

  return (
    <div className="w-[800px] bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-4 pb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight ">
          Channel Strip
        </h1>
        <a
          href="https://github.com/kabaskill/channel-strip-extension"
          target="_blank"
        >
          <Button variant="ghost" className="group">
            <span className="opacity-0 group-hover:opacity-100 transition-all duration-300">
              Github
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-github-icon lucide-github"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </Button>
        </a>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-[1fr_auto_auto] gap-4 p-4 overflow-hidden">
        {/* Tab Navigation */}
        <Tabs defaultValue="eq" className="flex gap-4" orientation="vertical">
          <TabsList className="flex flex-col h-fit gap-2 bg-slate-800/50 p-2">
            <TabsTrigger
              value="eq"
              className="justify-start w-full data-[state=active]:bg-slate-700"
            >
              EQ
            </TabsTrigger>
            <TabsTrigger
              value="compressor"
              className="justify-start w-full data-[state=active]:bg-slate-700"
            >
              Compressor
            </TabsTrigger>
            <TabsTrigger
              value="gate"
              className="justify-start w-full data-[state=active]:bg-slate-700"
            >
              Gate
            </TabsTrigger>
            <TabsTrigger
              value="pitchShift"
              className="justify-start w-full data-[state=active]:bg-slate-700"
            >
              Pitch Shift
            </TabsTrigger>
          </TabsList>

          {/* Module Controls */}
          <div className="flex-1 min-w-0">
            <TabsContent
              value="gate"
              className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col"
            >
              <Gate />
            </TabsContent>

            <TabsContent
              value="eq"
              className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col"
            >
              <EQ />
            </TabsContent>

            <TabsContent
              value="compressor"
              className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col"
            >
              <Compressor />
            </TabsContent>

            <TabsContent
              value="pitchShift"
              className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col"
            >
              <PitchShift />
            </TabsContent>

          </div>
        </Tabs>


        {/* Master Controls (Gain & Volume) */}
        <div className="flex flex-col gap-2 min-w-[160px] bg-slate-800/30 rounded-lg p-4 border border-slate-700">
          {/* Gain Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-full inline-flex items-center justify-between text-center">
              <h3 className="text-sm font-semibold text-slate-300 mb-1">GAIN</h3>
              <button
                onClick={toggleGain}
                className={cn(!gain.isActive && "opacity-40")}
              >
                <Power />
              </button>
            </div>
            <Knob
              value={gain.value}
              isActive={gain.isActive}
              defaults={gainDefaults}
              onChange={setGain}
              sensitivity={0.4}
              className="w-24"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-slate-700" />

          {/* Mono Section */}
          <Mono />

          {/* Divider */}
          <div className="border-t border-slate-700" />

          {/* Volume Section */}
          <div className="flex flex-col gap-3 flex-1">
            <div className="inline-flex items-center justify-between text-center">
              <h3 className="text-sm font-semibold text-slate-300 mb-1">VOLUME</h3>
              <button
                onClick={toggleVolume}
                className={cn(!volume.isActive && "opacity-40")}
              >
                <Power />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <Knob
                value={volume.value}
                isActive={volume.isActive}
                defaults={volumeDefaults}
                onChange={setVolume}
                sensitivity={1}
                className="w-24"
              />
            </div>
          </div>
        </div>

        {/* Meters */}
        <div className="relative flex gap-4 bg-slate-800/30 rounded-lg p-4 border border-slate-700">
          <Meter
            getValue={() => meters.input}
            label="IN"
            orientation="vertical"
            className="flex-1"
          />
          <Meter
            getValue={() => meters.output}
            label="OUT"
            orientation="vertical"
            className="flex-1"
          />
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-lg">
              <p className="text-xs text-slate-500">No Audio</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
