// Detecta dispositivos móveis de forma mais robusta e aplica classes
    document.addEventListener('DOMContentLoaded', function () {
      function isMobileDevice() {
        const ua = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /Mobi|Android|iPhone|iPad|iPod|IEMobile|Windows Phone/i;
        const hasTouch = (('maxTouchPoints' in navigator && navigator.maxTouchPoints > 0) || 'ontouchstart' in window);
        const smallScreen = window.innerWidth <= 768;
        return mobileRegex.test(ua) || hasTouch || smallScreen;
      }

      const isMobile = isMobileDevice();
      if (isMobile) {
        const selectors = '.seta, .arrow, .btn-arrow, .carousel .prev, .carousel .next';
        document.querySelectorAll(selectors).forEach(el => el.classList.add('hide-on-mobile'));
        document.body.classList.add('is-mobile');
      } else {
        document.body.classList.add('is-desktop');
      }
    });