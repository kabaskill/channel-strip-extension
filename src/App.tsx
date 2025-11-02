import { useAudioStore } from "@/lib/store";
import { volumeDefaults, gainDefaults } from "@/lib/audioState";
import { getKnobColors } from "@/lib/theme";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Fader from "@/components/Fader";
import Knob from "./components/ui/Knob";
import Compressor from "./components/Compressor";
import EQ from "./components/EQ";
import { Button } from "./components/ui/button";

export default function App() {
  const volume = useAudioStore((state) => state.volume);
  const setVolume = useAudioStore((state) => state.setVolume);
  const toggleVolume = useAudioStore((state) => state.toggleVolume);

  const gain = useAudioStore((state) => state.gain);
  const setGain = useAudioStore((state) => state.setGain);
  const toggleGain = useAudioStore((state) => state.toggleGain);

  const gainColors = getKnobColors("gain");

  return (
    <div className="max-w-fit min-h-[400px] bg-slate-900 text-white dark flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700">
        <h1 className="text-2xl font-bold tracking-tight text-center">
          Channel Strip
        </h1>
      </div>

      {/* Main Content - 3 Column Grid */}
      <div className="flex-1 grid grid-cols-[auto_1fr] gap-4 p-4 overflow-hidden">
        {/* Column 1: Tab Navigation */}
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
          </TabsList>

          {/* Column 2: Module Controls */}
          <div className="flex-1 min-w-0">
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
          </div>
        </Tabs>

        {/* Column 3: Master Controls (Gain & Volume) */}
        <div className="flex flex-col gap-6 min-w-[120px] bg-slate-800/30 rounded-lg p-4 border border-slate-700">
          {/* Gain Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-full inline-flex items-center justify-between text-center">
              <h3 className="text-sm font-semibold text-slate-300 mb-1">GAIN</h3>
              <Button
                variant={gain.isActive ? "default" : "outline"}
                size="sm"
                onClick={toggleGain}
              >
                {gain.isActive ? "ON" : "OFF"}
              </Button>
            </div>
            <Knob
              value={gain.value}
              isActive={gain.isActive}
              defaults={gainDefaults}
              onChange={setGain}
              sensitivity={0.4}
              className="w-24"
              gaugePrimaryColor={gainColors.primary}
              gaugeSecondaryColor={gainColors.secondary}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-slate-700" />

          {/* Volume Section */}
          <div className="flex flex-col gap-3 flex-1">
            <div className="inline-flex items-center justify-between text-center">
              <h3 className="text-sm font-semibold text-slate-300 mb-1">VOLUME</h3>
              <Button
                variant={volume.isActive ? "default" : "outline"}
                size="sm"
                onClick={toggleVolume}
              >
                {volume.isActive ? "ON" : "OFF"}
              </Button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <Fader
                value={volume.value}
                isActive={volume.isActive}
                defaults={volumeDefaults}
                onChange={setVolume}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
