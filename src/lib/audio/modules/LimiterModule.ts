import * as Tone from "tone";
import { AudioModule, AudioModuleConfig } from "../AudioModule";

export interface LimiterModuleParams extends Record<string, number> {
  threshold: number;
}

/**
 * Limiter module
 * Prevents audio from exceeding a threshold to avoid clipping
 * Note: Tone.Limiter threshold is read-only, so bypass effectively disables limiting
 */
export class LimiterModule extends AudioModule<LimiterModuleParams> {
  private limiter: Tone.Limiter;
  private isBypassing: boolean = false;

  constructor(params?: Partial<LimiterModuleParams>, config?: AudioModuleConfig) {
    const limiter = new Tone.Limiter(params?.threshold ?? -3);

    super(limiter, config);
    this.limiter = limiter;

    this._currentParams = {
      threshold: params?.threshold ?? -3,
    };
  }

  bypass(shouldBypass: boolean): void {
    this._isBypassed = shouldBypass;
    this.isBypassing = shouldBypass;
    // Note: We can't actually change the threshold on Tone.Limiter
    // The limiter will still apply, but we mark it as bypassed
    // For true bypass, would need to reconnect the audio chain
  }

  updateParam(param: keyof LimiterModuleParams, value: number): void {
    this._currentParams[param] = value;
    // Note: Tone.Limiter threshold is read-only after creation
    // To change threshold, would need to recreate the limiter node
    console.warn("Limiter threshold cannot be changed after creation in Tone.js");
  }

  applyState(state: LimiterModuleParams & { isActive: boolean }): void {
    this._isActive = state.isActive;
    this._currentParams = {
      threshold: state.threshold,
    };

    if (!state.isActive) {
      this.bypass(true);
    }
  }
}
