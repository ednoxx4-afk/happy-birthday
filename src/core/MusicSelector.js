/**
 * MusicSelector.js
 * Elegant, mobile/iPhone friendly music selection modal menu component.
 * Allows one-tap song selection among Songs 1–6, live playing indicator,
 * play/pause control, and locked state UI for finale.
 */

class MusicSelector {
  constructor() {
    this.isOpen = false;
    this.containerEl = null;
    this.backdropEl = null;
    this.cardEl = null;
  }

  init() {
    this.createDOM();
    if (window.audioManager) {
      window.audioManager.subscribe(() => this.renderTrackList());
    }
  }

  createDOM() {
    if (document.getElementById('music-selector-container')) return;

    this.containerEl = document.createElement('div');
    this.containerEl.id = 'music-selector-container';
    this.containerEl.className = 'music-selector-container hidden';

    this.containerEl.innerHTML = `
      <div class="music-selector-backdrop" id="music-selector-backdrop"></div>
      <div class="music-selector-card" id="music-selector-card">
        <div class="music-selector-header">
          <div class="header-title-group">
            <span class="header-icon">🎵</span>
            <span class="header-title">Soundtrack Collection</span>
          </div>
          <button class="selector-close-btn" id="selector-close-btn" aria-label="Close menu">✕</button>
        </div>
        
        <div class="music-selector-controls">
          <button class="play-pause-toggle-btn" id="play-pause-toggle-btn">
            <span class="pp-icon" id="pp-icon">⏸</span>
            <span class="pp-text" id="pp-text">Pause Music</span>
          </button>
        </div>

        <div class="track-list" id="track-list"></div>

        <div class="music-selector-footer">
          <span class="footer-hint">Tap any track to switch • Persists across pages</span>
        </div>
      </div>
    `;

    document.body.appendChild(this.containerEl);

    this.backdropEl = this.containerEl.querySelector('#music-selector-backdrop');
    this.cardEl = this.containerEl.querySelector('#music-selector-card');

    // Event listeners
    this.backdropEl.addEventListener('click', () => this.close());
    const closeBtn = this.containerEl.querySelector('#selector-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    const ppBtn = this.containerEl.querySelector('#play-pause-toggle-btn');
    if (ppBtn) {
      ppBtn.addEventListener('click', () => {
        if (window.audioManager) {
          window.audioManager.togglePlayPause();
        }
      });
    }

    this.renderTrackList();
  }

  renderTrackList() {
    const listEl = document.getElementById('track-list');
    if (!listEl || !window.audioManager) return;

    const songs = window.SONG_REGISTRY || [];
    const currentIndex = window.audioManager.currentTrackIndex;
    const isPlaying = window.audioManager.isPlaying;
    const isLocked = window.audioManager.isLocked;

    // Update play/pause toggle button text
    const ppIcon = document.getElementById('pp-icon');
    const ppText = document.getElementById('pp-text');
    if (ppIcon && ppText) {
      if (isPlaying && window.audioManager.currentAudio && !window.audioManager.currentAudio.paused) {
        ppIcon.textContent = "⏸";
        ppText.textContent = "Pause Music";
      } else {
        ppIcon.textContent = "▶";
        ppText.textContent = "Play Music";
      }
    }

    if (isLocked) {
      listEl.innerHTML = `
        <div class="locked-section-notice">
          <div class="lock-icon-lg">🔒</div>
          <div class="lock-title">Finale Soundtrack Locked</div>
          <div class="lock-subtitle">"Out of My League — Fitz and the Tantrums" is reserved for the final experience.</div>
        </div>
      `;
      return;
    }

    listEl.innerHTML = '';

    // Only render Songs 1–6 (index 0 to 5) for user selection
    songs.slice(0, 6).forEach((song, index) => {
      const item = document.createElement('div');
      const isActive = index === currentIndex;
      
      item.className = `track-item ${isActive ? 'active' : ''}`;
      item.setAttribute('data-index', index);

      item.innerHTML = `
        <div class="track-left">
          <span class="track-num">${index + 1}</span>
          <div class="track-info">
            <div class="track-title-text">${song.title}</div>
            <div class="track-artist-text">${song.artist}</div>
          </div>
        </div>
        <div class="track-right">
          ${isActive ? `
            <div class="mini-equalizer ${isPlaying ? '' : 'paused'}">
              <span class="m-bar"></span>
              <span class="m-bar"></span>
              <span class="m-bar"></span>
            </div>
          ` : `<span class="play-arrow">▶</span>`}
        </div>
      `;

      item.addEventListener('click', () => {
        if (window.audioManager) {
          window.audioManager.selectTrack(index);
        }
        setTimeout(() => this.close(), 250);
      });

      listEl.appendChild(item);
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (!this.containerEl) this.createDOM();
    if (window.audioManager && window.audioManager.isLocked) {
      // If locked, render lock notice
      this.renderTrackList();
    } else {
      this.renderTrackList();
    }
    
    this.containerEl.classList.remove('hidden');
    void this.containerEl.offsetWidth; // Force reflow
    this.containerEl.classList.add('visible');
    this.isOpen = true;
  }

  close() {
    if (!this.containerEl || !this.isOpen) return;
    this.containerEl.classList.remove('visible');
    setTimeout(() => {
      this.containerEl.classList.add('hidden');
      this.isOpen = false;
    }, 300);
  }
}

window.musicSelector = new MusicSelector();
