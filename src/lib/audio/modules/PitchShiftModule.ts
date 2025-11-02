import * as Tone from "tone";
import { AudioModule, AudioModuleConfig } from "../AudioModule";

export interface PitchShiftModuleParams extends Record<string, number> {
  pitch: number; // in semitones
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
      windowSize: 0.03,
      delayTime: 0,
      feedback: 0,
    });

    super(pitchShift, config);
    this.pitchShift = pitchShift;

    this._currentParams = {
      pitch: params?.pitch ?? 0,
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
    
    if (param === "pitch") {
      this.pitchShift.pitch = value;
    }
  }

  applyState(state: PitchShiftModuleParams & { isActive: boolean }): void {
    this._isActive = state.isActive;
    this._currentParams = {
      pitch: state.pitch,
    };

    if (state.isActive) {
      this.pitchShift.pitch = state.pitch;
    } else {
      this.bypass(true);
    }
  }

  dispose(): void {
    this.pitchShift.dispose();
    super.dispose();
  }
}
