import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import AssistantIA from './AssistantIA';
import Button from '../ui/Button';

interface FloatingAssistantProps {
  className?: string;
}

const FloatingAssistant: React.FC<FloatingAssistantProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bouton flottant */}
      <div className={cn(
        "fixed bottom-6 right-6 z-50",
        className
      )}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="primary"
          size="lg"
          icon={isOpen ? "✕" : "🤖"}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {!isOpen && <span className="sr-only">Ouvrir l'assistant IA</span>}
        </Button>
      </div>

      {/* Assistant IA flottant */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] shadow-2xl rounded-xl overflow-hidden">
          <AssistantIA 
            title="Assistant IA"
            placeholder="Question sur les télécoms..."
            className="h-full"
          />
        </div>
      )}

      {/* Overlay pour fermer */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-25"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default FloatingAssistant; 