import { useAudioStore } from "@/lib/store";
import { pitchShiftDefaults } from "@/lib/audioState";
import Knob from "./ui/Knob";
import Power from "./Power";
import { cn } from "@/lib/utils";

export default function PitchShift() {
  const pitchShift = useAudioStore((state) => state.pitchShift);
  const updatePitchShift = useAudioStore((state) => state.updatePitchShift);
  const togglePitchShift = useAudioStore((state) => state.togglePitchShift);

  return (
    <div className="flex flex-col gap-4 p-4 bg-slate-800/20 rounded-lg border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Pitch Shift</h2>
        <button
          onClick={togglePitchShift}
          className={cn(!pitchShift.isActive && "opacity-40")}
        >
          <Power />
        </button>
      </div>

      {/* Pitch Shift Controls */}
      <div
        className={cn(
          "flex-1",
          !pitchShift.isActive && "opacity-40 pointer-events-none"
        )}
      >
        {/* Pitch */}
        <div className="flex items-center justify-center p-4 bg-slate-800/40 rounded-lg border border-slate-600/50">
          <Knob
            value={pitchShift.pitch}
            isActive={pitchShift.isActive}
            defaults={pitchShiftDefaults.pitch}
            onChange={(value: number) => updatePitchShift("pitch", value)}
            sensitivity={0.3}
          />
        </div>
      </div>
    </div>
  );
}
