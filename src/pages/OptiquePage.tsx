import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OptiqueForm from '../components/optique/OptiqueForm';

const OptiquePage: React.FC = () => {
  const [optiqueHistory, setOptiqueHistory] = useState<any[]>([]);

  // Fonction pour charger l'historique
  const loadHistory = () => {
    const history = JSON.parse(localStorage.getItem('optique_history') || '[]');
    setOptiqueHistory(history);
  };

  useEffect(() => {
    loadHistory();
    
    // Écouter les changements du localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'optique_history') {
        loadHistory();
      }
    };

    // Écouter les événements personnalisés pour les mises à jour locales
    const handleLocalUpdate = () => {
      loadHistory();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('optiqueHistoryUpdated', handleLocalUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('optiqueHistoryUpdated', handleLocalUpdate);
    };
  }, []);

  const totalLongueur = optiqueHistory.reduce((sum, item) => sum + (item.params?.length || 0), 0);
  const totalPertes = optiqueHistory.reduce((sum, item) => sum + (item.pertesTotales || 0), 0);
  const totalBilan = optiqueHistory.reduce((sum, item) => sum + (item.bilan || 0), 0);
  const totalCalculs = optiqueHistory.length;
  
  // Calcul du bilan moyen seulement si il y a des calculs
  const bilanMoyen = totalCalculs > 0 ? totalBilan / totalCalculs : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                💡 Liaisons Optiques
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Calculez le bilan de liaison de votre réseau fibre optique avec des outils avancés 
                d'analyse d'atténuation et d'optimisation de performance.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/simulation/optique"
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
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">📏</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Longueur Totale</p>
                <p className="text-2xl font-bold text-gray-900">{totalLongueur.toFixed(1)} km</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <span className="text-2xl">📉</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pertes Totales</p>
                <p className="text-2xl font-bold text-gray-900">{totalPertes.toFixed(1)} dB</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-pink-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bilan Moyen</p>
                <p className="text-2xl font-bold text-gray-900">{bilanMoyen.toFixed(1)} dBm</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
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
                <p className="text-gray-600 mt-1">Configurez les paramètres de votre liaison optique</p>
              </div>
              <div className="p-6">
                <OptiqueForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptiquePage;