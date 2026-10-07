/**
 * Modern synthesized Web Audio chime effects for Sahla notifications.
 * Works completely offline, requires zero external mp3/wav assets, and produces crystal-clear audio.
 */

let globalAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!globalAudioCtx) {
      globalAudioCtx = new AudioCtx();
    }
    if (globalAudioCtx.state === "suspended") {
      globalAudioCtx.resume().catch(() => {});
    }
    return globalAudioCtx;
  } catch {
    return null;
  }
}

// Auto-unlock AudioContext on first user interaction anywhere in the page
if (typeof window !== "undefined") {
  const unlockAudio = () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
    } catch {
      // Ignore
    }
    window.removeEventListener("click", unlockAudio);
    window.removeEventListener("keydown", unlockAudio);
    window.removeEventListener("touchstart", unlockAudio);
  };
  window.addEventListener("click", unlockAudio, { passive: true });
  window.addEventListener("keydown", unlockAudio, { passive: true });
  window.addEventListener("touchstart", unlockAudio, { passive: true });
}

export type SoundEffectType = "ai_ready" | "chime" | "warning" | "wallet";

export function isSoundMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem("sahla_sound_muted") === "true";
  } catch {
    return false;
  }
}

export function setSoundMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("sahla_sound_muted", muted ? "true" : "false");
  } catch {
    // Ignore
  }
}

/**
 * Synthesizes a clean, pleasant notification tone using Web Audio API oscillators.
 */
export function playNotificationSound(type: SoundEffectType = "chime", volume: number = 0.35): boolean {
  if (typeof window === "undefined") return false;
  if (isSoundMuted()) return false;

  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    if (type === "ai_ready") {
      // 3-tone harmonic bright arpeggio (C5 -> E5 -> G5 -> C6)
      const frequencies = [523.25, 659.25, 783.99, 1046.5];
      frequencies.forEach((freq, idx) => {
        const startTime = now + idx * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume * 0.9, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.38);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
      return true;
    }

    if (type === "wallet") {
      // 2-tone brisk bell (A5 -> D6)
      const frequencies = [880.0, 1174.66];
      frequencies.forEach((freq, idx) => {
        const startTime = now + idx * 0.09;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume * 0.8, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.32);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
      return true;
    }

    if (type === "warning") {
      // Gentle two-tone soft alert
      const frequencies = [493.88, 392.0];
      frequencies.forEach((freq, idx) => {
        const startTime = now + idx * 0.12;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(volume * 0.85, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
      return true;
    }

    // Default: Crisp pleasant chime (G5 -> C6)
    const frequencies = [783.99, 1046.5];
    frequencies.forEach((freq, idx) => {
      const startTime = now + idx * 0.1;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.48);
    });
    return true;
  } catch (err) {
    console.warn("[SoundEffects] WebAudio play error:", err);
    return false;
  }
}
