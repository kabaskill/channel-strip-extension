import { useCallback, useEffect, useState } from "react";
export default function Animated({
  max = 100,
  min = 0,
  value,
  className = "",

  strokeWidth = 7,
  onChange,
  sensitivity = 0.4,
  onClickRing,
}: {
  max?: number;
  value: number;
  min?: number;
  className?: string;
  children?: React.ReactNode;
  strokeWidth?: number;
  size?: number;
  onChange?: (newValue: number) => void;
  sensitivity?: number;
  onClickRing?: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(value);

  const circumference = 2 * Math.PI * 45;
  const percentPx = circumference / 100;
  const currentPercent = Math.round(((value - min) / (max - min)) * 100);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      setIsDragging(true);
      setStartY("touches" in e ? e.touches[0].clientY : e.clientY);
      setStartValue(value);
      document.body.style.cursor = "none";
    },
    [value]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      const currentY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const deltaY = (startY - currentY) * sensitivity;
      const valueRange = max - min;
      const newValue = Math.min(Math.max(startValue + (deltaY / 100) * valueRange, min), max);

      onChange?.(Math.round(newValue));

      e.preventDefault();
    },
    [isDragging, startY, startValue, max, min, sensitivity, onChange]
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
      className={`relative z-10 size-32 text-2xl font-semibold ${className}`}
      style={{
        transform: "translateZ(0)",
      }}
    >
      <svg
        fill="none"
        className="size-full transition-transform duration-200 ease-in-out"
        strokeWidth="2"
        viewBox="0 0 100 100"
      >
        {currentPercent <= 90 && currentPercent >= 0 && (
          <circle
            onClick={onClickRing}
            cx="50"
            cy="50"
            r="45"
            strokeWidth="10"
            strokeDashoffset="0"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="cursor-pointer opacity-100 hover:stroke-[10]"
            style={{
              strokeDasharray: `${(90 - currentPercent) * percentPx}px ${circumference}px`,
              transform: "rotate(270deg) scaleY(-1)",
              transformOrigin: "50% 50%",
            }}
          />
        )}
        <circle
          onClick={onClickRing}
          cx="50"
          cy="50"
          r="45"
          strokeWidth={strokeWidth}
          strokeDashoffset="0"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="cursor-pointer opacity-100 hover:stroke-[10]"
          style={{
            stroke: "green",
            strokeDasharray: `${currentPercent * percentPx}px ${circumference}px`,
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />
      </svg>
      <span
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        data-current-value={currentPercent}
        className="absolute inset-0 m-auto size-fit scale-95 select-none rounded-full"
        style={{ cursor: isDragging ? "none" : "grab" }}
      >
        <img
          alt="Gabriel Bianchi"
          className="pointer-events-none z-10 size-24 rounded-full p-0 transition-opacity hover:opacity-75"
          src="https://github.com/dbianchii.png"
        />
      </span>

    </div>
  );
}
