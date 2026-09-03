/**
 * main.js - Application Entry Point
 * Initializes core engines (Particles, Audio, Page State Machine) and boots Page 1.
 */

function initApp() {
  const particleSystem = new window.ParticleSystem('particle-canvas');
  window.particleSystem = particleSystem;

  if (window.audioManager) {
    window.audioManager.init();
  }

  if (window.musicSelector) {
    window.musicSelector.init();
  }

  if (window.pageManager) {
    window.pageManager.init('app', particleSystem);
    window.pageManager.register('page1', window.Page1);
    window.pageManager.register('page2', window.Page2Placeholder);
    window.pageManager.register('page3', window.Page3);
    window.pageManager.register('page4', window.Page4);
    window.pageManager.register('page5', window.Page5);
    window.pageManager.register('page6', window.Page6);
    window.pageManager.register('page7', window.Page7);
    window.pageManager.register('page8', window.Page8);
    window.pageManager.register('page9', window.Page9);
    window.pageManager.register('page10', window.Page10);
    window.pageManager.navigateTo('page1');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
