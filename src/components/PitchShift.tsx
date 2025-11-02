import { useAudioStore } from "@/lib/store";
import { pitchShiftDefaults } from "@/lib/audioState";
import Knob from "./ui/Knob";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function PitchShift() {
  const pitchShift = useAudioStore((state) => state.pitchShift);
  const updatePitchShift = useAudioStore((state) => state.updatePitchShift);
  const togglePitchShift = useAudioStore((state) => state.togglePitchShift);

  return (
    <div className="h-full flex flex-col gap-4 p-4 bg-slate-800/20 rounded-lg border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Pitch Shift</h2>
        <Button 
          variant={pitchShift.isActive ? "default" : "outline"}
          size="sm"
          onClick={togglePitchShift}
        >
          {pitchShift.isActive ? "ON" : "OFF"}
        </Button>
      </div>

      {/* Pitch Shift Controls */}
      <div
        className={cn(
          "flex-1 grid grid-cols-2 gap-4",
          !pitchShift.isActive && "opacity-40 pointer-events-none"
        )}
      >
        {/* Pitch */}
        <div className="flex flex-col items-center justify-center gap-4 p-4 bg-slate-800/40 rounded-lg border border-slate-600/50">
          <Knob
            value={pitchShift.pitch}
            isActive={pitchShift.isActive}
            defaults={pitchShiftDefaults.pitch}
            onChange={(value: number) => updatePitchShift("pitch", value)}
            sensitivity={1}
            className="w-24 h-24"
            gaugePrimaryColor="#8b5cf6"
            gaugeSecondaryColor="#1e293b"
          />
        </div>

        {/* Window Size */}
        <div className="flex flex-col items-center justify-center gap-4 p-4 bg-slate-800/40 rounded-lg border border-slate-600/50">
          <Knob
            value={pitchShift.windowSize}
            isActive={pitchShift.isActive}
            defaults={pitchShiftDefaults.windowSize}
            onChange={(value: number) => updatePitchShift("windowSize", value)}
            sensitivity={0.01}
            className="w-24 h-24"
            gaugePrimaryColor="#8b5cf6"
            gaugeSecondaryColor="#1e293b"
          />
        </div>
      </div>
    </div>
  );
}
