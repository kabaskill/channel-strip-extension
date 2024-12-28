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
  gaugePrimaryColor: string;
  gaugeSecondaryColor: string;
  className?: string;
  onChange?: (newValue: number) => void;
  sensitivity?: number;
}

export default function Knob({
  defaults,
  value,
  gaugePrimaryColor,
  gaugeSecondaryColor,
  className,
  onChange,
  sensitivity = 0.4,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
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
      setIsDragging(true);
      setStartY("touches" in e ? e.touches[0].clientY : e.clientY);
      setStartValue(value);
      document.body.style.cursor = "ns-resize";
    },
    [value]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      const currentY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const deltaY = (startY - currentY) * sensitivity;
      const valueRange = max - min;
      // const newValue = Math.min(Math.max(startValue + (deltaY / 100) * valueRange, min), max);
      const newValue = Math.min(
        Math.max(startValue + Math.round(deltaY / valueRange) * step, min),
        max
      );

      onChange?.(Math.round(newValue));
      e.preventDefault();
    },
    [isDragging, startY, startValue, min, max, step, onChange, sensitivity]
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
        "relative font-semibold transition-transform duration-150",
        isHovered && !isDragging && "scale-105",
        isDragging && "scale-110",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      style={{
        transform: "translateZ(0)",
        cursor: isDragging ? "ns-resize" : "grab",
      }}
    >
      <svg fill="none" className={cn("size-full -rotate-[135deg]")} viewBox="0 0 100 100">
        {/* Background Track */}
        <path
          d="M50 5 A 45 45 0 1 1 50 95 A 45 45 0 0 1 50 5"
          strokeWidth="10"
          strokeLinecap="round"
          className={cn(
            "opacity-80",
            !isDragging && "transition-all duration-200",
            isHovered && "opacity-100"
          )}
          style={{
            stroke: gaugeSecondaryColor,
            strokeDasharray: `${arcLength} ${circumference}`,
            // strokeDashoffset: arcLength / 4,
          }}
        />

        {/* Progress Track */}
        <path
          d="M50 5 A 45 45 0 1 1 50 95 A 45 45 0 0 1 50 5"
          strokeWidth="10"
          strokeLinecap="round"
          className={cn(!isDragging && "transition-all duration-200")}
          style={{
            stroke: gaugePrimaryColor,
            strokeDasharray: `${progressLength} ${circumference}`,
            // strokeDashoffset: arcLength / 4,
          }}
        />
      </svg>

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center select-none",
          "rounded-full transition-all duration-200",
          isHovered && !isDragging && "bg-white/5",
          isDragging && "bg-white/10"
        )}
      >
        <span className="text-xl">
          {value} {prefix}
        </span>
        <span className="text-base absolute bottom-0">{label}</span>
      </div>
    </div>
  );
}
