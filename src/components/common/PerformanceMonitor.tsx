import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { usePerformanceMode } from '../../stores/settingsStore';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  bundleSize: number;
  renderCount: number;
}

interface PerformanceMonitorProps {
  className?: string;
  showDetails?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  className = '',
  showDetails = false 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    loadTime: 0,
    bundleSize: 0,
    renderCount: 0
  });

  const [isVisible, setIsVisible] = useState(false);
  const performanceMode = usePerformanceMode();

  // Optimisation : Mesurer les performances avec une fréquence réduite
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;
    let updateInterval: number;

    const measurePerformance = useCallback(() => {
      frameCount++;
      const currentTime = performance.now();
      
      // Réduire la fréquence de mise à jour pour économiser les ressources
      if (currentTime - lastTime >= 2000) { // Mise à jour toutes les 2 secondes au lieu de 1
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        const memoryUsage = (performance as any).memory ? 
          Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) : 0;
        
        setMetrics(prev => ({
          ...prev,
          fps,
          memoryUsage,
          loadTime: Math.round(performance.now() - performance.timing.navigationStart),
          renderCount: prev.renderCount + 1
        }));
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measurePerformance);
    }, []);

    // Démarrer le monitoring seulement si le mode performance est activé ET en développement
    if (performanceMode && (process.env.NODE_ENV === 'development' || showDetails)) {
      animationId = requestAnimationFrame(measurePerformance);
      
      // Mise à jour moins fréquente pour les métriques lourdes
      updateInterval = window.setInterval(() => {
        const memoryUsage = (performance as any).memory ? 
          Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) : 0;
        
        setMetrics(prev => ({
          ...prev,
          memoryUsage
        }));
      }, 5000); // Mise à jour toutes les 5 secondes
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, [performanceMode, showDetails]);

  // Calculer le statut de performance - mémorisé
  const performanceStatus = useMemo(() => {
    if (metrics.fps >= 50) return { color: 'text-green-600', status: 'Excellent', bg: 'bg-green-100' };
    if (metrics.fps >= 30) return { color: 'text-yellow-600', status: 'Bon', bg: 'bg-yellow-100' };
    return { color: 'text-red-600', status: 'Lent', bg: 'bg-red-100' };
  }, [metrics.fps]);

  // Optimisation : Afficher seulement si nécessaire
  if (!performanceMode && !showDetails) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <div 
        className={`p-3 rounded-lg shadow-lg cursor-pointer transition-all duration-200 ${
          performanceStatus.bg
        } ${isVisible ? 'w-64' : 'w-12 h-12'}`}
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm">Performance</span>
              <span className={`text-xs font-medium ${performanceStatus.color}`}>
                {performanceStatus.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-600">FPS:</span>
                <span className={`ml-1 font-medium ${performanceStatus.color}`}>
                  {metrics.fps}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Mémoire:</span>
                <span className="ml-1 font-medium">{metrics.memoryUsage} MB</span>
              </div>
              {showDetails && (
                <>
                  <div>
                    <span className="text-gray-600">Temps:</span>
                    <span className="ml-1 font-medium">{metrics.loadTime}ms</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Renders:</span>
                    <span className="ml-1 font-medium">{metrics.renderCount}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className={`w-3 h-3 rounded-full ${performanceStatus.color.replace('text-', 'bg-')}`} />
          </div>
        )}
      </div>
    </div>
  );
}; 