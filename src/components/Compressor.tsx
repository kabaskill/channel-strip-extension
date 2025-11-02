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
    <>
      <Button variant={"outline"} onClick={toggleCompressor}>
        {compressor.isActive ? "Disable" : "Enable"} Compressor
      </Button>

      <div
        className={cn(
          " grid grid-cols-[1fr_3fr_1fr] gap-8 p-2",
          compressor.isActive ? "opacity-100" : "opacity-50"
        )}
      >
        <div>
          <Knob
            value={compressor.threshold}
            isActive={compressor.isActive}
            defaults={compressorDefaults.threshold}
            onChange={(value: number) => updateCompressor("threshold", value)}
            sensitivity={10}
          />
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-8">
          <Knob
            value={compressor.knee}
            isActive={compressor.isActive}
            defaults={compressorDefaults.knee}
            onChange={(value: number) => updateCompressor("knee", value)}
            sensitivity={1}
          />
          <Knob
            value={compressor.ratio}
            isActive={compressor.isActive}
            defaults={compressorDefaults.ratio}
            onChange={(value: number) => updateCompressor("ratio", value)}
            sensitivity={1}
          />
          <Knob
            value={compressor.attack}
            isActive={compressor.isActive}
            defaults={compressorDefaults.attack}
            onChange={(value: number) => updateCompressor("attack", value)}
            sensitivity={1000}
          />
          <Knob
            value={compressor.release}
            isActive={compressor.isActive}
            defaults={compressorDefaults.release}
            onChange={(value: number) => updateCompressor("release", value)}
            sensitivity={1000}
          />
        </div>

        <div className="bg-white text-black text-center">
          {compressorDefaults.reduction.label} <br />
          {compressor.reduction}dB
        </div>
      </div>
    </>
  );
}
