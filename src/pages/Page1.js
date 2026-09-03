/**
 * Page1.js - The Entrance
 * Features glowing crystal orb, mystery text, touch-friendly ENTER button with ripple,
 * particle burst reaction, audio unlock, and smooth transition to Stage 2.
 */

window.Page1 = {
  render() {
    const container = document.createElement('div');
    container.className = 'page1-container';

    container.innerHTML = `
      <!-- Header Group -->
      <div class="p1-header-group">
        <h1 class="p1-main-title">I made something for you.</h1>
        <p class="p1-subtitle">But you're going to have to explore it. ✨</p>
      </div>

      <!-- Glowing Central Interactive Crystal Orb -->
      <div class="p1-orb-wrapper" id="p1-orb">
        <div class="p1-orb-halo"></div>
        <div class="p1-orb-ring"></div>
        <div class="p1-orb-core"></div>
      </div>

      <!-- Touch-Friendly ENTER Button -->
      <div class="p1-button-wrapper">
        <button class="btn-enter" id="btn-enter" aria-label="Enter experience">
          <span>ENTER</span>
        </button>
      </div>
    `;

    setTimeout(() => {
      this.attachEvents(container);
    }, 0);

    return container;
  },

  attachEvents(container) {
    const enterBtn = container.querySelector('#btn-enter');
    const orb = container.querySelector('#p1-orb');

    const handleOrbInteraction = (e) => {
      if (window.particleSystem) {
        const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : window.innerWidth / 2);
        const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : window.innerHeight / 2);
        window.particleSystem.triggerBurst(clientX, clientY, 25);
      }
    };

    if (orb) {
      orb.addEventListener('pointerdown', handleOrbInteraction);
    }

    let isEntering = false;
    const handleEnter = (e) => {
      if (isEntering) return;
      isEntering = true;
      e.preventDefault();
      
      const rect = enterBtn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const diameter = Math.max(rect.width, rect.height);
      const clientX = e.clientX || rect.left + rect.width / 2;
      const clientY = e.clientY || rect.top + rect.height / 2;

      ripple.style.width = ripple.style.height = `${diameter}px`;
      ripple.style.left = `${clientX - rect.left - diameter / 2}px`;
      ripple.style.top = `${clientY - rect.top - diameter / 2}px`;
      enterBtn.appendChild(ripple);

      if (window.particleSystem) {
        window.particleSystem.triggerBurst(clientX, clientY, 45);
      }

      if (window.audioManager) {
        window.audioManager.unlockAudioContext();
      }

      setTimeout(() => {
        if (window.pageManager) {
          window.pageManager.navigateTo('page2');
        }
      }, 400);
    };

    if (enterBtn) {
      enterBtn.addEventListener('click', handleEnter);
      enterBtn.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch') {
          handleEnter(e);
        }
      });
    }
  },

  onEnter() {
    console.log("✨ Page 1 (The Entrance) Active");
  },

  onLeave() {
    console.log("✨ Transitioning out of Page 1...");
  }
};
