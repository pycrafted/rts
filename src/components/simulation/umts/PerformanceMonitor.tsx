import React, { useState, useEffect } from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  userCount: number;
  loadFactor: number;
}

interface PerformanceMonitorProps {
  userCount: number;
  loadFactor: number;
  onFpsChange?: (fps: number) => void;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  userCount, 
  loadFactor,
  onFpsChange
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    renderTime: 0,
    userCount,
    loadFactor
  });

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
        
        setMetrics({
          fps,
          memoryUsage,
          renderTime: Math.round(currentTime - lastTime),
          userCount,
          loadFactor
        });
        
        // Partager les FPS avec le composant parent
        if (onFpsChange) {
          onFpsChange(fps);
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measurePerformance);
    };

    animationId = requestAnimationFrame(measurePerformance);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [userCount, loadFactor, onFpsChange]);

  const getPerformanceStatus = () => {
    if (metrics.fps >= 50) return { color: 'text-green-600', status: 'Excellent' };
    if (metrics.fps >= 30) return { color: 'text-yellow-600', status: 'Bon' };
    return { color: 'text-red-600', status: 'Lent' };
  };

  const performanceStatus = getPerformanceStatus();

  return (
    <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 rounded-lg p-4 shadow-lg min-w-[280px]">
      <h4 className="text-sm font-semibold text-gray-800 mb-3">📊 Performance Monitor</h4>
      
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
        
        {/* Utilisateurs */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Utilisateurs:</span>
          <span className="font-mono">
            {metrics.userCount}
          </span>
        </div>
        
        {/* Facteur de charge */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Charge:</span>
          <span className="font-mono">
            {(metrics.loadFactor * 100).toFixed(1)}%
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
      
      {/* Conseils d'optimisation */}
      {metrics.fps < 30 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <p className="text-yellow-800 font-semibold mb-1">💡 Optimisations suggérées:</p>
          <ul className="text-yellow-700 space-y-1">
            <li>• Réduire le nombre d'utilisateurs</li>
            <li>• Désactiver les effets visuels</li>
            <li>• Fermer d'autres applications</li>
          </ul>
        </div>
      )}
    </div>
  );
}; 