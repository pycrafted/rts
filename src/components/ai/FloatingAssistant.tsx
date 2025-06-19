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
    "fixed bottom-6 right-6 z-50",
    className
  ), [className]);

  const assistantClasses = useMemo(() => 
    "fixed bottom-24 right-6 z-50 w-96 h-[500px] shadow-2xl rounded-xl overflow-hidden",
    []
  );

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
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300"
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
          className="fixed inset-0 z-40 bg-black bg-opacity-25"
          onClick={handleClose}
        />
      )}
    </>
  );
};

export default FloatingAssistant; 