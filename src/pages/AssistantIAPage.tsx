import React, { useRef } from 'react';
import AssistantIA from '../components/ai/AssistantIA';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import type { AssistantIARef } from '../components/ai/AssistantIA';

const AssistantIAPage: React.FC = () => {
  const assistantRef = useRef<AssistantIARef>(null);

  const handleCardClick = (question: string) => {
    if (assistantRef.current) {
      assistantRef.current.askQuestion(question);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Assistant IA Télécoms</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assistant IA */}
          <div className="lg:col-span-2">
            <Card className="h-full shadow-lg">
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

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Guide d'utilisation */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-xl">📖</span>
                  Guide d'utilisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Exemples de questions :</h4>
                  <div className="space-y-2 text-sm">
                    <button 
                      onClick={() => handleCardClick("Comment calculer le nombre de TRX pour un réseau GSM ?")}
                      className="w-full p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400 hover:bg-blue-100 transition-colors text-left"
                    >
                      <strong>GSM :</strong> "Comment calculer le nombre de TRX pour un réseau GSM ?"
                    </button>
                    <button 
                      onClick={() => handleCardClick("Comment optimiser un réseau UMTS avec le facteur de charge ?")}
                      className="w-full p-3 bg-green-50 rounded-lg border-l-4 border-green-400 hover:bg-green-100 transition-colors text-left"
                    >
                      <strong>UMTS :</strong> "Comment optimiser un réseau UMTS avec le facteur de charge ?"
                    </button>
                    <button 
                      onClick={() => handleCardClick("Comment calculer les zones de Fresnel pour une liaison hertzienne ?")}
                      className="w-full p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400 hover:bg-purple-100 transition-colors text-left"
                    >
                      <strong>Hertzien :</strong> "Comment calculer les zones de Fresnel pour une liaison hertzienne ?"
                    </button>
                    <button 
                      onClick={() => handleCardClick("Comment analyser les défauts d'une fibre optique avec un OTDR ?")}
                      className="w-full p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400 hover:bg-orange-100 transition-colors text-left"
                    >
                      <strong>Optique :</strong> "Comment analyser les défauts d'une fibre optique avec un OTDR ?"
                    </button>
                    <button 
                      onClick={() => handleCardClick("Comment utiliser les simulations 3D dans l'application ?")}
                      className="w-full p-3 bg-indigo-50 rounded-lg border-l-4 border-indigo-400 hover:bg-indigo-100 transition-colors text-left"
                    >
                      <strong>Simulations :</strong> "Comment utiliser les simulations 3D dans l'application ?"
                    </button>
                    <button 
                      onClick={() => handleCardClick("Quelles sont les formules importantes en télécoms ?")}
                      className="w-full p-3 bg-teal-50 rounded-lg border-l-4 border-teal-400 hover:bg-teal-100 transition-colors text-left"
                    >
                      <strong>Formules :</strong> "Quelles sont les formules importantes en télécoms ?"
                    </button>
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