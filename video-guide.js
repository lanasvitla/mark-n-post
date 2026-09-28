// A local poster is the only video resource loaded until an explicit play action.
document.querySelectorAll('[data-video-guide]').forEach((guide) => {
  const player = guide.querySelector('[data-video-player]');
  guide.querySelectorAll('[data-video-start]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      const start = Number(link.dataset.videoStart) || 0;
      const iframe = document.createElement('iframe');
      iframe.title = 'Как перевезти личные вещи из России в Грузию – Mark’n’Post';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      iframe.src = `https://www.youtube-nocookie.com/embed/vVWKapspRVM?autoplay=1&playsinline=1&rel=0&start=${start}`;
      player.replaceChildren(iframe);
      iframe.focus({ preventScroll: true });
      if (link.dataset.videoStart !== '0') {
        player.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
      }
    });
  });
});

// Center the visible content, excluding the section's spacing above it.
(() => {
  const section = document.getElementById('video-guide');
  if (!section) return;
  const alignVideoGuide = () => {
    if (location.hash !== '#video-guide') return;
    const heading = section.querySelector('.video-guide-heading').getBoundingClientRect();
    const layout = section.querySelector('.video-guide-layout').getBoundingClientRect();
    const headerBottom = Math.max(0, document.querySelector('.site-header')?.getBoundingClientRect().bottom || 0);
    const available = window.innerHeight - headerBottom;
    const contentHeight = layout.bottom - heading.top;
    // On short/mobile screens keep the heading visible and let the block scroll normally.
    const top = headerBottom + Math.max(24, (available - contentHeight) / 2);
    window.scrollTo({ top: window.scrollY + heading.top - top, behavior: 'instant' });
  };
  window.addEventListener('hashchange', alignVideoGuide);
  window.addEventListener('load', async () => {
    await document.fonts.ready;
    requestAnimationFrame(alignVideoGuide);
  }, { once: true });
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href, location.href);
    if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search && url.hash === '#video-guide') {
      event.preventDefault();
      if (location.hash !== url.hash) location.hash = url.hash;
      else alignVideoGuide();
    }
  });
})();
