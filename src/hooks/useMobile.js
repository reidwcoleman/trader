import { useState, useEffect } from 'react';

/**
 * Custom hook to detect mobile devices and screen sizes
 * @returns {Object} Mobile detection state
 */
export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [screenHeight, setScreenHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 0);
  const [orientation, setOrientation] = useState('portrait');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if touch device
    const checkTouchDevice = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      );
    };

    setIsTouchDevice(checkTouchDevice());

    // Update screen info
    const updateScreenInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setScreenWidth(width);
      setScreenHeight(height);

      // Breakpoints
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);

      // Orientation
      setOrientation(width > height ? 'landscape' : 'portrait');
    };

    updateScreenInfo();

    // Listen for resize and orientation changes
    window.addEventListener('resize', updateScreenInfo);
    window.addEventListener('orientationchange', updateScreenInfo);

    return () => {
      window.removeEventListener('resize', updateScreenInfo);
      window.removeEventListener('orientationchange', updateScreenInfo);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
    screenHeight,
    orientation,
    isTouchDevice,
    // Utility breakpoint checks
    isSmallMobile: screenWidth < 480,
    isMediumMobile: screenWidth >= 480 && screenWidth < 640,
    isLargeMobile: screenWidth >= 640 && screenWidth < 768,
  };
};

/**
 * Hook to check if user prefers reduced motion
 */
export const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};

/**
 * Hook to detect network speed (for optimizing content loading on mobile)
 */
export const useNetworkSpeed = () => {
  const [connectionSpeed, setConnectionSpeed] = useState('4g');
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

      if (connection) {
        const updateConnection = () => {
          setConnectionSpeed(connection.effectiveType);
          setIsSlowConnection(connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
        };

        updateConnection();
        connection.addEventListener('change', updateConnection);

        return () => connection.removeEventListener('change', updateConnection);
      }
    }
  }, []);

  return { connectionSpeed, isSlowConnection };
};

export default useMobile;
