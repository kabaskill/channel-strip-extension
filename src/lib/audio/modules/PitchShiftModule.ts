import * as Tone from "tone";
import { AudioModule, AudioModuleConfig } from "../AudioModule";

export interface PitchShiftModuleParams extends Record<string, number> {
  pitch: number;
  windowSize: number;
}

/**
 * Pitch Shift module
 * Changes the pitch of audio without affecting playback speed
 */
export class PitchShiftModule extends AudioModule<PitchShiftModuleParams> {
  private pitchShift: Tone.PitchShift;

  constructor(params?: Partial<PitchShiftModuleParams>, config?: AudioModuleConfig) {
    const pitchShift = new Tone.PitchShift({
      pitch: params?.pitch ?? 0,
      windowSize: params?.windowSize ?? 0.1,
    });

    super(pitchShift, config);
    this.pitchShift = pitchShift;

    this._currentParams = {
      pitch: params?.pitch ?? 0,
      windowSize: params?.windowSize ?? 0.1,
    };
  }

  bypass(shouldBypass: boolean): void {
    this._isBypassed = shouldBypass;
    if (shouldBypass) {
      this.pitchShift.pitch = 0;
    } else {
      this.pitchShift.pitch = this._currentParams.pitch;
    }
  }

  updateParam(param: keyof PitchShiftModuleParams, value: number): void {
    this._currentParams[param] = value;

    if (this._isBypassed) return;

    switch (param) {
      case "pitch":
        this.pitchShift.pitch = value;
        break;
      case "windowSize":
        this.pitchShift.windowSize = value;
        break;
    }
  }

  applyState(state: PitchShiftModuleParams & { isActive: boolean }): void {
    this._isActive = state.isActive;
    this._currentParams = {
      pitch: state.pitch,
      windowSize: state.windowSize,
    };

    if (state.isActive) {
      this.updateParams(this._currentParams);
    } else {
      this.bypass(true);
    }
  }
}
