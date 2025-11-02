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
  sensitivity = 0.4,
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
  
  // Calculate rotation angle for the indicator (270 degrees total arc, starting at -135)
  // const indicatorAngle = -135 + (currentPercent / 100) * 270;

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
      const deltaY = (startY - currentY) * sensitivity;
      const deltaX = (startX - currentX) * -sensitivity;
      const positiveMovement = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
      const valueRange = max - min;
      // const newValue = Math.min(Math.max(startValue + (deltaY / 100) * valueRange, min), max);
      const newValue = Math.min(
        Math.max(startValue + Math.round(positiveMovement / valueRange) * step, min),
        max
      );

      onChange?.(Math.round(newValue));
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

        {/* Rotating indicator dot group */}
        {/* 
        <g 
          transform={`rotate(${indicatorAngle} 50 50)`}
          className="transition-transform duration-500"
        >
          <circle
            cx="50"
            cy="5"
            r="3"
            fill={isActive ? gaugePrimaryColor : gaugeSecondaryColor}
            className="transition-colors duration-200"
            style={{
              filter: isDragging ? "brightness(1.5)" : "brightness(1)",
            }}
          />
        </g>
        */}
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
          {value}{prefix}
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
