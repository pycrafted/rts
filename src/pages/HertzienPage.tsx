import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HertzienForm from '../components/hertzien/HertzienForm';

const HertzienPage: React.FC = () => {
  const [hertzienHistory, setHertzienHistory] = useState<any[]>([]);

  const loadHertzienHistory = () => {
    const history = JSON.parse(localStorage.getItem('hertzien_history') || '[]');
    setHertzienHistory(history);
  };

  useEffect(() => {
    loadHertzienHistory();
  }, []);

  const totalDistance = hertzienHistory.reduce((sum, item) => sum + (item.distance || 0), 0);
  const totalMarge = hertzienHistory.reduce((sum, item) => sum + (item.marge || 0), 0);
  const totalBilan = hertzienHistory.reduce((sum, item) => sum + (item.bilan || 0), 0);
  const totalCalculs = hertzienHistory.length;

  const handleFormSubmit = () => {
    // Recharger les données après sauvegarde
    setTimeout(() => {
      loadHertzienHistory();
    }, 100);
  };

  const handleSave = () => {
    // Recharger les données après sauvegarde
    setTimeout(() => {
      loadHertzienHistory();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                📡 Liaisons Hertziennes
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Calculez le bilan de liaison de vos réseaux hertziens avec des outils avancés 
                d'analyse de propagation et d'optimisation de couverture.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/simulation/hertzien"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
              >
                🌐 Simulation 3D
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">📏</span>
                </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Distance Totale</p>
                <p className="text-2xl font-bold text-gray-900">{totalDistance.toFixed(1)} km</p>
                    </div>
                    </div>
                  </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <span className="text-2xl">📊</span>
                    </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Marge Moyenne</p>
                <p className="text-2xl font-bold text-gray-900">{totalMarge.toFixed(1)} dB</p>
              </div>
            </div>
                </div>
                
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">📈</span>
                    </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bilan Moyen</p>
                <p className="text-2xl font-bold text-gray-900">{totalBilan.toFixed(1)} dBm</p>
            </div>
          </div>
        </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-2xl">🧮</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Calculs Effectués</p>
                <p className="text-2xl font-bold text-gray-900">{totalCalculs}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="w-full">
          {/* Formulaire */}
          <div className="w-full">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Paramètres de calcul</h2>
                <p className="text-gray-600 mt-1">Configurez les paramètres de votre liaison hertzienne</p>
              </div>
              <div className="p-6">
                <HertzienForm onSubmit={handleFormSubmit} onSave={handleSave} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HertzienPage;