import { useAudioStore } from "@/lib/store";
import { gateDefaults } from "@/lib/audioState";
import Knob from "./ui/Knob";
import Power from "./Power";
import { cn } from "@/lib/utils";

export default function Gate() {
  const gate = useAudioStore((state) => state.gate);
  const updateGate = useAudioStore((state) => state.updateGate);
  const toggleGate = useAudioStore((state) => state.toggleGate);

  return (
    <div className="flex flex-col gap-4 p-4 bg-slate-800/20 rounded-lg border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Noise Gate</h2>
        <button
          onClick={toggleGate}
          className={cn(!gate.isActive && "opacity-40")}
        >
          <Power />
        </button>
      </div>

      {/* Gate Controls */}
      <div
        className={cn(
          "flex-1 ",
          !gate.isActive && "opacity-40 pointer-events-none"
        )}
      >
        {/* Threshold */}
        <div className="flex items-center justify-center gap-4 p-4 bg-slate-800/40 rounded-lg border border-slate-600/50">
          <Knob
            value={gate.threshold}
            isActive={gate.isActive}
            defaults={gateDefaults.threshold}
            onChange={(value: number) => updateGate("threshold", value)}
            sensitivity={0.5}
          />

          {/* Smoothing */}
          <Knob
            value={gate.smoothing}
            isActive={gate.isActive}
            defaults={gateDefaults.smoothing}
            onChange={(value: number) => updateGate("smoothing", value)}
            sensitivity={0.1}
          />
        </div>
      </div>
    </div>
  );
}
