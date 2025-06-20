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
    if (metrics.fps >= 50) return { color: 'text-lime-400', status: 'Excellent' };
    if (metrics.fps >= 30) return { color: 'text-yellow-300', status: 'Bon' };
    return { color: 'text-red-500', status: 'Lent' };
  };

  const performanceStatus = getPerformanceStatus();

  return (
    <div className="absolute bottom-4 left-4 bg-slate-800 bg-opacity-90 rounded-lg p-4 shadow-lg min-w-[280px] border border-slate-700 opacity-20 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
      <h4 className="text-sm font-semibold text-white mb-3">📊 Performance Monitor</h4>
      
      <div className="space-y-2 text-xs">
        {/* FPS */}
        <div className="flex justify-between items-center">
          <span className="text-slate-300">FPS:</span>
          <span className={`font-mono font-bold ${performanceStatus.color}`}>
            {metrics.fps}
          </span>
        </div>
        
        {/* Status */}
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Status:</span>
          <span className={`font-semibold ${performanceStatus.color}`}>
            {performanceStatus.status}
          </span>
        </div>
        
        {/* Mémoire */}
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Mémoire:</span>
          <span className="font-mono text-slate-300">
            {metrics.memoryUsage} MB
          </span>
        </div>
        
        {/* Utilisateurs */}
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Utilisateurs:</span>
          <span className="font-mono text-slate-300">
            {metrics.userCount}
          </span>
        </div>
        
        {/* Facteur de charge */}
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Charge:</span>
          <span className="font-mono text-slate-300">
            {(metrics.loadFactor * 100).toFixed(1)}%
          </span>
        </div>
      </div>
      
      {/* Barre de performance */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-slate-300 mb-1">
          <span>Performance</span>
          <span>{performanceStatus.status}</span>
        </div>
        <div className="w-full bg-slate-600 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              metrics.fps >= 50 ? 'bg-lime-500' : 
              metrics.fps >= 30 ? 'bg-yellow-400' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min((metrics.fps / 60) * 100, 100)}%` }}
          />
        </div>
      </div>
      
      {/* Conseils d'optimisation */}
      {metrics.fps < 30 && (
        <div className="mt-3 p-2 bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded text-xs">
          <p className="text-yellow-200 font-semibold mb-1">💡 Optimisations suggérées:</p>
          <ul className="text-yellow-100 space-y-1">
            <li>• Réduire le nombre d'utilisateurs</li>
            <li>• Désactiver les effets visuels</li>
            <li>• Fermer d'autres applications</li>
          </ul>
        </div>
      )}
    </div>
  );
}; 