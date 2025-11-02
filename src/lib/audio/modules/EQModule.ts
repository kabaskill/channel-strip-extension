import * as Tone from "tone";
import { AudioModule, AudioModuleConfig } from "../AudioModule";

export interface EQModuleParams extends Record<string, number> {
  low: number;
  mid: number;
  high: number;
  lowFreq: number;
  highFreq: number;
}

/**
 * 3-Band Equalizer module
 */
export class EQModule extends AudioModule<EQModuleParams> {
  private eq3: Tone.EQ3;

  constructor(params?: Partial<EQModuleParams>, config?: AudioModuleConfig) {
    const eq3 = new Tone.EQ3({
      low: params?.low ?? 0,
      mid: params?.mid ?? 0,
      high: params?.high ?? 0,
      lowFrequency: params?.lowFreq ?? 400,
      highFrequency: params?.highFreq ?? 8000,
    });

    super(eq3, config);
    this.eq3 = eq3;

    this._currentParams = {
      low: params?.low ?? 0,
      mid: params?.mid ?? 0,
      high: params?.high ?? 0,
      lowFreq: params?.lowFreq ?? 400,
      highFreq: params?.highFreq ?? 8000,
    };
  }

  bypass(shouldBypass: boolean): void {
    this._isBypassed = shouldBypass;
    if (shouldBypass) {
      this.eq3.low.rampTo(0, 0.05);
      this.eq3.mid.rampTo(0, 0.05);
      this.eq3.high.rampTo(0, 0.05);
    } else {
      this.eq3.low.rampTo(this._currentParams.low, 0.05);
      this.eq3.mid.rampTo(this._currentParams.mid, 0.05);
      this.eq3.high.rampTo(this._currentParams.high, 0.05);
    }
  }

  updateParam(param: keyof EQModuleParams, value: number): void {
    this._currentParams[param] = value;

    if (this._isBypassed) return;

    switch (param) {
      case "low":
        this.eq3.low.rampTo(value, 0.05);
        break;
      case "mid":
        this.eq3.mid.rampTo(value, 0.05);
        break;
      case "high":
        this.eq3.high.rampTo(value, 0.05);
        break;
      case "lowFreq":
        this.eq3.lowFrequency.rampTo(value, 0.05);
        break;
      case "highFreq":
        this.eq3.highFrequency.rampTo(value, 0.05);
        break;
    }
  }

  applyState(state: EQModuleParams & { isActive: boolean }): void {
    this._isActive = state.isActive;
    this._currentParams = {
      low: state.low,
      mid: state.mid,
      high: state.high,
      lowFreq: state.lowFreq,
      highFreq: state.highFreq,
    };

    if (state.isActive) {
      this.updateParams(this._currentParams);
    } else {
      this.bypass(true);
    }
  }
}
