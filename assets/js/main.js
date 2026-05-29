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

  /* ------------------------------------------------------------
     Mobile-Drawer (Hauptnavigation)
     ------------------------------------------------------------ */
  var toggle = document.getElementById('nav-toggle');
  var close  = document.getElementById('nav-close');
  var drawer = document.getElementById('mobile-nav');

  function openDrawer() {
    if (!drawer || !toggle) return;
    drawer.setAttribute('data-open', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.setAttribute('data-drawer-open', 'true');
  }
  function closeDrawer() {
    if (!drawer || !toggle) return;
    drawer.setAttribute('data-open', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.removeAttribute('data-drawer-open');
  }

  if (toggle) toggle.addEventListener('click', openDrawer);
  if (close)  close.addEventListener('click', closeDrawer);

  if (drawer) {
    // Beim Klick auf einen Navi-Link Drawer schließen, damit der Smooth-Scroll sichtbar wird.
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeDrawer);
    });
  }

  // ESC schließt den Drawer
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.getAttribute('data-open') === 'true') {
      closeDrawer();
    }
  });

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
