/**
 * Page2Placeholder.js - Stage 2 Interactive Exploration Container
 * Song: "Oh My Angel — Bertha Tillman"
 * Interactive discovery stage: Displays mystery text and interactive glowing star object.
 * Remains active until the user completes exploration (NO automatic timers).
 */

window.Page2Placeholder = {
  render() {
    const container = document.createElement('div');
    container.className = 'p2-placeholder-container';

    container.innerHTML = `
      <div class="p2-content-group">
        <h2 class="p2-mystery-text">Wait... what did he make? ✨</h2>
        <p class="p2-subtext" id="p2-hint">Tap the glowing star to explore the mystery...</p>
      </div>

      <!-- Interactive Glowing Star / Secret Element -->
      <div class="p2-star-wrapper" id="p2-star" aria-label="Interactive star element">
        <div class="p2-star-halo"></div>
        <div class="p2-star-core">✨</div>
      </div>

      <!-- Secret Revealed Message (Hidden until user interacts) -->
      <div class="p2-reveal-card hidden" id="p2-reveal">
        <p class="p2-reveal-text">"Every detail was crafted with love... Step closer into the journey." 💫</p>
        <button class="btn-enter" id="btn-p2-next" style="margin-top: 1rem; padding: 10px 24px; font-size: 0.85rem;" aria-label="Go to Page 3">
          <span>CONTINUE TO PAGE 3 →</span>
        </button>
      </div>
    `;

    setTimeout(() => {
      this.attachEvents(container);
    }, 0);

    return container;
  },

  attachEvents(container) {
    const star = container.querySelector('#p2-star');
    const revealCard = container.querySelector('#p2-reveal');
    const hintText = container.querySelector('#p2-hint');

    let isDiscovered = false;

    const handleStarTap = (e) => {
      e.preventDefault();
      
      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : window.innerWidth / 2);
      const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : window.innerHeight / 2);

      // Trigger particle explosion at tap coordinates
      if (window.particleSystem) {
        window.particleSystem.triggerBurst(clientX, clientY, 35);
      }

      if (!isDiscovered) {
        isDiscovered = true;
        
        // Reveal secret text & animate star
        if (star) star.classList.add('discovered');
        if (hintText) hintText.textContent = "Discovery unlocked! ✨";
        if (revealCard) {
          revealCard.classList.remove('hidden');
          revealCard.classList.add('visible');
        }
      }
    };

    const nextBtn = container.querySelector('#btn-p2-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.pageManager) {
          window.pageManager.navigateTo('page3');
        }
      });
    }

    if (star) {
      star.addEventListener('click', handleStarTap);
      star.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch') {
          handleStarTap(e);
        }
      });
    }
  },

  onEnter() {
    console.log("✨ Page 2 Active — Continuous soundtrack playback active");
  },

  onLeave() {
    console.log("✨ Transitioning out of Page 2...");
  }
};
