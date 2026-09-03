/**
 * Page7.js - "CAKE TIME 🍰"
 * Playful, cute, funny birthday cake-eating experience with 4 distinct interactive cakes.
 * Verbatim messages, candle tap-blow interaction, cake cutting animation, bite mechanics,
 * and seamless navigation.
 */

window.Page7 = {
  theme: 'cake-playful',

  // State Management
  state: 'INTRO', // INTRO, CAKE_1, CAKE_2, CAKE_3, CAKE_4_CANDLE, CAKE_4_CUT, CAKE_4_EAT, FINISHED
  introIndex: 0,
  tapsRemaining: 0,
  totalTaps: 0,
  candleBlown: false,
  cakeCut: false,

  introLines: [
    "Okay birthday girllll... 🍰",
    "You thought you were done receiving gifts?",
    "NAHHH 😭",
    "You're getting CAKE now. 🎂",
    "Actually... FOUR cakes. 😭🍰",
    "Alright... open wide. 👀"
  ],

  render() {
    this.state = 'INTRO';
    this.introIndex = 0;
    this.tapsRemaining = 0;
    this.totalTaps = 0;
    this.candleBlown = false;
    this.cakeCut = false;

    const container = document.createElement('div');
    container.className = 'page7-container';

    container.innerHTML = `
      <!-- Ambient Decorative Elements -->
      <div class="p7-decorations">
        <div class="p7-balloon p7-balloon-1">🎈</div>
        <div class="p7-balloon p7-balloon-2">🎈</div>
        <div class="p7-sparkle p7-sparkle-1">✨</div>
        <div class="p7-sparkle p7-sparkle-2">💖</div>
        <div class="p7-sparkle p7-sparkle-3">⭐</div>
      </div>

      <!-- Header Speech Area -->
      <div class="p7-header-area" id="p7-header">
        <div class="p7-speech-bubble" id="p7-speech">
          <p class="p7-dialog-text" id="p7-dialog-text">${this.introLines[0]}</p>
        </div>
      </div>

      <!-- Main Stage Container -->
      <div class="p7-cake-stage" id="p7-stage">
        <!-- Intro Card Box -->
        <div class="p7-intro-box" id="p7-intro-box">
          <div class="p7-intro-card">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎉🍰✨</div>
            <div class="p7-intro-sub">A special 4-course birthday cake feast made just for Ivaa!</div>
          </div>
        </div>

        <!-- Cake Interactive Stage -->
        <div class="p7-cake-container hidden" id="p7-cake-container">
          <div class="p7-tap-hint" id="p7-tap-hint">Tap repeatedly to eat! 😋</div>
          <div class="p7-eat-progress-bar" id="p7-progress-bar">
            <div class="p7-progress-fill" id="p7-progress-fill" style="width: 100%;"></div>
          </div>
          <div class="p7-cake-wrapper" id="p7-cake-wrapper">
            <!-- Active Cake SVG Injected Dynamically -->
          </div>
        </div>
      </div>

      <!-- Bottom Controls Area -->
      <div class="p7-controls-area" id="p7-controls">
        <button class="btn-p7-action" id="btn-p7-action">NEXT ➔</button>
      </div>
    `;

    setTimeout(() => {
      this.attachEvents(container);
    }, 0);

    return container;
  },

  attachEvents(container) {
    const dialogText = container.querySelector('#p7-dialog-text');
    const introBox = container.querySelector('#p7-intro-box');
    const cakeContainer = container.querySelector('#p7-cake-container');
    const cakeWrapper = container.querySelector('#p7-cake-wrapper');
    const progressBar = container.querySelector('#p7-progress-bar');
    const progressFill = container.querySelector('#p7-progress-fill');
    const tapHint = container.querySelector('#p7-tap-hint');
    const actionBtn = container.querySelector('#btn-p7-action');

    // Handle Action Button / Intro Tap Progression
    const handleActionClick = (e) => {
      if (e) e.preventDefault();

      if (this.state === 'INTRO') {
        this.introIndex++;
        if (this.introIndex < this.introLines.length) {
          dialogText.style.opacity = '0';
          dialogText.style.transform = 'translateY(-6px)';
          setTimeout(() => {
            dialogText.textContent = this.introLines[this.introIndex];
            dialogText.style.opacity = '1';
            dialogText.style.transform = 'translateY(0)';
          }, 200);

          if (this.introIndex === this.introLines.length - 1) {
            actionBtn.textContent = "SHOW CAKE 1 🍰 →";
          }
        } else {
          // Intro complete -> Show Cake 1
          this.loadCake1(introBox, cakeContainer, cakeWrapper, actionBtn, tapHint, progressBar, progressFill, dialogText);
        }
      } else if (this.state === 'CAKE_1_DONE') {
        this.loadCake2(cakeWrapper, actionBtn, tapHint, progressBar, progressFill, dialogText);
      } else if (this.state === 'CAKE_2_DONE') {
        this.loadCake3(cakeWrapper, actionBtn, tapHint, progressBar, progressFill, dialogText);
      } else if (this.state === 'CAKE_3_DONE') {
        this.loadCake4(cakeWrapper, actionBtn, tapHint, progressBar, progressFill, dialogText);
      } else if (this.state === 'CAKE_4_CANDLE_BLOWN') {
        // Cut the cake button clicked
        this.cutCake4(cakeWrapper, actionBtn, tapHint, progressBar, progressFill, dialogText);
      } else if (this.state === 'FINISHED') {
        this.handleNextNavigation();
      }
    };

    actionBtn.addEventListener('click', handleActionClick);

    // Cake Tap Interaction Handler (Bite Mechanic & Candle Blowing)
    const handleCakeTap = (e) => {
      e.preventDefault();

      // Handle Candle Blowing Step on Cake 4
      if (this.state === 'CAKE_4_CANDLE') {
        this.blowCandle(cakeWrapper, actionBtn, dialogText);
        return;
      }

      if (this.tapsRemaining <= 0) return;

      // Eating interaction only active when in eating states
      if (['CAKE_1', 'CAKE_2', 'CAKE_3', 'CAKE_4_EAT'].includes(this.state)) {
        this.tapsRemaining--;

        // Calculate progress percentage
        const progressPct = (this.tapsRemaining / this.totalTaps) * 100;
        progressFill.style.width = `${progressPct}%`;

        // Scale cake down visually as eaten
        const scaleFactor = 0.2 + (this.tapsRemaining / this.totalTaps) * 0.8;
        cakeWrapper.style.transform = `scale(${scaleFactor})`;

        // Trigger Wobble
        cakeWrapper.classList.remove('wobble');
        void cakeWrapper.offsetWidth;
        cakeWrapper.classList.add('wobble');

        // Spawn Nom visual text feedback & crumbs at tap location
        const rect = cakeWrapper.getBoundingClientRect();
        const clientX = e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX || rect.left + rect.width / 2;
        const clientY = e.touches && e.touches[0] ? e.touches[0].clientY : e.clientY || rect.top + rect.height / 2;

        this.spawnBiteEffects(cakeWrapper, clientX, clientY);

        if (window.particleSystem) {
          window.particleSystem.triggerBurst(clientX, clientY, 15, 'rgba(255, 215, 0, ');
        }

        // Check if finished eating active cake
        if (this.tapsRemaining === 0) {
          this.onCakeEaten(cakeWrapper, actionBtn, tapHint, progressBar, dialogText);
        }
      }
    };

    cakeWrapper.addEventListener('click', handleCakeTap);
    cakeWrapper.addEventListener('touchstart', handleCakeTap, { passive: false });
  },

  // ----------------------------------------------------
  // CAKE 1 SETUP
  // ----------------------------------------------------
  loadCake1(introBox, cakeContainer, cakeWrapper, actionBtn, tapHint, progressBar, progressFill, dialogText) {
    this.state = 'CAKE_1';
    this.totalTaps = 7;
    this.tapsRemaining = 7;

    introBox.classList.add('hidden');
    cakeContainer.classList.remove('hidden');
    actionBtn.parentElement.classList.add('hidden');
    tapHint.classList.remove('hidden');
    progressBar.classList.remove('hidden');
    progressFill.style.width = '100%';

    cakeWrapper.style.transform = 'scale(1)';
    cakeWrapper.innerHTML = `
      <svg class="p7-cake-svg cake-size-1" viewBox="0 0 160 140">
        <defs>
          <filter id="cakeShadow1" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="4" flood-opacity="0.3"/>
          </filter>
        </defs>
        <ellipse cx="80" cy="115" rx="70" ry="16" fill="#e6e6fa" stroke="#d8b4fe" stroke-width="2" filter="url(#cakeShadow1)" />
        <rect x="35" y="65" width="90" height="45" rx="8" fill="#ff85a2" />
        <path d="M 35,65 Q 45,75 55,65 Q 65,75 75,65 Q 85,75 95,65 Q 105,75 115,65 L 125,65 L 125,55 Q 80,45 35,55 Z" fill="#fffdd0" />
        <circle cx="45" cy="55" r="7" fill="#ffffff" />
        <circle cx="80" cy="52" r="8" fill="#ffffff" />
        <circle cx="115" cy="55" r="7" fill="#ffffff" />
        <path d="M 80,42 Q 74,32 80,24 Q 86,32 80,42 Z" fill="#ff3366" />
        <path d="M 78,24 Q 80,20 84,22" fill="none" stroke="#a8e6cf" stroke-width="2" />
        <line x1="50" y1="75" x2="56" y2="78" stroke="#ffd700" stroke-width="3" stroke-linecap="round" />
        <line x1="100" y1="80" x2="105" y2="74" stroke="#a8e6cf" stroke-width="3" stroke-linecap="round" />
        <line x1="75" y1="90" x2="82" y2="92" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
      </svg>
    `;

    dialogText.textContent = "Alright... open wide. 👀";
  },

  // ----------------------------------------------------
  // CAKE 2 SETUP
  // ----------------------------------------------------
  loadCake2(cakeWrapper, actionBtn, tapHint, progressBar, progressFill, dialogText) {
    this.state = 'CAKE_2';
    this.totalTaps = 9;
    this.tapsRemaining = 9;

    actionBtn.parentElement.classList.add('hidden');
    tapHint.classList.remove('hidden');
    progressBar.classList.remove('hidden');
    progressFill.style.width = '100%';

    cakeWrapper.style.transform = 'scale(1)';
    cakeWrapper.innerHTML = `
      <svg class="p7-cake-svg cake-size-2" viewBox="0 0 220 180">
        <defs>
          <filter id="cakeShadow2" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="5" flood-opacity="0.35"/>
          </filter>
        </defs>
        <ellipse cx="110" cy="155" rx="95" ry="20" fill="#fff8f0" stroke="#f8c8dc" stroke-width="2.5" filter="url(#cakeShadow2)" />
        <rect x="35" y="95" width="150" height="55" rx="10" fill="#fffdd0" />
        <path d="M 35,95 Q 50,110 65,95 Q 80,110 95,95 Q 110,110 125,95 Q 140,110 155,95 Q 170,110 185,95 L 185,85 L 35,85 Z" fill="#ff85a2" />
        <rect x="60" y="45" width="100" height="45" rx="8" fill="#d8b4fe" />
        <path d="M 60,45 Q 75,55 90,45 Q 105,55 120,45 Q 135,55 150,45 L 160,45 L 160,38 L 60,38 Z" fill="#fffdd0" />
        <circle cx="80" cy="32" r="8" fill="#ff0044" />
        <path d="M 80,24 Q 85,16 92,20" stroke="#6b4226" stroke-width="1.5" fill="none" />
        <circle cx="110" cy="28" r="9" fill="#ff0044" />
        <path d="M 110,19 Q 115,12 122,16" stroke="#6b4226" stroke-width="1.5" fill="none" />
        <circle cx="140" cy="32" r="8" fill="#ff0044" />
        <path d="M 140,24 Q 145,16 152,20" stroke="#6b4226" stroke-width="1.5" fill="none" />
        <circle cx="70" cy="70" r="3" fill="#ffd700" />
        <circle cx="130" cy="75" r="3" fill="#ff85a2" />
        <line x1="50" y1="120" x2="58" y2="125" stroke="#ff3366" stroke-width="3.5" stroke-linecap="round" />
        <line x1="120" y1="130" x2="128" y2="124" stroke="#ffd700" stroke-width="3.5" stroke-linecap="round" />
        <line x1="160" y1="115" x2="166" y2="122" stroke="#a8e6cf" stroke-width="3.5" stroke-linecap="round" />
      </svg>
    `;

    dialogText.textContent = "Here comes Cake 2... much bigger! 🍰";
  },

  // ----------------------------------------------------
  // CAKE 3 SETUP
  // ----------------------------------------------------
  loadCake3(cakeWrapper, actionBtn, tapHint, progressBar, progressFill, dialogText) {
    this.state = 'CAKE_3';
    this.totalTaps = 12;
    this.tapsRemaining = 12;

    actionBtn.parentElement.classList.add('hidden');
    tapHint.classList.remove('hidden');
    progressBar.classList.remove('hidden');
    progressFill.style.width = '100%';

    cakeWrapper.style.transform = 'scale(1)';
    cakeWrapper.innerHTML = `
      <svg class="p7-cake-svg cake-size-3" viewBox="0 0 280 240">
        <defs>
          <filter id="cakeShadow3" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="10" stdDeviation="6" flood-opacity="0.4"/>
          </filter>
        </defs>
        <ellipse cx="140" cy="215" rx="125" ry="22" fill="#ffd700" opacity="0.9" filter="url(#cakeShadow3)" />
        <ellipse cx="140" cy="215" rx="120" ry="18" fill="#fff8f0" />
        <rect x="25" y="145" width="230" height="65" rx="12" fill="#a8e6cf" />
        <path d="M 25,145 Q 45,165 65,145 Q 85,165 105,145 Q 125,165 145,145 Q 165,165 185,145 Q 205,165 225,145 Q 240,165 255,145 L 255,135 L 25,135 Z" fill="#ff85a2" />
        <rect x="55" y="85" width="170" height="55" rx="10" fill="#fffdd0" />
        <path d="M 55,85 Q 75,102 95,85 Q 115,102 135,85 Q 155,102 175,85 Q 195,102 215,85 L 225,85 L 225,78 L 55,78 Z" fill="#d8b4fe" />
        <rect x="85" y="35" width="110" height="48" rx="8" fill="#ff85a2" />
        <path d="M 85,35 Q 102,48 119,35 Q 136,48 153,35 Q 170,48 187,35 L 195,35 L 195,28 L 85,28 Z" fill="#fffdd0" />
        <polygon points="140,8 144,18 155,18 146,24 149,34 140,28 131,34 134,24 125,18 136,18" fill="#ffd700" />
        <polygon points="105,15 108,22 116,22 109,27 112,34 105,29 98,34 101,27 94,22 102,22" fill="#ffd700" />
        <polygon points="175,15 178,22 186,22 179,27 182,34 175,29 168,34 171,27 164,22 172,22" fill="#ffd700" />
        <rect x="25" y="185" width="230" height="10" fill="#ffd700" opacity="0.8" />
        <rect x="55" y="118" width="170" height="8" fill="#ff3366" opacity="0.8" />
      </svg>
    `;

    dialogText.textContent = "Bro why did you make THIS much cake 😭";
  },

  // ----------------------------------------------------
  // CAKE 4 SETUP (REAL BIRTHDAY CAKE WITH "14" TOPPER)
  // ----------------------------------------------------
  loadCake4(cakeWrapper, actionBtn, tapHint, progressBar, progressFill, dialogText) {
    this.state = 'CAKE_4_CANDLE';
    this.candleBlown = false;
    this.cakeCut = false;

    actionBtn.parentElement.classList.add('hidden');
    tapHint.textContent = "Tap the candle to blow it out! 🕯️";
    tapHint.classList.remove('hidden');
    progressBar.classList.add('hidden');

    cakeWrapper.style.transform = 'scale(1)';
    cakeWrapper.innerHTML = `
      <svg class="p7-cake-svg cake-size-4" viewBox="0 0 240 210" id="svg-cake-4">
        <defs>
          <filter id="cakeShadow4" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" flood-opacity="0.38"/>
          </filter>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff8e7" />
            <stop offset="35%" stop-color="#ffd700" />
            <stop offset="70%" stop-color="#d4af37" />
            <stop offset="100%" stop-color="#aa7c11" />
          </linearGradient>
          <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="30%" stop-color="#ffff00" />
            <stop offset="70%" stop-color="#ff6600" />
            <stop offset="100%" stop-color="#ff0000" />
          </linearGradient>
        </defs>
        <ellipse cx="120" cy="180" rx="100" ry="18" fill="url(#goldGradient)" filter="url(#cakeShadow4)" />
        <ellipse cx="120" cy="178" rx="94" ry="14" fill="#fff8f0" />
        <g id="p7-cake4-body">
          <rect x="35" y="95" width="170" height="75" rx="12" fill="#fff8f0" stroke="#f8c8dc" stroke-width="2" />
          <path d="M 35,95 Q 52,110 69,95 Q 86,110 103,95 Q 120,110 137,95 Q 154,110 171,95 Q 188,110 205,95 L 205,85 L 35,85 Z" fill="#ff85a2" />
          <circle cx="50" cy="165" r="6" fill="#ffb6c1" />
          <circle cx="85" cy="165" r="6" fill="#fffdd0" />
          <circle cx="120" cy="165" r="6" fill="#ffb6c1" />
          <circle cx="155" cy="165" r="6" fill="#fffdd0" />
          <circle cx="190" cy="165" r="6" fill="#ffb6c1" />
        </g>
        <!-- Visible 3D "14" Topper Stick -->
        <g class="p7-topper-group" id="p7-topper-14">
          <line x1="85" y1="90" x2="85" y2="30" stroke="#d4af37" stroke-width="3" stroke-linecap="round" />
          <g transform="translate(62, 10)">
            <path d="M 6,24 L 12,24 L 12,6 L 6,10 L 6,6 L 14,0 L 18,0 L 18,24 L 24,24 L 24,28 L 6,28 Z" fill="url(#goldGradient)" stroke="#ffffff" stroke-width="0.8" />
            <path d="M 28,18 L 38,0 L 44,0 L 44,16 L 48,16 L 48,20 L 44,20 L 44,28 L 38,28 L 38,20 L 28,20 Z M 38,16 L 38,6 L 31,16 Z" fill="url(#goldGradient)" stroke="#ffffff" stroke-width="0.8" />
            <path d="M 44,2 Q 45,6 48,6 Q 45,6 44,10 Q 44,6 40,6 Q 44,6 44,2 Z" fill="#ffffff" />
          </g>
        </g>
        <!-- Lit Candle with Generous Touch Target -->
        <g class="p7-candle-container" id="p7-candle-group" style="cursor: pointer; pointer-events: all;">
          <rect x="115" y="10" width="60" height="90" fill="transparent" pointer-events="all" />
          <rect x="140" y="55" width="10" height="35" rx="3" fill="#e6e6fa" stroke="#d8b4fe" stroke-width="1.5" />
          <line x1="145" y1="55" x2="145" y2="48" stroke="#333333" stroke-width="2" />
          <g class="p7-candle-flame" id="p7-flame-element">
            <path d="M 145,28 Q 138,40 145,48 Q 152,40 145,28 Z" fill="url(#flameGrad)" filter="drop-shadow(0 0 8px rgba(255,150,0,0.9))" />
            <ellipse cx="145" cy="44" rx="3" ry="5" fill="#ffffff" />
          </g>
        </g>
      </svg>
    `;

    // Attach direct touch/click event listener on candle group for instant responsiveness
    const candleGroup = cakeWrapper.querySelector('#p7-candle-group');
    if (candleGroup) {
      const handleCandleTap = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (this.state === 'CAKE_4_CANDLE') {
          this.blowCandle(cakeWrapper, actionBtn, dialogText);
        }
      };
      candleGroup.addEventListener('click', handleCandleTap);
      candleGroup.addEventListener('touchstart', handleCandleTap, { passive: false });
    }

    dialogText.textContent = "One last thing... blow the candle. 🕯️";
  },

  // ----------------------------------------------------
  // BLOW CANDLE ACTION
  // ----------------------------------------------------
  blowCandle(cakeWrapper, actionBtn, dialogText) {
    if (this.candleBlown) return;
    this.candleBlown = true;
    this.state = 'CAKE_4_CANDLE_BLOWN';

    const flameEl = cakeWrapper.querySelector('#p7-flame-element');
    if (flameEl) {
      flameEl.classList.add('extinguished');
    }

    // Spawn Smoke Puff Particles
    const rect = cakeWrapper.getBoundingClientRect();
    const candleX = rect.left + rect.width * 0.6;
    const candleY = rect.top + rect.height * 0.3;

    for (let i = 0; i < 6; i++) {
      const smoke = document.createElement('div');
      smoke.className = 'p7-smoke-particle';
      smoke.style.left = `${candleX + (Math.random() - 0.5) * 10}px`;
      smoke.style.top = `${candleY}px`;
      smoke.style.setProperty('--sx', `${(Math.random() - 0.5) * 30}px`);
      document.body.appendChild(smoke);
      setTimeout(() => smoke.remove(), 1200);
    }

    if (window.particleSystem) {
      window.particleSystem.triggerBurst(candleX, candleY, 25, 'rgba(255, 255, 255, ');
    }

    dialogText.textContent = "make a wishhh 🎂✨";

    // Reveal CUT THE CAKE Button
    actionBtn.textContent = "CUT THE CAKE 🔪🍰";
    actionBtn.parentElement.classList.remove('hidden');
  },

  // ----------------------------------------------------
  // CUT CAKE ACTION
  // ----------------------------------------------------
  cutCake4(cakeWrapper, actionBtn, tapHint, progressBar, progressFill, dialogText) {
    this.state = 'CAKE_4_EAT';
    this.totalTaps = 14;
    this.tapsRemaining = 14;

    actionBtn.parentElement.classList.add('hidden');
    tapHint.textContent = "Tap repeatedly to eat the birthday cake! 😋";
    tapHint.classList.remove('hidden');
    progressBar.classList.remove('hidden');
    progressFill.style.width = '100%';

    // Add knife cut SVG slice mark to cake
    const cakeBody = cakeWrapper.querySelector('#p7-cake4-body');
    if (cakeBody) {
      cakeBody.innerHTML += `
        <line x1="120" y1="85" x2="120" y2="170" stroke="#ffd700" stroke-width="3" stroke-dasharray="4 3" />
        <line x1="35" y1="130" x2="205" y2="130" stroke="#ffd700" stroke-width="2" stroke-dasharray="4 3" />
      `;
    }

    const rect = cakeWrapper.getBoundingClientRect();
    if (window.particleSystem) {
      window.particleSystem.triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35, 'rgba(255, 133, 162, ');
    }

    dialogText.textContent = "okayyy now eat it 😭";
  },

  // ----------------------------------------------------
  // CAKE EATEN CALLBACK (Exact Messages per prompt)
  // ----------------------------------------------------
  onCakeEaten(cakeWrapper, actionBtn, tapHint, progressBar, dialogText) {
    tapHint.classList.add('hidden');
    progressBar.classList.add('hidden');

    cakeWrapper.style.transform = 'scale(0)';
    setTimeout(() => {
      cakeWrapper.innerHTML = '';
    }, 300);

    const rect = cakeWrapper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    if (window.particleSystem) {
      window.particleSystem.triggerBurst(centerX, centerY, 45, 'rgba(255, 215, 0, ');
    }

    if (this.state === 'CAKE_1') {
      this.state = 'CAKE_1_DONE';
      dialogText.textContent = "wow kha bhi gaii ek aur banaya tere liyeee";
      actionBtn.textContent = "NEXT CAKE 🍰 →";
      actionBtn.parentElement.classList.remove('hidden');
    } else if (this.state === 'CAKE_2') {
      this.state = 'CAKE_2_DONE';
      dialogText.textContent = "hainaaa tasty????";
      actionBtn.textContent = "NEXT CAKE 🍰 →";
      actionBtn.parentElement.classList.remove('hidden');
    } else if (this.state === 'CAKE_3') {
      this.state = 'CAKE_3_DONE';
      dialogText.textContent = "ha ha thus le birthday hai tera isliye kuch ni bola warna mai bhi saath mein thusta";
      
      // Reveal extra sub text "WAIT... THERE'S ONE MORE. 👀"
      setTimeout(() => {
        dialogText.innerHTML = `ha ha thus le birthday hai tera isliye kuch ni bola warna mai bhi saath mein thusta<br><br><span style="color: #ffd700; font-size: 0.95rem;">WAIT... THERE'S ONE MORE. 👀</span>`;
      }, 1200);

      actionBtn.textContent = "NEXT →";
      actionBtn.parentElement.classList.remove('hidden');
    } else if (this.state === 'CAKE_4_EAT') {
      this.state = 'FINISHED';
      dialogText.textContent = "WOW SARE CAKE KHA GAII YUMMY THE NAA maine banaye btw";

      if (window.particleSystem) {
        window.particleSystem.triggerFireworks(5000);
      }

      actionBtn.textContent = "NEXT →";
      actionBtn.parentElement.classList.remove('hidden');
    }
  },

  // Spawn Bite "Nom!" Text & Crumbs
  spawnBiteEffects(container, x, y) {
    const noms = ["Nom! 🍰", "Yum! ✨", "Chomp! 😋", "Mmm! 🎂", "Thus! 😭"];
    const text = noms[Math.floor(Math.random() * noms.length)];

    const pop = document.createElement('div');
    pop.className = 'p7-bite-particle';
    pop.textContent = text;
    pop.style.left = `${x - 20}px`;
    pop.style.top = `${y - 20}px`;
    document.body.appendChild(pop);

    setTimeout(() => pop.remove(), 700);

    for (let i = 0; i < 4; i++) {
      const crumb = document.createElement('div');
      crumb.className = 'p7-crumb';
      const colors = ['#ff85a2', '#fffdd0', '#ffd700', '#d8b4fe', '#a8e6cf'];
      crumb.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      crumb.style.left = `${x}px`;
      crumb.style.top = `${y}px`;
      crumb.style.setProperty('--tx', `${(Math.random() - 0.5) * 60}px`);
      crumb.style.setProperty('--ty', `${(Math.random() - 0.5) * 60 - 20}px`);
      document.body.appendChild(crumb);

      setTimeout(() => crumb.remove(), 600);
    }
  },

  handleNextNavigation() {
    console.log("🍰 User tapped NEXT on Page 7");
    if (window.particleSystem) {
      window.particleSystem.triggerBurst(window.innerWidth / 2, window.innerHeight / 2, 50);
    }

    if (window.pageManager && window.pageManager.pages.has('page8')) {
      window.pageManager.navigateTo('page8');
    } else {
      console.log("✨ Page 7 complete! Staying at final birthday moment.");
    }
  },

  onEnter() {
    console.log("🍰 Page 7 Active — CAKE TIME!");
  },

  onLeave() {
    console.log("🍰 Transitioning out of Page 7...");
  }
};
