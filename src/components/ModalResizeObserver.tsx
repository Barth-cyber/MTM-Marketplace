import React, { useEffect } from 'react';

/**
 * Universal Dialog Resize Observer
 * Attaches a prominent greyed (shaded) triangular resize handle to the bottom corner of every dialog box.
 * Contains a double-sided diagonal arrow line moving from the bottom-right corner towards the top-most left hand of the dialog box.
 * Supports smooth click/touch dragging to expand and adjust the size of the dialog box in real time.
 */
export const ModalResizeObserver: React.FC = () => {
  useEffect(() => {
    let activeModal: HTMLElement | null = null;
    let startX = 0;
    let startY = 0;
    let startW = 0;
    let startH = 0;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const handle = target.closest('.modal-corner-resizer') as HTMLElement;
      if (!handle) return;

      const modal = handle.closest('div[class*="fixed"][class*="inset-0"]:not(#mobile-nav-overlay) > div:not([aria-hidden="true"]), [role="dialog"]') as HTMLElement;
      if (!modal) return;

      e.preventDefault();
      e.stopPropagation();

      activeModal = modal;
      startX = e.clientX;
      startY = e.clientY;

      const rect = modal.getBoundingClientRect();
      startW = rect.width;
      startH = rect.height;

      try {
        handle.setPointerCapture(e.pointerId);
      } catch {}

      document.body.style.cursor = 'nwse-resize';
      document.body.style.userSelect = 'none';
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!activeModal) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const maxW = Math.min(window.innerWidth * 0.98, 1600);
      const maxH = Math.min(window.innerHeight * 0.96, 1200);

      const newWidth = Math.max(300, Math.min(maxW, startW + deltaX));
      const newHeight = Math.max(220, Math.min(maxH, startH + deltaY));

      activeModal.style.width = `${newWidth}px`;
      activeModal.style.height = `${newHeight}px`;
      activeModal.style.maxWidth = '98vw';
      activeModal.style.maxHeight = '96vh';
      activeModal.style.transition = 'none';
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!activeModal) return;
      activeModal = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    // Attach resize handles to all dialogs
    const attachHandlesToModals = () => {
      const modals = document.querySelectorAll<HTMLElement>(
        'div[class*="fixed"][class*="inset-0"]:not(#mobile-nav-overlay) > div:not([class*="fixed"]):not([class*="absolute inset-0"]):not([aria-hidden="true"]):not(.no-resize-handle), [role="dialog"]:not(.no-resize-handle)'
      );

      modals.forEach((modal) => {
        // Ensure relative positioning for corner anchor
        if (getComputedStyle(modal).position === 'static') {
          modal.style.position = 'relative';
        }

        // Check if resize handle already exists
        let existingHandle = modal.querySelector('.modal-corner-resizer');
        if (!existingHandle) {
          const handle = document.createElement('div');
          handle.className = 'modal-corner-resizer';
          handle.setAttribute('title', 'Drag to expand or adjust dialog size');
          handle.setAttribute('aria-label', 'Resize dialog');
          handle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
              <!-- Shaded Grey/Silver Triangular Corner Grip -->
              <polygon points="2,28 28,28 28,2" fill="#CBD5E1" fill-opacity="0.95" stroke="#94A3B8" stroke-width="1.2" stroke-linejoin="round" />
              <polygon points="10,28 28,28 28,10" fill="#94A3B8" fill-opacity="0.45" />
              <!-- Diagonal Double-Sided Arrow Line (spanning from bottom-right to top-most left) -->
              <line x1="7" y1="7" x2="21" y2="21" stroke="#0F172A" stroke-width="2.4" stroke-linecap="round" />
              <!-- Top-Left Arrow Head (pointing to top-most left of dialog) -->
              <polyline points="13,7 7,7 7,13" stroke="#0F172A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
              <!-- Bottom-Right Arrow Head (pointing to bottom right of dialog) -->
              <polyline points="15,21 21,21 21,15" stroke="#0F172A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          `;

          modal.appendChild(handle);
        }
      });
    };

    // Run immediately and observe DOM mutations
    attachHandlesToModals();

    const observer = new MutationObserver(() => {
      attachHandlesToModals();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      observer.disconnect();
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, []);

  return null;
};
