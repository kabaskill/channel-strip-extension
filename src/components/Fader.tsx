// components/Fader.jsx
import { cn } from "@/lib/utils";

export interface FaderProps {
  value: number;
  isActive: boolean;
  defaults: {
    min: number;
    max: number;
    step: number;
    label: string;
    prefix?: string;
  };
  onChange?: (newValue: number) => void;
}

export default function Fader({ value, isActive, defaults, onChange }: FaderProps) {
  const { min, max, step, label, prefix } = defaults;

  // Calculate and show 5 ticks on the fader
  const calculateTicks = () => {
    const tickCount = 5;
    const interval = (max - min) / (tickCount - 1);
    return Array.from({ length: tickCount }, (_, i) => {
      const value = min + interval * i;
      return Math.round(value / step) * step;
    });
  };

  const datalistId = `tickmarks-${label.toLowerCase()}`;
  const ticks = calculateTicks();

  return (
    <div
      className={cn(
        "relative flex-1  p-4",
        "bg-white rounded-lg shadow-sm",
        "flex flex-col items-center gap-4",
        !isActive && "opacity-50",
        
      )}
    >
      <label className="font-medium text-gray-900 text-sm">{label}</label>

      <span className="text-lg font-semibold text-gray-900">
        {value}
        {prefix}
      </span>

   
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange && onChange(Number(e.target.value))}
          className={cn("rounded-full w-full", "bg-gray-200", isActive && "cursor-pointer")}
          list={datalistId}
          disabled={!isActive}
        />
  

      <datalist id={datalistId}>
        {ticks.map((tickValue) => (
          <option key={tickValue} value={tickValue} />
        ))}
      </datalist>
    </div>
  );
}
