/**
 * Page6.js - Quiet Midnight Memory Universe
 * Theme: 'midnight-constellation' (Deep Midnight Navy, Dark Indigo, Rich Purple, Soft Lavender, Golden Stars)
 * Features 3 floating constellation nodes, verbatim personal messages, constellation illumination,
 * two-line final reveal, and smooth mobile navigation.
 */

window.Page6 = {
  theme: 'midnight-constellation',
  openedSet: new Set(),

  render() {
    this.openedSet = new Set();

    const container = document.createElement('div');
    container.className = 'page6-container';

    container.innerHTML = `
      <!-- Header Section -->
      <div class="p6-header-group">
        <h2 class="p6-title">A few thoughts I saved for you... ✨</h2>
        <p class="p6-subtitle">Some things are easier to say when the world is quiet.</p>
      </div>

      <!-- Progress Tracker Indicator -->
      <div class="p6-progress-tracker" id="p6-progress">
        0 / 3 thoughts opened ✦
      </div>

      <!-- Constellation Stage Viewport -->
      <div class="p6-constellation-stage" id="p6-stage">
        <!-- SVG Constellation Line Connections -->
        <svg class="p6-constellation-svg" viewBox="0 0 370 380" preserveAspectRatio="none">
          <!-- Line connecting Node 1 to Node 2 -->
          <line id="line-1-2" class="p6-const-line" x1="120" y1="80" x2="270" y2="185" />
          <!-- Line connecting Node 2 to Node 3 -->
          <line id="line-2-3" class="p6-const-line" x1="270" y1="185" x2="160" y2="310" />
          <!-- Line connecting Node 3 to Node 1 -->
          <line id="line-3-1" class="p6-const-line" x1="160" y1="310" x2="120" y2="80" />
        </svg>

        <!-- Node 1 -->
        <div class="p6-node p6-node-1" data-node="1" aria-label="Open thought 1">
          <span class="p6-node-star">✦</span>
          <span>"A little thought"</span>
        </div>

        <!-- Node 2 -->
        <div class="p6-node p6-node-2" data-node="2" aria-label="Open thought 2">
          <span class="p6-node-star">✦</span>
          <span>"Something I remember"</span>
        </div>

        <!-- Node 3 -->
        <div class="p6-node p6-node-3" data-node="3" aria-label="Open thought 3">
          <span class="p6-node-star">✦</span>
          <span>"One more thing"</span>
        </div>
      </div>

      <!-- Final Constellation Reveal Group (Appears after 3/3 thoughts opened) -->
      <div class="p6-final-reveal-group hidden" id="p6-final-group">
        <div class="p6-final-line1">Maybe that's what makes little moments special... ✨</div>
        <div class="p6-final-line2">they turn into memories before you even realize it.</div>
        <button class="btn-p6-action btn-p6-next" id="btn-p6-next">NEXT →</button>
      </div>

      <!-- Memory Card Overlay -->
      <div id="p6-modal-overlay" class="p6-modal-backdrop hidden"></div>
    `;

    setTimeout(() => {
      this.attachEvents(container);
    }, 0);

    return container;
  },

  attachEvents(container) {
    console.log("✨ Page 6: Attaching quiet midnight memory constellation listeners...");
    const nodes = container.querySelectorAll('.p6-node');
    const overlay = container.querySelector('#p6-modal-overlay');
    const progressEl = container.querySelector('#p6-progress');
    const finalGroup = container.querySelector('#p6-final-group');
    const line12 = container.querySelector('#line-1-2');
    const line23 = container.querySelector('#line-2-3');
    const line31 = container.querySelector('#line-3-1');
    const nextBtn = container.querySelector('#btn-p6-next');

    const memoryData = {
      1: {
        title: "A random thought... 💭",
        message: `remember our first call it was soo cute
i love ur voice it's more cutee

i hope we are friends forever`
      },
      2: {
        title: "Something I still remember... ✨",
        message: `happiest birthday ivaa

wow u made this far!! ofcc birthday girll you are the bestt

do u remember when the first time we met in cod
and u told me to wait because u got ban and then i waited loll

i still think about it sometimes because i MET YOU YAWR!!

and i'm so happy that i met u
and i wish u the happiest birthday and you will achieve all ur dreams

i will never stop supporting you i will be always and always there for u

happy birthday once again

noww there's more ahead cutie goo exploreee`
      },
      3: {
        title: "One last little thought... 🌙",
        message: `some memories are funny because they start
as something completely random...

and then suddenly become something
you never expected to find. ✨`
      }
    };

    nodes.forEach(node => {
      const nodeId = parseInt(node.getAttribute('data-node'), 10);

      const handleTap = (e) => {
        e.preventDefault();
        console.log(`✨ Constellation Node ${nodeId} tapped!`);

        if (window.particleSystem) {
          const rect = node.getBoundingClientRect();
          window.particleSystem.triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);
        }

        // Mark node as opened
        this.openedSet.add(nodeId);
        node.classList.add('opened');

        // Update constellation lines
        if (this.openedSet.has(1) && this.openedSet.has(2)) {
          if (line12) line12.classList.add('active');
        }
        if (this.openedSet.has(2) && this.openedSet.has(3)) {
          if (line23) line23.classList.add('active');
        }
        if (this.openedSet.has(3) && this.openedSet.has(1)) {
          if (line31) line31.classList.add('active');
        }

        // Update progress tracker
        const count = this.openedSet.size;
        if (progressEl) {
          progressEl.textContent = `${count} / 3 thoughts opened ✦`;
          if (count === 3) {
            progressEl.classList.add('completed');
          }
        }

        // Open Memory Modal
        this.openMemoryModal(overlay, memoryData[nodeId], () => {
          // After closing, check if 3/3 thoughts opened
          if (this.openedSet.size === 3 && finalGroup) {
            if (line12) line12.classList.add('active');
            if (line23) line23.classList.add('active');
            if (line31) line31.classList.add('active');
            finalGroup.classList.remove('hidden');

            if (window.particleSystem) {
              window.particleSystem.triggerFireworks(4000);
            }
          }
        });
      };

      node.addEventListener('click', handleTap);
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleNextNavigation();
      });
    }
  },

  openMemoryModal(overlay, data, onCloseCallback) {
    if (!overlay) return;
    overlay.innerHTML = '';
    overlay.classList.remove('hidden');

    const card = document.createElement('div');
    card.className = 'p6-modal-card';

    card.innerHTML = `
      <div class="p6-modal-title">${data.title}</div>
      <div class="p6-modal-body">${data.message}</div>
      <div class="p6-modal-controls">
        <button class="btn-p6-action" id="btn-p6-modal-close">CLOSE</button>
      </div>
    `;

    overlay.appendChild(card);

    const closeBtn = card.querySelector('#btn-p6-modal-close');
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('hidden');
      overlay.innerHTML = '';
      if (onCloseCallback) onCloseCallback();
    });
  },

  handleNextNavigation() {
    console.log("✨ User tapped NEXT on Page 6");
    if (window.particleSystem) {
      window.particleSystem.triggerBurst(window.innerWidth / 2, window.innerHeight / 2, 40);
    }

    if (window.pageManager && window.pageManager.pages.has('page7')) {
      window.pageManager.navigateTo('page7');
    } else {
      const overlay = document.querySelector('#p6-modal-overlay');
      if (overlay) {
        overlay.classList.remove('hidden');
        overlay.innerHTML = `
          <div class="p6-modal-card">
            <div class="p6-modal-title">✨ To be continued...</div>
            <div class="p6-modal-body" style="text-align: center;">Page 7 awaits in the next chapter! 💖</div>
            <div class="p6-modal-controls">
              <button class="btn-p6-action" onclick="document.querySelector('#p6-modal-overlay').classList.add('hidden')">CLOSE</button>
            </div>
          </div>
        `;
      }
    }
  },

  onEnter() {
    console.log("✨ Page 6 Active — Quiet Midnight Memory Universe");
  },

  onLeave() {
    console.log("✨ Transitioning out of Page 6...");
  }
};
