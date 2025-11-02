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
          />
        </div>

        {/* Window Size */}
        <div className="flex flex-col items-center justify-center gap-4 p-4 bg-slate-800/40 rounded-lg border border-slate-600/50">
          <Knob
            value={pitchshift.windowsize}
            isactive={pitchshift.isactive}
            defaults={pitchshiftdefaults.windowsize}
            onchange={(value: number) => updatepitchshift("windowsize", value)}
            sensitivity={0.01}
          />
        </div>
      </div>
    </div>
  );
}
