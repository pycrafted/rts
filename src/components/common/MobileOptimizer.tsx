import React, { useEffect, useState } from 'react';

interface MobileOptimizerProps {
  children: React.ReactNode;
}

/**
 * Composant d'optimisation mobile
 * Gère les interactions tactiles, les safe areas, et les optimisations de performance
 */
const MobileOptimizer: React.FC<MobileOptimizerProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    // Détection mobile
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };

    // Détection PWA standalone
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;
      setIsStandalone(standalone);
    };

    // Détection orientation
    const checkOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      setOrientation(isLandscape ? 'landscape' : 'portrait');
    };

    // Initialisation
    checkMobile();
    checkStandalone();
    checkOrientation();

    // Event listeners
    window.addEventListener('resize', () => {
      checkMobile();
      checkOrientation();
    });

    window.addEventListener('orientationchange', checkOrientation);

    // Optimisations tactiles
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const preventDoubleTap = (e: TouchEvent) => {
      e.preventDefault();
    };

    // Appliquer les optimisations tactiles
    if (isMobile) {
      document.addEventListener('touchstart', preventZoom, { passive: false });
      document.addEventListener('touchend', preventDoubleTap, { passive: false });
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkOrientation);
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchend', preventDoubleTap);
    };
  }, [isMobile]);

  // Styles conditionnels pour mobile
  const mobileStyles = isMobile ? {
    // Optimisations pour mobile
    touchAction: 'manipulation' as const,
    WebkitOverflowScrolling: 'touch' as const,
    // Support des safe areas iOS
    paddingTop: isStandalone ? 'env(safe-area-inset-top)' : '0',
    paddingBottom: isStandalone ? 'env(safe-area-inset-bottom)' : '0',
    paddingLeft: isStandalone ? 'env(safe-area-inset-left)' : '0',
    paddingRight: isStandalone ? 'env(safe-area-inset-right)' : '0',
  } : {};

  return (
    <div 
      className={`mobile-optimizer ${isMobile ? 'mobile' : 'desktop'} ${isStandalone ? 'standalone' : ''} ${orientation}`}
      style={mobileStyles}
    >
      {children}
    </div>
  );
};

export default MobileOptimizer; 