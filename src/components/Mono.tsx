import { useAudioStore } from "@/lib/store";
import { Button } from "./ui/button";

export default function Mono() {
  const mono = useAudioStore((state) => state.mono);
  const toggleMono = useAudioStore((state) => state.toggleMono);

  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-slate-300 mb-1">MONO</h3>
      <Button 
        variant={mono.isActive ? "default" : "outline"}
        size="sm"
        onClick={toggleMono}
      >
        {mono.isActive ? "ON" : "OFF"}
      </Button>
    </div>
  );
}
