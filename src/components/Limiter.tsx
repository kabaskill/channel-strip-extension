import { useAudioStore } from "@/lib/store";
import { Button } from "./ui/button";

export default function Limiter() {
  const limiter = useAudioStore((state) => state.limiter);
  const toggleLimiter = useAudioStore((state) => state.toggleLimiter);

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
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-slate-400">
          <p className="text-sm">Threshold: {limiter.threshold}dB</p>
          <p className="text-xs mt-2">
            (Threshold is set at initialization)
          </p>
        </div>
      </div>
    </div>
  );
}
