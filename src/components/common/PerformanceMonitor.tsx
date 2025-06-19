import React, { useState, useEffect, useMemo } from 'react';
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

  // Mesurer les performances
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measurePerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
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
    };

    // Démarrer le monitoring seulement si le mode performance est activé
    if (performanceMode) {
      animationId = requestAnimationFrame(measurePerformance);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [performanceMode]);

  // Calculer le statut de performance
  const performanceStatus = useMemo(() => {
    if (metrics.fps >= 50) return { color: 'text-green-600', status: 'Excellent', bg: 'bg-green-100' };
    if (metrics.fps >= 30) return { color: 'text-yellow-600', status: 'Bon', bg: 'bg-yellow-100' };
    return { color: 'text-red-600', status: 'Lent', bg: 'bg-red-100' };
  }, [metrics.fps]);

  // Afficher seulement si le mode performance est activé
  if (!performanceMode) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      {/* Bouton toggle */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Performance Monitor"
      >
        📊
      </button>

      {/* Panneau de monitoring */}
      {isVisible && (
        <div className="absolute top-12 right-0 bg-white rounded-lg shadow-xl p-4 min-w-[280px] border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-800">📊 Performance Monitor</h4>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2 text-xs">
            {/* FPS */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">FPS:</span>
              <span className={`font-mono font-bold ${performanceStatus.color}`}>
                {metrics.fps}
              </span>
            </div>
            
            {/* Status */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <span className={`font-semibold ${performanceStatus.color}`}>
                {performanceStatus.status}
              </span>
            </div>
            
            {/* Mémoire */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Mémoire:</span>
              <span className="font-mono">
                {metrics.memoryUsage} MB
              </span>
            </div>

            {/* Temps de chargement */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Load Time:</span>
              <span className="font-mono">
                {metrics.loadTime}ms
              </span>
            </div>

            {/* Renders */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Renders:</span>
              <span className="font-mono">
                {metrics.renderCount}
              </span>
            </div>
          </div>
          
          {/* Barre de performance */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Performance</span>
              <span>{performanceStatus.status}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  metrics.fps >= 50 ? 'bg-green-500' : 
                  metrics.fps >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min((metrics.fps / 60) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Détails supplémentaires */}
          {showDetails && (
            <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
              <p className="text-gray-800 font-semibold mb-1">🔧 Optimisations actives:</p>
              <ul className="text-gray-700 space-y-1">
                <li>• Lazy loading des composants</li>
                <li>• Mémorisation des calculs</li>
                <li>• Code splitting optimisé</li>
                <li>• Bundle compression</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 