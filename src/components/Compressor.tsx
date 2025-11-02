import { useAudioStore } from "@/lib/store";
import { compressorDefaults } from "@/lib/audioState";
import Knob from "./ui/Knob";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function Compressor() {
  const compressor = useAudioStore((state) => state.compressor);
  const updateCompressor = useAudioStore((state) => state.updateCompressor);
  const toggleCompressor = useAudioStore((state) => state.toggleCompressor);

  return (
    <div className="h-full flex flex-col gap-4 p-4 bg-slate-800/20 rounded-lg border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Dynamic Compressor</h2>
        <Button 
          variant={compressor.isActive ? "default" : "outline"}
          size="sm"
          onClick={toggleCompressor}
        >
          {compressor.isActive ? "ON" : "OFF"}
        </Button>
      </div>

      {/* Compressor Controls */}
      <div
        className={cn(
          "flex-1 grid grid-cols-[auto_1fr_auto] gap-6",
          !compressor.isActive && "opacity-40 pointer-events-none"
        )}
      >
        {/* Threshold (Left) */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-800/40 rounded-lg border border-slate-600/50">
          <Knob
            value={compressor.threshold}
            isActive={compressor.isActive}
            defaults={compressorDefaults.threshold}
            onChange={(value: number) => updateCompressor("threshold", value)}
            sensitivity={10}
            className="w-32 h-32"
          />
        </div>

        {/* Main Controls (Center) */}
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          <div className="flex flex-col items-center justify-center p-3 bg-slate-800/40 rounded-lg border border-slate-600/50">
            <Knob
              value={compressor.knee}
              isActive={compressor.isActive}
              defaults={compressorDefaults.knee}
              onChange={(value: number) => updateCompressor("knee", value)}
              sensitivity={1}
            />
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-slate-800/40 rounded-lg border border-slate-600/50">
            <Knob
              value={compressor.ratio}
              isActive={compressor.isActive}
              defaults={compressorDefaults.ratio}
              onChange={(value: number) => updateCompressor("ratio", value)}
              sensitivity={1}
            />
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-slate-800/40 rounded-lg border border-slate-600/50">
            <Knob
              value={compressor.attack}
              isActive={compressor.isActive}
              defaults={compressorDefaults.attack}
              onChange={(value: number) => updateCompressor("attack", value)}
              sensitivity={1000}
            />
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-slate-800/40 rounded-lg border border-slate-600/50">
            <Knob
              value={compressor.release}
              isActive={compressor.isActive}
              defaults={compressorDefaults.release}
              onChange={(value: number) => updateCompressor("release", value)}
              sensitivity={1000}
            />
          </div>
        </div>

        {/* Gain Reduction Meter (Right) */}
        <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-800/60 to-slate-800/40 rounded-lg border border-slate-600/50 min-w-[100px]">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">
                {compressor.reduction}
              </div>
              <div className="text-xs text-slate-400 mt-1">dB</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
