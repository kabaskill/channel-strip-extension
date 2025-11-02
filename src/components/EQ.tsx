import { useAudioStore } from "@/lib/store";
import { eqDefaults } from "@/lib/audioState";
import Knob from "./ui/Knob";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function EQ() {
  const eq = useAudioStore((state) => state.eq);
  const updateEQ = useAudioStore((state) => state.updateEQ);
  const toggleEQ = useAudioStore((state) => state.toggleEQ);

  return (
    <div className="h-full flex flex-col gap-4 p-4 bg-slate-800/20 rounded-lg border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">3-Band Equalizer</h2>
        <Button 
          variant={eq.isActive ? "default" : "outline"}
          size="sm"
          onClick={toggleEQ}
        >
          {eq.isActive ? "ON" : "OFF"}
        </Button>
      </div>

      {/* EQ Bands Grid */}
      <div
        className={cn(
          "flex-1 grid grid-cols-3 gap-4",
          !eq.isActive && "opacity-40 pointer-events-none"
        )}
      >
        {/* Low Band */}
        <div className="flex flex-col items-center justify-center gap-4 p-4 bg-slate-800/40 rounded-lg border border-slate-600/50">
          <Knob
            value={eq.low}
            isActive={eq.isActive}
            defaults={eqDefaults.low}
            onChange={(value: number) => updateEQ("low", value)}
            sensitivity={1}
          />
          <div className="text-xs text-center mt-2">
            <Knob
              value={eq.lowFreq}
              isActive={eq.isActive}
              defaults={eqDefaults.lowFreq}
              onChange={(value: number) => updateEQ("lowFreq", value)}
              sensitivity={10}
            />
          </div>
        </div>

        {/* Mid Band */}
        <div className="flex flex-col items-center justify-center gap-4 p-4 bg-slate-800/40 rounded-lg border border-slate-600/50">
          <Knob
            value={eq.mid}
            isActive={eq.isActive}
            defaults={eqDefaults.mid}
            onChange={(value: number) => updateEQ("mid", value)}
            sensitivity={1}
          />
          <div className="text-xs text-center mt-2">
            <Knob
              value={eq.midFreq}
              isActive={eq.isActive}
              defaults={eqDefaults.midFreq}
              onChange={(value: number) => updateEQ("midFreq", value)}
              sensitivity={100}
            />
          </div>
        </div>

        {/* High Band */}
        <div className="flex flex-col items-center justify-center gap-4 p-4 bg-slate-800/40 rounded-lg border border-slate-600/50">
          <Knob
            value={eq.high}
            isActive={eq.isActive}
            defaults={eqDefaults.high}
            onChange={(value: number) => updateEQ("high", value)}
            sensitivity={1}
          />
          <div className="text-xs text-center mt-2">
            <Knob
              value={eq.highFreq}
              isActive={eq.isActive}
              defaults={eqDefaults.highFreq}
              onChange={(value: number) => updateEQ("highFreq", value)}
              sensitivity={500}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

