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

  constructor(config?: AudioModuleConfig) {
    // Use Tone.Mono to convert stereo to mono
    const mono = new Tone.Mono();

    super(mono, config);
    this.mono = mono;

    this._currentParams = {
      enabled: 1,
    };
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
  }

  applyState(state: MonoModuleParams & { isActive: boolean }): void {
    this._isActive = state.isActive;
    if (!state.isActive) {
      this.bypass(true);
    }
  }

  dispose(): void {
    super.dispose();
  }
}
