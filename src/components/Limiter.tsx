import { useAudioStore } from "@/lib/store";
import { Button } from "./ui/button";
import Knob from "./ui/Knob";

export default function Limiter() {
  const limiter = useAudioStore((state) => state.limiter);
  const toggleLimiter = useAudioStore((state) => state.toggleLimiter);
  const updateLimiter = useAudioStore((state) => state.updateLimiter);

  return (
    <div className="h-full flex flex-col gap-4 p-4 bg-slate-800/20 rounded-lg border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Limiter</h2>
        <Button 
          variant={limiter.isActive ? "default" : "outline"}
          size="sm"
          onClick={toggleLimiter}
        >
          {limiter.isActive ? "ON" : "OFF"}
        </Button>
      </div>

      {/* Info */}
        <div className="flex flex-col items-center justify-center gap-4 p-4 bg-slate-800/40 rounded-lg border border-slate-600/50">
          <Knob
            value={limiter.threshold}
            isActive={limiter.isActive}
            defaults={limiterDefaults.threshold}
            onChange={(value: number) => updateLimiter("threshold", value)}
            sensitivity={1}
          />
        </div>
    </div>
  );
}
