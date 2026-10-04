import { AmbientEnvironment } from '../types';

/**
 * Web Audio API Synthesized Ambient Sound Generator
 * Completely client-side, zero latency, works 100% offline.
 */
class AmbientSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private currentEnv: AmbientEnvironment = 'silence';
  private currentVolume = 0.5;
  public isMuted = false;
  private wasPlayingBeforeMute = false;

  private activeNodes: (AudioNode | number)[] = [];
  private intervalId: number | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        const initialGain = this.isMuted ? 0 : this.currentVolume;
        this.masterGain.gain.setValueAtTime(initialGain, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended' && !this.isMuted) {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setVolume(volume: number) {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : this.currentVolume;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;

    if (muted) {
      // Remember if audio was playing before being muted
      if (this.isPlaying && this.currentEnv !== 'silence') {
        this.wasPlayingBeforeMute = true;
      }
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.01);
        if (this.ctx.state === 'running') {
          this.ctx.suspend().catch(() => {});
        }
      }
    } else {
      // When unmuting: only resume if it was actively playing when muted
      if (this.wasPlayingBeforeMute) {
        this.wasPlayingBeforeMute = false;
        const ctx = this.getContext();
        if (ctx) {
          if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
          }
          if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(this.currentVolume, ctx.currentTime, 0.05);
          }
          // If nodes were stopped, re-instantiate sound
          if (this.activeNodes.length === 0 && this.currentEnv !== 'silence') {
            this.start(this.currentEnv, this.currentVolume);
          }
        }
      }
    }
  }

  public start(env: AmbientEnvironment, volume: number = 0.5) {
    this.currentEnv = env;
    this.currentVolume = volume;

    if (env === 'silence') {
      this.stop();
      return;
    }

    if (this.isMuted) {
      this.isPlaying = true;
      this.wasPlayingBeforeMute = true;
      return;
    }

    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;

    this.stopNodes();
    this.isPlaying = true;
    this.wasPlayingBeforeMute = false;

    // Ensure gain is set to current volume
    this.masterGain.gain.setValueAtTime(this.currentVolume, ctx.currentTime);

    if (env === 'rain') {
      this.createRainSound(ctx);
    } else if (env === 'ocean') {
      this.createOceanSound(ctx);
    } else if (env === 'fireplace') {
      this.createFireplaceSound(ctx);
    } else if (env === 'forest') {
      this.createForestSound(ctx);
    } else if (env === 'cafe') {
      this.createCafeSound(ctx);
    } else if (env === 'white-noise') {
      this.createWhiteNoise(ctx);
    }
  }

  public stop() {
    this.isPlaying = false;
    this.wasPlayingBeforeMute = false;
    this.stopNodes();
  }

  public isSoundPlaying(): boolean {
    return this.isPlaying && !this.isMuted && this.currentEnv !== 'silence';
  }

  private stopNodes() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.activeNodes.forEach((node) => {
      if (typeof node !== 'number' && 'stop' in node && typeof node.stop === 'function') {
        try {
          (node as AudioScheduledSourceNode).stop();
        } catch (e) {
          // Ignore
        }
      }
      if (typeof node !== 'number' && 'disconnect' in node) {
        try {
          node.disconnect();
        } catch (e) {
          // Ignore
        }
      }
    });
    this.activeNodes = [];
  }

  // Rain: Filtered noise + soft droplet clicks
  private createRainSound(ctx: AudioContext) {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    const rainGain = ctx.createGain();
    rainGain.gain.value = 0.25;

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain!);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, filter, rainGain);
  }

  // Ocean: Swelling lowpass noise wave
  private createOceanSound(ctx: AudioContext) {
    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    // LFO for wave swells
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.12; // wave every ~8 seconds
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 300;

    lfo.connect(filter.frequency);

    const oceanGain = ctx.createGain();
    oceanGain.gain.value = 0.35;

    whiteNoise.connect(filter);
    filter.connect(oceanGain);
    oceanGain.connect(this.masterGain!);

    whiteNoise.start();
    lfo.start();
    this.activeNodes.push(whiteNoise, lfo, filter, oceanGain);
  }

  // Fireplace: Low warm rumble + crackle
  private createFireplaceSound(ctx: AudioContext) {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 350;
    filter.Q.value = 1.0;

    const fireGain = ctx.createGain();
    fireGain.gain.value = 0.3;

    whiteNoise.connect(filter);
    filter.connect(fireGain);
    fireGain.connect(this.masterGain!);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, filter, fireGain);
  }

  // Forest: Subtle breeze + high soft rustle
  private createForestSound(ctx: AudioContext) {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 3.0;

    const forestGain = ctx.createGain();
    forestGain.gain.value = 0.18;

    whiteNoise.connect(filter);
    filter.connect(forestGain);
    forestGain.connect(this.masterGain!);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, filter, forestGain);
  }

  // Cafe: Soft ambient background murmur
  private createCafeSound(ctx: AudioContext) {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 650;

    const cafeGain = ctx.createGain();
    cafeGain.gain.value = 0.22;

    whiteNoise.connect(filter);
    filter.connect(cafeGain);
    cafeGain.connect(this.masterGain!);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, filter, cafeGain);
  }

  // White Noise: Pure soft soothing noise
  private createWhiteNoise(ctx: AudioContext) {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1500;

    const gain = ctx.createGain();
    gain.gain.value = 0.2;

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, filter, gain);
  }
}

export const ambientSynth = new AmbientSynthesizer();
