/**
 * Page8.js - "HOW WELL DO I KNOW YOU?" 🎮
 * Cozy retro arcade / game-night birthday quiz experience.
 * 6 questions with verbatim messages, touch feedback, score tracking,
 * result tiers, and smooth mobile navigation.
 */

window.Page8 = {
  theme: 'arcade-cozy',

  state: 'OPENING', // OPENING, QUIZ, RESULT
  currentQuestionIndex: 0,
  score: 0,
  answered: false,

  questions: [
    {
      q: "what's the thing you say the most?",
      options: [
        "lol",
        "okayyy",
        "yawr and haw",
        "ohhh"
      ],
      correct: 2, // "yawr and haw"
      correctMsg: "YESS 😭 I KNEW IT",
      wrongMsg: "haha nope 😭"
    },
    {
      q: "what u like to do the most?",
      options: [
        "play badminton",
        "dance",
        "yap",
        "POOP 👿👿"
      ],
      correct: 3, // "POOP 👿👿"
      correctMsg: "NAHHH 😭 OF COURSE IT'S THIS",
      wrongMsg: "nope not that one 😭"
    },
    {
      q: "whats my nickname?",
      options: [
        "adi",
        "takla gittha mogu mogu",
        "mogu",
        "mogesh"
      ],
      correct: 1, // "takla gittha mogu mogu"
      correctMsg: "YESS 😭 YOU ACTUALLY REMEMBERED",
      wrongMsg: "hey! that's not it 😭"
    },
    {
      q: "whats ur fav number?",
      options: [
        "8",
        "4",
        "5 2 3 9",
        "1"
      ],
      correct: 2, // "5 2 3 9"
      correctMsg: "YES i remember ur fav numbers", // EXACT MESSAGE
      wrongMsg: "wrong answer 😭"
    },
    {
      q: "when is ur father's birthday?",
      options: [
        "4 august",
        "17 april",
        "29 october",
        "30 july"
      ],
      correct: 3, // "30 july"
      correctMsg: "i remember this too", // EXACT MESSAGE
      wrongMsg: "think again 😭"
    },
    {
      q: "so how we will end up in the future?",
      options: [
        "as friends only",
        "as cute couples",
        "as enemies",
        "as strangers"
      ],
      correct: 1, // "as cute couples"
      correctMsg: "well, we got same brains👉👈", // EXACT MESSAGE
      wrongMsg: "oh" // EXACT MESSAGE
    }
  ],

  render() {
    this.state = 'OPENING';
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.answered = false;

    const container = document.createElement('div');
    container.className = 'page8-container';

    container.innerHTML = `
      <!-- Ambient Arcade Pixel Stars -->
      <div class="p8-decorations">
        <div class="p8-star p8-star-1">✦</div>
        <div class="p8-star p8-star-2">★</div>
        <div class="p8-star p8-star-3">✦</div>
        <div class="p8-star p8-star-4">★</div>
      </div>

      <!-- Main Stage Container -->
      <div class="p8-stage" id="p8-stage">
        <!-- Opening Screen Card -->
        <div class="p8-opening-card" id="p8-opening-card">
          <div class="p8-arcade-badge">🎮 Arcade Birthday Challenge</div>
          <h2 class="p8-open-title">OKAY, LET'S SEE... 👀</h2>
          <div class="p8-open-subtitle">How well do I know you?</div>
          <div class="p8-open-subtext">6 questions. Don't disappoint me. 😭</div>
          <button class="btn-p8-action btn-p8-start" id="btn-p8-start">START 🎮 →</button>
        </div>

        <!-- Quiz Card (Hidden during Opening) -->
        <div class="p8-quiz-card hidden" id="p8-quiz-card">
          <!-- Dynamic Content -->
        </div>

        <!-- Result Card (Hidden initially) -->
        <div class="p8-result-card hidden" id="p8-result-card">
          <!-- Dynamic Result Content -->
        </div>
      </div>
    `;

    setTimeout(() => {
      this.attachEvents(container);
    }, 0);

    return container;
  },

  attachEvents(container) {
    const startBtn = container.querySelector('#btn-p8-start');
    const openingCard = container.querySelector('#p8-opening-card');
    const quizCard = container.querySelector('#p8-quiz-card');
    const resultCard = container.querySelector('#p8-result-card');

    if (startBtn) {
      startBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openingCard.classList.add('hidden');
        quizCard.classList.remove('hidden');
        this.renderQuestion(quizCard, resultCard);
      });
    }
  },

  renderQuestion(quizCard, resultCard) {
    this.answered = false;
    const qData = this.questions[this.currentQuestionIndex];

    quizCard.innerHTML = `
      <div class="p8-q-header">
        <div class="p8-arcade-badge">QUESTION</div>
        <div class="p8-q-tracker">${this.currentQuestionIndex + 1} / ${this.questions.length}</div>
      </div>
      <h3 class="p8-q-title">${qData.q}</h3>
      <div class="p8-options-list" id="p8-options-list">
        ${qData.options.map((opt, idx) => `
          <button class="p8-opt-btn" data-index="${idx}">
            <span>${opt}</span>
            <span class="p8-opt-icon" id="opt-icon-${idx}"></span>
          </button>
        `).join('')}
      </div>

      <!-- Reaction Box (Appears after answer selection) -->
      <div class="p8-reaction-box hidden" id="p8-reaction-box">
        <p class="p8-reaction-text" id="p8-reaction-text"></p>
      </div>

      <!-- Continue Button Area -->
      <div class="p8-controls-area hidden" id="p8-controls">
        <button class="btn-p8-action" id="btn-p8-continue">CONTINUE ➔</button>
      </div>
    `;

    const optBtns = quizCard.querySelectorAll('.p8-opt-btn');
    const reactionBox = quizCard.querySelector('#p8-reaction-box');
    const reactionText = quizCard.querySelector('#p8-reaction-text');
    const controlsArea = quizCard.querySelector('#p8-controls');
    const continueBtn = quizCard.querySelector('#btn-p8-continue');

    optBtns.forEach(btn => {
      const handleSelect = (e) => {
        e.preventDefault();
        if (this.answered) return;
        this.answered = true;

        const selectedIdx = parseInt(btn.getAttribute('data-index'), 10);
        const isCorrect = selectedIdx === qData.correct;

        // Disable all option buttons to prevent multiple selections
        optBtns.forEach(b => b.classList.add('disabled'));

        if (isCorrect) {
          this.score++;
          btn.classList.add('correct');
          const iconEl = btn.querySelector('.p8-opt-icon');
          if (iconEl) iconEl.textContent = '✓';

          reactionText.textContent = qData.correctMsg;

          if (window.particleSystem) {
            const rect = btn.getBoundingClientRect();
            window.particleSystem.triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25, 'rgba(74, 222, 128, ');
          }
        } else {
          btn.classList.add('wrong');
          const iconEl = btn.querySelector('.p8-opt-icon');
          if (iconEl) iconEl.textContent = '✕';

          // Highlight correct answer gently
          const correctBtn = quizCard.querySelector(`.p8-opt-btn[data-index="${qData.correct}"]`);
          if (correctBtn) {
            correctBtn.classList.add('correct');
            const cIcon = correctBtn.querySelector('.p8-opt-icon');
            if (cIcon) cIcon.textContent = '✓';
          }

          reactionText.textContent = qData.wrongMsg;

          if (window.particleSystem) {
            const rect = btn.getBoundingClientRect();
            window.particleSystem.triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 15, 'rgba(248, 113, 113, ');
          }
        }

        // Show Reaction Banner & Continue Button
        reactionBox.classList.remove('hidden');
        controlsArea.classList.remove('hidden');
      };

      btn.addEventListener('click', handleSelect);
      btn.addEventListener('touchstart', handleSelect, { passive: false });
    });

    if (continueBtn) {
      continueBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.currentQuestionIndex++;

        if (this.currentQuestionIndex < this.questions.length) {
          this.renderQuestion(quizCard, resultCard);
        } else {
          quizCard.classList.add('hidden');
          resultCard.classList.remove('hidden');
          this.renderResult(resultCard);
        }
      });
    }
  },

  renderResult(resultCard) {
    this.state = 'RESULT';

    let msg1 = "";
    let msg2 = "";

    if (this.score === 6) {
      msg1 = "BIRTHDAY GIRL APPROVED. 🎂✨";
      msg2 = "okayyy you actually know me 😭";
    } else if (this.score === 5) {
      msg1 = "okayyy not bad 😭";
      msg2 = "you know me pretty well";
    } else if (this.score >= 3) {
      msg1 = "WE NEED TO TALK 😭";
      msg2 = "how did you get those wronggg";
    } else {
      msg1 = "NAHHHH 😭";
      msg2 = "WHO ARE YOU";
    }

    resultCard.innerHTML = `
      <div class="p8-arcade-badge">QUIZ COMPLETE 🎮✨</div>
      <div class="p8-score-circle">${this.score} / 6</div>
      <h3 class="p8-result-title">${msg1}</h3>
      <p class="p8-result-msg2">${msg2}</p>
      <div class="p8-ready-text">Ready for what's next? 👀</div>
      <div class="p8-controls-area">
        <button class="btn-p8-action btn-p8-start" id="btn-p8-finish">CONTINUE →</button>
      </div>
    `;

    if (window.particleSystem) {
      window.particleSystem.triggerFireworks(4000);
    }

    const finishBtn = resultCard.querySelector('#btn-p8-finish');
    if (finishBtn) {
      finishBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleNextNavigation();
      });
    }
  },

  handleNextNavigation() {
    console.log("🎮 User tapped CONTINUE on Page 8 Result");
    if (window.particleSystem) {
      window.particleSystem.triggerBurst(window.innerWidth / 2, window.innerHeight / 2, 45);
    }

    if (window.pageManager && window.pageManager.pages.has('page9')) {
      window.pageManager.navigateTo('page9');
    } else {
      console.log("✨ Page 8 complete! Staying at final quiz celebration.");
    }
  },

  onEnter() {
    console.log("🎮 Page 8 Active — Arcade Birthday Quiz!");
  },

  onLeave() {
    console.log("🎮 Transitioning out of Page 8...");
  }
};
