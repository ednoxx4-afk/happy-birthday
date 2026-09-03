/**
 * AudioManager.js
 * Centralized Web Audio System handling 7 tracks, manual switching, cross-page persistence,
 * iOS Safari touch unlock, smooth fading, missing file resilience, and finale song locking.
 */

window.SONG_REGISTRY = [
  { id: 1, title: "Risk It All", artist: "Bruno Mars", src: "./public/audio/risk-it-all.mp3" },
  { id: 2, title: "Oh My Angel", artist: "Bertha Tillman", src: "./public/audio/oh-my-angel.mp3" },
  { id: 3, title: "Everybody Loves Somebody", artist: "Dean Martin", src: "./public/audio/everybody-loves-somebody.mp3" },
  { id: 4, title: "I Only Have Eyes for You", artist: "The Flamingos", src: "./public/audio/i-only-have-eyes-for-you.mp3" },
  { id: 5, title: "Glue Song", artist: "beabadoobee", src: "./public/audio/glue-song.mp3" },
  { id: 6, title: "Can I Call You Rose", artist: "Thee Sacred Souls", src: "./public/audio/can-i-call-you-rose.mp3" },
  { id: 7, title: "Out of My League", artist: "Fitz and the Tantrums", src: "./public/audio/out-of-my-league.mp3", locked: true }
];

class AudioManager {
  constructor() {
    this.currentAudio = null;
    this.currentTrackIndex = 0; // Default to Track 1 (Risk It All)
    this.isUnlocked = false;
    this.isPlaying = false;
    this.isLocked = false;
    this.targetVolume = 0.55;
    this.fadeInterval = null;
    this.listeners = [];

    // UI Badges
    this.badgeEl = null;
    this.trackNameEl = null;
    this.equalizerEl = null;
  }

  init() {
    this.badgeEl = document.getElementById('audio-control-badge');
    this.trackNameEl = document.getElementById('current-track-name');
    this.equalizerEl = this.badgeEl?.querySelector('.equalizer');

    this.updateBadgeUI();

    // Attach click event to badge to toggle selector menu
    if (this.badgeEl) {
      this.badgeEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.musicSelector) {
          window.musicSelector.toggle();
        }
      });
    }
  }

  /**
   * Unlock Audio Context on user gesture (e.g. Page 1 ENTER tap)
   */
  unlockAudioContext() {
    if (this.isUnlocked) {
      if (!this.isPlaying) {
        this.playCurrentTrack();
      }
      return;
    }

    const dummyAudio = new Audio();
    dummyAudio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
    dummyAudio.play().then(() => {
      this.isUnlocked = true;
      console.log("🔊 Audio Context Unlocked on iOS Safari / Browser");
      this.playCurrentTrack();
    }).catch(err => {
      console.warn("Audio unlock notice:", err.message);
      this.isUnlocked = true;
      this.playCurrentTrack();
    });
  }

  /**
   * Play or resume current track
   */
  playCurrentTrack() {
    const song = window.SONG_REGISTRY[this.currentTrackIndex];
    if (!song) return;

    if (this.currentAudio && !this.currentAudio.paused) {
      this.isPlaying = true;
      this.updateBadgeUI();
      return;
    }

    if (!this.currentAudio) {
      this.startAudioInstance(song);
    } else {
      const playPromise = this.currentAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isPlaying = true;
          this.fadeIn(this.currentAudio, this.targetVolume);
          this.updateBadgeUI();
        }).catch(err => {
          console.warn(`🎵 Music notice [${song.title}]: Local audio file pending upload (${song.src}). Visual badge remains active.`);
          this.isPlaying = true; // Keep visual audio state active even if audio file is missing
          this.updateBadgeUI();
        });
      }
    }
  }

  /**
   * Internal helper to construct and start a new Audio element
   */
  startAudioInstance(song) {
    const audio = new Audio(song.src);
    audio.loop = true;
    audio.volume = 0;
    this.currentAudio = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.isPlaying = true;
        this.fadeIn(audio, this.targetVolume);
        this.updateBadgeUI();
        this.notifyListeners();
      }).catch(err => {
        console.warn(`🎵 Music notice [${song.title}]: Local audio file pending (${song.src}). Visual badge remains active.`);
        this.isPlaying = true;
        this.updateBadgeUI();
        this.notifyListeners();
      });
    }
  }

  /**
   * Switch manually to a song by index (0-5 for user songs, 6 for finale)
   */
  selectTrack(index) {
    if (this.isLocked && index !== 6) {
      console.warn("🔒 Music Selection is locked for the final experience section.");
      return;
    }

    if (index < 0 || index >= window.SONG_REGISTRY.length) return;

    if (this.currentTrackIndex === index && this.currentAudio && !this.currentAudio.paused) {
      return;
    }

    this.currentTrackIndex = index;
    const nextSong = window.SONG_REGISTRY[index];

    if (this.currentAudio) {
      this.fadeOutAndStop(this.currentAudio, () => {
        this.startAudioInstance(nextSong);
      });
    } else {
      this.startAudioInstance(nextSong);
    }

    this.updateBadgeUI();
    this.notifyListeners();
  }

  /**
   * Toggle Play / Pause state
   */
  togglePlayPause() {
    if (!this.currentAudio) {
      this.playCurrentTrack();
      return;
    }

    if (this.currentAudio.paused) {
      this.currentAudio.play().then(() => {
        this.isPlaying = true;
        this.updateBadgeUI();
        this.notifyListeners();
      }).catch(err => {
        this.isPlaying = !this.isPlaying;
        this.updateBadgeUI();
        this.notifyListeners();
      });
    } else {
      this.currentAudio.pause();
      this.isPlaying = false;
      this.updateBadgeUI();
      this.notifyListeners();
    }
  }

  /**
   * Lock Finale Song (Song 7) when entering final two-page section
   */
  lockFinaleSong() {
    if (this.isLocked && this.currentTrackIndex === 6) return;
    
    this.isLocked = true;
    console.log("🔒 Finale Lock Engaged — Track 7: Out of My League");
    this.selectTrack(6);

    if (window.musicSelector) {
      window.musicSelector.close();
    }
  }

  /**
   * Synchronize floating badge UI
   */
  updateBadgeUI() {
    const currentSong = window.SONG_REGISTRY[this.currentTrackIndex];
    if (this.trackNameEl && currentSong) {
      this.trackNameEl.textContent = `${currentSong.title} — ${currentSong.artist}`;
    }
    if (this.badgeEl) {
      this.badgeEl.classList.remove('hidden');
      if (this.isLocked) {
        this.badgeEl.classList.add('locked');
      } else {
        this.badgeEl.classList.remove('locked');
      }
    }
    if (this.equalizerEl) {
      if (this.isPlaying && (!this.currentAudio || !this.currentAudio.paused)) {
        this.equalizerEl.classList.remove('paused');
      } else {
        this.equalizerEl.classList.add('paused');
      }
    }
  }

  fadeIn(audio, maxVol, durationMs = 1200) {
    if (!audio) return;
    const stepMs = 50;
    const increment = maxVol / (durationMs / stepMs);
    let currentVol = 0;
    
    clearInterval(this.fadeInterval);
    this.fadeInterval = setInterval(() => {
      currentVol = Math.min(maxVol, currentVol + increment);
      try {
        audio.volume = currentVol;
      } catch (e) {}
      if (currentVol >= maxVol) {
        clearInterval(this.fadeInterval);
      }
    }, stepMs);
  }

  fadeOutAndStop(audio, onComplete) {
    if (!audio) {
      if (onComplete) onComplete();
      return;
    }

    const stepMs = 40;
    const durationMs = 600;
    const decrement = audio.volume / (durationMs / stepMs);

    const fadeOutInterval = setInterval(() => {
      try {
        audio.volume = Math.max(0, audio.volume - decrement);
        if (audio.volume <= 0.05) {
          clearInterval(fadeOutInterval);
          audio.pause();
          audio.currentTime = 0;
          if (onComplete) onComplete();
        }
      } catch (e) {
        clearInterval(fadeOutInterval);
        if (onComplete) onComplete();
      }
    }, stepMs);
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notifyListeners() {
    this.listeners.forEach(fn => fn(this.currentTrackIndex, this.isPlaying, this.isLocked));
  }
}

window.audioManager = new AudioManager();
