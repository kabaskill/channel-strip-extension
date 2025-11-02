import * as Tone from "tone";
import { AudioModule, AudioModuleConfig } from "../AudioModule";

export interface MonoModuleParams extends Record<string, number> {
  // Mono doesn't have adjustable parameters
  // Using a dummy parameter to satisfy the constraint
  enabled: number;
}

/**
 * Mono module
 * Converts stereo audio to mono by averaging both channels
 */
export class MonoModule extends AudioModule<MonoModuleParams> {
  private mono: Tone.Mono;
  private gain: Tone.Gain;

  constructor(config?: AudioModuleConfig) {
    // Use Tone.Mono to convert stereo to mono
    const mono = new Tone.Mono();
    
    // Add -6dB gain reduction to compensate for channel summing
    // -6dB = 0.5 in linear gain
    const gain = new Tone.Gain(0.5);
    
    // Connect: mono -> gain
    mono.connect(gain);

    super(mono, config);
    this.mono = mono;
    this.gain = gain;

    this._currentParams = {
      enabled: 1,
    };
  }

  /**
   * Override connect to connect from the gain output
   */
  connect(destination: AudioModule | Tone.ToneAudioNode | AudioNode): void {
    if (destination instanceof AudioModule) {
      this.gain.connect(destination.node);
    } else {
      this.gain.connect(destination);
    }
  }

  /**
   * Override disconnect to disconnect the gain
   */
  disconnect(): void {
    this.gain.disconnect();
  }

  bypass(shouldBypass: boolean): void {
    this._isBypassed = shouldBypass;
    // For mono, bypass means not converting to mono
    // This would require reconnecting the audio chain to truly bypass
    // For now, we mark it as bypassed
  }

  updateParam(_param: keyof MonoModuleParams, _value: number): void {
    // Mono module has no adjustable parameters
    // It's either active (converting to mono) or bypassed (passing stereo through)
    // Underscore prefix indicates intentionally unused parameters
  }

  applyState(state: MonoModuleParams & { isActive: boolean }): void {
    this._isActive = state.isActive;
    if (!state.isActive) {
      this.bypass(true);
    }
  }

  dispose(): void {
    this.mono.dispose();
    this.gain.dispose();
    super.dispose();
  }
}
