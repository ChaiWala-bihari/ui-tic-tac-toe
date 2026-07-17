/**
 * Web Audio API synthesizer for retro-arcade sound effects.
 * Lazy-initializes AudioContext on the first player interaction to comply with browser autoplay policies.
 */
class SoundSynth {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    } catch (e) {
      console.warn("Web Audio API is not supported in this browser:", e);
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Helper to create a sound gain node with a smooth volume envelope
   */
  private createOscillator(
    type: OscillatorType,
    freqStart: number,
    freqEnd: number,
    duration: number,
    volume: number = 0.1
  ) {
    if (this.isMuted) return null;
    this.init();
    if (!this.ctx) return null;

    // Resume context if suspended (browser behavior)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, this.ctx.currentTime);
    if (freqStart !== freqEnd) {
      osc.frequency.exponentialRampToValueAtTime(freqEnd, this.ctx.currentTime + duration);
    }

    gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    // Smooth release to avoid pop/clicks
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    return { osc, gainNode, time: this.ctx.currentTime };
  }

  playMove() {
    const sound = this.createOscillator('triangle', 180, 80, 0.12, 0.15);
    if (!sound) return;
    sound.osc.start(sound.time);
    sound.osc.stop(sound.time + 0.12);
  }

  playClick() {
    const sound = this.createOscillator('sine', 800, 300, 0.05, 0.1);
    if (!sound) return;
    sound.osc.start(sound.time);
    sound.osc.stop(sound.time + 0.05);
  }

  playWin() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    const noteDuration = 0.12;

    notes.forEach((freq, index) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * noteDuration);
      
      gainNode.gain.setValueAtTime(0, now + index * noteDuration);
      gainNode.gain.linearRampToValueAtTime(0.12, now + index * noteDuration + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + index * noteDuration + noteDuration);

      osc.connect(gainNode);
      gainNode.connect(this.ctx!.destination);

      osc.start(now + index * noteDuration);
      osc.stop(now + index * noteDuration + noteDuration);
    });
  }

  playLose() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const notes = [349.23, 293.66, 246.94]; // F4, D4, B3
    const noteDuration = 0.18;

    notes.forEach((freq, index) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();

      osc.type = 'sawtooth';
      // Slide slightly down on each note
      osc.frequency.setValueAtTime(freq, now + index * noteDuration);
      osc.frequency.linearRampToValueAtTime(freq - 20, now + index * noteDuration + noteDuration);

      gainNode.gain.setValueAtTime(0, now + index * noteDuration);
      gainNode.gain.linearRampToValueAtTime(0.08, now + index * noteDuration + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + index * noteDuration + noteDuration);

      osc.connect(gainNode);
      gainNode.connect(this.ctx!.destination);

      osc.start(now + index * noteDuration);
      osc.stop(now + index * noteDuration + noteDuration);
    });
  }

  playDraw() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const duration = 0.35;

    // Play two detuned oscillators for a retro "buzz" draw sound
    const freqs = [220, 222];

    freqs.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gainNode);
      gainNode.connect(this.ctx!.destination);

      osc.start(now);
      osc.stop(now + duration);
    });
  }
}

// Single instance for global audio management
export const soundSynth = new SoundSynth();
