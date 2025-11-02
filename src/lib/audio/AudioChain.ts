import * as Tone from "tone";
import { AudioModule } from "./AudioModule";
import { Meter } from "./Meter";
import { EQModule } from "./modules/EQModule";
import { CompressorModule } from "./modules/CompressorModule";
import { GainModule } from "./modules/GainModule";
import { GateModule } from "./modules/GateModule";
import { PitchShiftModule } from "./modules/PitchShiftModule";
import { MonoModule } from "./modules/MonoModule";

export type ModuleName = "eq" | "compressor" | "gain" | "gate" | "pitchShift" | "mono";

/**
 * AudioChain manages the entire audio processing chain
 * Handles module creation, connection, and message routing
 */
export class AudioChain {
  private modules: Map<ModuleName, AudioModule>;
  private meters: Map<string, Meter>;
  private source: MediaElementAudioSourceNode | null = null;
  private mediaElement: HTMLMediaElement | null = null;
  private initialized: boolean = false;

  // Define the signal chain order
  private readonly chainOrder: ModuleName[] = [
    "gate",
    "eq",
    "compressor",
    "pitchShift",
    "gain",
    "mono",
  ];

  constructor() {
    this.modules = new Map();
    this.meters = new Map();
  }

  /**
   * Initialize the audio chain with a media element
   */
  async initialize(mediaElement: HTMLMediaElement): Promise<boolean> {
    if (this.initialized) {
      return true;
    }

    try {
      this.mediaElement = mediaElement;

      // Start Tone.js audio context (must be called after user gesture)
      await Tone.start();
      console.log("Tone.js audio context started");

      // Get Tone's audio context
      const audioContext = Tone.getContext().rawContext as AudioContext;

      // Resume the context if it's suspended
      if (audioContext.state === "suspended") {
        await audioContext.resume();
        console.log("AudioContext resumed");
      }

      // Create MediaElementSource
      this.source = audioContext.createMediaElementSource(mediaElement);

      // Create all modules with default settings
      this.createModules();

      // Connect the chain
      this.reconnect();

      this.initialized = true;
      console.log("AudioChain initialized successfully");
      return true;
    } catch (error) {
      console.error("Failed to initialize AudioChain:", error);
      this.initialized = false;
      return false;
    }
  }

  /**
   * Create all audio modules with default settings
   */
  private createModules(): void {
    // Create each module
    this.modules.set("eq", new EQModule({
      low: 0,
      mid: 0,
      high: 0,
      lowFreq: 400,
      highFreq: 8000,
    }, { isActive: true }));

    this.modules.set("compressor", new CompressorModule({
      threshold: -24,
      knee: 30,
      ratio: 12,
      attack: 3,
      release: 250,
    }, { isActive: true }));

    this.modules.set("gain", new GainModule({
      gain: 1,
    }, { isActive: true }));

    this.modules.set("gate", new GateModule({
      threshold: -50,
      smoothing: 0.1,
    }, { isActive: false })); // Disabled by default

    this.modules.set("pitchShift", new PitchShiftModule({
      pitch: 0,
    }, { isActive: false })); // Disabled by default

    this.modules.set("mono", new MonoModule({ isActive: false })); // Disabled by default

    // Create meters for key modules
    this.meters.set("input", new Meter(0.8));
    this.meters.set("output", new Meter(0.8));
  }

