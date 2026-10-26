(() => {
  'use strict';
  const id = 'G-BJK1ZHJZWH';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  const production = ['deartogrow.com', 'www.deartogrow.com', 'deartogrow.vercel.app'].includes(location.hostname);
  if (production) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(script);
    gtag('js', new Date());
    gtag('config', id, { allow_google_signals: false, allow_ad_personalization_signals: false });
  }
  // Fixed event names only; do not send visitor-entered text or contact details.
  const sections = ['hero', 'about', 'signs', 'programs', 'process', 'pricing', 'counselor', 'space-gallery', 'contact', 'faq'];
  const name = value => value.replace(/-/g, '_');
  const track = event => gtag('event', event, { send_to: id, transport_type: 'beacon' });
  document.addEventListener('click', event => {
    const a = event.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (a.classList.contains('more')) track('view_more_click');
    const section = href.split('#')[1];
    if (sections.includes(section) && a.closest('nav, .nav, .footer')) track('menu_' + name(section));
    if (href.startsWith('https://naver.me/')) track('naver_booking_click');
    if (href.startsWith('sms:')) track('sms_click');
    if (href.startsWith('tel:')) track('phone_click');
    if (href.startsWith('mailto:')) track('email_click');
  });
  document.querySelectorAll('.faq-item').forEach((item, index) => {
    item.addEventListener('toggle', () => {
      if (item.open) track('faq_open_' + String(index + 1).padStart(2, '0'));
    });
  });
  // Count a section once per page load when its heading is visible for one second.
  if ('IntersectionObserver' in window) {
    const timers = new Map();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const target = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          if (!timers.has(target)) timers.set(target, setTimeout(() => {
            if (!document.hidden) {
              track('section_view_' + name(target.dataset.analyticsSection));
              observer.unobserve(target);
            }
            timers.delete(target);
          }, 1000));
        } else {
          clearTimeout(timers.get(target));
          timers.delete(target);
        }
      });
    }, { threshold: [0, 0.5] });
    sections.forEach(section => {
      const container = document.getElementById(section);
      const heading = container && container.querySelector('h1, h2, h3');
      if (heading) { heading.dataset.analyticsSection = section; observer.observe(heading); }
    });
  }
})();
