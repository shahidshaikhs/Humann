'use strict';

class HumannAnnouncementBar extends HTMLElement {
  connectedCallback() {
    this._slides = Array.from(this.querySelectorAll('[data-slide]'));
    this._currentIndex = 0;
    if (this._slides.length === 0) return;
    for (const btn of this.querySelectorAll('[data-direction]')) {
      btn.addEventListener('click', () => {
        const dir = btn.dataset.direction;
        if (dir === 'prev') {
          this._currentIndex = (this._currentIndex - 1 + this._slides.length) % this._slides.length;
        } else {
          this._currentIndex = (this._currentIndex + 1) % this._slides.length;
        }
        this._showSlide(this._currentIndex);
      });
    }
  }

  _showSlide(index) {
    for (const slide of this._slides) {
      slide.removeAttribute('data-slide-active');
    }
    if (this._slides[index]) {
      this._slides[index].setAttribute('data-slide-active', '');
    }
  }
}

class HumannHeader extends HTMLElement {
  connectedCallback() {
    this._setHeaderHeight();
    if (window.ResizeObserver) {
      this._resizeObserver = new ResizeObserver(() => this._setHeaderHeight());
      this._resizeObserver.observe(this);
    }

    const megaMenuTrigger = this.querySelector('[data-has-dropdown]');
    const megaMenu = this.querySelector('[data-mega-menu]');

    if (megaMenuTrigger && megaMenu) {
      megaMenuTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = megaMenu.style.display === 'flex';
        megaMenu.style.display = isOpen ? 'none' : 'flex';
        megaMenuTrigger.setAttribute('aria-expanded', String(!isOpen));
      });
      document.addEventListener('click', (e) => {
        if (!this.contains(e.target)) {
          megaMenu.style.display = 'none';
          megaMenuTrigger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    const drawer = this.querySelector('[data-drawer]');
    const drawerBackdrop = this.querySelector('[data-drawer-backdrop]');
    const drawerOpenBtn = this.querySelector('[data-drawer-open]');
    const drawerCloseBtn = drawer ? drawer.querySelector('[data-drawer-close]') : null;

    if (drawerOpenBtn && drawer) {
      drawerOpenBtn.addEventListener('click', () => {
        drawer.setAttribute('data-drawer-active', '');
        if (drawerBackdrop) drawerBackdrop.setAttribute('data-backdrop-active', '');
        document.body.style.overflow = 'hidden';
      });
    }

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', () => this._closeDrawer(drawer, drawerBackdrop));
    }

    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', () => this._closeDrawer(drawer, drawerBackdrop));
    }

    const benefitToggle = this.querySelector('[data-benefit-toggle]');
    const benefitSubmenu = this.querySelector('[data-benefit-submenu]');

    if (benefitToggle && benefitSubmenu) {
      benefitToggle.addEventListener('click', () => {
        const isOpen = benefitToggle.hasAttribute('data-benefit-open');
        if (isOpen) {
          benefitToggle.removeAttribute('data-benefit-open');
          benefitSubmenu.style.display = 'none';
          benefitToggle.setAttribute('aria-expanded', 'false');
        } else {
          benefitToggle.setAttribute('data-benefit-open', '');
          benefitSubmenu.style.display = 'flex';
          benefitToggle.setAttribute('aria-expanded', 'true');
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (megaMenu) {
        megaMenu.style.display = 'none';
        if (megaMenuTrigger) megaMenuTrigger.setAttribute('aria-expanded', 'false');
      }
      if (drawer && drawer.hasAttribute('data-drawer-active')) {
        this._closeDrawer(drawer, drawerBackdrop);
      }
    });
  }

  _setHeaderHeight() {
    document.documentElement.style.setProperty('--header-height', this.offsetHeight + 'px');
  }

  _closeDrawer(drawer, backdrop) {
    if (drawer) drawer.removeAttribute('data-drawer-active');
    if (backdrop) backdrop.removeAttribute('data-backdrop-active');
    document.body.style.overflow = '';
  }

  disconnectedCallback() {
    if (this._resizeObserver) this._resizeObserver.disconnect();
  }
}

if (!customElements.get('humann-announcement-bar')) {
  customElements.define('humann-announcement-bar', HumannAnnouncementBar);
}

if (!customElements.get('humann-header')) {
  customElements.define('humann-header', HumannHeader);
}
