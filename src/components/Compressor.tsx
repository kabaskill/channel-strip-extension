import { audioActions, compressorDefaults, compressorState } from "@/lib/audioState";
import { cn } from "@/lib/utils";
import Knob from "./ui/Knob";
import { useSignals } from "@preact/signals-react/runtime";
import Fader from "./Fader";

export default function Compressor() {
  useSignals();
  return (
    <>
      <button
        type="button"
        className={cn(
          "px-4 py-2 rounded-md",
          "bg-white text-black border-2 border-gray-300",
          "font-medium text-sm",
          "transition-colors duration-200",
          "hover:bg-gray-50 active:bg-gray-100",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        )}
        onClick={() => audioActions.toggleModule("compressor")}
      >
        Comp Enable
      </button>

      <div className="grid grid-cols-[1fr_3fr_1fr] bg-orange-400">
        <div>
          <Knob
            value={compressorState.value.threshold}
            isActive={compressorState.value.isActive}
            defaults={compressorDefaults.threshold}
            onChange={(value: number) => audioActions.updateCompressor("threshold", value)}
            gaugePrimaryColor="green"
            gaugeSecondaryColor="gray"
            sensitivity={10}
          />
        </div>

        <div className="grid grid-cols-2 grid-rows-2">
          <Knob
            value={compressorState.value.knee}
            isActive={compressorState.value.isActive}
            defaults={compressorDefaults.knee}
            onChange={(value: number) => audioActions.updateCompressor("knee", value)}
            gaugePrimaryColor="green"
            gaugeSecondaryColor="gray"
            sensitivity={1}
          />
          <Knob
            value={compressorState.value.ratio}
            isActive={compressorState.value.isActive}
            defaults={compressorDefaults.ratio}
            onChange={(value: number) => audioActions.updateCompressor("ratio", value)}
            gaugePrimaryColor="green"
            gaugeSecondaryColor="gray"
            sensitivity={1}
          />
          <Knob
            value={compressorState.value.attack}
            isActive={compressorState.value.isActive}
            defaults={compressorDefaults.attack}
            onChange={(value: number) => audioActions.updateCompressor("attack", value)}
            gaugePrimaryColor="green"
            gaugeSecondaryColor="gray"
            sensitivity={1}
          />
          <Knob
            value={compressorState.value.release}
            isActive={compressorState.value.isActive}
            defaults={compressorDefaults.release}
            onChange={(value: number) => audioActions.updateCompressor("release", value)}
            gaugePrimaryColor="green"
            gaugeSecondaryColor="gray"
            sensitivity={1}
          />
        </div>

        <div className="bg-white text-black text-center">
          {compressorDefaults.reduction.label} <br />
          {compressorState.value.reduction}dB
        </div>
      </div>
    </>
  );
}
