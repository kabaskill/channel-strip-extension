import * as Tone from "tone";

/**
 * Base interface for all audio processing modules
 * Provides common functionality for connection, bypass, and parameter updates
 */
export interface AudioModuleConfig {
  isActive?: boolean;
}

export abstract class AudioModule<TParams extends Record<string, number> = Record<string, number>> {
  protected _node: Tone.ToneAudioNode;
  protected _isActive: boolean;
  protected _isBypassed: boolean;
  protected _currentParams: TParams;

  constructor(node: Tone.ToneAudioNode, config: AudioModuleConfig = {}) {
    this._node = node;
    this._isActive = config.isActive ?? true;
    this._isBypassed = false;
    this._currentParams = {} as TParams;
  }

  /**
   * Get the underlying Tone.js node
   */
  get node(): Tone.ToneAudioNode {
    return this._node;
  }

  /**
   * Check if module is active
   */
  get isActive(): boolean {
    return this._isActive;
  }

  /**
   * Check if module is bypassed
   */
  get isBypassed(): boolean {
    return this._isBypassed;
  }

  /**
   * Get current parameters
   */
  get params(): Readonly<TParams> {
    return this._currentParams;
  }

  /**
   * Connect this module to another module or audio node
   */
  connect(destination: AudioModule | Tone.ToneAudioNode | AudioNode): void {
    if (destination instanceof AudioModule) {
      this._node.connect(destination.node);
    } else {
      this._node.connect(destination);
    }
  }

  /**
   * Disconnect this module from all destinations
   */
  disconnect(): void {
    this._node.disconnect();
  }

  /**
   * Bypass the module (pass audio through without processing)
   */
  abstract bypass(shouldBypass: boolean): void;

  /**
   * Update a single parameter
   */
  abstract updateParam(param: keyof TParams, value: number): void;

  /**
   * Update multiple parameters at once
   */
  updateParams(params: Partial<TParams>): void {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        this.updateParam(key as keyof TParams, value as number);
      }
    });
  }

  /**
   * Set the active state of the module
   */
  setActive(isActive: boolean): void {
    this._isActive = isActive;
    this.bypass(!isActive);
  }

  /**
   * Dispose of the module and clean up resources
   */
  dispose(): void {
    this.disconnect();
    this._node.dispose();
  }

  /**
   * Apply stored state to the module
   */
  abstract applyState(state: TParams & { isActive: boolean }): void;
}
