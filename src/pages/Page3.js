/**
 * Page3.js - The Personal Birthday Entrance
 * Theme: 'birthday-warm' (blush pink, rose, soft peach, warm cream, champagne gold)
 * Features mystery headers, interactive envelope card, wax seal tap reaction,
 * warm particle sparkle burst, sequential message reveal, and manual CONTINUE progression.
 */

window.Page3 = {
  theme: 'birthday-warm',

  render() {
    const container = document.createElement('div');
    container.className = 'page3-container';

    container.innerHTML = `
      <!-- Header Group -->
      <div class="p3-header-group">
        <h2 class="p3-title">Okay… now that you're here…</h2>
        <p class="p3-subtitle">I think you deserve to know something.</p>
      </div>

      <!-- Interactive Envelope Object -->
      <div class="p3-envelope-wrapper" id="p3-envelope" aria-label="Interactive Birthday Letter Envelope">
        <div class="p3-envelope-body">
          <div class="p3-envelope-flap"></div>
          <div class="p3-envelope-pocket"></div>
          
          <!-- Wax Seal Badge -->
          <div class="p3-wax-seal">
            <span class="seal-heart">💌</span>
            <span>Open me</span>
          </div>

          <!-- Letter Paper Card (Slides up when opened) -->
          <div class="p3-letter-paper" id="p3-letter">
            <div class="p3-message-container">
              <p class="p3-msg-line line-1" id="p3-line-1">"This isn't just a birthday wish."</p>
              <p class="p3-msg-line line-2" id="p3-line-2">"I wanted to make you something you could actually explore. ✨"</p>
              <p class="p3-msg-line line-3" id="p3-line-3">"And this is only the beginning…"</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Manual Progression Button (Shown after full message reveal) -->
      <div class="p3-continue-wrapper" id="p3-continue-group">
        <button class="btn-continue" id="btn-p3-continue" aria-label="Continue journey">
          <span>CONTINUE →</span>
        </button>
      </div>
    `;

    setTimeout(() => {
      this.attachEvents(container);
    }, 0);

    return container;
  },

  attachEvents(container) {
    const envelope = container.querySelector('#p3-envelope');
    const line1 = container.querySelector('#p3-line-1');
    const line2 = container.querySelector('#p3-line-2');
    const line3 = container.querySelector('#p3-line-3');
    const continueGroup = container.querySelector('#p3-continue-group');
    const continueBtn = container.querySelector('#btn-p3-continue');

    let isOpened = false;

    const handleEnvelopeTap = (e) => {
      if (isOpened) return;
      isOpened = true;
      e.preventDefault();

      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : window.innerWidth / 2);
      const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : window.innerHeight / 2);

      // Trigger warm sparkle particle explosion
      if (window.particleSystem) {
        window.particleSystem.triggerBurst(clientX, clientY, 40);
      }

      // Visual envelope opening transition
      if (envelope) {
        envelope.classList.add('opened');
      }

      // Sequential Message Line Reveal
      setTimeout(() => {
        if (line1) line1.classList.add('show');
      }, 400);

      setTimeout(() => {
        if (line2) line2.classList.add('show');
        if (window.particleSystem) {
          window.particleSystem.triggerBurst(window.innerWidth / 2, window.innerHeight * 0.45, 20);
        }
      }, 1500);

      setTimeout(() => {
        if (line3) line3.classList.add('show');
      }, 2600);

      // Reveal Continue Button
      setTimeout(() => {
        if (continueGroup) continueGroup.classList.add('show');
      }, 3400);
    };

    if (envelope) {
      envelope.addEventListener('click', handleEnvelopeTap);
      envelope.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch') {
          handleEnvelopeTap(e);
        }
      });
    }

    if (continueBtn) {
      continueBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("✨ User tapped CONTINUE on Page 3");
        if (window.particleSystem) {
          window.particleSystem.triggerBurst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 30);
        }
        // Smooth transition to next stage (Page 4 placeholder or notice)
        if (window.pageManager && window.pageManager.pages.has('page4')) {
          window.pageManager.navigateTo('page4');
        } else {
          console.log("✨ End of currently created pages — Page 3 completed successfully.");
        }
      });
    }
  },

  onEnter() {
    console.log("✨ Page 3 Active — Theme: Warm Birthday Aesthetic");
  },

  onLeave() {
    console.log("✨ Transitioning out of Page 3...");
  }
};
