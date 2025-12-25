import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { debounce } from '../../utils/debounce';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dotRef.current) {
      dotRef.current.style.left = `${e.clientX}px`;
      dotRef.current.style.top = `${e.clientY}px`;
    }

    requestAnimationFrame(() => {
      if (circleRef.current) {
        circleRef.current.style.left = `${e.clientX}px`;
        circleRef.current.style.top = `${e.clientY}px`;
      }
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    document.body.classList.add('cursor-hovering');
  }, []);

  const handleMouseLeave = useCallback(() => {
    document.body.classList.remove('cursor-hovering');
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .hover-target, input, select, textarea');

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  // Debounced function to re-attach listeners
  const reattachListeners = useMemo(
    () => debounce(() => {
      const interactiveElements = document.querySelectorAll('a, button, .hover-target, input, select, textarea');
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    }, 200),
    [handleMouseEnter, handleMouseLeave]
  );

  // Re-attach listeners when DOM changes (debounced)
  useEffect(() => {
    const observer = new MutationObserver(reattachListeners);

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [reattachListeners]);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={circleRef} className="cursor-circle" />
    </>
  );
};
