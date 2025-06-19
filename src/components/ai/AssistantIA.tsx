import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { processUserMessage } from '../../services/iaService';
import { validateConfig } from '../../config/env';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AssistantIAProps {
  className?: string;
  title?: string;
  placeholder?: string;
}

export interface AssistantIARef {
  askQuestion: (question: string) => void;
}

const AssistantIA = forwardRef<AssistantIARef, AssistantIAProps>(({
  className,
  title = "Assistant IA Télécoms",
  placeholder = "Posez votre question sur les réseaux télécoms..."
}, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigValid, setIsConfigValid] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    askQuestion: async (question: string) => {
      setInput('');
      setMessages(prev => [...prev, { role: 'user', content: question }]);
      setIsLoading(true);

      try {
        const response = await processUserMessage(question);
        setMessages(prev => [...prev, response]);
      } catch (error) {
        console.error('Error processing message:', error);
        setError("Désolé, j'ai rencontré une erreur. Pouvez-vous reformuler votre question ?");
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "Désolé, j'ai rencontré une erreur. Pouvez-vous reformuler votre question ?"
        }]);
      }

      setIsLoading(false);
    }
  }));

  // Vérification de la configuration au chargement
  useEffect(() => {
    const checkConfig = async () => {
      const valid = await validateConfig();
      setIsConfigValid(valid);
      
      // Message de présentation initial
      const welcomeMessage = {
        role: 'assistant' as const,
        content: `Bonjour ! 👋 Je suis votre assistant spécialisé en télécommunications.

Je peux vous aider sur plusieurs domaines :

📱 **GSM** : Dimensionnement, TRX, trafic Erlang
📡 **UMTS** : NodeB, facteur de charge, couverture
🛰️ **Liaisons Hertziennes** : Zones de Fresnel, bilans de liaison
🔌 **Fibre Optique** : Atténuation, épissures, connectique

N'hésitez pas à me poser vos questions ! Vous pouvez aussi cliquer sur les exemples de questions dans le guide d'utilisation. 😊`
      };
      setMessages([welcomeMessage]);
    };
    checkConfig();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await processUserMessage(userMessage);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error processing message:', error);
      setError("Désolé, j'ai rencontré une erreur. Pouvez-vous reformuler votre question ?");
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Désolé, j'ai rencontré une erreur. Pouvez-vous reformuler votre question ?"
      }]);
    }

    setIsLoading(false);
  };

  const formatMessage = (content: string) => {
    return content
      .split('\n')
      .map((line) => {
        if (line.startsWith('•')) {
          return `<li class="ml-4">${line.substring(1).trim()}</li>`;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return `<strong class="font-semibold text-primary-600">${line.slice(2, -2)}</strong>`;
        }
        if (line.startsWith('```')) {
          return `<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">${line.slice(3)}</code>`;
        }
        return line;
      })
      .join('\n');
  };

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          {title}
          {isConfigValid === false && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
              Configuration manquante
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Zone des messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 dark:text-white'
                }`}
              >
                <div 
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ 
                    __html: formatMessage(message.content) 
                  }}
                />
              </div>
            </div>
          ))}

          {/* Indicateur de chargement */}
          {isLoading && (
            <div className="flex justify-start gap-3">
              <div className="bg-gray-100 dark:bg-gray-800 dark:text-white rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">L'assistant réfléchit...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isConfigValid === false ? "Configuration manquante - Vérifiez .env" : placeholder}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                disabled={isLoading || isConfigValid === false}
              />
            </div>
            
            <Button
              type="submit"
              disabled={!input.trim() || isLoading || isConfigValid === false}
              loading={isLoading}
              icon="📤"
              size="sm"
              className="self-end"
            >
              {isLoading ? 'Envoi...' : 'Envoyer'}
            </Button>
          </form>

          {/* Message d'erreur */}
          {error && (
            <div className="mt-2 text-xs text-error-600 bg-error-50 p-2 rounded">
              {error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

AssistantIA.displayName = 'AssistantIA';

export default AssistantIA; 