import React, { useRef, useState } from 'react';
import AssistantIA from '../components/ai/AssistantIA';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import type { AssistantIARef } from '../components/ai/AssistantIA';
import { cn } from '../utils/cn';

const AssistantIAPage: React.FC = () => {
  const assistantRef = useRef<AssistantIARef>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'examples'>('chat');

  const handleCardClick = (question: string) => {
    if (assistantRef.current) {
      assistantRef.current.askQuestion(question);
      setActiveTab('chat'); // Basculer vers le chat après avoir cliqué sur un exemple
    }
  };

  const examples = [
    {
      category: "GSM",
      question: "Comment calculer le nombre de TRX pour un réseau GSM ?",
      color: "blue",
      icon: "📱"
    },
    {
      category: "UMTS",
      question: "Comment optimiser un réseau UMTS avec le facteur de charge ?",
      color: "green",
      icon: "📶"
    },
    {
      category: "Hertzien",
      question: "Comment calculer les zones de Fresnel pour une liaison hertzienne ?",
      color: "purple",
      icon: "📡"
    },
    {
      category: "Optique",
      question: "Comment analyser les défauts d'une fibre optique avec un OTDR ?",
      color: "orange",
      icon: "🔌"
    },
    {
      category: "Simulations",
      question: "Comment utiliser les simulations 3D dans l'application ?",
      color: "indigo",
      icon: "🌐"
    },
    {
      category: "Formules",
      question: "Quelles sont les formules importantes en télécoms ?",
      color: "teal",
      icon: "📊"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-50 border-blue-400 hover:bg-blue-100 active:bg-blue-200",
      green: "bg-green-50 border-green-400 hover:bg-green-100 active:bg-green-200",
      purple: "bg-purple-50 border-purple-400 hover:bg-purple-100 active:bg-purple-200",
      orange: "bg-orange-50 border-orange-400 hover:bg-orange-100 active:bg-orange-200",
      indigo: "bg-indigo-50 border-indigo-400 hover:bg-indigo-100 active:bg-indigo-200",
      teal: "bg-teal-50 border-teal-400 hover:bg-teal-100 active:bg-teal-200"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header responsive */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
            Assistant IA Télécoms
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Votre expert personnel en télécommunications
          </p>
        </div>
        
        {/* Tabs pour mobile */}
        <div className="lg:hidden mb-6">
          <div className="flex bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setActiveTab('chat')}
              className={cn(
                "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 touch-manipulation",
                activeTab === 'chat'
                  ? "bg-primary-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setActiveTab('examples')}
              className={cn(
                "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 touch-manipulation",
                activeTab === 'examples'
                  ? "bg-primary-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              📚 Exemples
            </button>
          </div>
        </div>

        {/* Layout responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Assistant IA - Principal sur mobile, 2/3 sur desktop */}
          <div className={cn(
            "lg:col-span-2",
            activeTab === 'examples' ? 'hidden lg:block' : 'block'
          )}>
            <Card className="h-full shadow-lg card-mobile">
              <CardContent className="p-0 h-full">
                <AssistantIA 
                  ref={assistantRef}
                  title=""
                  placeholder="Posez votre question sur les réseaux télécoms..."
                  className="h-full border-0"
                />
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral - Caché sur mobile si pas actif */}
          <div className={cn(
            "space-y-4 sm:space-y-6",
            activeTab === 'chat' ? 'hidden lg:block' : 'block'
          )}>
            {/* Guide d'utilisation */}
            <Card className="shadow-lg card-mobile">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <span className="text-lg sm:text-xl">📖</span>
                  Guide d'utilisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    Exemples de questions :
                  </h4>
                  <div className="space-y-2 sm:space-y-3">
                    {examples.map((example, index) => (
                      <button 
                        key={index}
                        onClick={() => handleCardClick(example.question)}
                        className={cn(
                          "w-full p-3 sm:p-4 rounded-lg border-l-4 transition-all duration-200 text-left touch-manipulation nav-item-mobile",
                          getColorClasses(example.color)
                        )}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <span className="text-lg sm:text-xl flex-shrink-0">
                            {example.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                              {example.category}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                              "{example.question}"
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conseils d'utilisation */}
            <Card className="shadow-lg card-mobile">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <span className="text-lg sm:text-xl">💡</span>
                  Conseils
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <div className="text-xs sm:text-sm text-gray-600 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-primary-500">•</span>
                    <span>Posez des questions spécifiques pour des réponses précises</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-500">•</span>
                    <span>Utilisez les exemples comme point de départ</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-500">•</span>
                    <span>L'assistant peut vous aider avec les calculs et formules</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantIAPage; 