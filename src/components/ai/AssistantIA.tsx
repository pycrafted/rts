import React, { useState, useRef, useEffect } from 'react';
import { askIA } from '../../services/iaService';
import { validateConfig } from '../../config/env';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AssistantIAProps {
  className?: string;
  title?: string;
  placeholder?: string;
}

const AssistantIA: React.FC<AssistantIAProps> = ({
  className,
  title = "Assistant IA Télécoms",
  placeholder = "Posez votre question sur les réseaux télécoms..."
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigValid, setIsConfigValid] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Vérification de la configuration au chargement
  useEffect(() => {
    const valid = validateConfig();
    setIsConfigValid(valid);
  }, []);

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize du textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  // Message de bienvenue initial
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'assistant',
      content: `Bonjour ! Je suis votre assistant IA spécialisé en télécommunications. 🤖

Je peux vous aider avec des questions sur :

• **GSM** : BTS, TRX, Erlangs, couverture cellulaire
• **UMTS** : NodeB, facteur de charge, qualité de service  
• **Hertzien** : Zones de Fresnel, affaiblissement, bilan de liaison
• **Optique** : Atténuation fibre, connecteurs, épissures
• **Simulation** : Visualisation 3D, paramètres de simulation

**Exemples de questions :**
- "Comment calculer le nombre de TRX nécessaires ?"
- "Qu'est-ce que la formule d'Erlang-B ?"
- "Comment optimiser une liaison hertzienne ?"

Posez-moi votre question ! 💬`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;

    // Vérification de la configuration
    if (!isConfigValid) {
      const errorMsg: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `❌ **Erreur de configuration** : Clé API Hugging Face manquante.

Vérifiez que votre fichier .env contient :
\`\`\`
VITE_HF_TOKEN=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
\`\`\`

Redémarrez l'application après avoir créé le fichier.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Appel à l'API IA
      const response = await askIA(userMessage.content);

      if (response.success && response.data) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: response.data,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(response.error || 'Erreur lors de la génération de la réponse');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `❌ **Erreur** : ${errorMessage}

Vérifiez votre connexion internet et réessayez.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
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
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3 text-sm",
                  message.type === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                )}
              >
                <div 
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ 
                    __html: formatMessage(message.content) 
                  }}
                />
                <div className={cn(
                  "text-xs mt-2 opacity-70",
                  message.type === 'user' ? 'text-white' : 'text-gray-500'
                )}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {/* Indicateur de chargement */}
          {isLoading && (
            <div className="flex justify-start gap-3">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                  <span className="text-sm text-gray-600">L'assistant réfléchit...</span>
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
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isConfigValid === false ? "Configuration manquante - Vérifiez .env" : placeholder}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                rows={1}
                maxLength={500}
                disabled={isLoading || isConfigValid === false}
              />
              <div className="absolute bottom-1 right-2 text-xs text-gray-400">
                {inputValue.length}/500
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading || isConfigValid === false}
              loading={isLoading}
              icon="📤"
              size="sm"
              className="self-end"
            >
              Envoyer
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
};

export default AssistantIA; 