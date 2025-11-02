import * as Tone from "tone";
import { AudioModule, AudioModuleConfig } from "../AudioModule";

export interface CompressorModuleParams extends Record<string, number> {
  threshold: number;
  knee: number;
  ratio: number;
  attack: number;
  release: number;
}

/**
 * Dynamic Compressor module
 */
export class CompressorModule extends AudioModule<CompressorModuleParams> {
  private compressor: Tone.Compressor;

  constructor(params?: Partial<CompressorModuleParams>, config?: AudioModuleConfig) {
    const compressor = new Tone.Compressor({
      threshold: params?.threshold ?? -24,
      ratio: params?.ratio ?? 12,
      attack: params?.attack ? params.attack / 1000 : 0.003,
      release: params?.release ? params.release / 1000 : 0.25,
      knee: params?.knee ?? 30,
    });

    super(compressor, config);
    this.compressor = compressor;

    this._currentParams = {
      threshold: params?.threshold ?? -24,
      knee: params?.knee ?? 30,
      ratio: params?.ratio ?? 12,
      attack: params?.attack ?? 3,
      release: params?.release ?? 250,
    };
  }

  bypass(shouldBypass: boolean): void {
    this._isBypassed = shouldBypass;
    if (shouldBypass) {
      // Set ratio to 1:1 to effectively bypass compression
      this.compressor.ratio.rampTo(1, 0.05);
    } else {
      // Restore all parameters when re-enabling
      this.compressor.threshold.rampTo(this._currentParams.threshold, 0.05);
      this.compressor.knee.rampTo(this._currentParams.knee, 0.05);
      this.compressor.ratio.rampTo(this._currentParams.ratio, 0.05);
      this.compressor.attack.rampTo(this._currentParams.attack / 1000, 0.05);
      this.compressor.release.rampTo(this._currentParams.release / 1000, 0.05);
    }
  }

  updateParam(param: keyof CompressorModuleParams, value: number): void {
    this._currentParams[param] = value;

    if (this._isBypassed) return;

    switch (param) {
      case "threshold":
        this.compressor.threshold.rampTo(value, 0.05);
        break;
      case "knee":
        this.compressor.knee.rampTo(value, 0.05);
        break;
      case "ratio":
        this.compressor.ratio.rampTo(value, 0.05);
        break;
      case "attack":
        this.compressor.attack.rampTo(value / 1000, 0.05);
        break;
      case "release":
        this.compressor.release.rampTo(value / 1000, 0.05);
        break;
    }
  }

  applyState(state: CompressorModuleParams & { isActive: boolean }): void {
    this._isActive = state.isActive;
    this._currentParams = {
      threshold: state.threshold,
      knee: state.knee,
      ratio: state.ratio,
      attack: state.attack,
      release: state.release,
    };

    if (state.isActive) {
      this.updateParams(this._currentParams);
    } else {
      this.bypass(true);
    }
  }

  /**
   * Get the current gain reduction (if available)
   * Note: Tone.js doesn't expose this directly, would need custom implementation
   */
  getReduction(): number {
    // This is a placeholder - Tone.Compressor doesn't expose reduction
    // For real gain reduction metering, you'd need to use native Web Audio API
    return 0;
  }
}
