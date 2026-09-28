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
