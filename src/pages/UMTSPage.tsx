import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UMTSForm from '../components/umts/UMTSForm';

const UMTSPage: React.FC = () => {
  const [umtsHistory, setUmtsHistory] = useState<any[]>([]);

  const loadUmtsHistory = () => {
    const history = JSON.parse(localStorage.getItem('umts_history') || '[]');
    setUmtsHistory(history);
  };

  useEffect(() => {
    loadUmtsHistory();
  }, []);

  const totalUtilisateurs = umtsHistory.reduce((sum, item) => sum + (item.nbUtilisateurs || 0), 0);
  const totalCellules = umtsHistory.reduce((sum, item) => sum + (item.nbCellules || 0), 0);
  const totalNodeB = umtsHistory.reduce((sum, item) => sum + (item.nbNodeB || 0), 0);
  const totalDebit = umtsHistory.reduce((sum, item) => sum + (item.debitTotal || 0), 0);

  const handleFormSubmit = () => {
    // Recharger les données après sauvegarde
    setTimeout(() => {
      loadUmtsHistory();
    }, 100);
  };

  const handleSave = () => {
    // Recharger les données après sauvegarde
    setTimeout(() => {
      loadUmtsHistory();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                📶 Dimensionnement UMTS
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Calculez le dimensionnement de votre réseau UMTS 3G avec des outils avancés de planification 
                et d'optimisation de la qualité de service.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/simulation/umts"
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
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{totalUtilisateurs.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <span className="text-2xl">📱</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cellules Déployées</p>
                <p className="text-2xl font-bold text-gray-900">{totalCellules}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-pink-100 rounded-lg">
                <span className="text-2xl">🏢</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">NodeB Total</p>
                <p className="text-2xl font-bold text-gray-900">{totalNodeB}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Débit Total (Mbps)</p>
                <p className="text-2xl font-bold text-gray-900">{(totalDebit / 1000).toFixed(1)}</p>
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
                <p className="text-gray-600 mt-1">Configurez les paramètres de votre réseau UMTS</p>
              </div>
              <div className="p-6">
                <UMTSForm onSubmit={handleFormSubmit} onSave={handleSave} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UMTSPage; 