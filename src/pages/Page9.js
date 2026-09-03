/**
 * Page9.js - "ONE LAST THING..." 💌
 * Emotional pause before the final reveal. Features handwritten letter presentation,
 * sunset cinematic atmosphere, verbatim personal letter, and finale song lock.
 */

window.Page9 = {
  isFinalePage: true,
  theme: 'sunset-cinematic',

  render() {
    const container = document.createElement('div');
    container.className = 'page9-container';

    container.innerHTML = `
      <!-- Ambient Sunset Orbs -->
      <div class="p9-decorations">
        <div class="p9-glow-orb p9-glow-1"></div>
        <div class="p9-glow-orb p9-glow-2"></div>
      </div>

      <!-- Opening Sequence Header -->
      <div class="p9-intro-box" id="p9-intro-box">
        <h2 class="p9-intro-title">ONE LAST THING...</h2>
        <p class="p9-intro-line" id="p9-line-1">hiiii</p>
        <p class="p9-intro-line" id="p9-line-2">u made it here yeah? 👀</p>
        <p class="p9-intro-line" id="p9-line-3">it lwk hurts but this is the ending...</p>
        <p class="p9-intro-line" id="p9-line-4">and u are so close.</p>
      </div>

      <!-- Envelope Card Stage -->
      <div class="p9-envelope-stage" id="p9-envelope-stage">
        <div class="p9-envelope-card">
          <div class="p9-seal-icon">💌</div>
          <div class="p9-envelope-text">i wrote something for you.</div>
          <button class="btn-p9-action" id="btn-p9-open">OPEN IT ✉️</button>
        </div>
      </div>

      <!-- Handwritten Letter Container (Revealed after tapping OPEN IT) -->
      <div class="p9-letter-container hidden" id="p9-letter-container">
        <!-- Section 1 -->
        <div class="p9-letter-card">
          <p class="p9-letter-text">hiiii

u made it here yeah?
it lwk hurts but this is the ending and u are so close 
i hope u enjoyed iva 
all i wanna see u is smiling thats what i care the most
even if u leave my texts sent for the whole day i would still send u a goodnight message</p>
        </div>

        <!-- Section 2 -->
        <div class="p9-letter-card">
          <p class="p9-letter-text">can u imagine?
i made this when we are so far away so just think what i would get u if we lived close
everybody buys expensive gifts by spending their money but nobody spends his 1-3 hours a day making handmade gifts 
it took me a month to make all of this
thats how much i love u 
u would say love is a big word but my love is much bigger than this 4 letter word</p>
        </div>

        <!-- Section 3 -->
        <div class="p9-letter-card">
          <p class="p9-letter-text">today u turn 14 and i wish u the best for ur future for best things happens to u 
i will pray that u smash every exams and get the best marks and impress ur mom
just don't do kalesh on phones😭</p>
        </div>

        <!-- Section 4 -->
        <div class="p9-letter-card">
          <p class="p9-letter-text">you are the best 
prettiest and cutest none compares to u 
NONE
and ykw 
if somehow i go back in 1 month before and realize i'm stuck here and have to make all these gifts for u again 
then
i would do it all over again💖</p>
        </div>

        <!-- Section 5 -->
        <div class="p9-letter-card" style="text-align: center;">
          <p class="p9-letter-text" style="font-weight: 700; color: #ffd700;">HAPPIEST BIRTHDAY AGAINNN!!</p>
          <div class="p9-letter-signature">yours 

ur takla gittha mogu mogu</div>
        </div>

        <!-- Footer Prompt & Button to Page 10 -->
        <div class="p9-footer-prompt">
          <div class="p9-footer-text">you really made it all the way here. 😭</div>
          <button class="btn-p9-action" id="btn-p9-next">THERE'S ONE MORE THING →</button>
        </div>
      </div>
    `;

    setTimeout(() => {
      this.attachEvents(container);
    }, 0);

    return container;
  },

  attachEvents(container) {
    // Staggered line reveal animations
    const line1 = container.querySelector('#p9-line-1');
    const line2 = container.querySelector('#p9-line-2');
    const line3 = container.querySelector('#p9-line-3');
    const line4 = container.querySelector('#p9-line-4');
    const envelopeStage = container.querySelector('#p9-envelope-stage');
    const letterContainer = container.querySelector('#p9-letter-container');
    const openBtn = container.querySelector('#btn-p9-open');
    const nextBtn = container.querySelector('#btn-p9-next');

    setTimeout(() => { if (line1) line1.classList.add('visible'); }, 500);
    setTimeout(() => { if (line2) line2.classList.add('visible'); }, 1400);
    setTimeout(() => { if (line3) line3.classList.add('visible'); }, 2300);
    setTimeout(() => { if (line4) line4.classList.add('visible'); }, 3200);

    if (openBtn) {
      openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.particleSystem) {
          window.particleSystem.triggerBurst(window.innerWidth / 2, window.innerHeight / 2, 35, 'rgba(248, 200, 220, ');
        }
        envelopeStage.classList.add('hidden');
        letterContainer.classList.remove('hidden');
        letterContainer.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleNextNavigation();
      });
    }
  },

  handleNextNavigation() {
    console.log("💌 User tapped THERE'S ONE MORE THING on Page 9");
    if (window.particleSystem) {
      window.particleSystem.triggerBurst(window.innerWidth / 2, window.innerHeight / 2, 45);
    }
    if (window.pageManager) {
      window.pageManager.navigateTo('page10');
    }
  },

  onEnter() {
    console.log("💌 Page 9 Active — ONE LAST THING...");
    if (window.audioManager) {
      window.audioManager.lockFinaleSong();
    }
  },

  onLeave() {
    console.log("💌 Transitioning out of Page 9...");
  }
};
