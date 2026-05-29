/* ============================================================
   JVF Mainz 2026 — main.js
   - AOS lokal initialisieren (kein CDN, keine Drittanbieter)
   - Cookie-Banner (einmaliger Hinweis)
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'jvf-consent-v1';

  var banner = document.getElementById('cookie-banner');
  var btnOk  = document.getElementById('cookie-accept');
  var reopen = document.getElementById('cookie-reopen');

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); }
    catch (e) { return null; }
  }
  function setConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); }
    catch (e) { /* noop */ }
  }
  function showBanner() { if (banner) banner.classList.add('is-visible'); }
  function hideBanner() { if (banner) banner.classList.remove('is-visible'); }

  // AOS direkt lokal initialisieren — AOS-Skript ist im HTML-Head eingebunden.
  function initAOS() {
    if (window.AOS && !window.__aosInited) {
      window.__aosInited = true;
      window.AOS.init({
        duration: 700,
        easing: 'ease-out',
        once: true,
        offset: 60,
        disable: function () {
          return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }
      });
    }
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initAOS();
  } else {
    document.addEventListener('DOMContentLoaded', initAOS);
  }

  // Cookie-Hinweis: einmalig anzeigen, lokal speichern.
  if (getConsent() === null) {
    setTimeout(showBanner, 400);
  }
  if (btnOk) {
    btnOk.addEventListener('click', function () {
      setConsent('acknowledged');
      hideBanner();
    });
  }
  if (reopen) {
    reopen.addEventListener('click', function (e) {
      e.preventDefault();
      showBanner();
    });
  }

  /* ---------------------------------------------------------
     Smooth-Scroll Offset für Sticky Header
     --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var headerH = document.querySelector('.topbar') ? document.querySelector('.topbar').offsetHeight : 0;
      var y = target.getBoundingClientRect().top + window.pageYOffset - headerH - 8;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

})();
