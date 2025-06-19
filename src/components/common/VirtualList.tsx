import React, { useState, useRef, useMemo, useCallback } from 'react';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

export function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 5,
  className = ''
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculer les indices visibles
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(height / itemHeight);
    const end = Math.min(start + visibleCount + overscan, items.length);
    const startIndex = Math.max(0, start - overscan);
    
    return { start: startIndex, end };
  }, [scrollTop, itemHeight, height, items.length, overscan]);

  // Calculer le padding pour maintenir la hauteur totale
  const paddingTop = visibleRange.start * itemHeight;
  const paddingBottom = (items.length - visibleRange.end) * itemHeight;

  // Gérer le scroll
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  // Optimiser le rendu avec React.memo
  const VirtualItem = React.memo<{ item: T; index: number }>(({ item, index }) => (
    <div style={{ height: itemHeight }}>
      {renderItem(item, index)}
    </div>
  ));

  VirtualItem.displayName = 'VirtualItem';

  // Rendu des éléments visibles
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => {
      const actualIndex = visibleRange.start + index;
      return (
        <VirtualItem
          key={actualIndex}
          item={item}
          index={actualIndex}
        />
      );
    });
  }, [items, visibleRange, renderItem]);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div
        style={{
          paddingTop,
          paddingBottom,
          position: 'relative'
        }}
      >
        {visibleItems}
      </div>
    </div>
  );
}

// Hook pour utiliser la virtualisation avec des données dynamiques
export function useVirtualization<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);

  const updateVisibleRange = useCallback((scrollTop: number) => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(start + visibleCount, items.length);
    
    setStartIndex(start);
    setEndIndex(end);
    setVisibleItems(items.slice(start, end));
  }, [items, itemHeight, containerHeight]);

  return {
    visibleItems,
    startIndex,
    endIndex,
    updateVisibleRange,
    totalHeight: items.length * itemHeight
  };
}

// Composant optimisé pour les listes de résultats
interface ResultsListProps<T> {
  results: T[];
  renderResult: (result: T, index: number) => React.ReactNode;
  height?: number;
  itemHeight?: number;
  emptyMessage?: string;
  loading?: boolean;
}

export function ResultsList<T>({
  results,
  renderResult,
  height = 400,
  itemHeight = 60,
  emptyMessage = "Aucun résultat trouvé",
  loading = false
}: ResultsListProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement...</span>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <VirtualList
      items={results}
      height={height}
      itemHeight={itemHeight}
      renderItem={renderResult}
      className="border border-gray-200 rounded-lg"
    />
  );
}

// Composant pour l'historique des simulations
interface HistoryListProps {
  history: Array<{
    id: string;
    type: string;
    date: string;
    title: string;
    description: string;
  }>;
  onSelect: (item: any) => void;
}

export function HistoryList({ history, onSelect }: HistoryListProps) {
  const renderHistoryItem = useCallback((item: any) => (
    <div
      className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onSelect(item)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{item.title}</h4>
          <p className="text-sm text-gray-600">{item.description}</p>
          <p className="text-xs text-gray-500 mt-1">{item.date}</p>
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {item.type}
        </span>
      </div>
    </div>
  ), [onSelect]);

  return (
    <ResultsList
      results={history}
      renderResult={renderHistoryItem}
      height={500}
      itemHeight={80}
      emptyMessage="Aucun historique disponible"
    />
  );
} 