import { useRef, useEffect } from 'react';

/**
 * Custom hook for handling touch gestures (swipe, long press, pull-to-refresh)
 * @param {Object} options - Configuration options
 * @returns {Object} Ref to attach to element and gesture state
 */
export const useTouchGestures = (options = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onLongPress,
    onPullToRefresh,
    swipeThreshold = 50,
    longPressDelay = 500,
    pullThreshold = 80,
  } = options;

  const elementRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const longPressTimerRef = useRef(null);
  const isPullingRef = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let startY = 0;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      startY = touch.clientY;

      // Start long press timer
      if (onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          onLongPress();
          element.classList.add('long-press-active');
          setTimeout(() => element.classList.remove('long-press-active'), 300);
        }, longPressDelay);
      }
    };

    const handleTouchMove = (e) => {
      // Cancel long press if user moves
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      // Pull to refresh logic
      if (onPullToRefresh && window.scrollY === 0) {
        const touch = e.touches[0];
        const deltaY = touch.clientY - startY;

        if (deltaY > 0 && deltaY < pullThreshold * 2) {
          isPullingRef.current = true;
          e.preventDefault(); // Prevent default scroll
        }
      }
    };

    const handleTouchEnd = (e) => {
      // Clear long press timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Calculate velocity (pixels per millisecond)
      const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime;

      // Pull to refresh
      if (isPullingRef.current && deltaY > pullThreshold) {
        if (onPullToRefresh) {
          onPullToRefresh();
        }
        isPullingRef.current = false;
        return;
      }
      isPullingRef.current = false;

      // Detect swipe gestures (only if fast enough)
      if (velocity > 0.3) {
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // Horizontal swipe
        if (absDeltaX > swipeThreshold && absDeltaX > absDeltaY) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        }
        // Vertical swipe
        else if (absDeltaY > swipeThreshold && absDeltaY > absDeltaX) {
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown();
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp();
          }
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onLongPress, onPullToRefresh, swipeThreshold, longPressDelay, pullThreshold]);

  return { ref: elementRef };
};

/**
 * Hook for pinch-to-zoom gesture
 */
export const usePinchZoom = (options = {}) => {
  const { onZoomIn, onZoomOut, onZoom, zoomThreshold = 1.1 } = options;
  const elementRef = useRef(null);
  const initialDistanceRef = useRef(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const getDistance = (touch1, touch2) => {
      const dx = touch2.clientX - touch1.clientX;
      const dy = touch2.clientY - touch1.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        initialDistanceRef.current = getDistance(e.touches[0], e.touches[1]);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const scale = currentDistance / initialDistanceRef.current;

        if (onZoom) {
          onZoom(scale);
        }

        if (scale > zoomThreshold && onZoomIn) {
          onZoomIn();
          initialDistanceRef.current = currentDistance;
        } else if (scale < 1 / zoomThreshold && onZoomOut) {
          onZoomOut();
          initialDistanceRef.current = currentDistance;
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [onZoomIn, onZoomOut, onZoom, zoomThreshold]);

  return { ref: elementRef };
};

export default useTouchGestures;
