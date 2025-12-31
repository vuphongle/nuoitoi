document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const formatValue = (value, format, suffix = '') => {
    const rounded = Math.round(value);
    if (format === 'currency') {
      return `${rounded.toLocaleString('vi-VN')} đ`;
    }
    return `${rounded.toLocaleString('vi-VN')}${suffix}`;
  };

  const counters = document.querySelectorAll('[data-counter]');
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target || 0);
    const format = counter.dataset.format;
    const suffix = counter.dataset.suffix || '';

    if (prefersReducedMotion) {
      counter.textContent = formatValue(target, format, suffix);
      return;
    }

    const duration = 1600;
    const start = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const current = target * progress;
      counter.textContent = formatValue(current, format, suffix);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  });

  const modal = document.getElementById('expense-modal');
  const modalBody = document.getElementById('modal-body');
  const modalTitle = document.getElementById('modal-title');

  if (modal && modalBody && modalTitle) {
    const closeModal = () => {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
    };

    document.querySelectorAll('.open-modal').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.expense-card');
        if (!card) return;

        const title = card.querySelector('.expense-title')?.textContent?.trim() || 'Chi tiết chi tiêu';
        const amount = card.querySelector('.expense-amount')?.textContent?.trim() || '';
        const date = card.querySelector('.expense-date')?.textContent?.trim() || '';
        const details = card.querySelector('.expense-details')?.innerHTML || '';

        modalTitle.textContent = title;
        modalBody.innerHTML = `<p class="modal-amount">${amount}</p><p class="modal-date">${date}</p>${details}`;
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
      });
    });

    modal.addEventListener('click', (event) => {
      if (event.target.dataset.close !== undefined || event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
      }
    });
  }
});
