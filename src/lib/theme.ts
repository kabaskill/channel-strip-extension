// Audio equipment inspired color theme
export const audioTheme = {
  // Primary accent - Warm blue/cyan (like VU meters)
  primary: {
    main: "#3b82f6",      // blue-500
    light: "#60a5fa",     // blue-400
    dark: "#2563eb",      // blue-600
    glow: "rgba(59, 130, 246, 0.5)",
  },
  
  // Secondary accent - Amber/Orange (like warm audio gear LEDs)
  secondary: {
    main: "#f59e0b",      // amber-500
    light: "#fbbf24",     // amber-400
    dark: "#d97706",      // amber-600
  },
  
  // EQ specific colors
  eq: {
    low: "#ef4444",       // red-500 - Low frequencies
    mid: "#10b981",       // emerald-500 - Mid frequencies  
    high: "#3b82f6",      // blue-500 - High frequencies
  },
  
  // Compressor colors
  compressor: {
    active: "#8b5cf6",    // violet-500
    reduction: "#ef4444", // red-500 - Gain reduction
  },
  
  // Background layers
  background: {
    primary: "#0f172a",   // slate-900
    secondary: "#1e293b", // slate-800
    tertiary: "#334155",  // slate-700
    panel: "rgba(30, 41, 59, 0.5)", // slate-800 with alpha
  },
  
  // Text colors
  text: {
    primary: "#f1f5f9",   // slate-100
    secondary: "#cbd5e1", // slate-300
    muted: "#64748b",     // slate-500
    disabled: "#475569",  // slate-600
  },
  
  // Border colors
  border: {
    default: "#334155",   // slate-700
    active: "#475569",    // slate-600
    focus: "#3b82f6",     // blue-500
  },
  
  // Status colors
  status: {
    on: "#10b981",        // emerald-500
    off: "#64748b",       // slate-500
    warning: "#f59e0b",   // amber-500
    error: "#ef4444",     // red-500
  },
};

// Helper to get knob colors based on module type
export function getKnobColors(module: "eq-low" | "eq-mid" | "eq-high" | "compressor" | "gain" | "default") {
  switch (module) {
    case "eq-low":
      return {
        primary: audioTheme.eq.low,
        secondary: audioTheme.background.secondary,
      };
    case "eq-mid":
      return {
        primary: audioTheme.eq.mid,
        secondary: audioTheme.background.secondary,
      };
    case "eq-high":
      return {
        primary: audioTheme.eq.high,
        secondary: audioTheme.background.secondary,
      };
    case "compressor":
      return {
        primary: audioTheme.compressor.active,
        secondary: audioTheme.background.secondary,
      };
    case "gain":
      return {
        primary: audioTheme.secondary.main,
        secondary: audioTheme.background.secondary,
      };
    default:
      return {
        primary: audioTheme.primary.main,
        secondary: audioTheme.background.secondary,
      };
  }
}
