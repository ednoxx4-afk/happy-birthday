/**
 * Page10.js - THE FINAL REVEAL 🎂✨
 * The grand finale of the entire website.
 * Memory universe visual culmination, glowing "14", verbatim birthday wishes,
 * celebratory fireworks, and seamless audio continuity.
 */

window.Page10 = {
  isFinalePage: true,
  theme: 'memory-universe',

  render() {
    const container = document.createElement('div');
    container.className = 'page10-container';

    container.innerHTML = `
      <!-- Ambient Glow & Memory Orbs -->
      <div class="p10-decorations">
        <div class="p10-glow-center"></div>
      </div>

      <!-- Opening Dark Stage -->
      <div class="p10-dark-stage" id="p10-dark-stage">
        <div class="p10-light-point"></div>
        <h2 class="p10-dark-title">wait...</h2>
        <div class="p10-dark-sub">you actually made it to the end. 🥹</div>
        <button class="btn-p10-action" id="btn-p10-show">SHOW ME ✨</button>
      </div>

      <!-- Final Reveal Stage (Hidden initially) -->
      <div class="p10-reveal-stage hidden" id="p10-reveal-stage">
        <!-- Large Glowing 14 -->
        <div class="p10-number-14">14</div>

        <!-- Birthday Message Card -->
        <div class="p10-msg-card">
          <h2 class="p10-main-headline">HAPPIEST BIRTHDAY IVAA 🎂💗</h2>
          <p class="p10-sub-line1">i hope 14 is one of your happiest years yet.</p>
          <p class="p10-sub-line2">keep smiling,
keep yapping,
keep being you. 😭</p>
          <p class="p10-sub-line3">and thank you for being a part of my life. ❤️</p>
          <div class="p10-special-line">I hope you liked your little adventure. ✨</div>
        </div>

        <!-- Very Final End -->
        <div class="p10-the-end-box">
          <div class="p10-the-end-text">THE END ✨</div>
          <div class="p10-effort-text">made with way too much effort 😭</div>
        </div>
      </div>
    `;

    setTimeout(() => {
      this.attachEvents(container);
    }, 0);

    return container;
  },

  attachEvents(container) {
    const darkStage = container.querySelector('#p10-dark-stage');
    const revealStage = container.querySelector('#p10-reveal-stage');
    const showBtn = container.querySelector('#btn-p10-show');

    if (showBtn) {
      showBtn.addEventListener('click', (e) => {
        e.preventDefault();
        darkStage.classList.add('hidden');
        revealStage.classList.remove('hidden');

        if (window.particleSystem) {
          window.particleSystem.triggerFireworks(6000);
        }
      });
    }
  },

  onEnter() {
    console.log("✨ Page 10 Active — THE FINAL REVEAL!");
    if (window.audioManager) {
      window.audioManager.lockFinaleSong();
    }
  },

  onLeave() {
    console.log("✨ Transitioning out of Page 10...");
  }
};
