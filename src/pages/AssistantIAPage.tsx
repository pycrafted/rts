import React from 'react';
import AssistantIA from '../components/ai/AssistantIA';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const AssistantIAPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <span>←</span>
                  Retour au Dashboard
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🧠</span>
              <h1 className="text-xl font-bold text-gray-900">Assistant IA Télécoms</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assistant IA Principal */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] shadow-xl">
              <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  Assistant IA Expert
                </CardTitle>
                <CardDescription className="text-primary-100">
                  Posez vos questions sur les télécommunications et obtenez des réponses expertes
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 h-full">
                <AssistantIA 
                  title=""
                  placeholder="Posez votre question sur les réseaux télécoms..."
                  className="h-full border-0"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar avec informations */}
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
                    <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <strong>GSM :</strong> "Comment calculer le nombre de TRX ?"
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <strong>UMTS :</strong> "Comment dimensionner un NodeB ?"
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                      <strong>Hertzien :</strong> "Comment calculer les zones de Fresnel ?"
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                      <strong>Optique :</strong> "Comment calculer l'atténuation fibre ?"
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fonctionnalités */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-xl">⚡</span>
                  Fonctionnalités
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Expertise spécialisée</strong> en télécoms
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Réponses techniques</strong> avec formules
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Exemples concrets</strong> et calculs
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Historique des conversations</strong>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technologies supportées */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Technologies supportées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 bg-blue-100 rounded text-center font-medium">
                    📱 GSM
                  </div>
                  <div className="p-2 bg-green-100 rounded text-center font-medium">
                    📡 UMTS
                  </div>
                  <div className="p-2 bg-purple-100 rounded text-center font-medium">
                    🔌 Hertzien
                  </div>
                  <div className="p-2 bg-orange-100 rounded text-center font-medium">
                    💡 Optique
                  </div>
                  <div className="p-2 bg-red-100 rounded text-center font-medium">
                    🎮 Simulation
                  </div>
                  <div className="p-2 bg-indigo-100 rounded text-center font-medium">
                    📊 Dimensionnement
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statut */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Statut du service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Assistant IA opérationnel</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Mode test activé - Réponses expertes simulées
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