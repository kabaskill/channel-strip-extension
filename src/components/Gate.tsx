import { useAudioStore } from "@/lib/store";
import { gateDefaults } from "@/lib/audioState";
import Knob from "./ui/Knob";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function Gate() {
  const gate = useAudioStore((state) => state.gate);
  const updateGate = useAudioStore((state) => state.updateGate);
  const toggleGate = useAudioStore((state) => state.toggleGate);

  return (
    <div className="h-full flex flex-col gap-4 p-4 bg-slate-800/20 rounded-lg border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Noise Gate</h2>
        <Button 
          variant={gate.isActive ? "default" : "outline"}
          size="sm"
          onClick={toggleGate}
        >
          {gate.isActive ? "ON" : "OFF"}
        </Button>
      </div>

      {/* Gate Controls */}
      <div
        className={cn(
          "flex-1 grid grid-cols-2 gap-4",
          !gate.isActive && "opacity-40 pointer-events-none"
        )}
      >
        {/* Threshold */}
        <div className="flex flex-col items-center justify-center gap-4 p-4 bg-slate-800/40 rounded-lg border border-slate-600/50">
          <Knob
            value={gate.threshold}
            isActive={gate.isActive}
            defaults={gateDefaults.threshold}
            onChange={(value: number) => updateGate("threshold", value)}
            sensitivity={10}
            className="w-24 h-24"
            gaugePrimaryColor="#8b5cf6"
            gaugeSecondaryColor="#1e293b"
          />
        </div>

        {/* Smoothing */}
        <div className="flex flex-col items-center justify-center gap-4 p-4 bg-slate-800/40 rounded-lg border border-slate-600/50">
          <Knob
            value={gate.smoothing}
            isActive={gate.isActive}
            defaults={gateDefaults.smoothing}
            onChange={(value: number) => updateGate("smoothing", value)}
            sensitivity={0.1}
            className="w-24 h-24"
            gaugePrimaryColor="#8b5cf6"
            gaugeSecondaryColor="#1e293b"
          />
        </div>
      </div>
    </div>
  );
}
