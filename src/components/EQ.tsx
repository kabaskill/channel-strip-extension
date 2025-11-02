import { useAudioStore } from "@/lib/store";
import { eqDefaults } from "@/lib/audioState";
import Knob from "./ui/Knob";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function EQ() {
  const eq = useAudioStore((state) => state.eq);
  const updateEQ = useAudioStore((state) => state.updateEQ);
  const toggleEQ = useAudioStore((state) => state.toggleEQ);

  return (
    <div className="h-full flex flex-col gap-4">
      <Button variant={"outline"} onClick={toggleEQ}>
        {eq.isActive ? "Disable" : "Enable"} EQ
      </Button>

      <div
        className={cn(
          "flex-1 grid grid-cols-3 gap-8 p-4",
          eq.isActive ? "opacity-100" : "opacity-50"
        )}
      >
        {/* Low Band */}
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-semibold">Low</h3>
          <Knob
            value={eq.low}
            isActive={eq.isActive}
            defaults={eqDefaults.low}
            onChange={(value: number) => updateEQ("low", value)}
            sensitivity={1}
          />
          <div className="text-sm text-center">
            <div className="font-medium">Frequency</div>
            <Knob
              value={eq.lowFreq}
              isActive={eq.isActive}
              defaults={eqDefaults.lowFreq}
              onChange={(value: number) => updateEQ("lowFreq", value)}
              sensitivity={10}
              className="w-16 h-16"
            />
          </div>
        </div>

        {/* Mid Band */}
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-semibold">Mid</h3>
          <Knob
            value={eq.mid}
            isActive={eq.isActive}
            defaults={eqDefaults.mid}
            onChange={(value: number) => updateEQ("mid", value)}
            sensitivity={1}
          />
          <div className="text-sm text-center">
            <div className="font-medium">Frequency</div>
            <Knob
              value={eq.midFreq}
              isActive={eq.isActive}
              defaults={eqDefaults.midFreq}
              onChange={(value: number) => updateEQ("midFreq", value)}
              sensitivity={100}
              className="w-16 h-16"
            />
          </div>
        </div>

        {/* High Band */}
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-semibold">High</h3>
          <Knob
            value={eq.high}
            isActive={eq.isActive}
            defaults={eqDefaults.high}
            onChange={(value: number) => updateEQ("high", value)}
            sensitivity={1}
          />
          <div className="text-sm text-center">
            <div className="font-medium">Frequency</div>
            <Knob
              value={eq.highFreq}
              isActive={eq.isActive}
              defaults={eqDefaults.highFreq}
              onChange={(value: number) => updateEQ("highFreq", value)}
              sensitivity={500}
              className="w-16 h-16"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
