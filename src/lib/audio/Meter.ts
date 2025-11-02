import * as Tone from "tone";

/**
 * Meter utility for monitoring audio levels
 * Wraps Tone.Meter and provides convenient methods for reading values
 */
export class Meter {
  private _meter: Tone.Meter;
  private _connected: boolean = false;

  constructor(smoothing: number = 0.8) {
    this._meter = new Tone.Meter({ smoothing });
  }

  /**
   * Get the underlying Tone.Meter instance
   */
  get node(): Tone.Meter {
    return this._meter;
  }

  /**
   * Get the current meter value in decibels
   */
  getValue(): number {
    return this._meter.getValue() as number;
  }

  /**
   * Get the current meter value as a normalized value (0-1)
   */
  getNormalizedValue(): number {
    const db = this.getValue();
    // Convert dB to normalized value (assuming -60dB to 0dB range)
    const min = -60;
    const max = 0;
    return Math.max(0, Math.min(1, (db - min) / (max - min)));
  }

  /**
   * Connect the meter to an audio source
   */
  connect(source: Tone.ToneAudioNode | AudioNode): void {
    Tone.connect(source, this._meter);
    this._connected = true;
  }

  /**
   * Disconnect the meter
   */
  disconnect(): void {
    this._meter.disconnect();
    this._connected = false;
  }

  /**
   * Check if the meter is connected
   */
  get isConnected(): boolean {
    return this._connected;
  }

  /**
   * Dispose of the meter and clean up resources
   */
  dispose(): void {
    this.disconnect();
    this._meter.dispose();
  }
}
