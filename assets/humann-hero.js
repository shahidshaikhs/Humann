'use strict';

class HumannHeroCarousel extends HTMLElement {
  connectedCallback() {
    this._track = this.querySelector('.humann-hero__track');
    this._slides = Array.from(this.querySelectorAll('.humann-hero__slide'));
    this._currentSlide = 0;
    this._totalSlides = this._slides.length;

    if (!this._track || this._totalSlides === 0) return;

    for (const btn of this.querySelectorAll('[data-direction]')) {
      btn.addEventListener('click', () => {
        const dir = btn.dataset.direction;
        if (dir === 'prev') {
          this.goTo((this._currentSlide - 1 + this._totalSlides) % this._totalSlides);
        } else {
          this.goTo((this._currentSlide + 1) % this._totalSlides);
        }
      });
    }

    this._touchStartX = 0;
    this._touchEndX = 0;

    this.addEventListener('touchstart', (e) => {
      this._touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.addEventListener('touchend', (e) => {
      this._touchEndX = e.changedTouches[0].screenX;
      const delta = this._touchStartX - this._touchEndX;
      if (Math.abs(delta) >= 50) {
        if (delta > 0) {
          this.goTo((this._currentSlide + 1) % this._totalSlides);
        } else {
          this.goTo((this._currentSlide - 1 + this._totalSlides) % this._totalSlides);
        }
      }
    }, { passive: true });
  }

  goTo(index) {
    this._currentSlide = index;
    this._track.style.transform = 'translateX(-' + (100 * index) + '%)';
  }
}

if (!customElements.get('humann-hero-carousel')) {
  customElements.define('humann-hero-carousel', HumannHeroCarousel);
}
