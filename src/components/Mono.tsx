import { useAudioStore } from "@/lib/store";
import Power from "./Power";
import { cn } from "@/lib/utils";

export default function Mono() {
  const mono = useAudioStore((state) => state.mono);
  const toggleMono = useAudioStore((state) => state.toggleMono);

  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-slate-300 mb-1">MONO</h3>
      <button
        onClick={toggleMono}
        className={cn(!mono.isActive && "opacity-40")}
      >
        <Power />
      </button>
    </div>
  );
}