  /**
   * Reconnect the entire audio chain
   * Rebuilds connections in the correct order, skipping inactive modules
   */
  private reconnect(): void {
    if (!this.source) return;

    // Disconnect all modules first
    this.modules.forEach(module => module.disconnect());

    // Connect source to first module
    let previousNode: Tone.ToneAudioNode | AudioNode = this.source;
    
    // Connect input meter
    const inputMeter = this.meters.get("input");
    if (inputMeter) {
      inputMeter.connect(this.source);
    }

    // Connect modules in order, skipping inactive ones for true bypass
    for (const moduleName of this.chainOrder) {
      const module = this.modules.get(moduleName);
      if (module) {
        // For mono, skip if inactive for true bypass
        // For other modules, include them (they handle bypass internally)
        const shouldSkip = !module.isActive && moduleName === "mono";
        
        if (!shouldSkip) {
          Tone.connect(previousNode, module.node);
          previousNode = module.node;
        }
      }
    }

    // Connect output meter and destination
    const outputMeter = this.meters.get("output");
    if (outputMeter) {
      outputMeter.connect(previousNode);
    }

    // Connect to destination
    Tone.connect(previousNode, Tone.getDestination());

    console.log("AudioChain reconnected");
  }

  /**
   * Get a module by name
   */
  getModule<T extends AudioModule>(name: ModuleName): T | undefined {
    return this.modules.get(name) as T | undefined;
  }

  /**
   * Get a meter by name
   */
  getMeter(name: string): Meter | undefined {
    return this.meters.get(name);
  }

  /**
   * Get input meter value in dB
   */
  getInputLevel(): number {
    const meter = this.meters.get("input");
    return meter ? meter.getValue() : -60;
  }

  /**
   * Get output meter value in dB
   */
  getOutputLevel(): number {
    const meter = this.meters.get("output");
    return meter ? meter.getValue() : -60;
  }

  /**
   * Update a module parameter
   */
  updateModuleParam(moduleName: ModuleName, param: string, value: number): void {
    const module = this.modules.get(moduleName);
    if (module) {
      module.updateParam(param as never, value);
    }
  }

  /**
   * Toggle a module on/off
   */
  toggleModule(moduleName: ModuleName, isActive: boolean): void {
    const module = this.modules.get(moduleName);
    if (module) {
      module.setActive(isActive);
      // For modules that can't truly bypass (Mono), reconnect the chain
      if (moduleName === "mono") {
        this.reconnect();
      }
    }
  }

  /**
   * Apply stored state to all modules
   */
  applyStoredState(state: Record<string, unknown>): void {
    // Apply volume directly to media element
    if (state.volume && this.mediaElement) {
      const volumeState = state.volume as { value: number; isActive: boolean };
      this.mediaElement.volume = volumeState.isActive ? volumeState.value / 100 : 0;
    }

    // Apply gain
    if (state.gain) {
      const gainModule = this.modules.get("gain");
      if (gainModule) {
        gainModule.applyState(state.gain as never);
      }
    }

    // Apply EQ
    if (state.eq) {
      const eqModule = this.modules.get("eq");
      if (eqModule) {
        eqModule.applyState(state.eq as never);
      }
    }

    // Apply Compressor
    if (state.compressor) {
      const compressorModule = this.modules.get("compressor");
      if (compressorModule) {
        compressorModule.applyState(state.compressor as never);
      }
    }

    // Apply Gate
    if (state.gate) {
      const gateModule = this.modules.get("gate");
      if (gateModule) {
        gateModule.applyState(state.gate as never);
      }
    }

    // Apply PitchShift
    if (state.pitchShift) {
      const pitchShiftModule = this.modules.get("pitchShift");
      if (pitchShiftModule) {
        pitchShiftModule.applyState(state.pitchShift as never);
      }
    }

    // Apply Mono
    if (state.mono) {
      const monoModule = this.modules.get("mono");
      if (monoModule) {
        monoModule.applyState(state.mono as never);
      }
    }
  }

  /**
   * Set volume on the media element
   */
  setVolume(volume: number): void {
    if (this.mediaElement) {
      this.mediaElement.volume = volume / 100;
    }
  }

  /**
   * Check if the chain is initialized
   */
  get isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Dispose of all modules and clean up
   */
  dispose(): void {
    this.modules.forEach(module => module.dispose());
    this.meters.forEach(meter => meter.dispose());
    this.modules.clear();
    this.meters.clear();
    this.initialized = false;
  }
}
