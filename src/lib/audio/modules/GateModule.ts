import * as Tone from "tone";
import { AudioModule, AudioModuleConfig } from "../AudioModule";

export interface GateModuleParams extends Record<string, number> {
  threshold: number;
  smoothing: number;
}

/**
 * Noise Gate module
 * Silences audio below a threshold to reduce background noise
 */
export class GateModule extends AudioModule<GateModuleParams> {
  private gate: Tone.Gate;

  constructor(params?: Partial<GateModuleParams>, config?: AudioModuleConfig) {
    const gate = new Tone.Gate({
      threshold: params?.threshold ?? -50,
      smoothing: params?.smoothing ?? 0.1,
    });

    super(gate, config);
    this.gate = gate;

    this._currentParams = {
      threshold: params?.threshold ?? -50,
      smoothing: params?.smoothing ?? 0.1,
    };
  }

  bypass(shouldBypass: boolean): void {
    this._isBypassed = shouldBypass;
    if (shouldBypass) {
      // Set very low threshold to effectively disable the gate
      this.gate.threshold = -100;
    } else {
      this.gate.threshold = this._currentParams.threshold;
    }
  }

  updateParam(param: keyof GateModuleParams, value: number): void {
    this._currentParams[param] = value;

    if (this._isBypassed) return;

    switch (param) {
      case "threshold":
        this.gate.threshold = value;
        break;
      case "smoothing":
        this.gate.smoothing = value;
        break;
    }
  }

  applyState(state: GateModuleParams & { isActive: boolean }): void {
    this._isActive = state.isActive;
    this._currentParams = {
      threshold: state.threshold,
      smoothing: state.smoothing,
    };

    if (state.isActive) {
      this.updateParams(this._currentParams);
    } else {
      this.bypass(true);
    }
  }
}
