import React, { useState, useMemo, useCallback, lazy, Suspense } from 'react';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';

// Lazy loading de l'assistant IA pour optimiser les performances
const AssistantIA = lazy(() => import('./AssistantIA'));

interface FloatingAssistantProps {
  className?: string;
}

const FloatingAssistant: React.FC<FloatingAssistantProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Mémoriser les classes CSS pour éviter les recalculs
  const buttonClasses = useMemo(() => cn(
    "fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50",
    className
  ), [className]);

  const assistantClasses = useMemo(() => cn(
    "fixed z-50 shadow-2xl rounded-xl overflow-hidden",
    // Mobile: plein écran avec safe areas
    "bottom-0 left-0 right-0 h-[85vh] sm:h-[500px]",
    // Desktop: position fixe
    "sm:bottom-24 sm:right-6 sm:left-auto sm:w-96"
  ), []);

  // Optimiser les callbacks
  const handleToggle = useCallback(() => setIsOpen(prev => !prev), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  // Composant de chargement pour l'assistant IA
  const AssistantIALoading = () => (
    <div className="flex items-center justify-center h-full bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <>
      {/* Bouton flottant - mémorisé */}
      <div className={buttonClasses}>
        <Button
          onClick={handleToggle}
          variant="primary"
          size="lg"
          icon={isOpen ? "✕" : "🤖"}
          className={cn(
            "rounded-full shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation",
            // Mobile: plus petit
            "w-12 h-12 sm:w-14 sm:h-14",
            // Mobile: position différente si ouvert
            isOpen && "sm:relative"
          )}
        >
          {!isOpen && <span className="sr-only">Ouvrir l'assistant IA</span>}
        </Button>
      </div>

      {/* Assistant IA flottant - chargement conditionnel */}
      {isOpen && (
        <div className={assistantClasses}>
          <Suspense fallback={<AssistantIALoading />}>
            <AssistantIA 
              title="Assistant IA"
              placeholder="Question sur les télécoms..."
              className="h-full"
            />
          </Suspense>
        </div>
      )}

      {/* Overlay pour fermer - conditionnel */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-25 sm:bg-opacity-25"
          onClick={handleClose}
        />
      )}
    </>
  );
};

export default FloatingAssistant; 