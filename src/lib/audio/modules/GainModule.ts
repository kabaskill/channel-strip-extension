import * as Tone from "tone";
import { AudioModule, AudioModuleConfig } from "../AudioModule";

export interface GainModuleParams extends Record<string, number> {
  gain: number;
}

/**
 * Gain/Volume module
 */
export class GainModule extends AudioModule<GainModuleParams> {
  private gain: Tone.Gain;

  constructor(params?: Partial<GainModuleParams>, config?: AudioModuleConfig) {
    const gain = new Tone.Gain(params?.gain ?? 1);

    super(gain, config);
    this.gain = gain;

    this._currentParams = {
      gain: params?.gain ?? 1,
    };
  }

  bypass(shouldBypass: boolean): void {
    this._isBypassed = shouldBypass;
    if (shouldBypass) {
      this.gain.gain.rampTo(1, 0.05);
    } else {
      this.gain.gain.rampTo(this._currentParams.gain, 0.05);
    }
  }

  updateParam(param: keyof GainModuleParams, value: number): void {
    this._currentParams[param] = value;

    if (this._isBypassed) return;

    this.gain.gain.rampTo(value, 0.05);
  }

  applyState(state: GainModuleParams & { isActive: boolean }): void {
    this._isActive = state.isActive;
    this._currentParams = {
      gain: state.gain,
    };

    if (state.isActive) {
      this.updateParams(this._currentParams);
    } else {
      this.bypass(true);
    }
  }
}
