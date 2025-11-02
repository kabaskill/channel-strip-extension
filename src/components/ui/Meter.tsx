import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface MeterProps {
  getValue: () => number; // Function that returns dB value
  label?: string;
  className?: string;
  orientation?: "vertical" | "horizontal";
}

export default function Meter({ 
  getValue, 
  label, 
  className,
  orientation = "vertical" 
}: MeterProps) {
  const [dbValue, setDbValue] = useState(-60);
  const [peakValue, setPeakValue] = useState(-60);

  useEffect(() => {
    let animationFrameId: number;
    let peakHoldTimeout: NodeJS.Timeout;

    const updateMeter = () => {
      const currentDb = getValue();
      setDbValue(currentDb);

      // Update peak if current value is higher
      if (currentDb > peakValue) {
        setPeakValue(currentDb);
        clearTimeout(peakHoldTimeout);
        peakHoldTimeout = setTimeout(() => {
          setPeakValue(-60);
        }, 1500);
      }

      animationFrameId = requestAnimationFrame(updateMeter);
    };

    updateMeter();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(peakHoldTimeout);
    };
  }, [getValue, peakValue]);

  // Convert dB to percentage (range: -60dB to 0dB)
  const dbToPercent = (db: number) => {
    const min = -60;
    const max = 0;
    return Math.max(0, Math.min(100, ((db - min) / (max - min)) * 100));
  };

  const percent = dbToPercent(dbValue);
  const peakPercent = dbToPercent(peakValue);

  // Color based on level
  const getColor = (value: number) => {
    if (value > -3) return "bg-red-500";
    if (value > -12) return "bg-yellow-500";
    return "bg-green-500";
  };

  const meterColor = getColor(dbValue);
  const peakColor = getColor(peakValue);

  if (orientation === "horizontal") {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {label && (
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {label}
          </div>
        )}
        <div className="relative h-6 bg-slate-800 rounded-sm overflow-hidden border border-slate-700">
          {/* Background segments */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 border-r border-slate-700/30"
              />
            ))}
          </div>
          
          {/* Level bar */}
          <div
            className={cn(
              "absolute inset-y-0 left-0 transition-all duration-75",
              meterColor
            )}
            style={{ width: `${percent}%` }}
          />
          
          {/* Peak indicator */}
          {peakValue > -60 && (
            <div
              className={cn(
                "absolute inset-y-0 w-1 transition-all duration-100",
                peakColor
              )}
              style={{ left: `${peakPercent}%` }}
            />
          )}
        </div>
        
        {/* dB value */}
        <div className="text-[10px] text-slate-400 text-center font-mono">
          {dbValue > -60 ? `${dbValue.toFixed(1)} dB` : "-∞ dB"}
        </div>
      </div>
    );
  }

  // Vertical orientation
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {label && (
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </div>
      )}
      
      <div className="relative w-8 h-full min-h-[200px] bg-slate-800 rounded-sm overflow-hidden border border-slate-700">
        {/* Background segments */}
        <div className="absolute inset-0 flex flex-col">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 border-b border-slate-700/30"
            />
          ))}
        </div>
        
        {/* Level bar (fills from bottom) */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 transition-all duration-75",
            meterColor
          )}
          style={{ height: `${percent}%` }}
        />
        
        {/* Peak indicator */}
        {peakValue > -60 && (
          <div
            className={cn(
              "absolute inset-x-0 h-1 transition-all duration-100",
              peakColor
            )}
            style={{ bottom: `${peakPercent}%` }}
          />
        )}
      </div>
      
      {/* dB value */}
      <div className="text-[10px] text-slate-400 font-mono text-center w-full">
        {dbValue > -60 ? `${dbValue.toFixed(1)}` : "-∞"}
      </div>
    </div>
  );
}
