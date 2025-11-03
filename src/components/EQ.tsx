import { useAudioStore } from "@/lib/store";
import { eqDefaults } from "@/lib/audioState";
import Knob from "./ui/Knob";
import Power from "./Power";
import { cn } from "@/lib/utils";

export default function EQ() {
  const eq = useAudioStore((state) => state.eq);
  const updateEQ = useAudioStore((state) => state.updateEQ);
  const toggleEQ = useAudioStore((state) => state.toggleEQ);

  return (
    <div className="flex flex-col gap-4 p-4 bg-slate-800/20 rounded-lg border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">3-Band Equalizer</h2>
        <button
          onClick={toggleEQ}
          className={cn(!eq.isActive && "opacity-40")}
        >
          <Power />
        </button>
      </div>

      {/* EQ Bands Grid */}
      <div
        className={cn(
          "flex-1 ",
          !eq.isActive && "opacity-40 pointer-events-none"
        )}
      >
        {/* Low Band */}
        <div className="w-full grid grid-cols-2 gap-4 p-4 place-items-center bg-slate-800/40 rounded-lg border border-slate-600/50">
          <Knob
            value={eq.low}
            isActive={eq.isActive}
            defaults={eqDefaults.low}
            onChange={(value: number) => updateEQ("low", value)}
            sensitivity={0.3}
          />
          <Knob
            value={eq.lowFreq}
            isActive={eq.isActive}
            defaults={eqDefaults.lowFreq}
            onChange={(value: number) => updateEQ("lowFreq", value)}
            sensitivity={0.5}
          />

          {/* Mid Band */}
          <Knob
            value={eq.mid}
            isActive={eq.isActive}
            defaults={eqDefaults.mid}
            onChange={(value: number) => updateEQ("mid", value)}
            sensitivity={0.3}
          />
          <Knob
            value={eq.midFreq}
            isActive={eq.isActive}
            defaults={eqDefaults.midFreq}
            onChange={(value: number) => updateEQ("midFreq", value)}
            sensitivity={0.5}
          />

          {/* High Band */}
          <Knob
            value={eq.high}
            isActive={eq.isActive}
            defaults={eqDefaults.high}
            onChange={(value: number) => updateEQ("high", value)}
            sensitivity={0.3}
          />
          <Knob
            value={eq.highFreq}
            isActive={eq.isActive}
            defaults={eqDefaults.highFreq}
            onChange={(value: number) => updateEQ("highFreq", value)}
            sensitivity={0.5}
          />
        </div>
      </div>
    </div>
  );
}

