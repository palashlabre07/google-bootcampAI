/**
 * Web Audio Ambient Soundscape Synthesizer
 * Generates genuine, calming procedural audio textures without external dependencies.
 */

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private currentType: string | null = null;
  private masterGain: GainNode | null = null;
  private nodes: (AudioNode | number)[] = [];
  private isMuted: boolean = false;
  private volume: number = 0.65;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play(type: 'river' | 'forest' | 'bowl' | 'theta') {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.currentType = type;

    if (type === 'river') {
      this.generateRiverStream();
    } else if (type === 'forest') {
      this.generateForestWind();
    } else if (type === 'bowl') {
      this.generateSingingBowl();
    } else if (type === 'theta') {
      this.generateThetaWaves();
    }
  }

  public stop() {
    this.nodes.forEach((item) => {
      if (typeof item === 'number') {
        window.clearInterval(item);
      } else {
        try {
          if ('stop' in item && typeof (item as AudioScheduledSourceNode).stop === 'function') {
            (item as AudioScheduledSourceNode).stop();
          }
          item.disconnect();
        } catch {
          // ignore already stopped nodes
        }
      }
    });
    this.nodes = [];
    this.currentType = null;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.currentType !== null;
  }

  public getCurrentType(): string | null {
    return this.currentType;
  }

  // Synthesizes continuous flowing stream / gentle water
  private generateRiverStream() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Pink noise generation
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.Q.setValueAtTime(2, this.ctx.currentTime);

    // LFO to simulate gentle river ripples
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.3, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(150, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const streamGain = this.ctx.createGain();
    streamGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(streamGain);
    streamGain.connect(this.masterGain);

    whiteNoise.start();
    lfo.start();

    this.nodes.push(whiteNoise, lfo, lfoGain, filter, streamGain);
  }

  // Synthesizes forest wind with occasional gentle harmonic wind chimes
  private generateForestWind() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 1.8;
    }

    const windSource = this.ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(280, this.ctx.currentTime);
    windFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    windSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.masterGain);
    windSource.start();

    this.nodes.push(windSource, windFilter, windGain);

    // Periodic gentle chimes
    const chimeTimer = window.setInterval(() => {
      if (!this.ctx || !this.masterGain) return;
      const chimeFreqs = [528, 660, 792, 1056];
      const freq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.0);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 3.1);
    }, 4500);

    this.nodes.push(chimeTimer);
  }

  // Synthesizes warm harmonic Tibetan singing bowl chime (432Hz cluster)
  private generateSingingBowl() {
    if (!this.ctx || !this.masterGain) return;
    const baseFreqs = [216, 432, 864, 1296];
    const baseOscs = baseFreqs.map((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f + (Math.random() * 2 - 1), this.ctx!.currentTime);

      const amp = [0.15, 0.25, 0.08, 0.03][idx];
      gain.gain.setValueAtTime(amp, this.ctx!.currentTime);

      // Tremolo / beat frequency
      const lfo = this.ctx!.createOscillator();
      lfo.frequency.setValueAtTime(0.8 + idx * 0.2, this.ctx!.currentTime);
      const lfoGain = this.ctx!.createGain();
      lfoGain.gain.setValueAtTime(amp * 0.3, this.ctx!.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start();
      lfo.start();
      this.nodes.push(osc, lfo, lfoGain, gain);
      return osc;
    });
    void baseOscs;
  }

  // Synthesizes calming Theta binaural drone (140Hz carrier + 146Hz left/right = 6Hz theta)
  private generateThetaWaves() {
    if (!this.ctx || !this.masterGain) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const merger = this.ctx.createChannelMerger(2);

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(136.1, this.ctx.currentTime); // OM frequency
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(142.1, this.ctx.currentTime); // 6Hz theta beat

    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();
    gain1.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain2.gain.setValueAtTime(0.2, this.ctx.currentTime);

    osc1.connect(gain1);
    osc2.connect(gain2);

    gain1.connect(merger, 0, 0);
    gain2.connect(merger, 0, 1);
    merger.connect(this.masterGain);

    osc1.start();
    osc2.start();
    this.nodes.push(osc1, osc2, gain1, gain2, merger);
  }
}

export const ambientAudio = new AmbientAudioEngine();
