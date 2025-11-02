import { useState, useEffect, useCallback } from "react";

interface MeterValues {
  input: number;
  output: number;
}

/**
 * Custom hook to get real-time meter values from the content script
 */
export function useMeterValues() {
  const [meters, setMeters] = useState<MeterValues>({
    input: -60,
    output: -60,
  });
  const [isConnected, setIsConnected] = useState(false);

  const fetchMeterValues = useCallback(async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) {
        setIsConnected(false);
        return;
      }

      chrome.tabs.sendMessage(
        tab.id,
        { type: "GET_METERS" },
        (response) => {
          // Ignore errors (content script might not be ready)
          if (chrome.runtime.lastError) {
            setIsConnected(false);
            return;
          }

          if (response?.success && response.meters) {
            setMeters(response.meters);
            setIsConnected(true);
          } else {
            setIsConnected(false);
          }
        }
      );
    } catch (error) {
      setIsConnected(false);
      console.error("Failed to fetch meter values:", error);
    }
  }, []);

  useEffect(() => {
    // Poll for meter values at ~30fps
    const interval = setInterval(fetchMeterValues, 33);

    return () => clearInterval(interval);
  }, [fetchMeterValues]);

  return { meters, isConnected };
}
