import { useSignals } from "@preact/signals-react/runtime";
import { volumeState, gainState, audioActions, volumeDefaults, gainDefaults } from "@/lib/audioState"; //prettier-ignore
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Fader from "@/components/Fader";
import Knob from "./components/ui/Knob";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import Compressor from "./components/Compressor";

export default function App() {
  useSignals();
  useEffect(() => {
    audioActions.initializeFromStorage();
  }, []);

  return (
    <div className="w-[800px] h-[500px] text-white">
      <div className="size-full bg-slate-800 flex gap-4 p-2">
        <h1 className="text-xl font-bold ">Channel Strip</h1>
        <Tabs defaultValue="pre-eq" className="w-5/6 bg-green-400">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pre-eq">Pre EQ</TabsTrigger>
            <TabsTrigger value="compressor">Compressor</TabsTrigger>
            <TabsTrigger value="post-eq">Post EQ</TabsTrigger>
          </TabsList>

          <TabsContent className=" flex justify-center items-center" value="pre-eq">
            Pre EQ
          </TabsContent>

          <TabsContent className="" value="compressor">
            <Compressor />
          </TabsContent>

          <TabsContent className=" flex justify-center items-center" value="post-eq">
            Post EQ
          </TabsContent>
        </Tabs>

        <div className="w-1/6 flex flex-col justify-between">
          <Knob
            value={gainState.value.value}
            isActive={gainState.value.isActive}
            defaults={gainDefaults}
            onChange={(value: number) => audioActions.setGain(value)}
            gaugePrimaryColor="green"
            gaugeSecondaryColor="gray"
            sensitivity={0.4}
            className="w-full"
          />
          <div className="flex flex-col gap-2  bg-red-600">
            <button
              type="button"
              className={cn(
                "px-4 py-2 rounded-md",
                "bg-white text-black border-2 border-gray-300",
                "font-medium text-sm",
                "transition-colors duration-200",
                "hover:bg-gray-50 active:bg-gray-100",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              )}
              onClick={() => audioActions.toggleModule("volume")}
            >
              Vol Enable
            </button>

            <Fader
              value={volumeState.value.value}
              isActive={volumeState.value.isActive}
              defaults={volumeDefaults}
              onChange={(value: number) => audioActions.setVolume(value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
