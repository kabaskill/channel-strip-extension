import { useAudioStore } from "@/lib/store";
import { compressorDefaults } from "@/lib/audioState";
import Knob from "./ui/Knob";
import Power from "./Power";
import { cn } from "@/lib/utils";

export default function Compressor() {
  const compressor = useAudioStore((state) => state.compressor);
  const updateCompressor = useAudioStore((state) => state.updateCompressor);
  const toggleCompressor = useAudioStore((state) => state.toggleCompressor);

  return (
    <div className="flex flex-col gap-4 p-4 bg-slate-800/20 rounded-lg border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Dynamic Compressor</h2>
        <button
          onClick={toggleCompressor}
          className={cn(!compressor.isActive && "opacity-40")}
        >
          <Power />
        </button>
      </div>

      {/* Compressor Controls */}
      <div
        className={cn(
          "flex-1 gap-6",
          !compressor.isActive && "opacity-40 pointer-events-none"
        )}
      >
        {/* Threshold (Left) */}
        <div className="grid grid-cols-2 gap-4 p-4 place-items-center bg-slate-800/40 rounded-lg border border-slate-600/50">
          <Knob
            value={compressor.threshold}
            isActive={compressor.isActive}
            defaults={compressorDefaults.threshold}
            onChange={(value: number) => updateCompressor("threshold", value)}
            sensitivity={0.5}
          />
          <Knob
            value={compressor.ratio}
            isActive={compressor.isActive}
            defaults={compressorDefaults.ratio}
            onChange={(value: number) => updateCompressor("ratio", value)}
            sensitivity={0.3}
          />
          <Knob
            value={compressor.attack}
            isActive={compressor.isActive}
            defaults={compressorDefaults.attack}
            onChange={(value: number) => updateCompressor("attack", value)}
            sensitivity={0.5}
          />
          <Knob
            value={compressor.release}
            isActive={compressor.isActive}
            defaults={compressorDefaults.release}
            onChange={(value: number) => updateCompressor("release", value)}
            sensitivity={0.5}
          />
        </div>
      </div>
    </div>
  );
}
