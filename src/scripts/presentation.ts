document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll<HTMLElement>('.slide');
  const totalSlides = slides.length;
  if (totalSlides === 0) return;

  let currentSlide = 0;
  let isOverview = false;

  const progressEl = document.querySelector<HTMLElement>('.progress');
  const progressFill = document.querySelector<HTMLElement>('.progress__fill');
  const progressCounter = document.querySelector<HTMLElement>('.progress__counter');

  function showSlide(index: number) {
    if (index < 0 || index >= totalSlides) return;
    slides[currentSlide]?.classList.remove('active');
    currentSlide = index;
    slides[currentSlide]?.classList.add('active');
    updateProgress();
    window.location.hash = `#${currentSlide + 1}`;
  }

  function updateProgress() {
    if (progressFill) {
      progressFill.style.width = `${((currentSlide + 1) / totalSlides) * 100}%`;
    }
    if (progressCounter) {
      progressCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
    }
  }

  function next() {
    if (currentSlide < totalSlides - 1) showSlide(currentSlide + 1);
  }

  function prev() {
    if (currentSlide > 0) showSlide(currentSlide - 1);
  }

  function first() {
    showSlide(0);
  }

  function last() {
    showSlide(totalSlides - 1);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  function toggleOverview() {
    const pres = document.getElementById('presentation');
    if (!pres) return;
    isOverview = !isOverview;
    pres.classList.toggle('overview-mode', isOverview);
    if (!isOverview) {
      showSlide(currentSlide);
    }
  }

  function showHint() {
    document.body.classList.add('show-hint');
    setTimeout(() => document.body.classList.remove('show-hint'), 2000);
  }

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (isOverview) {
      if (e.key === 'Escape') toggleOverview();
      return;
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        next();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        prev();
        break;
      case 'Home':
        e.preventDefault();
        first();
        break;
      case 'End':
        e.preventDefault();
        last();
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'Escape':
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        break;
      case 'o':
      case 'O':
        toggleOverview();
        break;
    }
  });

  // Hash navigation
  const hash = window.location.hash;
  if (hash) {
    const idx = parseInt(hash.replace('#', ''), 10) - 1;
    if (idx >= 0 && idx < totalSlides) {
      currentSlide = idx;
    }
  }

  // Touch swipe
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
  }, { passive: true });

  // Nav buttons
  const prevBtn = document.querySelector('.nav-btn--prev');
  const nextBtn = document.querySelector('.nav-btn--next');
  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);

  // Overview clicks
  document.querySelectorAll('.slide').forEach((s, i) => {
    s.addEventListener('click', () => {
      if (isOverview) {
        isOverview = false;
        document.getElementById('presentation')?.classList.remove('overview-mode');
        showSlide(i);
      }
    });
  });

  // Init
  showSlide(currentSlide);
  showHint();
});
