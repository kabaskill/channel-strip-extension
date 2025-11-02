import { useAudioStore } from "@/lib/store";
import { volumeDefaults, gainDefaults } from "@/lib/audioState";
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

  return (
    <div className="w-[800px] h-[500px]  bg-slate-400 text-foreground dark">
      <div className="size-full  flex gap-4 p-2">
        <Tabs defaultValue="eq" className=" w-5/6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="eq">EQ</TabsTrigger>
            <TabsTrigger value="compressor">Compressor</TabsTrigger>
          </TabsList>

          <TabsContent className=" flex justify-center items-center" value="eq">
            <EQ />
          </TabsContent>

          <TabsContent className="" value="compressor">
            <Compressor />
          </TabsContent>
        </Tabs>

        <div className="w-1/6 flex flex-col justify-between ">
          <h1 className="text-xl font-bold text-center">
            Channel <br />
            Strip
          </h1>
          <div className="flex flex-col gap-2 ">
            <Button
              variant={"outline"}
              className="dark"
              onClick={toggleGain}
            >
              Gain {gain.isActive ? "On" : "Off"}
            </Button>

            <Knob
              value={gain.value}
              isActive={gain.isActive}
              defaults={gainDefaults}
              onChange={setGain}
              sensitivity={0.4}
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2 ">
            <Button
              variant={"outline"}
              className="dark"
              onClick={toggleVolume}
            >
              Vol {volume.isActive ? "On" : "Off"}
            </Button>

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
  );
}
