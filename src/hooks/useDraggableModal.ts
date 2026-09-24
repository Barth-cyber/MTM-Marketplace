import { useState, useRef, useEffect, useCallback } from 'react';

interface UseDraggableModalOptions {
  initialX?: number;
  initialY?: number;
}

export function useDraggableModal(options: UseDraggableModalOptions = {}) {
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: options.initialX || 0,
    y: options.initialY || 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  const startDrag = useCallback((clientX: number, clientY: number, target: HTMLElement) => {
    // Prevent dragging if interactive controls were clicked
    if (
      target.closest(
        'button, input, select, textarea, a, [role="button"], .no-drag, [data-no-drag="true"]'
      )
    ) {
      return;
    }

    setIsDragging(true);
    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: position.x,
      initialY: position.y,
    };
  }, [position]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (e.button !== 0) return; // Only left-click
      startDrag(e.clientX, e.clientY, e.target as HTMLElement);
    },
    [startDrag]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      if (e.touches.length === 1) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY, e.target as HTMLElement);
      }
    },
    [startDrag]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;
      setPosition({
        x: dragStartRef.current.initialX + dx,
        y: dragStartRef.current.initialY + dy,
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragStartRef.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - dragStartRef.current.startX;
      const dy = e.touches[0].clientY - dragStartRef.current.startY;
      setPosition({
        x: dragStartRef.current.initialX + dx,
        y: dragStartRef.current.initialY + dy,
      });
    };

    const handleEnd = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  const resetPosition = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return {
    position,
    isDragging,
    resetPosition,
    dragHandleProps: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
      style: {
        cursor: isDragging ? 'grabbing' : 'default',
        userSelect: 'none' as const,
      },
    },
    modalStyle: {
      transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      transition: isDragging ? 'none' : 'transform 0.05s ease-out',
    },
  };
}
