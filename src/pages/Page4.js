/**
 * Page4.js - Interactive Birthday Gift Boxes & Celebration Page
 * Theme: 'birthday-warm' (blush pink, rose, soft peach, warm cream, champagne gold)
 * Features 5 decorative present boxes, verbatim message reveals, interactive Tic-Tac-Toe
 * mini-game for Box 5, victory fireworks celebration, and smooth mobile navigation.
 */

window.Page4 = {
  theme: 'birthday-warm',
  hasWonBox5: false,
  activeModal: null,

  render() {
    const container = document.createElement('div');
    container.className = 'page4-container';

    container.innerHTML = `
      <!-- Header Section -->
      <div class="p4-header-group">
        <h2 class="p4-title">Pick Your Birthday Gifts! 🎁</h2>
        <p class="p4-subtitle">Tap any box to open... unlock the special surprise ✨</p>
      </div>

      <!-- 5 Decorative Gift Boxes Grid -->
      <div class="p4-boxes-grid">
        <!-- Box 1 -->
        <div class="p4-box-wrapper">
          <div class="p4-box-card" data-box="1" aria-label="Open Gift Box 1">
            <div class="p4-present-graphic">
              <div class="p4-ribbon-v"></div>
              <div class="p4-ribbon-h"></div>
              <div class="p4-bow">🎀</div>
            </div>
            <span class="p4-box-label">Box 1</span>
          </div>
        </div>

        <!-- Box 2 -->
        <div class="p4-box-wrapper">
          <div class="p4-box-card" data-box="2" aria-label="Open Gift Box 2">
            <div class="p4-present-graphic">
              <div class="p4-ribbon-v"></div>
              <div class="p4-ribbon-h"></div>
              <div class="p4-bow">🎁</div>
            </div>
            <span class="p4-box-label">Box 2</span>
          </div>
        </div>

        <!-- Box 3 -->
        <div class="p4-box-wrapper">
          <div class="p4-box-card" data-box="3" aria-label="Open Gift Box 3">
            <div class="p4-present-graphic">
              <div class="p4-ribbon-v"></div>
              <div class="p4-ribbon-h"></div>
              <div class="p4-bow">✨</div>
            </div>
            <span class="p4-box-label">Box 3</span>
          </div>
        </div>

        <!-- Box 4 -->
        <div class="p4-box-wrapper">
          <div class="p4-box-card" data-box="4" aria-label="Open Gift Box 4">
            <div class="p4-present-graphic">
              <div class="p4-ribbon-v"></div>
              <div class="p4-ribbon-h"></div>
              <div class="p4-bow">💖</div>
            </div>
            <span class="p4-box-label">Box 4</span>
          </div>
        </div>

        <!-- Box 5 — SPECIAL GIFT -->
        <div class="p4-box-wrapper">
          <div class="p4-box-card p4-box-special" data-box="5" aria-label="Open Special Gift Box 5">
            <div class="p4-present-graphic">
              <div class="p4-ribbon-v"></div>
              <div class="p4-ribbon-h"></div>
              <div class="p4-bow">👑</div>
            </div>
            <span class="p4-box-label">Box 5 — Special Gift 👑</span>
          </div>
        </div>
      </div>

      <!-- Dynamic Modal Container Overlay -->
      <div id="p4-modal-overlay" class="p4-modal-backdrop hidden"></div>
    `;

    setTimeout(() => {
      this.attachEvents(container);
    }, 0);

    return container;
  },

  attachEvents(container) {
    console.log("🎁 Page 4: Attaching gift box event listeners...");
    const boxCards = container.querySelectorAll('.p4-box-card');
    const overlay = container.querySelector('#p4-modal-overlay');

    boxCards.forEach(box => {
      const boxId = parseInt(box.getAttribute('data-box'), 10);
      const handleTap = (e) => {
        e.preventDefault();
        console.log(`🎁 Gift Box ${boxId} tapped!`);
        
        // Burst particles on tap
        if (window.particleSystem) {
          const rect = box.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          window.particleSystem.triggerBurst(centerX, centerY, 35);
        }

        this.openBox(boxId, overlay);
      };

      box.addEventListener('click', handleTap);
    });
  },

  openBox(boxId, overlay) {
    console.log(`🎁 Opening Box ${boxId}...`);
    if (!overlay) {
      console.error("🎁 Error: Modal overlay element not found!");
      return;
    }
    overlay.innerHTML = '';
    overlay.classList.remove('hidden');

    if (boxId === 1) {
      this.renderMessageModal(
        overlay,
        "HAPPIEST BIRTHDAY IVAA YOU'RE 14 NOWW YAAYYYY!!!"
      );
    } else if (boxId === 2) {
      this.renderMessageModal(
        overlay,
        "I'M SO HAPPY FOR YOU !!"
      );
    } else if (boxId === 3) {
      this.renderMessageModal(
        overlay,
        "i wish i could see ur smiling face rnnn"
      );
    } else if (boxId === 4) {
      this.renderMessageModal(
        overlay,
        "i love the way u smile"
      );
    } else if (boxId === 5) {
      if (this.hasWonBox5) {
        // If already won, show victory celebration card
        this.renderCelebrationModal(overlay);
      } else {
        // Render Tic-Tac-Toe Game
        this.renderTicTacToeGame(overlay);
      }
    }
  },

  renderMessageModal(overlay, messageText) {
    const card = document.createElement('div');
    card.className = 'p4-modal-card';

    const showNextBtn = this.hasWonBox5;

    card.innerHTML = `
      <div class="p4-message-text">${messageText}</div>
      <div class="p4-modal-controls">
        <button class="btn-p4-action btn-p4-close" id="btn-modal-close">CLOSE</button>
        ${showNextBtn ? `<button class="btn-p4-action btn-p4-next" id="btn-modal-next">NEXT →</button>` : ''}
      </div>
    `;

    overlay.appendChild(card);

    const closeBtn = card.querySelector('#btn-modal-close');
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('hidden');
      overlay.innerHTML = '';
    });

    const nextBtn = card.querySelector('#btn-modal-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleNextNavigation();
      });
    }
  },

  renderTicTacToeGame(overlay) {
    const card = document.createElement('div');
    card.className = 'p4-modal-card';

    card.innerHTML = `
      <div class="p4-game-container">
        <h3 class="p4-game-title">Special Gift Challenge 👑</h3>
        <p class="p4-game-sub">Win Tic-Tac-Toe against the site to unlock the birthday celebration!</p>

        <div class="p4-ttt-grid" id="ttt-grid">
          <div class="p4-ttt-cell" data-index="0"></div>
          <div class="p4-ttt-cell" data-index="1"></div>
          <div class="p4-ttt-cell" data-index="2"></div>
          <div class="p4-ttt-cell" data-index="3"></div>
          <div class="p4-ttt-cell" data-index="4"></div>
          <div class="p4-ttt-cell" data-index="5"></div>
          <div class="p4-ttt-cell" data-index="6"></div>
          <div class="p4-ttt-cell" data-index="7"></div>
          <div class="p4-ttt-cell" data-index="8"></div>
        </div>

        <div class="p4-game-status" id="ttt-status">Your turn! Tap any spot ✨</div>

        <div class="p4-modal-controls">
          <button class="btn-p4-action btn-p4-close" id="btn-game-close">CLOSE</button>
          <button class="btn-p4-action hidden" id="btn-game-replay">PLAY AGAIN 🔄</button>
        </div>
      </div>
    `;

    overlay.appendChild(card);

    this.initTicTacToeLogic(card, overlay);
  },

  initTicTacToeLogic(card, overlay) {
    let board = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    const human = 'X';
    const ai = 'O';

    const cells = card.querySelectorAll('.p4-ttt-cell');
    const statusEl = card.querySelector('#ttt-status');
    const closeBtn = card.querySelector('#btn-game-close');
    const replayBtn = card.querySelector('#btn-game-replay');

    const winningCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    const checkWin = (currentBoard, player) => {
      return winningCombos.some(combo => {
        return combo.every(index => currentBoard[index] === player);
      });
    };

    const isBoardFull = (currentBoard) => {
      return currentBoard.every(cell => cell !== '');
    };

    const handleCellClick = (index) => {
      if (!gameActive || board[index] !== '') return;

      // Human move
      board[index] = human;
      cells[index].textContent = human;
      cells[index].classList.add('mark-x');

      if (window.particleSystem) {
        const rect = cells[index].getBoundingClientRect();
        window.particleSystem.triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);
      }

      if (checkWin(board, human)) {
        gameActive = false;
        this.hasWonBox5 = true;
        statusEl.textContent = "YOU WON! 🎉 Unlocking special celebration...";
        
        // Trigger Fireworks Celebration
        if (window.particleSystem) {
          window.particleSystem.triggerFireworks(6000);
        }

        setTimeout(() => {
          overlay.innerHTML = '';
          this.renderCelebrationModal(overlay);
        }, 1200);
        return;
      }

      if (isBoardFull(board)) {
        gameActive = false;
        statusEl.textContent = "It's a draw! Give it another try 💕";
        replayBtn.classList.remove('hidden');
        return;
      }

      // AI turn
      gameActive = false;
      statusEl.textContent = "Thinking... 💭";

      setTimeout(() => {
        makeAiMove();
      }, 500);
    };

    const makeAiMove = () => {
      const emptyIndices = board
        .map((val, idx) => (val === '' ? idx : null))
        .filter(val => val !== null);

      if (emptyIndices.length === 0) return;

      let chosenIndex = null;

      // 1. Check if AI can win in 1 move
      for (let idx of emptyIndices) {
        let tempBoard = [...board];
        tempBoard[idx] = ai;
        if (checkWin(tempBoard, ai)) {
          // 40% chance AI takes it, 60% skip so user can win easily
          if (Math.random() < 0.4) {
            chosenIndex = idx;
            break;
          }
        }
      }

      // 2. Check if Human is about to win -> Block human (50% chance)
      if (chosenIndex === null) {
        for (let idx of emptyIndices) {
          let tempBoard = [...board];
          tempBoard[idx] = human;
          if (checkWin(tempBoard, human)) {
            if (Math.random() < 0.5) {
              chosenIndex = idx;
              break;
            }
          }
        }
      }

      // 3. Fallback: random move
      if (chosenIndex === null) {
        chosenIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      }

      board[chosenIndex] = ai;
      cells[chosenIndex].textContent = ai;
      cells[chosenIndex].classList.add('mark-o');

      if (checkWin(board, ai)) {
        gameActive = false;
        statusEl.textContent = "So close! Give it another go! 💫";
        replayBtn.classList.remove('hidden');
        return;
      }

      if (isBoardFull(board)) {
        gameActive = false;
        statusEl.textContent = "It's a draw! Try again 💕";
        replayBtn.classList.remove('hidden');
        return;
      }

      gameActive = true;
      statusEl.textContent = "Your turn! ✨";
    };

    cells.forEach(cell => {
      const idx = parseInt(cell.getAttribute('data-index'), 10);
      const cellTap = (e) => {
        e.preventDefault();
        handleCellClick(idx);
      };
      cell.addEventListener('click', cellTap);
      cell.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch') cellTap(e);
      });
    });

    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('hidden');
      overlay.innerHTML = '';
    });

    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      board = ['', '', '', '', '', '', '', '', ''];
      gameActive = true;
      cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'p4-ttt-cell';
      });
      statusEl.textContent = "Your turn! Tap any spot ✨";
      replayBtn.classList.add('hidden');
    });
  },

  renderCelebrationModal(overlay) {
    overlay.innerHTML = '';
    overlay.classList.remove('hidden');

    const card = document.createElement('div');
    card.className = 'p4-modal-card p4-celebration-card';

    card.innerHTML = `
      <div class="p4-celebration-title">HAPPY BIRTHDAY!! 🎉</div>
      <div class="p4-celebration-sub">
        You unlocked the special gift! ✨<br/>
        May your day be filled with endless joy, smiles, and magic! 💕
      </div>
      <div class="p4-modal-controls">
        <button class="btn-p4-action btn-p4-close" id="btn-celeb-close">CLOSE</button>
        <button class="btn-p4-action btn-p4-next" id="btn-celeb-next">NEXT →</button>
      </div>
    `;

    overlay.appendChild(card);

    // Launch continuous fireworks bursts
    if (window.particleSystem) {
      window.particleSystem.triggerFireworks(5000);
    }

    const closeBtn = card.querySelector('#btn-celeb-close');
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('hidden');
      overlay.innerHTML = '';
    });

    const nextBtn = card.querySelector('#btn-celeb-next');
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleNextNavigation();
    });
  },

  handleNextNavigation() {
    console.log("✨ User tapped NEXT on Page 4");
    if (window.particleSystem) {
      window.particleSystem.triggerBurst(window.innerWidth / 2, window.innerHeight / 2, 40);
    }

    if (window.pageManager && window.pageManager.pages.has('page5')) {
      window.pageManager.navigateTo('page5');
    } else {
      // Show sweet alert/notice when Page 5 is not created yet
      const overlay = document.querySelector('#p4-modal-overlay');
      if (overlay) {
        overlay.classList.remove('hidden');
        overlay.innerHTML = `
          <div class="p4-modal-card">
            <div class="p4-message-text">✨ To be continued... Page 5 awaits! 💖</div>
            <div class="p4-modal-controls">
              <button class="btn-p4-action btn-p4-close" onclick="document.querySelector('#p4-modal-overlay').classList.add('hidden')">CLOSE</button>
            </div>
          </div>
        `;
      }
    }
  },

  onEnter() {
    console.log("✨ Page 4 Active — Warm Birthday Gift Box Experience");
  },

  onLeave() {
    console.log("✨ Transitioning out of Page 4...");
  }
};
