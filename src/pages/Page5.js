/**
 * Page5.js - Dreamy Night Room Hidden-Object Exploration Experience
 * Theme: 'dreamy-night' (Midnight Blue, Deep Purple, Lavender, Golden Fairy Lights, Moonlight)
 * Features an immersive 3D-esque room scene with 6 camouflaged hidden objects, vague hint system,
 * dynamic room lighting evolution (3/6 & 5/6), golden key unlock, and verbatim final reveal: "DANGG you are so cool yawr".
 */

window.Page5 = {
  theme: 'dreamy-night',
  discoveredSet: new Set(),

  render() {
    this.discoveredSet = new Set();

    const container = document.createElement('div');
    container.className = 'page5-container';

    container.innerHTML = `
      <!-- Header Section -->
      <div class="p5-header-group">
        <h2 class="p5-title">Find the little things... ✨</h2>
        <div class="p5-subtitle-group">
          <p class="p5-sub">I hid a few tiny surprises here.</p>
          <p class="p5-sub">See if you can find them all. 👀</p>
        </div>
      </div>

      <!-- Control Bar: Progress Badge & Hint Button -->
      <div class="p5-control-bar">
        <div class="p5-progress-badge" id="p5-progress">
          0 / 6 little things found ✨
        </div>
        <button class="btn-p5-hint" id="btn-p5-hint">Need a hint? ✨</button>
      </div>

      <!-- Immersive Cozy Moonlit Room Scene Stage -->
      <div class="p5-room-scene" id="p5-room">
        <!-- Environmental Fairy Lights String -->
        <div class="p5-fairy-lights">
          <div class="p5-light-bulb"></div>
          <div class="p5-light-bulb"></div>
          <div class="p5-light-bulb"></div>
          <div class="p5-light-bulb"></div>
          <div class="p5-light-bulb"></div>
          <div class="p5-light-bulb"></div>
        </div>

        <!-- Window View to Night Sky (Top Right) -->
        <div class="p5-window-view">
          <div class="p5-moon">🌙</div>
          <div class="p5-sky-stars">✨ ✦ ✧</div>
        </div>

        <!-- Wall Photo String (Top Left) -->
        <div class="p5-wall-photos-string">
          <div class="p5-decor-photo">🌌</div>
          <div class="p5-decor-photo">✨</div>
        </div>

        <!-- Desk & Accessories (Middle Right) -->
        <div class="p5-desk-graphic">
          <div class="p5-lamp">💡</div>
          <div class="p5-books">📚</div>
        </div>

        <!-- Bed & Blanket (Bottom Left) -->
        <div class="p5-bed-graphic">
          <div class="p5-pillow-left"></div>
          <div class="p5-pillow-right"></div>
        </div>

        <!-- Cozy Chair (Bottom Right) -->
        <div class="p5-chair-graphic"></div>

        <!-- 6 Hidden Target Hitboxes (Naturally Camouflaged in Room) -->

        <!-- Target 1: Envelope (Tucked beside bed pillow) -->
        <div class="p5-target-hitbox p5-target-envelope" data-obj="1" aria-label="Search near bed pillow">
          <div class="p5-target-icon">💌</div>
        </div>

        <!-- Target 2: Flower (Desk flower arrangement) -->
        <div class="p5-target-hitbox p5-target-flower" data-obj="2" aria-label="Search desk plant vase">
          <div class="p5-target-icon">🌸</div>
        </div>

        <!-- Target 3: Star (Sky star near window) -->
        <div class="p5-target-hitbox p5-target-star" data-obj="3" aria-label="Search night sky window">
          <div class="p5-target-icon">⭐</div>
        </div>

        <!-- Target 4: Ribbon (Tied on desk lamp/handle) -->
        <div class="p5-target-hitbox p5-target-ribbon" data-obj="4" aria-label="Search desk decoration">
          <div class="p5-target-icon">🎀</div>
        </div>

        <!-- Target 5: Teddy Bear (Sitting on cozy chair) -->
        <div class="p5-target-hitbox p5-target-teddy" data-obj="5" aria-label="Search cozy chair">
          <div class="p5-target-icon">🧸</div>
        </div>

        <!-- Target 6: Polaroid Photo (Among wall photo string) -->
        <div class="p5-target-hitbox p5-target-polaroid" data-obj="6" aria-label="Search wall photos">
          <div class="p5-target-icon">📸</div>
        </div>

        <!-- Golden Key Reveal Overlay (Appears inside room after 6/6) -->
        <div class="p5-key-overlay hidden" id="p5-key-overlay">
          <div class="p5-key-title">You found everything. ✨</div>
          <div class="p5-key-subtext">There's one more thing...</div>
          <div class="p5-golden-key-btn" id="btn-golden-key" aria-label="Unlock final golden key">🔑</div>
        </div>
      </div>

      <!-- Modal Backdrop for Discoveries, Hints, and Final Reveal -->
      <div id="p5-modal-overlay" class="p5-modal-backdrop hidden"></div>
    `;

    setTimeout(() => {
      this.attachEvents(container);
    }, 0);

    return container;
  },

  attachEvents(container) {
    console.log("✨ Page 5: Attaching hidden-object room event listeners...");
    const targets = container.querySelectorAll('.p5-target-hitbox');
    const overlay = container.querySelector('#p5-modal-overlay');
    const room = container.querySelector('#p5-room');
    const progressEl = container.querySelector('#p5-progress');
    const hintBtn = container.querySelector('#btn-p5-hint');
    const keyOverlay = container.querySelector('#p5-key-overlay');
    const goldenKeyBtn = container.querySelector('#btn-golden-key');

    const discoveryData = {
      1: {
        title: "You found the tiny envelope! 💌",
        message: "Some things are better\ntold in little notes. ❤️",
        clue: "Something cozy might be hiding a little secret... 👀"
      },
      2: {
        title: "You found the flower! 🌸",
        message: "This one is just here\nbecause it looked cute. 🌸",
        clue: "Look closely at the things that grow around here... 🌸"
      },
      3: {
        title: "You found the star! ⭐",
        message: "You actually made it this far.\nRespect. 😭",
        clue: "Maybe the sky is hiding more than you think... ✨"
      },
      4: {
        title: "You found the ribbon! 🎀",
        message: "Okay I definitely spent\ntoo much time making this. 😭",
        clue: "Something is tied up where you least expect it... 🎀"
      },
      5: {
        title: "You found the teddy! 🧸",
        message: "Just a little buddy\ncheering for you always.",
        clue: "There's a little buddy hiding somewhere nearby... 🧸"
      },
      6: {
        title: "You found the photo! 📸",
        message: "Memories are my favorite\nkind of magic. ✨",
        clue: "Some memories are hiding among other memories... 📸"
      }
    };

    // Target Hitbox Event Listeners
    targets.forEach(target => {
      const objId = parseInt(target.getAttribute('data-obj'), 10);

      const handleTap = (e) => {
        e.preventDefault();
        console.log(`✨ Hidden Object ${objId} discovered!`);

        // Sparkle particle burst at click coordinates
        if (window.particleSystem) {
          const rect = target.getBoundingClientRect();
          window.particleSystem.triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);
        }

        // Mark object as discovered
        this.discoveredSet.add(objId);
        target.classList.add('found');

        // Update progress badge
        const count = this.discoveredSet.size;
        if (progressEl) {
          progressEl.textContent = `${count} / 6 little things found ✨`;
          if (count === 6) {
            progressEl.classList.add('completed');
          }
        }

        // Environmental Room Evolution
        if (count === 3 && room && !room.classList.contains('evolved-stage-1')) {
          room.classList.add('evolved-stage-1');
          this.showToastNotice(container, "Wait... something changed. ✨");
        } else if (count === 5 && room && !room.classList.contains('evolved-stage-2')) {
          room.classList.add('evolved-stage-2');
        }

        // Open Discovery Card Modal
        this.openDiscoveryModal(overlay, discoveryData[objId], () => {
          // Check if all 6 found after closing modal
          if (this.discoveredSet.size === 6 && keyOverlay) {
            room.classList.add('dimmed-for-key');
            keyOverlay.classList.remove('hidden');
            if (window.particleSystem) {
              window.particleSystem.triggerFireworks(4000);
            }
          }
        });
      };

      target.addEventListener('click', handleTap);
    });

    // Hint System Handler
    if (hintBtn) {
      hintBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("✨ User requested a hint");
        this.showVagueHint(overlay, discoveryData);
      });
    }

    // Golden Key Handler
    if (goldenKeyBtn) {
      goldenKeyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("🔑 Golden key tapped!");
        if (window.particleSystem) {
          window.particleSystem.triggerFireworks(5000);
        }
        this.openFinalRevealModal(overlay);
      });
    }
  },

  showToastNotice(container, text) {
    const toast = document.createElement('div');
    toast.className = 'p5-toast-notice';
    toast.textContent = text;
    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3200);
  },

  showVagueHint(overlay, discoveryData) {
    // Find undiscovered objects
    const undiscovered = [];
    for (let id = 1; id <= 6; id++) {
      if (!this.discoveredSet.has(id)) {
        undiscovered.push(id);
      }
    }

    if (undiscovered.length === 0) {
      this.openDiscoveryModal(overlay, {
        title: "All Surprises Found! ✨",
        message: "You've already discovered all six little things!\nTap the Golden Key 🔑 to unlock the final secret."
      });
      return;
    }

    // Pick random undiscovered clue
    const randomId = undiscovered[Math.floor(Math.random() * undiscovered.length)];
    const clueText = discoveryData[randomId].clue;

    this.openDiscoveryModal(overlay, {
      title: "Little Hint ✨",
      message: clueText
    });
  },

  openDiscoveryModal(overlay, data, onCloseCallback) {
    if (!overlay) return;
    overlay.innerHTML = '';
    overlay.classList.remove('hidden');

    const card = document.createElement('div');
    card.className = 'p5-modal-card';

    card.innerHTML = `
      <div class="p5-modal-title">${data.title}</div>
      <div class="p5-modal-body">${data.message}</div>
      <div class="p5-modal-controls">
        <button class="btn-p5-action" id="btn-p5-modal-close">CLOSE</button>
      </div>
    `;

    overlay.appendChild(card);

    const closeBtn = card.querySelector('#btn-p5-modal-close');
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('hidden');
      overlay.innerHTML = '';
      if (onCloseCallback) onCloseCallback();
    });
  },

  openFinalRevealModal(overlay) {
    if (!overlay) return;
    overlay.innerHTML = '';
    overlay.classList.remove('hidden');

    const card = document.createElement('div');
    card.className = 'p5-modal-card p5-final-card';

    card.innerHTML = `
      <div class="p5-modal-title">You unlocked the last secret! 🔑✨</div>
      <div class="p5-final-text">DANGG you are so cool yawr</div>
      <div class="p5-modal-controls">
        <button class="btn-p5-action btn-p5-next" id="btn-p5-final-next">NEXT →</button>
      </div>
    `;

    overlay.appendChild(card);

    const nextBtn = card.querySelector('#btn-p5-final-next');
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleNextNavigation();
    });
  },

  handleNextNavigation() {
    console.log("✨ User tapped NEXT on Page 5");
    if (window.particleSystem) {
      window.particleSystem.triggerBurst(window.innerWidth / 2, window.innerHeight / 2, 40);
    }

    if (window.pageManager && window.pageManager.pages.has('page6')) {
      window.pageManager.navigateTo('page6');
    } else {
      const overlay = document.querySelector('#p5-modal-overlay');
      if (overlay) {
        overlay.classList.remove('hidden');
        overlay.innerHTML = `
          <div class="p5-modal-card">
            <div class="p5-modal-title">✨ To be continued...</div>
            <div class="p5-modal-body">Page 6 awaits in the next chapter! 💖</div>
            <div class="p5-modal-controls">
              <button class="btn-p5-action" onclick="document.querySelector('#p5-modal-overlay').classList.add('hidden')">CLOSE</button>
            </div>
          </div>
        `;
      }
    }
  },

  onEnter() {
    console.log("✨ Page 5 Active — Dreamy Night Room Hidden-Object Exploration");
  },

  onLeave() {
    console.log("✨ Transitioning out of Page 5...");
  }
};
