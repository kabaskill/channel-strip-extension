import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

interface Props {
  value: number;
  isActive: boolean;
  defaults: {
    min: number;
    max: number;
    step: number;
    label: string;
    prefix?: string;
  };
  gaugePrimaryColor?: string;
  gaugeSecondaryColor?: string;
  className?: string;
  onChange?: (newValue: number) => void;
  sensitivity?: number;
}

export default function Knob({
  defaults,
  value,
  isActive,
  gaugePrimaryColor = "#8b5cf6", // violet-500
  gaugeSecondaryColor = "#1e293b", // slate-800
  className,
  onChange,
  sensitivity = 1,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startX, setStartX] = useState(0);
  const [startValue, setStartValue] = useState(value);
  const [isHovered, setIsHovered] = useState(false);

  const { min, max, label, prefix, step } = defaults;

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const currentPercent = ((value - min) / (max - min)) * 100;
  const progressLength = (currentPercent / 100) * arcLength;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isActive) return; // Don't allow interaction when disabled

      setIsDragging(true);
      setStartY("touches" in e ? e.touches[0].clientY : e.clientY);
      setStartX("touches" in e ? e.touches[0].clientX : e.clientX);
      setStartValue(value);
      document.body.style.cursor = "ns-resize";
      e.stopPropagation(); // Prevent event bubbling
    },
    [value, isActive]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      const currentY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const deltaY = startY - currentY;
      const deltaX = (startX - currentX) * -1;
      const positiveMovement = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
      const valueRange = max - min;

      // Auto-adjust sensitivity based on range
      // Smaller ranges need less sensitivity, larger ranges need more
      const autoSensitivity = sensitivity * (valueRange / 100);
      
      // Calculate new value based on pixel movement (1 pixel = autoSensitivity units)
      const rawValue = startValue + (positiveMovement * autoSensitivity);

      // Round to nearest step
      const steppedValue = Math.round(rawValue / step) * step;

      // Clamp to min/max and fix floating point precision
      const clampedValue = Math.min(Math.max(steppedValue, min), max);
      const finalValue = parseFloat(clampedValue.toFixed(10));

      onChange?.(finalValue);
      e.preventDefault();
    },
    [isDragging, startX, startY, startValue, min, max, step, onChange, sensitivity]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = "";
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={cn(
        "relative font-semibold transition-all duration-200",
        isHovered && !isDragging && "scale-105",
        isDragging && "scale-110 drop-shadow-lg",
        !isActive && "opacity-40 cursor-not-allowed",
        "size-24",
        className
      )}
      onMouseEnter={() => isActive && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      style={{
        transform: "translateZ(0)",
        cursor: isActive ? (isDragging ? "ns-resize" : "grab") : "not-allowed",
      }}
    >
      <svg fill="none" className={cn("size-full pointer-events-none")} viewBox="0 0 100 100">
        {/* Outer glow when active */}
        {isActive && isHovered && (
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke={gaugePrimaryColor}
            strokeWidth="1"
            opacity="0.2"
            className="transition-opacity duration-200"
          />
        )}

        {/* Background Track - Rotated to start at bottom-left */}
        <g transform="rotate(-135 50 50)">
          <path
            d="M50 5 A 45 45 0 1 1 50 95 A 45 45 0 0 1 50 5"
            strokeWidth="8"
            strokeLinecap="round"
            className={cn(
              "transition-all duration-200",
              isHovered && isActive && "opacity-100"
            )}
            style={{
              stroke: gaugeSecondaryColor,
              strokeDasharray: `${arcLength} ${circumference}`,
              opacity: isActive ? 0.6 : 0.3,
            }}
          />
        </g>

        {/* Progress Track - Rotated to start at bottom-left */}
        <g transform="rotate(-135 50 50)">
          <path
            d="M50 5 A 45 45 0 1 1 50 95 A 45 45 0 0 1 50 5"
            strokeWidth="8"
            strokeLinecap="round"
            className={cn(
              "transition-all duration-200",
              isDragging && "drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
            )}
            style={{
              stroke: gaugePrimaryColor,
              strokeDasharray: `${progressLength} ${circumference}`,
              filter: isActive && isHovered ? "brightness(1.2)" : "brightness(1)",
            }}
          />
        </g>
      </svg>

      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center select-none",
          "transition-all duration-200"
        )}
      >
        <span className={cn(
          "text-lg font-bold",
          isActive ? "text-white" : "text-slate-500"
        )}>
          {step < 1 ? value.toFixed(2) : Math.round(value)}{prefix}
        </span>
        <span className={cn(
          "text-[10px] uppercase tracking-wider mt-1",
          isActive ? "text-slate-400" : "text-slate-600"
        )}>
          {label}
        </span>
      </div>
    </div>
  );
}
