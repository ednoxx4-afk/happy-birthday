/**
 * PageManager.js
 * Extensible Screen State Machine. Manages page registration, lifecycle hooks,
 * dynamic transitions, and coordinate orchestration between Audio and Particle engines.
 */

class PageManager {
  constructor() {
    this.pages = new Map();
    this.currentPageKey = null;
    this.container = null;
    this.particleSystem = null;
  }

  init(containerId, particleSystem) {
    this.container = document.getElementById(containerId);
    this.particleSystem = particleSystem;
  }

  register(key, pageObject) {
    this.pages.set(key, pageObject);
  }

  async navigateTo(pageKey) {
    if (!this.pages.has(pageKey)) {
      console.error(`PageManager: Page [${pageKey}] is not registered.`);
      return;
    }

    const nextScreenObj = this.pages.get(pageKey);
    const currentScreenObj = this.currentPageKey ? this.pages.get(this.currentPageKey) : null;
    const currentDomEl = this.container.querySelector(`.screen[data-page="${this.currentPageKey}"]`);

    if (currentScreenObj && currentScreenObj.onLeave) {
      await currentScreenObj.onLeave();
    }

    if (this.particleSystem) {
      this.particleSystem.triggerCyanStream(2000);
    }

    if (currentDomEl) {
      currentDomEl.classList.remove('active');
      currentDomEl.classList.add('exit');
    }

    let nextDomEl = this.container.querySelector(`.screen[data-page="${pageKey}"]`);
    if (!nextDomEl) {
      nextDomEl = document.createElement('div');
      nextDomEl.className = 'screen';
      nextDomEl.setAttribute('data-page', pageKey);
      nextDomEl.appendChild(nextScreenObj.render());
      this.container.appendChild(nextDomEl);
    }

    void nextDomEl.offsetWidth;

    setTimeout(() => {
      if (currentDomEl) {
        currentDomEl.remove();
      }

      nextDomEl.classList.add('active');
      this.currentPageKey = pageKey;

      // Handle finale audio locking if next screen is in final two-page section
      if (nextScreenObj.isFinalePage && window.audioManager) {
        window.audioManager.lockFinaleSong();
      }

      // Handle theme visual direction transition if specified (e.g. Page 3+ birthday warm)
      if (this.particleSystem) {
        const theme = nextScreenObj.theme || 'navy-cyan';
        this.particleSystem.setTheme(theme);
      }

      if (nextScreenObj.onEnter) {
        nextScreenObj.onEnter();
      }
    }, 600);
  }
}

window.pageManager = new PageManager();
