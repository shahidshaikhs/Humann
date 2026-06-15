'use strict';

class HumannFooterAccordion extends HTMLElement {
  connectedCallback() {
    const heading = this.querySelector('.humann-footer__nav-heading');
    if (!heading) return;

    heading.addEventListener('click', () => {
      const body = this.querySelector('.humann-footer__nav-body');
      const icon = this.querySelector('.humann-footer__nav-icon');

      if (body) body.classList.toggle('is-open');
      if (icon) icon.classList.toggle('is-rotated');

      const isOpen = body ? body.classList.contains('is-open') : false;
      heading.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }
}

if (!customElements.get('humann-footer-accordion')) {
  customElements.define('humann-footer-accordion', HumannFooterAccordion);
}
